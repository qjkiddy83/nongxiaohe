//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    printer: [
      "1#打印机",
      "2#打印机"
    ],
    printer_index : 0
  },
  //事件处理函数
  submitSet: function() {
    wx.showModal({
      title: '提示',
      content: '设置成功，点击确认返回设备页。',
      confirmText: '确认',
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          var pages = getCurrentPages();
          // var currPage = pages[pages.length - 1];   //当前页面
          var prevPage = pages[pages.length - 2];
          console.log(prevPage)
          prevPage.setData({
            
          })
          wx.navigateBack({
            delta: 1
          })
        }
      }
    })
  },
  printerChange: function (e) {
    this.setData({
      printer_index: e.detail.value
    })
  },
  onLoad: function (options) {
    var windowWidth = 320;
    var self = this;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
      self.setData({
        imgW: (windowWidth * 0.92 - windowWidth * 0.04 * 3) / 4,
        imgR: windowWidth * 0.04
      })
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
  }
})
