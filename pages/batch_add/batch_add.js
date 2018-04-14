//index.js
//获取应用实例
var app = getApp()
var date = new Date(); 
var uid = '';

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
    if (!formData.name || !formData.device_id || !formData.land || !formData.zzdates || !formData.csdates){
      wx.showModal({
        content: '请填写必须的资料',
        showCancel:false
      })
      return false;
    }
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
        uid : uid
      },
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        let message = "提交成功"

        if (res.data.status != 1) {
          message = "提交失败"
        }
        wx.showToast({
          title: message,
          complete:function(){
            if (res.data.status == 1) {
              // var pages = getCurrentPages();
              // pages[pages.length - 2]._load();
              // wx.navigateBack({
              //   delta: 1
              // })
              console.log(res)
              wx.request({
                url: app.globalData.api + "/origin/info",
                data: {
                  id: res.data.data.id,
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
                  // console.log(result.data)
                  let _info = result.data.info;
                  self.setData({
                    qrcode : _info.qrcode,
                    qrcodelayer : true
                  });
                  wx.showLoading({
                    title: '加载中...',
                  })
                }
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
  showPic:function(e){
    this.setData({
      bigPic:e.currentTarget.dataset.src,
      bigShow:true,
      bigIndex:e.currentTarget.dataset.index
    })
  },
  closeLayer:function(){
    this.setData({
      bigShow:false
    })
  },
  delPic:function(e){
    let imgs = this.data.imgs;
    imgs.splice(this.data.bigIndex,1);
    this.setData({
      imgs : imgs,
      bigShow:false
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
  downQrcode:function(e){
    wx.downloadFile({
      url: this.data.qrcode, //仅为示例，并非真实的资源
      success: function (res) {
        if (res.statusCode === 200) {
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success(res) {
            }
          })
        }
      }
    })
  },
  qrcodeloaded:function(){
    wx.hideLoading()
  },
  onLoad: function (options) {
    uid = wx.getStorageSync('uid');
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
      data:{
        uid : uid
      },
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
      data:{
        uid : uid
      },
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
          id : options.id,
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
  },
  onShareAppMessage: function () {
    return {
      title: "农小盒",
      path: "/pages/index/index"
    }
  },
  onUnload:function(){
    var pages = getCurrentPages();
    pages[pages.length - 2]._load();
  },
  goback:function(){
    wx.navigateBack({
      delta: 1
    })
  }
})
