/**
 * Created by fp on 2018/12/30.
 * 时间轴数据缓存，对外提供序列化的数据
 */
import moment from 'moment'
import mapUtil from '@/map/js/util/mapUtil'
import mapLayerHttp from '@/https/map/mapLayerHttp'

class TimeBarCache {
  constructor(options) {
    this.status = 'stop';
    this.cacheData = {};
    this.picCache = {
      picUrl: {},
      loadEnd: false
    };
    this.loadingTime = null;
    this.timer = null;
    this.mapEvtHandle = options.mapEvtHandle;
    this.uuid = null;
    //每次加载的数量
    this.count = 3;
  }

  //接收需要换成数据的指令
  setCacheOrder() {
    this.clear();
    if (!this.mapEvtHandle.layerData) {
      return;
    }
    this.uuid = Math.random();
    if (this.timer) {
      window.clearTimeout(this.timer);
      this.timer = null;
    }
    this.status = 'start';
    let airLayer = this.mapEvtHandle.layerData[0].childs[0].childs;
    const searchParams = [];
    airLayer.forEach(item => {
      if (item.checked) {
        searchParams.push({
          type: item.code,
          factorName: this.mapEvtHandle.getSelectedFactorByCode(item.code)
        })
      }
    });
    /* let industryLayer = this.mapEvtHandle.layerData[0].childs[2].childs;
     industryLayer.forEach(item => {
     if (item.checked) {
     searchParams.push({
     type: item.code,
     factorName: this.getFactorNameByType(item.code)
     })
     }
     });

     let polluteLayer = this.mapEvtHandle.layerData[0].childs[3].childs;
     polluteLayer.forEach(item => {
     if (item.checked) {
     searchParams.push({
     type: item.code,
     factorName: this.getFactorNameByType(item.code)
     })
     }
     });*/

    this.loadingTime = this.mapEvtHandle.getDate();
    let tucLayer = this.mapEvtHandle.layerData[1].childs[0].childs;
    const tucParams = [];
    tucLayer.forEach(item => {
      if (item.checked && (item.code === 'AQIRLT' || item.code === 'PM10RLT')) {
        tucParams.push({
          type: item.code,
          factorName: this.getTuCengFactorName(item.code)
        })
      }
    });
    this.getDatas(searchParams, tucParams);
  }

  updateNextTime() {
    let dateType = this.mapEvtHandle.getAirDateType();
    let endDate = this.mapEvtHandle.getTimerEndDate();
    if (dateType === 'hour') {
      let date = moment(this.loadingTime).add(1, 'hours').format('YYYY-MM-DD HH:mm:ss');
      if (endDate < date) {
        this.loadingTime = null;
      } else {
        this.loadingTime = date;
      }
    } else if (dateType === 'day') {
      let date = moment(this.loadingTime).add(1, 'days').format('YYYY-MM-DD HH:mm:ss');
      if (endDate < date) {
        this.loadingTime = null;
      } else {
        this.loadingTime = date;
      }
    } else {
      this.loadingTime = null;
    }
  }

  getTuCengFactorName(code) {
    if (code === 'AQIRLT') {
      return 'aqi';
    } else if (code === 'PM10RLT') {
      return 'pm10'
    } else {
      return '';
    }
  }

  getDatas(searchParams, tucParams) {
    let promises = [];
    let alreadyLoadingTime = '';
    for (let i = 0; i < this.count; i++) {
      if (this.loadingTime) {
        let p = this.getDataFromBack({
          time: this.loadingTime,
          dateType: this.mapEvtHandle.getAirDateType(),
          types: searchParams,
          uuid: this.uuid
        }, {
          startTime: this.loadingTime,
          endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
          time: this.loadingTime,
          dateType: this.mapEvtHandle.getAirDateType(),
          types: tucParams,
          uuid: this.uuid
        }, i + 1);
        promises.push(p);
        alreadyLoadingTime = this.loadingTime;
        this.updateNextTime();
      }
    }
    if (promises.length > 0) {
      Promise.all(promises).then(() => {
        this.mapEvtHandle.loadSuccessTime(alreadyLoadingTime);
        this.timer = window.setTimeout(() => {
          this.getDatas(searchParams, tucParams)
        }, 100)
      });
    }
  }

  //从后台加载数据放入缓存
  getDataFromBack(params, paramsTuc, i) {
    return new Promise((resolve, reject) => {
      window.setTimeout(() => {
        let diancPromise = this.getPointData(params);
        let tucPromise = this.getPicData(paramsTuc);
        Promise.all([diancPromise, tucPromise]).then(results => {
          if (params.uuid === this.uuid) {
            let pointResult = results[0];
            this.cacheData[params.time] = pointResult.data;
            let tcResult = results[1];
            if (tcResult && tcResult.length > 0) {
              this.cacheData[params.time] = pointResult.data.concat(tcResult)
            }
          }
          resolve([]);
        })
      }, 100 * i);

    });
  }

  getPointData(params) {
    if (!params.types || params.types.length === 0) {
      return new Promise((resolve, reject) => {
        resolve({
          data: []
        });
      })
    }
    return mapLayerHttp.getTimePlay(params)
  }


  getPicData(params) {
    if (!params.types || params.types.length === 0) {
      return new Promise((resolve, reject) => {
        resolve({
          data: []
        });
      })
    }
    return new Promise((resolve, reject) => {
      this.getPicUrl(params).then(() => {
        let imageUrl = [], resolveParams = [];
        params.types.forEach(item => {
          let obj = {
            type: item.type,
            url: ''
          };
          this.picCache.picUrl[item.factorName].forEach(item2 => {
            if (item2.fTime === params.time && item2.fFileUrl) {
              let url = window.SITE_CONFIG.proxyName + item2.fFileUrl;
              imageUrl.push(url);
              obj.url = url;
            }
          });
          resolveParams.push(obj)
        });
        mapUtil.loadingMultiImage(imageUrl).then(result => {
          resolve(resolveParams)
        });
      });
    });
  }

  getPicUrl(params) {
    if (this.picCache.loadEnd) {
      return new Promise((resolve, reject) => {
        resolve();
      })
    }
    const urlPromises = [];
    params.types.forEach(item => {
      let p = mapLayerHttp.getHeatmapInfos({
        dataType: params.dateType,
        factor: item.factorName,
        startTime: params.startTime,
        endTime: params.endTime
      });
      urlPromises.push(p);
    });
    return new Promise((resolve, reject) => {
      Promise.all(urlPromises).then(results => {
        let dataUrl = {};
        results.forEach(item => {
          dataUrl[item.item.factor] = item.data
        });
        this.picCache.picUrl = dataUrl;
        this.picCache.loadEnd = true;
        resolve();
      });
    })
  }

  //对外提供接口，获取缓存的数据
  getDataFromCache(time) {
    let data = this.cacheData[time];
    this.cacheData[time] = null;
    return data;
  }

  //清空缓存
  clear() {
    this.status = 'stop';
    this.cacheData = {};
    this.picCache = {
      picUrl: {},
      loadEnd: false
    };
  }
}


export default TimeBarCache;
