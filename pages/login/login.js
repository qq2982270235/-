var app = getApp();
var utils = require('../../utils/util.js');
Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    wx_avatarUrl:'/images/normal_header.png',
    wx_nickName: '',
  },
  onLoad:function(){
    var that = this;
    var getMemberInfo = wx.getStorageSync('MemberUserInfo') || [];
    if (getMemberInfo.Guid != '' && getMemberInfo.Guid != undefined && getMemberInfo.Daniel != '' && getMemberInfo.Daniel!=undefined) {
      that.setData({
        wx_avatarUrl: getMemberInfo.Images,
        wx_nickName: getMemberInfo.Name
      });
      setTimeout(function () {
        wx.switchTab({
          url: '../index/index',
        });
      }, 200);
    }
  },
  //点击授权按钮
  bindGetUserInfo: function (e) {
    var that = this;
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      wx.getUserInfo({
        lang: 'zh_CN',
        success: function (res) {
          //获取微信code
          wx.login({
            success: function (logres) {
              wx.showToast({
                title: '授权成功！',
                icon: 'none'
              });
              that.setData({
                wx_nickName: res.userInfo.nickName,
                wx_avatarUrl: res.userInfo.avatarUrl,
              });
              that.loginSubmit('', logres.code, res.encryptedData, res.iv);
            }
          });
          if (that.userInfoReadyCallback) {
            that.userInfoReadyCallback(res);
          }
        }     
      });
    } else {
      //点击拒绝按钮  返回授权
      wx.showModal({
        title: '温馨提示',
        content: '您点击了拒绝授权，将无法体验小程序，请授权之后再进入!',
        showCancel: false,
        confirmText: '返回授权',
        confirmColor: '#b50029'
      });
    }
  },
  //授权登陆
  loginSubmit: function (message, code, encryptedData, iv){
    var that = this;
    var url = app.globalData.apiUrl +'/PartnerApi/GetWxValidate';
    var data={
      'code': code,
      'encryptedData': encryptedData,
      'iv':iv
    };
    utils.requestLoading(message, url, data, 0, 'GET', function (res) {
      if (res.isSuccess){
        wx.hideToast();
        //缓存授权时返回的数据
        try{
          wx.setStorageSync('MemberUserInfo', res.data);
        }catch(e){
          utils.alertMsg('出错了，请稍后再试！');
        }
        //判断是否已经注册  注册过->首页   没注册->注册
        if (res.data.Daniel != '' && res.data.Daniel != null){
          setTimeout(function () {
            wx.switchTab({
              url: '../index/index',
            });
          }, 200);
        }else{
          setTimeout(function () {
            wx.redirectTo({
              url: '../signin/signin',
            });
          }, 200);
        }
      }else{
        wx.showModal({
          title: '温馨提示',
          content: res.message == '' ?'服务器暂时出错，请稍后再试！':res.message,
          showCancel: false,
          confirmColor: '#b50029'
        });
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
      title: '登陆',
      path: '/pages/login/login'
    }
  }
})