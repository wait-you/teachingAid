// miniprogram/pages/MangeClass_Tea/MangeClass_Tea.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    classList : [],
    isNull : false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const db = wx.cloud.database()
    db.collection("teachers").where({_openid:app.globalData.openId}).get().then(res=>{
      console.log(res.data[0].classes)

      if(res.data[0].classes.length==0){
        this.setData({
          isNull : true
        })
      }else{
        for(let i = 0; i < res.data[0].classes.length; i++){
          const _ = db.command
          db.collection(res.data[0].classes[i]).where({_openid:app.globalData.openId}).get().then(res=>{
            this.setData({
              classList : this.data.classList.concat(res.data[0])
            })
          })
        }
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

  }
})