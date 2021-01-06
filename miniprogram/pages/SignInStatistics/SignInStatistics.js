// miniprogram/pages/SignInStatistics/SignInStatistics.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    signList : [],
    isNull : true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const db = wx.cloud.database()
    db.collection("signIn").where({_openid:app.globalData.openId}).get().then(res=>{
      if(res.data.length==0){
        this.setData({
          isNull : true
        })
      }else{
        this.setData({
          signList : res.data,
          isNull : false
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

  }
})