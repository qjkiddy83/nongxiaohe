//index.js
//获取应用实例
var app = getApp()
var date = new Date();
Page({
  data: {
    imgs: [
    ],
    date_start: '',
    date_end : ''
  },
  //事件处理函数
  formSubmit: function (e) {
    var self = this, formData = e.detail.value;
    console.log(formData);
    wx.request({
      url: app.globalData.api+'/origin',
      data: {
        id: self.data.id||"",	
        update_name: formData.name,	
        update_pic: formData.imgs.join(','),	
        update_device_id: formData.device_id,	
        update_land: formData.land,	
        update_zzdate: formData.zzdates,	
        update_csdate: formData.csdates,	
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
          title: message,
          complete:function(){
            if (res.data.status) {
              var pages = getCurrentPages();
              pages[pages.length - 2]._load();
              wx.navigateBack({
                delta: 1
              })
            }
          }
        })
      }
    })
    
  },
  startDateChange: function (e) {
    this.setData({
      zzdates: e.detail.value
    })
  },
  endDateChange: function (e) {
    this.setData({
      csdates: e.detail.value
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
          url: app.globalData.api +'/upload', //仅为示例，非真实的接口地址
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
      url: app.globalData.api +'/device/list',
      success: function (res) {
        let result = res.data;
        if (!result.status) {
          wx.showModal({
            content: '获取设备数据失败',
            showCancel: false
          })
          return;
        }
        console.log(result.data)
        self.setData({
          devicelist: result.data.list
        })
      }
    })

    wx.request({
      url: app.globalData.api +'/work/land',
      success: function (res) {
        let result = res.data;
        if (!result.status) {
          wx.showModal({
            content: '获取地块数据失败',
            showCancel: false
          })
          return;
        }
        // console.log(result.data)
        self.setData({
          landlist: result.data.list
        })
      }
    })

    if(options.id){
      // console.log(options.id)
      wx.request({
        url: app.globalData.api +"/origin/info",
        data : {
          id : options.id
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
          let _info = result.data.info;
          self.setData(result.data.info);
          self.setData({
            imgs : _info.pic.split(',')
          })
        }
      })
    }else{
      this.setData({
        csdates: [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-'),
        zzdates: [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-')
      })
    }
  }
})
