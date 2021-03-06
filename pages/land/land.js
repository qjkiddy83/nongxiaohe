//index.js
//获取应用实例
var app = getApp()
var uid = '';

Page({
  data: {
    success : false
  },
  //事件处理函数
  bindDevice: function() {
    var rand = Math.random()*10;
    var self = this;
    if(rand<5){
      wx.showModal({
        title: '提示',
        content: '手机号或者安全码错误',
        confirmText:'知道了',
        showCancel:false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }else{
      self.setData({
        success : true
      })
    }
  },
  onLoad: function () {
    uid = wx.getStorageSync('uid');
    var windowWidth = 320;
    var self = this;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
      self.setData({
        wwidth : windowWidth
      })
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
    this._load();
  },
  _load : function(){
    var self = this;
    wx.request({
      url: app.globalData.api +"/work/land",
      data:{
        uid :uid
      },
      success: function (res) {
        let result = res.data;
        if (!result.status) {
          wx.showModal({
            content: '获取数据失败',
            showCancel: false
          })
          return;
        }
        console.log(result.data)
        self.setData({
          list: result.data.list,
          farm: result.data.setting.farm
        })
      }
    })
  },
  onShareAppMessage: function () {
    return {
      title: "农小盒",
      path: "/pages/index/index"
    }
  }
})
