/**
 * Created by fp on 2018/10/25.
 */
//图层分成2类，一种是普通的顶层，一种是需要覆盖在其它图层上的
let zDefaultIndex = 0;
let zTopIndex = 0;

const zIndexManage = {
  getNextZIndex : function(){
    zDefaultIndex++;
    return zDefaultIndex;
  },

  getNextTopZIndex: function(){
    zTopIndex++;
    return zTopIndex;
  }
};

export default zIndexManage;
