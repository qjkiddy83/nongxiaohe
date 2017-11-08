//index.js
//获取应用实例
var app = getApp()
var uid = wx.getStorageSync('uid');
var lineChart = null;
var windowWidth = 320;
var wxCharts = require('../../lib/wxcharts.js');
var date = new Date();
var pagelock = 0;
Page({
  data: {
    tabs: [{
      text: "设备监控"
    }, {
      text: "数据统计"
    }, {
      text: "图像记录"
    }, {
      text: "设备日志"
    }],
    tab: 0,
    device_index: 0,
    data_cycle_index: 0,
    date: [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-'),
    scrHeight: 300,
    picpage: {
      current : 1,
      total:1
    },
    msgpage: {
      current: 1,
      total: 1
    }
  },
  //事件处理函数
  tabswitch: function (e) {
    var self = this;
    this.setData({
      tab: e.target.dataset.tab
    })
    switch (e.target.dataset.tab) {
      case 1:
        wx.request({
          url: app.globalData.api+'/device/stat',
          data: {
            id: self.data.deviceid,
            device: self.data.home.device[0].id,
            uid:uid
          },
          success(res) {
            let result = res.data;
            if (!result.status) {
              wx.showModal({
                content: '获取数据失败',
                showCancel: false
              })
              return;
            }
            self.setData({
              statistics: result.data
            })
            self.drawCharts(result.data.data);
          }
        })
        break;
        case 2:
          wx.request({
            url: app.globalData.api+'/device/pic',
            data:{
              page:1,
              id: self.data.deviceid,
              search_date :self.data.date,
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
              // console.log(result.data.pic)
              
              self.setData({
                pics: result.data.pic,
                picpage :result.data.page
              })
            }
          })
        break;
        case 3:
          wx.request({
            url: app.globalData.api+'/device/msg',
            data: {
              page: 1,
              id: self.data.deviceid,
              search_date: self.data.date,
              uid:uid
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
              console.log(result.data)

              self.setData({
                msg: result.data.msg,
                msgpage: result.data.page
              })
            }
          })
          break;
    }
  },
  deviceChange: function (e) {
    this.setData({
      device_index: e.detail.value
    })
  },
  dataCycleChange: function (e) {
    this.setData({
      data_cycle_index: e.detail.value
    })
  },
  dateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  showCharts: function () {
    var self = this;
    wx.request({
      url: app.globalData.api+'/device/stat',
      data: {
        id: self.data.deviceid,
        device: self.data.statistics.device[self.data.device_index || 0].id,
        search_group: self.data.statistics.group[self.data.data_cycle_index || 0].id,
        uid : uid
      },
      success(res) {
        let result = res.data;
        if (!result.status) {
          wx.showModal({
            content: '获取数据失败',
            showCancel: false
          })
          return;
        }
        self.drawCharts(result.data.data);
      }
    })
  },
  drawCharts: function (data) {
    let categories = [],
      _data = [];
    data.forEach(function (item, i) {
      categories = JSON.parse(item.data.time)
      _data[i] = {};
      _data[i].name = item.name;
      _data[i].list = JSON.parse(item.data.value)
    })
    new wxCharts({
      canvasId: 'lineCanvas',
      type: 'line',
      categories: categories,
      series: [{
        name: _data[0].name,
        data: _data[0].list,
        format: function (val) {
          return ''//val.toFixed(2) + '万';
        }
      }, {
        name: _data[1].name,
        data: _data[1].list,
        format: function (val) {
          return ''//val.toFixed(2) + '万';
        }
      }],
      yAxis: {
        title: '',
        format: function (val) {
          return val;
        },
        min: 0
      },
      width: windowWidth,
      height: windowWidth * 3 / 4
    });
  },
  onLoad: function (options) {
    var self = this;
    var res = wx.getSystemInfoSync();
    windowWidth = res.windowWidth;
    self.setData({
      scrHeight: res.windowHeight - 75,
      wwidth: windowWidth,
      deviceid: options.id
    })

    wx.request({
      url: app.globalData.api+'/device',
      data: {
        id: options.id,
        uid:uid
      },
      success(res) {
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
          home: result.data
        })
      }
    })
  },
  reload : function(){
    var self = this;
    wx.request({
      url: app.globalData.api+'/device',
      data: {
        id: self.data.deviceid,
        uid:uid
      },
      success(res) {
        let result = res.data;
        console.log(result)
        if (!result.status) {
          wx.showModal({
            content: '获取数据失败',
            showCancel: false
          })
          return;
        }
        // console.log(result.data)
        self.setData({
          home: result.data
        })
      }
    })
  },
  lower:function(){
    var self = this;
    if(this.data.picpage.current >= this.data.picpage.total || pagelock){
      return;
    }
    pagelock = 1;
    
    wx.request({
      url: app.globalData.api+'/device/pic',
      data: {
        page: parseInt(this.data.picpage.current)+1,
        id: self.data.deviceid,
        search_date: self.data.date,
        uid:uid
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
          pics: self.data.pics.concat(result.data.pic),
          picpage: result.data.page
        })
      },
      complete:function(){
        pagelock = 0;
      }
    })
  },
  lowermsg: function () {
    var self = this;
    if (this.data.msgpage.current >= this.data.msgpage.total || pagelock) {
      return;
    }
    pagelock = 1;

    wx.request({
      url: app.globalData.api+'/device/msg',
      data: {
        page: parseInt(this.data.msgpage.current) + 1,
        id: self.data.deviceid,
        search_date: self.data.date,
        uid:uid
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
          msg: self.data.msg.concat(result.data.msg),
          msgpage: result.data.page
        })
      },
      complete: function () {
        pagelock = 0;
      }
    })
  }
})
