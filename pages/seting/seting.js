//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    success : false
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
  onLoad: function (options) {
    this.setData({
      type : options.type,
      title : options.tit
    })
  }
})
