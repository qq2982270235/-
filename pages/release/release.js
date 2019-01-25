var app = getApp();
var utils = require('../../utils/util.js');
Page({
  data: {
    Guid: '',//用户ID
    TradeName: '',//所属行业
    TradeType: '',//行业类型
    Directions: '',//寻找方向
    UserName: '',//发布人的名称
    PortraitImg: '',//头像
    Position: '',//职位
    otherTradeType: '',//选择其他  输入行业名称
    ageText: '',//年龄
    sexText: '请选择您的性别',//性别
    infoText: '',//内容
    isOther: true
  },
  onLoad: function () {
    var that = this;
    var getMemberInfo = wx.getStorageSync("MemberUserInfo");
    if (getMemberInfo.Guid) {
      that.setData({
        Guid: getMemberInfo.Guid,
        UserName: getMemberInfo.Name,
        PortraitImg: getMemberInfo.Images,
        Position: getMemberInfo.Position
      });
    } else {
      wx.redirectTo({
        url: '../login/login',
      });
    }
  },
  //输入所属行业
  bindJob: function (e) {
    var that = this;
    that.setData({
      TradeName: e.detail.value
    });
  },
  //单选框  选择专业名称
  radioChange(e) {
    var that = this;
    var radioVal = e.detail.value;
    if (radioVal == '其他') {
      that.setData({
        isOther: false,
        TradeType: radioVal
      });
    } else {
      that.setData({
        isOther: true,
        TradeType: radioVal,
        otherTradeType: ''
      });
    }
  },
  //单选框  选择其他  需要输入其他专业名称
  bindOtherJob: function (e) {
    var that = this;
    that.setData({
      otherTradeType: e.detail.value
    });
  },
  //方向选择
  radioChange2:function(e){
    var that = this;
    that.setData({
      Directions: e.detail.value
    });
  },
  //年龄选择
  bindAge: function (e) {
    var that = this;
    that.setData({
      ageText: e.detail.value
    });
  },
  //性别选择
  sexSelect: function () {
    var that = this;
    wx.showActionSheet({
      itemList: ['未知', '男', '女'],
      success: function (res) {
        if (!res.cancel) {
          var index = res.tapIndex;
          if (index == 0) {
            that.setData({
              sexText: '未知'
            });
          } else if (index == 1) {
            that.setData({
              sexText: '男'
            });
          } else if (index == 2) {
            that.setData({
              sexText: '女'
            });
          }
        }
      }
    });
  },
  //输入详细信息
  infoInsert: function (e) {
    var that = this;
    that.setData({
      infoText: e.detail.value
    });
  },
  //点击发布按钮
  releaseSubmitBtn: function () {
    var that = this;
    if (!that.data.TradeName) {
      utils.alertMsg('请输入您的所属行业！');
      return false;
    }
    if (that.data.TradeType == '') {
      utils.alertMsg('请选择您的行业类型！');
      return false;
    } else if (that.data.TradeType == '其他') {
      if (that.data.otherTradeType == '') {
        utils.alertMsg('请输入其他专业名称');
        return false;
      }
    }
    if (that.data.Directions=='') {
      utils.alertMsg('请选择寻找方向！');
      return false;
    }
    if (!that.data.ageText) {
      utils.alertMsg('请输入您的年龄');
      return false;
    }
    if (!that.data.sexText || that.data.sexText == '请选择您的性别') {
      utils.alertMsg('请选择您的性别！');
      return false;
    }
    if (!that.data.infoText) {
      utils.alertMsg('请输入详细信息！');
      return false;
    }
    wx.showModal({
      title: '温馨提示',
      content: '确定要发布吗？',
      confirmColor: '#b50029',
      success: function (res) {
        if (res.confirm) {
          that.releaseSubmit('提交中...');
        }
      }
    });
  },
  //发布
  releaseSubmit: function (message) {
    var that = this;
    var url = app.globalData.apiUrl + '/PartnerApi/PutInformation';
    var data = {
      'TradeName': that.data.TradeName,//所属行业
      'TradeType': that.data.TradeType == '其他' ? that.data.otherTradeType : that.data.TradeType,//行业类型
      'Directions': that.data.Directions,//寻找方向
      'UserName': that.data.UserName,//发布人的名称
      'PortraitImg': that.data.PortraitImg,//头像
      'UserId': that.data.Guid,
      'Position': that.data.Position,//职位
      'Age': that.data.ageText,//年龄
      'Sex': that.data.sexText,//性别
      'Content': that.data.infoText//内容
    };
    utils.requestLoading(message, url, data, 1, 'POST', function (res) {
      if (res.isSuccess) {
        wx.showToast({
          title: '发布成功',
          icon: 'none'
        });
        setTimeout(function () {
          wx.switchTab({
            url: '../index/index',
          });
        }, 500);
      } else {
        utils.alertMsg(res.message == '' ? '发布失败，请稍后再发布吧！' : res.message);
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
      title: '发布信息',
      path: '/pages/release/release'
    }
  }
})