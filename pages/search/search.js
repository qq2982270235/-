var app = getApp();
var utils = require('../../utils/util.js');
Page({
  data: {
    Guid:'',//用户ID
    searchVal: '', //搜索值
    pageIndex: 1, //当前页  默认第一页
    pageSize: 15, //每一页多少条数据
    dataList: [], //放置返回数据的数组
    isFromSearch: true, // 用于判断dataList数组是不是空数组，默认true，空的数组
    dataIsMore: true, //是否还有更多数据
    dataIsEmpty: true, //数据列表是否为空 默认为空
  },
  onLoad:function(){
    var that = this;
    var getMemberInfo = wx.getStorageSync("MemberUserInfo");
    if (getMemberInfo.Guid) {
      that.setData({
        Guid: getMemberInfo.Guid
      });
    } else {
      wx.redirectTo({
        url: '../login/login',
      });
    }
  },
  bindSearchVal: function(e) {
    var that = this;
    that.setData({
      searchVal: e.detail.value
    });
  },
  //点击搜索按钮
  searchSubmitBtn: function() {
    var that = this;
    if (that.data.searchVal == '') {
      utils.alertMsg('请输入您需要搜索的姓名或职位！');
      return false;
    } else {
      that.getDataList('努力加载中...');
    }
  },
  //获取发布的数据列表
  getDataList: function(message) {
    var that = this;
    var url = app.globalData.apiUrl + '/PartnerApi/GetUserPageList';
    var data = {
      'type': 0,
      'where': that.data.searchVal,
      'pageIndex': that.data.pageIndex,
      'pageSize': that.data.pageSize
    };
    utils.requestLoading(message, url, data, 0, 'GET', function(res) {
      if (res.isSuccess) {
        if (res.message == 0) {
          that.setData({
            dataIsEmpty: false,
            pageIndex: 1, 
            dataList: [], 
            isFromSearch: true, 
            dataIsMore: true,
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
              dataIsMore: true,
              dataIsEmpty: true
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
      title: '搜索',
      path: '/pages/search/search'
    }
  }
})