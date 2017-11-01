//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    success: false
  },
  //事件处理函数
  submitSet: function (e) {
    wx.request({
      url: 'http://192.168.15.10:8088/device/set',
      data: e.detail.value,
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.showModal({
          title: '提示',
          content: '设置成功，点击确认返回设备页。',
          confirmText: '确认',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              var pages = getCurrentPages();
              var prevPage = pages[pages.length - 2];
              prevPage.reload();
              wx.navigateBack({
                delta: 1
              })
            }
          }
        })
      }
    })

  },
  onLoad: function (options) {
    console.log(options)
    this.setData({
      id: options.id,
      title: options.tit,
      unit: options.unit
    })
  }
})
