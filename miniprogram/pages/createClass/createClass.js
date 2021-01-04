// miniprogram/pages/createClass/createClass.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addMsg : []
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

  formSubmit : function(e) {
    let card = /^[0-9]*$/

    if(e.detail.value.name==""){
      wx.showToast({
        title: '名称不能为空',
        icon : 'loading',
        duration : 1500
      })
    }else if(e.detail.value.persons==""){
      wx.showToast({
        title: '人数不能为空',
        icon : 'loading',
        duration : 1500
      })
    }else if(!card.test(e.detail.value.persons)){
      wx.showToast({
        title: '人数格式不对',
        icon : 'loading',
        duration : 1500
      })
    }else{
      let status = false
      var flag = true
      const db = wx.cloud.database()
      const classes = db.collection("classes")

      status = this.checkmsg(e.detail.value.name)
    
      let rWord = this.randomWord(9)

      classes.where({
        name:e.detail.value.name,
        _openid:app.globalData.openId
      }).get().then(res=>{
          if(res.data.length!=0){
            flag = !flag
            wx.showToast({
              title: '您已添加该班级',
              icon:'loading',
              duration:1500
            })
          }
        classes.where({classId:rWord}).get().then(res=>{
          if(res.data.length!=0){
            rWord+="A"
          }
        })

        console.log(rWord)
        if(flag){
          if(status){
            wx.cloud.callFunction({
              name:"createDB",
              data : {
                od : rWord
              }
            }).then(res=>{
              db.collection(rWord).add({
                data:{
                  name : e.detail.value.name,
                  persons : e.detail.value.persons,
                  classId : rWord
                }
              }).then(res=>{
                const _ = db.command
                db.collection("teachers").where({_openid:app.globalData.openId}).update({
                  data:{
                    classes : _.push([rWord]),
                    classesName : _.push(e.detail.value.name)
                  }
                }).then(res=>{
                  db.collection("classes").add({
                    data:{
                      classId : rWord
                    }
                  })
                }).then(res=>{
                  wx.showModal({
                    title:"创建成功",
                    content:"班级ID为"+rWord,
                    showCancel:false,
                    complete(res){
                      wx.redirectTo({
                        url: '../teacherHome/teacherHome',
                      })
                    }
                  })
                })
              })
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
  },
  
  randomWord: function(range){
    let str = "",
        pos,
        arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
 
    for(var i=0; i<range; i++){
        pos = Math.round(Math.random() * (arr.length-1));
        str += arr[pos];
    }
    return str;
  },
})