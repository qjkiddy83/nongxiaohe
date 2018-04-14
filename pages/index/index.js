//index.js
//获取应用实例
var app = getApp()
var uid = '';
Page({
  data: {
    success: false,
    logined: uid ? true : false
  },
  //事件处理函数
  bindDevice: function (e) {
    var rand = Math.random() * 10;
    var self = this;
    wx.showLoading({
      title: '提交中',
    })
    wx.login({
      success: function (loginres) {
        wx.getUserInfo({
          success(info){
            wx.request({
              url: app.globalData.api + '/login', //仅为示例，并非真实的接口地址
              data: {
                code: loginres.code,
                mobile: e.detail.value.mobile,
                password: e.detail.value.password,
                nickname: info.userInfo.nickName
              },
              success: function (res) {
                if (res.data.status === 1) {
                  if(res.data.data.status == 1){
                    wx.showModal({
                      content: '您的账号已被禁用'
                    })
                    return;
                  }
                  wx.setStorageSync('uid', res.data.data.uid);
                  wx.setStorageSync('wid', res.data.data.wid);
                  self.setData({
                    success: true
                  })
                } else {
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
              },
              complete: function () {
                wx.hideLoading()
              }
            })
          }
        })
        
      }
    })
  },
  toHome:function(){
    // console.log('aaa')
    this.setData({
      logined:true
    })
    this.getHomeData();
  },
  onLoad: function () {
    uid = wx.getStorageSync('uid');
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
    if(uid){
      this.getHomeData();
    }else{
      this.setData({
        logined: false
      })
    }
  },
  getHomeData:function(){
    var self = this;
    wx.request({
      url: app.globalData.api,
      data: {
        uid: wx.getStorageSync('uid')
      },
      success: function (res) {
        let result = res.data;
        if (!result.status) {
          wx.showModal({
            content: '获取网关列表失败',
            showCancel: false
          })
          return;
        }
        self.setData({
          gateway: result.data.gateway,
          farm: result.data.farm,
          msg: result.data.msg
        })
      }
    })
  },
  onShareAppMessage:function(){
    return {
      title:"农小盒",
      path:"/pages/index/index"
    }
  }
})
