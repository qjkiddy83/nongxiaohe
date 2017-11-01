//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    success : false
  },
  _load:function(){
    var self = this;
    wx.request({
      url: 'http://192.168.15.10:8088/work',
      success: function (res) {
        let result = res.data;
        if (!result.status) {
          wx.showModal({
            content: '获取数据失败',
            showCancel: false
          })
          return;
        }
        // console.log(result.data)
        self.setData({
          records: result.data
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
        wwidth : windowWidth
      })
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }

    this._load();
  }
})
