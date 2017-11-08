//index.js
//获取应用实例
var app = getApp()
var uid = wx.getStorageSync('uid');
var windowWidth = 320;
var pagelock = 0;
Page({
  data: {
    msgpage: {
      current: 1,
      total: 1
    },
  },
  lower: function () {
    var self = this;
    if (this.data.msgpage.current >= this.data.msgpage.total || pagelock) {
      return;
    }
    pagelock = 1;

    wx.request({
      url: app.globalData.api+'/farm/msg',
      data: {
        page: parseInt(this.data.msgpage.current) + 1,
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
        // console.log(result.data.pic)

        self.setData({
          msgs: self.data.msgs.concat(result.data.list),
          msgpage: result.data.page
        })
      },
      complete: function () {
        pagelock = 0;
      }
    })
  },
  onLoad: function () {
    var self = this;
    var res = wx.getSystemInfoSync();
    windowWidth = res.windowWidth;
    self.setData({
      scrHeight: res.windowHeight,
      wwidth: windowWidth
    })

    wx.request({
      url: app.globalData.api+'/farm/msg',
      data:{
        uid:uid
      },
      success:function(res){
        let result = res.data;
        if (!result.status) {
          wx.showModal({
            content: '获取数据失败',
            showCancel: false
          })
          return;
        }
        console.log(res.data)
        self.setData({
          msgs: result.data.list,
          msgpage:result.data.page
        })
      }
    })
  }
})
