// miniprogram/pages/Homework/Homework.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    homework : [],
    isNull : true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const db = wx.cloud.database()
    db.collection("students").where({_openid:app.globalData.openId}).get().then(res=>{
      console.log(res.data[0].classes)
      for(let i = 0; i < res.data[0].classes.length; i++){
        db.collection("homework").where({classId : res.data[0].classes[i]}).get().then(result=>{
          for(let j = 0; j <result.data.length; j++){
            let status = this.checkExist(res.data[0].id, result.data[j].member)
            if(status){
              this.setData({
                isNull : false,
                homework : this.data.homework.concat(result.data[j])
              }) 
            }
          }
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

  checkExist : function(id, arr){
    var  status = false
    for(let j = 0; j < arr.length; j++){
      if(id==arr[j]){
        status = !status
        break
      }else{
        status = status
      }
    }

    if(status){
      return false
    }else{
      return true
    }
  }
})