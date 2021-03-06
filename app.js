//app.js
App({
  onLaunch: function() {
    //调用API从本地缓存中获取数据
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)

    // if (wx.getStorageSync('uid')) {
    //   wx.redirectTo({
    //     url: '/pages/home/home',
    //   })
    // }

    // this.getUserInfo();
    if (wx.getStorageSync('uid')){
      wx.request({
        url: this.globalData.api+'/login/check',
        data: {
          uid: wx.getStorageSync('uid'),
          wid: wx.getStorageSync('wid')
        },
        success: function (res) {
          if(res.data.data.status === 1){
            wx.reLaunch({
              url: '/pages/index/index',
            })
            wx.showToast({
              title: '您的账号已被禁用',
            })
            wx.clearStorageSync('uid')
            wx.clearStorageSync('wid')
          }
        }
      })
    }
  },

  getUserInfo: function(cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.getUserInfo({
        withCredentials: false,
        success: function(res) {
          that.globalData.userInfo = res.userInfo
          typeof cb == "function" && cb(that.globalData.userInfo)
        }
      })
    }
  },

  globalData: {
    // api: 'http://192.168.15.10:8088',
    api: 'https://api.nongxiaohe.com',
    userInfo: null
  }
})
