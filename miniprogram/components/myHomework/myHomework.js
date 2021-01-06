// components/myHomework/myHomework.js
var util = require('../../utils/util.js')
const app = getApp()
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
    images :[]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleImagePreview : function(e){
      console.log(this.data.itemM.infoImages[e.target.dataset.idx])
      wx.previewImage({
        current:this.data.itemM.infoImages[e.target.dataset.idx],
        urls : this.data.itemM.infoImages
      })
    },

    uploadHomework : function(){
      let daytime = util.formatTime(new Date())

      if(daytime-this.data.itemM.timeRange<0){
        wx.showToast({
          title: '作业已超时',
          icon:"loading",
          duration:1500
        })
      }else{
        wx.chooseImage({
          count: 9,
          sizeType: ['original', 'compressed'],
          sourceType: ['album', 'camera'],
        }).then(result1=>{
          const db = wx.cloud.database()
          const _ = db.command
          db.collection("students").where({_openid:app.globalData.openId}).get().then(res=>{
            db.collection("homework").where({homeworkId:this.data.itemM.homeworkId}).update({
              data:{
                member : _.push(res.data[0].id),
                homeworkUrl : _.push([]),
                number : _.inc(1)
              }
            }).then(result=>{
              for(let i = 0; i < result1.tempFilePaths.length; i++){
                wx.cloud.uploadFile({
                  filePath : result1.tempFilePaths[i],
                  cloudPath : this.data.itemM.classId + res.data[0].id + i
                }).then(res=>{
                  db.collection("homework").where({homeworkId:this.data.itemM.homeworkId}).update({
                    data:{
                      homeworkUrl : _.push(res.fileID)
                    }
                  })
                })
              }
            }).then(res=>{
              wx.showModal({
                cancelColor: 'cancelColor',
                content:"作业完成",
                showCancel:false
              }).then(res=>{
                wx.redirectTo({
                  url: '../../pages/studentHome/studentHome',
                })
              })
            })
          })
        })
      }
    }
  }
})
