// miniprogram/pages/joinClass/joinClass.js
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

  formSubmit : function(e){
    if(e.detail.value.name==""){
      wx.showToast({
        title: '班级名称不得为空',
        icon:"loading",
        duration:1500
      })
    }else{
      let status = false

      status = this.checkmsg(e.detail.value.name)

      if(status){

        const db = wx.cloud.database()

        db.collection("classes").where({classId:e.detail.value.name}).get().then(res=>{
          console.log(res.data)
        })

        db.collection("students").where({_openid:app.globalData.openId}).get().then(res=>{
          db.collection("classes").where({classId:e.detail.value.name}).get().then(result=>{
            console.log(e.detail.value.name)
            if(result.data.length==0){
              wx.showToast({
                title: '未找到该班级',
                icon:"loading",
                duration:1500
              })
            }else{
              db.collection(e.detail.value.name).where({id:res.data[0].id}).get().then(res2=>{
                if(res2.data.length!=0){
                  wx.showToast({
                    title: '您已加入该班级',
                    icon:"loading",
                    duration:1500
                  })
                }else{
                  db.collection(e.detail.value.name).add({
                    data:{
                      id : res.data[0].id,
                      name : res.data[0].name,
                      number : res.data[0].number,
                      sex : res.data[0].sex,
                      classroom : res.data[0].classroom
                    }
                  }).then(res=>{
                    const _ = db.command
                    db.collection("students").where({_openid:app.globalData.openId}).update({
                      data:{
                        classes:_.push([e.detail.value.name]),
                      }
                    })
                  }).then(res=>{
                    wx.showToast({
                      title: '加入班级成功',
                      icon:"loading",
                      duration:1500
                    })
                    setTimeout(function(){
                      wx.redirectTo({
                        url: '../studentHome/studentHome',
                      })
                    },1500)
                  })
                }
              })
            }
          })
        })

      }
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
  },
})