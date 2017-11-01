//index.js
//获取应用实例
var app = getApp()
var date = new Date();
Page({
  data: {
    imgs: [],
    workdate: ''
  },
  //事件处理函数
  bindDevice: function () {
    
  },
  dateChange: function (e) {
    this.setData({
      workdate: e.detail.value
    })
  },
  landChange:function(e){
    this.setData({
      land_id:e.detail.value
    })
  },
  categoryChange: function (e) {
    this.setData({
      category_id: e.detail.value
    })
  },
  contentUpdate:function(e){
    this.setData({
      content:e.detail.value
    })
  },
  amountUpdate: function (e) {
    this.setData({
      amount: e.detail.value
    })
  },
  imgupload:function(){
    var self = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: 'http://192.168.15.10:8088/upload', //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            
          },
          success: function (res) {
            var result = JSON.parse(res.data)
            // console.log(result,self.data)
            self.setData({
              imgs: self.data.imgs.concat([result.data.src])
            })
          }
        })
      }
    })
  },
  submit:function(){
    var self = this;
    wx.request({
      url: 'http://192.168.15.10:8088/work',
      data: {
        id:self.data.id||'',
        update_pic: self.data.imgs.join(','),
        update_category: self.data.category_id,
        update_land: self.data.land_id,
        update_workdate: self.data.workdate,
        update_content: self.data.content,
        update_amount: self.data.amount
      },
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if(!res.data.status){
          wx.showToast({
            title: '提交失败',
            complete: function () {
              
            }
          })
          return;
        }
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
    wx.request({
      url: 'http://192.168.15.10:8088/work/land',
      success:function(res){
        let result = res.data;
        if (!result.status) {
          wx.showModal({
            content: '获取地块数据失败',
            showCancel: false
          })
          return;
        }
        console.log(result.data)
        self.setData({
          land: result.data.list
        })
      }
    })
    wx.request({
      url: 'http://192.168.15.10:8088/work/category',
      success: function (res) {
        let result = res.data;
        if (!result.status) {
          wx.showModal({
            content: '获取农事分类数据失败',
            showCancel: false
          })
          return;
        }
        console.log(result.data)
        self.setData({
          category: result.data.list
        })
      }
    })

    if(options.id){
      wx.request({
        url: 'http://192.168.15.10:8088/work/info',
        data:{
          id:options.id
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
            id: options.id,
            imgs: result.data.info.pic.split(','),
            category_id: result.data.info.category_id,
            land_id: result.data.info.land_id,
            workdate: result.data.info.workdates,
            content: result.data.info.content,
            amount: result.data.info.amount
          })
        }
      })
    }else{
      this.setData({
        workdate: [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-')
      })
    }
  }
})
