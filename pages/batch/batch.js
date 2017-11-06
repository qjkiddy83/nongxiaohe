//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    success : false
  },
  onLoad: function () {
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
      url: app.globalData.api+"/origin",
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
          list: result.data.list
        })
      }
    })
  }
})
