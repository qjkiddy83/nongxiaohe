//index.js
//获取应用实例
var app = getApp()
var date = new Date();
var uid = wx.getStorageSync('uid');

Page({
  data: {
    selected:{

    },
    bigShow : false,
    bigIndex:'',
    bigSelected : false,
    bigPic : ''
  },
  //事件处理函数
  imgTap: function (e) {
    // console.log(e.currentTarget.dataset)
    this.setData({
      bigShow : true,
      bigPic : e.currentTarget.dataset.src,
      bigId: e.currentTarget.dataset.id,
      bigIndex : e.currentTarget.dataset.index,
      bigSelected : e.currentTarget.dataset.bigselected
    })
  },
  closeLayer: function (e) {
    this.setData({
      bigShow: false
    })
  },
  del:function(e){
    // console.log(e)
    let self = this;
    console.log(self.data.bigId)
    wx.request({
      url: app.globalData.api + '/work/land_pic?id=' + self.data.bigId,
      data:{
      },
      method:'DELETE',
      success:function(res){
        if(res.data.status == 1){
          let _list = self.data.list;
          let idx = self.data.bigIndex.split('-');
          _list[idx[0]].pic.splice(idx[1],1)
          // console.log(_list[idx[0]].pic)
          self.setData({
            list: _list,
            bigShow:false
          })
        }else{
          wx.showToast({
            title: '删除失败'
          })
        }
      }
    })
  },
  select:function(e){
    let _list = this.data.list; 
    let idx = this.data.bigIndex.split('-');
    _list[idx[0]].pic[idx[1]].selected = e.target.dataset.selected?false:true;
    this.setData({
      list:_list,
      bigShow : false
    })
  },
  imgupload: function (e) {
    var self = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: app.globalData.api +'/upload', //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {

          },
          success: function (res) {
            var result = JSON.parse(res.data)
            let _list = self.data.list;
            let idx = e.currentTarget.dataset.upindex;
            _list[idx].pic.push({pic:result.data.src})
            // console.log(_list[idx].pic)
            self.setData({
              list: _list
            })
            wx.request({
              url: app.globalData.api +'/work/land_pic',
              data: {
                update_land_id: e.currentTarget.dataset.upfarm_id,
                update_pic: result.data.src,
                uid : uid
              },
              method: "POST",
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              success:function(res){
                console.log(res)
              }
            })
          }
        })
      }
    })
  },
  formSubmit:function(e){
    var pages = getCurrentPages();
    var pics = pages[pages.length - 2].data.imgs;
    e.detail.value.pics.forEach(function(pic){
      if(!~pics.indexOf(pic)){
        pics.push(pic);
      }
    })
    console.log(pics)
    pages[pages.length-2].setData({
      imgs: pics
    })
    console.log(e.detail.value)
    wx.navigateBack({
      delta:1
    })
  },
  onLoad: function (options) {
    var windowWidth = 320;
    var self = this;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
      self.setData({
        imgW: (windowWidth * 0.92 - windowWidth * 0.04 * 2) / 3,
        imgR: windowWidth * 0.04,
        isfrom_select: options.isfrom_select,
        utms:options.utms
      })
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
    wx.request({
      url: app.globalData.api +"/work/land_pic",
      data:{
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
        console.log(result.data)
        self.setData({
          list: result.data.list
        })
      }
    })
  },
  onShareAppMessage: function () {
    return {
      title: "农小盒",
      path: "/pages/index/index"
    }
  }
})
