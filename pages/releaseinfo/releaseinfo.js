var app = getApp();
var utils = require('../../utils/util.js');
Page({
  data: {
    Guid:'',//用户id
    userid:'',//寻找合伙人或我的发布传过来的guid
    userguid: '',//寻找合伙人或我的发布传过来的userid
    userName: '',
    userSex: '',
    userAge: '',
    userPosition: '',
    userImg: '',
    userTradeName: '',
    userContent: ''
  },
  onLoad: function (options) {
    var that = this;
    var getMemberInfo = wx.getStorageSync("MemberUserInfo");
    if (getMemberInfo.Guid) {
      if (options.userid != '' && options.userid != undefined) {
        that.setData({
          Guid: getMemberInfo.Guid,
          userid: options.userid,
          userguid: options.userguid
        });
        that.getReleaseInfo('努力加载中...');
      }
    } else {
      wx.redirectTo({
        url: '../login/login',
      });
    }
  },
  //获取发布详情信息
  getReleaseInfo:function(message){
    var that = this;
    var url = app.globalData.apiUrl + '/PartnerApi/GetInformationItem';
    var data = {
      'guid': that.data.userguid
    };
    utils.requestLoading(message, url, data, 1, 'POST', function (res) {
      if (res.isSuccess) {
        var resDate = res.data;
        that.setData({
          userName: res.data.UserName,
          userSex: res.data.Sex,
          userAge: res.data.Age,
          userPosition: res.data.Position,
          userImg: res.data.PortraitImg,
          userTradeName: res.data.TradeName,
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
  //跳转到好友信息或个人中心
  goToUserInfo:function(){
    var that = this;
    if (that.data.Guid == that.data.userid){
      wx.switchTab({
        url: '../personal/personal',
      });
    }else{
      wx.navigateTo({
        url: '../userinfo/userinfo?userid='+that.data.userid,
      });
    }
  },
  //分享
  onShareAppMessage: function () {
    return {
      title: '详细信息',
      path: '/pages/releaseinfo/releaseinfo'
    }
  }
})