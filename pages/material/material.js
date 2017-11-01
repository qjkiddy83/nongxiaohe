//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    imgs: [],
  },
  //事件处理函数
  formSubmit: function(e) {
    var self = this,formData = e.detail.value;
    console.log(formData)
    wx.request({
      url: 'http://192.168.15.10:8088/farm',
      data: {
        id: self.data.id,
        update_name: formData.name,
        update_address: formData.address,
        update_master_name: formData.master_name,
        update_tel: formData.tel,
        update_pic: formData.imgs.join(',')
      },
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        let message = "提交成功"

        if (!res.data.status) {
          message = "提交失败"
        }
        wx.showToast({
          title: message
        })
      }
    })
  },
  imgupload: function () {
    var self = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
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
      url: "http://192.168.15.10:8088/farm",
      success:function(res){
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
          farm: result.data.farm,
          imgs: result.data.farm.pic ? result.data.farm.pic.split(','):[],
          id : result.data.farm.id
        })
      }
    })
  }
})
