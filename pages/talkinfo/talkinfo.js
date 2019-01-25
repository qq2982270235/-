var app = getApp();
var utils = require('../../utils/util.js');
Page({
  data: {
    Guid: '',//用户id
    userid:'',//userid
    userguid: '',//传递的guid
    userName: '',
    userImg: '',
    userTime:'',
    userContent: ''
  },
  onLoad: function (options) {
    var that = this;
    var getMemberInfo = wx.getStorageSync("MemberUserInfo");
    if (getMemberInfo.Guid) {
      if (options.userguid != '' && options.userguid != undefined && options.userid != '' && options.userid!=undefined) {
        that.setData({
          Guid: getMemberInfo.Guid,
          userid: options.userid,
          userguid: options.userguid
        });
        that.getmessageinfo('努力加载中...');
      }
    } else {
      wx.redirectTo({
        url: '../login/login',
      });
    }
  },
  //获取发布详情信息
  getmessageinfo: function (message) {
    var that = this;
    var url = app.globalData.apiUrl + '/PartnerApi/SelectMessageByguid';
    var data = {
      'guid': that.data.userguid
    };
    utils.requestLoading(message, url, data, 1, 'POST', function (res) {
      if (res.isSuccess) {
        var resDate = res.data;
        that.setData({
          userName: res.data.UserNane,
          UserImg: res.data.UserImg,
          userTime: res.data.CreateDate,
          userContent: res.data.Content
        });
      }
    }, function (res) {
      wx.showToast({
        title: '服务器出错...',
        image: '/images/error.png'
      });
    });
  },
  //跳转到好友信息
  goToUserInfo: function () {
    var that = this;
    wx.navigateTo({
      url: '../userinfo/userinfo?userid=' + that.data.userid,
    });
  },
  //分享
  onShareAppMessage: function () {
    return {
      title: '留言详情',
      path: '/pages/talkinfo/talkinfo'
    }
  }
})