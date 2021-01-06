// components/checkHomework/checkHomework.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    itemM:Object
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleImagePreview : function(e){
      console.log(this.data.itemM.homeworkUrl[e.target.dataset.idx])
      wx.previewImage({
        current:this.data.itemM.homeworkUrl[e.target.dataset.idx],
        urls : this.data.itemM.homeworkUrl
      })
    },
  }
})
