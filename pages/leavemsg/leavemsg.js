var app = getApp();
var utils = require('../../utils/util.js');
Page({
  data: {
    Guid: '',//用户ID
    InformId: '',//被留言人guid
    infoText: ''//留言内容
  },
  onLoad: function (options) {
    var that = this;
    var getMemberInfo = wx.getStorageSync("MemberUserInfo");
    if (getMemberInfo.Guid) {
      if (options.InformId != '' && options.InformId != undefined) {
        that.setData({
          Guid: getMemberInfo.Guid,
          InformId: options.InformId
        });
      }
    } else {
      wx.redirectTo({
        url: '../login/login',
      });
    }
  },
  //输入详细信息
  infoInsert: function (e) {
    var that = this;
    that.setData({
      infoText: e.detail.value
    });
  },
  //点击留言按钮
  releaseSubmitBtn: function () {
    var that = this;
    if (!that.data.infoText) {
      utils.alertMsg('请输入留言信息！');
      return;
    }
    wx.showModal({
      title: '温馨提示',
      content: '确定要留言吗？',
      confirmColor: '#b50029',
      success: function (res) {
        if (res.confirm) {
          that.releaseSubmit('提交中...');
        }
      }
    });
  },
  //留言
  releaseSubmit: function (message) {
    var that = this;
    var url = app.globalData.apiUrl + '/PartnerApi/PutMessage';
    var data = {
      'UserId': that.data.Guid,
      'InformId': that.data.InformId,
      'Content': that.data.infoText,
    };
    utils.requestLoading(message, url, data, 1, 'POST', function (res) {
      if (res.isSuccess) {
        wx.showToast({
          title: '留言成功',
          icon: 'none'
        });
        setTimeout(function () {
          wx.switchTab({
            url: '../index/index',
          });
        }, 500);
      } else {
        utils.alertMsg(res.message == '' ? '留言失败，请稍后再留言吧！' : res.message);
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
      title: '留言',
      path: '/pages/leavemsg/leavemsg'
    }
  }
})