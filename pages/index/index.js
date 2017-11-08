//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    success: false
  },
  //事件处理函数
  bindDevice: function (e) {
    var rand = Math.random() * 10;
    var self = this;
    console.log(e)
    wx.login({
      success: function (loginres) {
        wx.request({
          url: app.globalData.api+'/login', //仅为示例，并非真实的接口地址
          data: {
            code: loginres.code,
            mobile: e.detail.value.mobile,
            password: e.detail.value.password
          },
          success: function (res) {
            if(res.data.status === 1){
              wx.setStorageSync('uid', res.data.data.uid);
              self.setData({
                success: true
              })
            }else{
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
    if(wx.getStorageSync('uid')){
      wx.redirectTo({
        url: '/pages/home/home',
      })
    }
  }
})
