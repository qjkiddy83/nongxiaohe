//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    success: true
  },
  //事件处理函数
  bindDevice: function () {
    var rand = Math.random() * 10;
    var self = this;
    wx.request({
      url: 'https://api.nongxiaohe.com/', //仅为示例，并非真实的接口地址
      data: {

      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        self.setData({
          success: true
        })
      },
      fail: function () {
        wx.showModal({
          title: '提示',
          content: '手机号或者安全码错误',
          confirmText: '知道了',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            }
          }
        })
      }
    })
  },
  onLoad: function () {
    var windowWidth = 320;
    var self = this;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
      self.setData({
        wwidth: windowWidth
      })
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
  }
})
