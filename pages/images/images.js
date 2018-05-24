// pages/images/images.js
let app = getApp(); 
var date = new Date();
var uid = '';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-'),
    picpage: {
      current: 1,
      total: 1
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    uid = wx.getStorageSync('uid');
    this.getPics();
  },
  getPics:function(){
    var self = this;
    wx.request({
      url: app.globalData.api + '/device/pic',
      data: {
        page: 1,
        id: self.data.deviceid,
        search_date: self.data.date,
        uid: uid
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
          pics: result.data.pic,
          picpage: result.data.page
        })
      }
    })
  },
  dateChange: function (e) {
    this.setData({
      date: e.detail.value
    }, function () {
      this.getPics()
    }.bind(this))
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})