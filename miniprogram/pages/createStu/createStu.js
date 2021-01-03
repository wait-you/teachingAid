// miniprogram/pages/createStu/createStu.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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

  formSubmit : function (e) {
    let zz = /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|17[0-9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
    let card = /^[0-9]*$/

    console.log(e.detail.value)

    if(e.detail.value.name==""){
      wx.showToast({
        title: '姓名不得为空',
        icon : "loading",
        duration : 2000
      })
    }else if(e.detail.value.classroom==""){
      wx.showToast({
        title: '班级不得为空',
        icon : "loading",
        duration : 2000
      })
    }else if(e.detail.value.id==""){
      wx.showToast({
        title: '学号不得为空',
        icon : "loading",
        duration : 2000
      })
    }else if(!card.test(e.detail.value.number)){
      wx.showToast({
        title: '学号格式错误',
        icon : "loading",
        duration : 2000
      })
    }else if(e.detail.value.number==""){
      wx.showToast({
        title: '电话不得为空',
        icon : "loading",
        duration : 2000
      })
    }else if(!zz.test(e.detail.value.number)){
      wx.showToast({
        title: '电话格式错误',
        icon : "loading",
        duration : 2000
      })
    }else{
      let status = true
      const db = wx.cloud.database()
      const students = db.collection("students")

      status = this.checkmsg(e.detail.value.name)
      status = this.checkmsg(e.detail.value.classroom)

      students.where({id:e.detail.value.id}).get().then(res=>{
        if(res.data.length!=0){
          wx.showToast({
            title: '已有学号',
            icon: "loading",
            duration:1500
          })
        }else{
          if(status){
            students.add({
              data : {
                name : e.detail.value.name,
                sex : e.detail.value.sex,
                classroom : e.detail.value.classroom,
                id : e.detail.value.id,
                number : e.detail.value.number
              }
            }).then(res=>{
              wx.showToast({
              title: '创建账号中',
              icon : 'loading',
              duration : 1500
            })
            setTimeout(function(){
              wx.showToast({
              title: '创建成功',
              icon : 'none',
              duration : 1000
            })
            },1500)
            setTimeout(function(){
              wx.redirectTo({
                url: '../studentHome/studentHome'
              })
            },2500)
            }).catch(err=>{
              wx.showToast({
                title: '创建账号中',
                icon : 'loading',
                duration : 1500
              })
              setTimeout(function(){
                wx.showToast({
                title: '创建失败',
                icon : 'none',
                duration : 1000
              })
              },1500)
            })
          }
        }
      })
    }

  },

  checkmsg : function (e){
    let flag = true;
    wx.cloud.callFunction({
      name : "msgcheck",
      data:{
        content : e
      }
    }).then(res=>{
      if(res.result.errCode == 0){
        flag = true;
      }else{
        wx.showModal({
          title : "警告",
          content : "请规范你输入的内容",
          showCancel : false
        })
        flag = false;
      }
    })
    if(flag){
      return true;
    }else{
      return false;
    }
  } 
})