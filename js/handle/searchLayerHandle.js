/**
 * Created by fp on 2019/1/11.
 * 搜索结果显示图层
 */
import SearchLayer from '@/map/js/layer/searchLayer'
class SearchLayerHandle{
  constructor(options){
    this.mapObj = options.mapObj;
  }

  showSearchDataInMap(dataList) {
    dataList.forEach((item, index) => {
      item.index = index + 1;
      item.id = item.id !== undefined ? item.id : item.code;
    });
    new SearchLayer({
      map: this.mapObj,
      name: 'search'
    });
    this.mapObj.showData({
      name: 'search',
      data: dataList
    })
  }

  removeSearchDataInMap() {
    this.mapObj.removeLayer({
      name: 'search'
    })
  }
}

export default SearchLayerHandle;
