//index.js
//获取应用实例
var app = getApp()
var uid = wx.getStorageSync('uid');

Page({
  data: {
    success : false
  },
  //事件处理函数
  onLoad: function () {
    var windowWidth = 320;
    var self = this;
    wx.request({
      url: app.globalData.api,
      data:{
        uid : uid
      },
      success:function(res){
        let result = res.data;
        if(!result.status){
          wx.showModal({
            content: '获取网关列表失败',
            showCancel:false
          })
          return;
        }
        self.setData({
          gateway: result.data.gateway,
          farm : result.data.farm,
          msg : result.data.msg
        })
      }
    })
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
      self.setData({
        wwidth : windowWidth
      })
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
  },
  onShareAppMessage: function () {
    return {
      title: "农小盒",
      path: "/pages/index/index"
    }
  }
})
