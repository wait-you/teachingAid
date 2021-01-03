// miniprogram/pages/logoin/login.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo : null,
    openId : null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSetting({
      withSubscriptions: true,
      success: (result) => {
        wx.getUserInfo({
          withCredentials: true,
          success: (result) => {
            this.setData({
              userInfo : result.userInfo
            })
            app.globalData.userInfo = result.userInfo
          }
        })
      }
    })

    wx.cloud.callFunction({   
      name: 'getId',   
      complete: res => {    
        console.log('在加载页面加载时云函数获取到的openid: ', res.result.openId)
        app.globalData.openId = res.result.openId
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

  getOpenId : function () {
    wx.cloud.callFunction({   
      name: 'getId',   
      complete: res => {    
        console.log('在选择登陆方式时获取到的openid: ', res.result.openId)
        app.globalData.openId = res.result.openId
        }
    })
  },

  toStudent : function () {
    const db = wx.cloud.database()
    const students = db.collection("students")

    wx.showToast({
      title: '登陆中',
      icon : 'loading',
      duration : 1500
    })

      students.where({_openid:app.globalData.openId}).get().then(res=>{
        console.log(res.data.length)
        console.log(res.data.length==0)
        if(res.data.length==0){
          wx.redirectTo({
            url: '../createStu/createStu',
          })
        }else{
          wx.redirectTo({
            url: '../studentHome/studentHome',
          })
        }
      })
  },

  toTeacher : function () {
    const db = wx.cloud.database()
    const teachers = db.collection("teachers")

    wx.showToast({
      title: '登录中',
      icon : 'loading',
      duration : 1500
    })

    teachers.where({_openid:app.globalData.openId}).get().then(res=>{
      if(res.data.length==0){
        wx.redirectTo({
          url: '../createTea/createTea',
        })
     }else{
      wx.redirectTo({
        url: '../teacherHome/teacherHome',
      })
     }
    })
  }
})