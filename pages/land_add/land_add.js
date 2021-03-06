//index.js
//获取应用实例
var app = getApp()
var uid = '';

Page({
  data: {
  },
  nameUpdate : function(e){
    this.setData({
      name : e.detail.value
    })
  },
  //事件处理函数
  submitSet: function(e) {
    let act = e.currentTarget.dataset.act,self = this;
    switch(act){
      case 'ok':
        wx.request({
          url: app.globalData.api +'/work/land',
          data: {
            id : self.data.id,
            update_name : self.data.name,
            uid: uid
          },
          method: "POST",
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            wx.showToast({
              title: '提交成功',
              complete: function () {
                var pages = getCurrentPages();
                pages[pages.length - 2]._load();
                wx.navigateBack({
                  delta: 1
                })
              }
            })
          }
        })
      break;
      case 'cancel':
        wx.navigateBack({
          delta : 1
        })
      break;
      case 'del':
        // console.log(self.data.id)
        wx.request({
          url: app.globalData.api +'/work/land?id='+self.data.id,
          data:{
            uid : uid
          },
          method : "DELETE",
          success: function (res) {
            wx.showToast({
              title: '提交成功',
              complete : function(){
                var pages = getCurrentPages();
                pages[pages.length-2]._load();
                wx.navigateBack({
                  delta: 1
                })
              }
            })
          }
        })
      break;
    }
  },
  onLoad: function (options) {
    uid = wx.getStorageSync('uid')
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

    this.setData({
      id : options.id||"",
      name : options.name
    })
  },
  onShareAppMessage: function () {
    return {
      title: "农小盒",
      path: "/pages/index/index"
    }
  }
})
