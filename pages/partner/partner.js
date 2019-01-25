var app = getApp();
var utils = require('../../utils/util.js');
Page({
  data: {
    Guid:'',//用户ID
    barIndex: 0,//选项卡索引
    dataList: [],//看过我的 我关注的 关注我的
    dataIsEmpty:false,//是否有数据
    searchVal: '', //搜索值
  },
  onLoad:function(){
    var that = this;
    var getMemberInfo = wx.getStorageSync("MemberUserInfo");
    if (getMemberInfo.Guid) {
      that.setData({
        Guid: getMemberInfo.Guid,
      });
      that.getFollowList('努力加载中...', that.data.barIndex);
    } else {
      wx.redirectTo({
        url: '../login/login',
      });
    }
  },
  //合伙人 导航切换
  changeBar: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    if (that.data.barIndex === index) {
      return false;
    } else {
      that.setData({
        barIndex: index
      });
      that.getFollowList('努力加载中...', index);
    }
  },
  //看过我的 我关注的 关注我的
  getFollowList:function(message,typeindex){
    var that = this;
    var url = app.globalData.apiUrl + '/PartnerApi/GetFollowList';
    var data = {
      'userid': that.data.Guid,
      'type': typeindex,
      'pagesize': 10000,
    };
    utils.requestLoading(message, url, data, 0, 'GET', function (res) {
      if (res.isSuccess) {        
        if (res.message!=0){
          that.setData({
            dataIsEmpty:true
          });
        }else{
          that.setData({
            dataIsEmpty: false
          });
        }
        that.setData({
          dataList: res.data
        });
      }
    }, function (res) {
      wx.showToast({
        title: '服务器出错...',
        image: '/images/error.png'
      });
    });
  },
  //跳转到好友详情
  goToUserInfo:function(e){
    var that = this;
    var userid = e.currentTarget.dataset.userid;
    if (userid == that.data.Guid) {
      wx.switchTab({
        url: '../personal/personal'
      });
    } else {
      wx.navigateTo({
        url: '../userinfo/userinfo?userid=' + userid,
      });
    }
  },
  //input搜索
  bindSearchVal: function (e) {
    var that = this;
    that.setData({
      searchVal: e.detail.value
    });
  },
  //点击搜索按钮
  searchSubmitBtn: function () {
    var that = this;
    if (that.data.searchVal == '') {
      utils.alertMsg('请输入您需要搜索的姓名或职位！');
      return false;
    } else {
      that.getDataList('努力加载中...', that.data.barIndex);
    }
  },
  //获取搜索列表
  getDataList: function (message,typeindex) {
    var that = this;
    var url = app.globalData.apiUrl + '/PartnerApi/GetFollowList';
    var data = {
      'userid': that.data.Guid,
      'type': typeindex,
      'pagesize':10000,
      'where': that.data.searchVal
    };
    utils.requestLoading(message, url, data, 0, 'GET', function (res) {
      if (res.isSuccess) {
        if (res.message != 0) {
          that.setData({
            dataIsEmpty: true
          });
        } else {
          that.setData({
            dataIsEmpty: false
          });
        }
        that.setData({
          dataList: res.data
        });
      }
    }, function (res) {
      wx.showToast({
        title: '服务器出错...',
        image: '/images/error.png'
      });
    });
  },
  //点击取消关注按钮
  bindDelFollow:function(e){
    var that = this;
    wx.showModal({
      title: '温馨提示',
      content: '确定要取消关注吗？',
      confirmColor: '#b50029',
      success: function (res) {
        if (res.confirm) {
          that.bindDelFollowSubmit('取消关注中...', e.currentTarget.dataset.userid);
        }
      }
    });
  },
  bindDelFollowSubmit: function (message, OtherID){
    var that = this;
    var url = app.globalData.apiUrl + '/PartnerApi/DelFollow';
    var data = {
      'Userid': that.data.Guid,
      'OtherID': OtherID
    };
    utils.requestLoading(message, url, data, 0, 'GET', function (res) {
      if (res.isSuccess) {
        wx.showToast({
          title: '取消成功',
          icon:'none'
        });
        that.getFollowList('', that.data.barIndex);
      }else{
        utils.alertMsg(res.message == '' ? '取消关注失败，请稍后再试！' : res.message);
      }
    }, function (res) {
      wx.showToast({
        title: '服务器出错...',
        image: '/images/error.png'
      });
    });
  },
  //分享
  onShareAppMessage: function () {
    return {
      title: '意向',
      path: '/pages/partner/partner'
    }
  }
})