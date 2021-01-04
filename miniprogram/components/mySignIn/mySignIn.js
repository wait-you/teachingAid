// components/mySignIn/mySignIn.js
var util = require('../../utils/util.js');
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

  },

  /**
   * 组件的方法列表
   */
  methods: {
    tapSign : function(){
      let signTime = this.data.itemM.time
      let nowTime = parseInt(util.formatTime(new Date()).replace(/[^0-9]/ig,""))
      let range = parseInt(this.data.itemM.timeRange.replace(/[^0-9]/ig,""))
      console.log(nowTime-signTime)
      if(nowTime-signTime>range){
        wx.showToast({
          title: '签到已超时',
          icon:"loading",
          duration:1500
        })
      }else{
        wx.getLocation({
          altitude: 'true',
          type:"wgs84",
        }).then(res=>{
          let _this = this
          if(_this.distance(this.data.itemM.lat, this.data.itemM.lng, res.latitude, res.longitude)>this.data.itemM.range){
            wx.showToast({
              title: '你不在签到的范围内',
              icon:"loading",
              duration:1500
            })
          }else{
            const db = wx.cloud.database()
            const _ = db.command
            db.collection("students").where({_openid:app.globalData.openId}).get().then(res=>{
              db.collection("signIn").where({classId:this.data.itemM.classId}).update({
                data:{
                   member : _.push(res.data[0].id),
                   number : _.inc(1)
                }
              }).then(res=>{
                wx.showModal({
                  cancelColor: 'cancelColor',
                  content : "签到成功",
                  showCancel : false
                }).then(res=>{
                  wx.redirectTo({
                    url: '../../pages/studentHome/studentHome',
                  })
                })
              })
            })
          }
        })
      }
    },
    
    distance : function(lat1, lng1, lat2, lng2) {
      console.log(lat1, lng1, lat2, lng2)
      var radLat1 = lat1 * Math.PI / 180.0;
      var radLat2 = lat2 * Math.PI / 180.0;
      var a = radLat1 - radLat2;
      var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
      var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
      s = s * 6378.137;
      s = Math.round(s * 10000) / 10000;
      return s
    }
  }
})
