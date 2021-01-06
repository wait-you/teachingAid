// miniprogram/pages/CreateSignIn/CreateSignIn.js
var util = require('../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    time:'05:00',
    array: [50, 100, 150, 200,200000000],
    index: 0,
    index2: 0,
    classList : [],
    classId : [],
    isNull : false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const db = wx.cloud.database()
    db.collection("teachers").where({_openid:app.globalData.openId}).get().then(res=>{
      console.log(res.data[0].classesName)
      console.log(res.data[0].classes)

      if(res.data[0].classes.length==0){
        this.setData({
          isNull : true,
          classList : this.data.classList.concat("你还未创建任何班级哦")
        })
      }else{
        this.setData({
          isNull : true,
          classList : res.data[0].classesName,
          classId : res.data[0].classes
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  
  bindTimeChange: function(e) {
    this.setData({
      time: e.detail.value
    })
  },
  bindPickerChange: function(e) {
    this.setData({
      index: e.detail.value
    })
  },

  bindClassChange: function(e){
    this.setData({
      index2: e.detail.value
    })
  },

  formSubmit : function(e){
    if(e.detail.value.name==""){
      wx.showToast({
        title: '名称不得为空',
        icon:"loading",
        duration:1500
      })
    }else if(parseInt(this.data.time.split(":")[0])==0){
      wx.showToast({
        title: '截止时间不得低于一分钟',
        icon:"loading",
        duration:1500
      })
    }else{
      wx.cloud.callFunction({
        name : "msgcheck",
        data:{
          content : e.detail.value.name
        }
      }).then(res=>{
        if(res.result.errCode == 0){
          wx.getLocation({
            altitude: 'true',
            type:"wgs84"
          }).then(res=>{
            const db = wx.cloud.database()
            db.collection("signIn").add({
              data:{
                name : e.detail.value.name,
                className : this.data.classList[this.data.index2],
                classId : this.data.classId[this.data.index2],
                timeRange : this.data.time,
                time : parseInt(util.formatTime(new Date()).replace(/[^0-9]/ig,"")),
                range : this.data.array[this.data.index],
                number : 0,
                member : [],
                lat : res.latitude,
                lng : res.longitude
              }
            }).then(res=>{
              wx.showModal({
                content : "发起签到成功！",
                showCancel : false
              }).then(res=>{
                wx.redirectTo({
                  url: '../teacherHome/teacherHome',
                })
              })
            })
          })
        }else{
          wx.showModal({
            title : "警告",
            content : "请规范你输入的内容",
            showCancel : false
          })
        }
      })
    }
  },
})