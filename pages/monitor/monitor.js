//index.js
//获取应用实例
var app = getApp()
var lineChart = null;
var wxCharts = require('../../lib/wxcharts.js');
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
    device: ["设备选择", "温度", "湿度", "光照", "二氧化碳", "PM2.5"],
    device_index: 0,
    data_cycle: ["周期选择（默认一天）", "一天", "一周", "一个月", "六个月"],
    data_cycle_index: 0
  },
  //事件处理函数
  tabswitch: function (e) {
    this.setData({
      tab: e.target.dataset.tab
    })
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
  onLoad: function () {
    var windowWidth = 320;
    var self = this;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
      self.setData({
        wwidth: windowWidth
      })
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }

    new wxCharts({
      canvasId: 'lineCanvas',
      type: 'line',
      categories: ['2012', '2013', '2014', '2015', '2016', '2017'],
      series: [{
        name: '低线',
        data: [0.15, 0.2, 0.45, 0.37, 0.4, 0.8],
        format: function (val) {
          return ''//val.toFixed(2) + '万';
        }
      }, {
        name: '高线',
        data: [0.30, 0.37, 0.65, 0.78, 0.69, 0.94],
        format: function (val) {
          return ''//val.toFixed(2) + '万';
        }
      }],
      yAxis: {
        title: '',
        format: function (val) {
          return val.toFixed(2);
        },
        min: 0
      },
      width: windowWidth,
      height: windowWidth*3/4
    });
  }
})
