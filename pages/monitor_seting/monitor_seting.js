//index.js
//获取应用实例
var app = getApp()
var uid = wx.getStorageSync('uid');

Page({
  data: {
    success: false
  },
  //事件处理函数
  submitSet: function (e) {
    let _data = e.detail.value;
    _data.uid = uid;
    wx.request({
      url: app.globalData.api +'/device/set',
      data: _data,
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
      unit: options.unit,
      max:options.max === "null"?'':options.max,
      min:options.min === "null"?'':options.min
    })
  },
  onShareAppMessage: function () {
    return {
      title: "农小盒",
      path: "/pages/index/index"
    }
  }
})
