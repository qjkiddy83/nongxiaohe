//index.js
//获取应用实例
var app = getApp()
var uid = wx.getStorageSync('uid');

Page({
  data: {
    success : false
  },
  _load:function(){
    var self = this;
    wx.request({
      url: app.globalData.api +'/work',
      data:{
        uid : uid
      },
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
  },
  onShareAppMessage: function () {
    return {
      title: "农小盒",
      path: "/pages/index/index"
    }
  }
})
