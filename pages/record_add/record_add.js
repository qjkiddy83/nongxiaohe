//index.js
//获取应用实例
var app = getApp()
var date = new Date();
var uid = '';

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
          url: app.globalData.api+'/upload', //仅为示例，非真实的接口地址
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
    if (!self.data.content || !self.data.category_id || !self.data.land_id || !self.data.amount){
      wx.showModal({
        title: '提示',
        content: '请填写完整内容再提交',
        showCancel:false
      })
      return false;
    }
    wx.request({
      url: app.globalData.api+'/work',
      data: {
        id:self.data.id||'',
        update_pic: self.data.imgs.join(','),
        update_category: self.data.category_id,
        update_land: self.data.land_id,
        update_workdate: self.data.workdate,
        update_content: self.data.content,
        update_amount: self.data.amount,
        uid:uid
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
            let isFromList = false;
            pages.forEach(function(page,i){
              if (page.route == "pages/record/record"){
                isFromList = true;
                pages[i]._load();
                wx.navigateBack({
                  delta: pages.length-i-1
                })
              }
            })
            if (!isFromList){
              wx.navigateTo({
                url: '/pages/record/record',
              })
            }
          }
        })
      }
    })
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
      url: app.globalData.api+'/work/land',
      data:{
        uid : uid
      },
      success:function(res){
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
          land: result.data.list
        })
      }
    })
    wx.request({
      url: app.globalData.api+'/work/category',
      data:{
        uid :uid
      },
      success: function (res) {
        let result = res.data;
        if (!result.status) {
          wx.showModal({
            content: '获取农事分类数据失败',
            showCancel: false
          })
          return;
        }
        // console.log(result.data)
        self.setData({
          category: result.data.list
        })
      }
    })

    if(options.id){
      wx.request({
        url: app.globalData.api+'/work/info',
        data:{
          id:options.id,
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
          // console.log(result.data)
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
  },
  onShareAppMessage: function () {
    return {
      title: "农小盒",
      path: "/pages/index/index"
    }
  }
})
