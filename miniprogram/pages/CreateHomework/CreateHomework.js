// miniprogram/pages/SignInStatistics/SignInStatistics.js
const app = getApp()
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nowDate : util.formatTime(new Date()).split(" ")[0],
    date : util.formatTime(new Date()).split(" ")[0],
    images:[],
    classList : [],
    classId : [],
    index2 :0,
    isNull : false,
    cloudFileId : []
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

  bindDateChange: function(e) {
    this.setData({
      date: e.detail.value
    })
  },

  chooseImage : function(){
    wx.chooseImage({
      count: 3,
      sizeType:['original', 'compressed'],
      sourceType:['album','camera']
    }).then(res=>{
      this.setData({
        images : this.data.images.concat(res.tempFilePaths)
      })
    })
  },

  handleImagePreview : function(e){
    console.log(this.data.images[e.target.dataset.idx])
    wx.previewImage({
      current:this.data.images[e.target.dataset.idx],
      urls : this.data.images
    })
  },

  removeImage : function(e){
    temp.splice(e.target.dataset.idx, 1)
    this.setData({
      images : temp
    })
  },

  formSubmit :function(e){
    console.log(this.data.images)
    if (e.detail.value.name=="") {
      wx.showToast({
        title: '名称不得为空',
        icon:"loading",
        duration:1500
      })
    }else if(e.detail.value.info==""){
      wx.showToast({
        title: '作业要求不得为空',
        icon:"loading",
        duration:1500
      })
    }else{
      let status = false
      status = this.checkmsg(e.detail.value.name)
      status = this.checkmsg(e.detail.value.info)

      if(status){
        let rWord = this.randomWord(9)
        const db = wx.cloud.database()

        db.collection("homework").where({classId:rWord}).get().then(res=>{
          if(res.data.length!=0){
            rWord+="A"
          }
        })

        db.collection("homework").add({
          data : {
            name : e.detail.value.name,
            classId : this.data.classId[this.data.index2],
            timeRange :  this.data.date.replace(/[^0-9]/ig, ""),
            info : e.detail.value.info,
            infoImages : [],
            homeworkId : rWord,
            member : [],
            homeworkUrl : [],
            number : 0,
            className : this.data.classList[this.data.index2]
          }
        }).then(res=>{
          for(let i = 0; i < this.data.images.length; i++){
            console.log(this.data.images[i])
            wx.cloud.uploadFile({
              filePath: this.data.images[i],
              cloudPath: '作业' + i,
              success(res){
                const _ = db.command
                db.collection("homework").where({homeworkId : rWord}).update({
                  data :{
                    infoImages : _.push(res.fileID)
                  }
                })
              }
            })
          }
          wx.showModal({
            cancelColor: 'cancelColor',
            content:"布置作业成功",
            showCancel:false
          }).then(res=>{
            wx.redirectTo({
              url: '../teacherHome/teacherHome',
            })
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
  
  bindClassChange: function(e){
    this.setData({
      index2: e.detail.value
    })
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
  }
})