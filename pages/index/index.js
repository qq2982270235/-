var app = getApp();
var utils = require('../../utils/util.js');
Page({
  data: {
    Guid: '', //用户ID
    swiperCurrent: 0, //轮播图索引
    bannerList: [], //轮播图数据
    baseHose: app.globalData.apiUrl, //域名地址
    msgNum:0,//留言数量
    pageIndex: 1, //当前页  默认第一页
    pageSize: 6, //每一页多少条数据
    dataList: [], //放置返回数据的数组
    isFromSearch: true, // 用于判断dataList数组是不是空数组，默认true，空的数组
    dataIsMore: true, //是否还有更多数据
    dataIsEmpty: true, //数据列表是否为空 默认为空
  },
  onLoad: function() {
    var that = this;
    that.getBannerImages(''); //轮播图
    that.getDataList('努力加载中...'); //获取发布内容
  },
  onShow: function() {
    var that = this;
    var getMemberInfo = wx.getStorageSync("MemberUserInfo");
    if (getMemberInfo.Guid) {
      that.setData({
        Guid: getMemberInfo.Guid,
        IsPerfect: getMemberInfo.IsPerfect
      });
      that.getMessage('');//获取未读留言数量
    } else {
      wx.redirectTo({
        url: '../login/login',
      });
    }
    //判断是否设置个人信息
    if (!that.data.IsPerfect) {
      wx.showModal({
        title: '温馨提示',
        content: '请前往完善个人信息，有助于好友了解你！',
        confirmColor: '#b50029',
        success: function(res) {
          if (res.confirm) {
            wx.switchTab({
              url: '../personal/personal',
            });
          }
        }
      });
    }
  },
  //调整Banner轮播图
  changDot(e) {
    this.setData({
      swiperCurrent: e.detail.current
    });
  },
  //获取轮播图片
  getBannerImages: function(message) {
    var that = this;
    var url = app.globalData.apiUrl + '/PartnerApi/GetBroadcastList';
    var data = {};
    utils.requestLoading(message, url, data, 0, 'GET', function(res) {
      if (res.isSuccess) {
        that.setData({
          bannerList: res.data
        });
      }
    }, function(res) {
      wx.showToast({
        title: '服务器出错...',
        image: '/images/error.png'
      });
    });
  },
  //获取未读留言
  getMessage:function(message) {
    var that = this;
    var url = app.globalData.apiUrl + '/PartnerApi/SelectMessageCount';
    var data = {
      'userid': that.data.Guid
    };
    utils.requestLoading(message, url, data, 1, 'POST', function (res) {
      if (res.isSuccess) {
        that.setData({
          msgNum: res.data
        });
      }
    }, function (res) {
      wx.showToast({
        title: '服务器出错...',
        image: '/images/error.png'
      });
    });
  },

  //搜索
  bindSearch: function() {
    wx.navigateTo({
      url: '../search/search',
    });
  },
  //获取发布的数据列表
  getDataList: function(message) {
    var that = this;
    var url = app.globalData.apiUrl + '/PartnerApi/GetUserPageList';
    var data = {
      'type': 0,
      'pageIndex': that.data.pageIndex,
      'pageSize': that.data.pageSize
    };
    utils.requestLoading(message, url, data, 0, 'GET', function(res) {
      if (res.isSuccess) {
        if (res.message == 0) {
          that.setData({
            dataIsEmpty: false
          });
        } else {
          var totalRow = res.message;
          var totalPage = Math.ceil(totalRow / that.data.pageSize);
          var currentPage = that.data.pageIndex;
          if (currentPage <= totalPage) {
            var tempDataList = [];
            //如果isFromSearch是true从data中取出数据，否则先从原来的数据继续添加
            that.data.isFromSearch ? tempDataList = res.data : tempDataList = that.data.dataList.concat(res.data)
            that.setData({
              dataList: tempDataList,
              dataIsMore: true
            });
          } else {
            that.setData({
              dataIsMore: false
            });
          }
        }
      }
    }, function(res) {
      wx.showToast({
        title: '服务器出错...',
        image: '/images/error.png'
      });
    });
  },
  //加载更多数据
  onReachBottom: function() {
    var that = this;
    if (that.data.dataIsMore) {
      that.setData({
        pageIndex: that.data.pageIndex + 1,
        isFromSearch: false
      });
      that.getDataList('努力加载中...');
    } else {
      wx.showToast({
        title: '没有更多数据...',
        image: '/images/cry.png'
      });
    }
  },
  //刷新数据
  onPullDownRefresh: function() {
    var that = this;
    wx.showToast({
      title: '正在刷新数据...',
      image: '/images/smile.png',
      duration: 1000
    });
    that.setData({
      pageIndex: 1,
      isFromSearch: true,
    });
    setTimeout(function() {
      that.getDataList('');
      that.getBannerImages('');
      wx.stopPullDownRefresh();
    }, 1000);
  },
  //跳转 本人跳转到个人中心  别人跳转到好友信息中
  goToUserInfo: function (e) {
    var userguid = e.currentTarget.dataset.userguid;
    var userid = e.currentTarget.dataset.userid;
    wx.navigateTo({
      url: '../releaseinfo/releaseinfo?userid=' + userid + '&userguid=' + userguid,
    });
  },
  //分享
  onShareAppMessage: function() {
    return {
      title: '首页',
      path: '/pages/index/index'
    }
  }
})