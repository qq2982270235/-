var app = getApp();
var utils = require('../../utils/util.js');
Page({
  data: {
    wx_avatarUrl:'',//头像
    nameText:'',//姓名
    idcardText:'',//身份证号码
    phoneText:'',//手机号码
    yzmText:'',//验证码
    backYzm:'',//短信返回的验证码
    codeText:'获取验证码',//获取验证码
    codeTime:61,//倒计时时间
    codeStatus:true,//倒计时状态
    codeInterval:'',//倒计时变量
    codeDisabled: false,//是否禁用
    jobText:'',//职位
    checkText:false//注册协议
  },
  onLoad:function(){
    var that = this;
    var getMemberInfo = wx.getStorageSync("MemberUserInfo");
    if (getMemberInfo.Guid) {
      that.setData({
        wx_avatarUrl: getMemberInfo.Images,
        Guid: getMemberInfo.Guid
      });
    } else {
      wx.redirectTo({
        url: '../login/login',
      });
    }
  },
  //姓名
  bindName:function(e){
    var that = this;
    that.setData({
      nameText:e.detail.value
    });
  },
  //身份证号码
  bindIdcard: function (e) {
    var that = this;
    that.setData({
      idcardText: e.detail.value
    });
  },
  //手机号码
  bindPhone: function (e) {
    var that = this;
    that.setData({
      phoneText: e.detail.value
    });
  },
  //验证码
  bindYzm: function (e) {
    var that = this;
    that.setData({
      yzmText: e.detail.value
    });
  },
  //获取验证码-倒计时
  getCode:function(){
    var that = this;
    if (that.data.phoneText != '' && that.data.phoneText.length==11){
      if (that.data.codeStatus) {
        that.setData({
          codeStatus: false,
          codeDisabled: true
        });
        var sendTime = that.data.codeTime;
        that.data.codeInterval = setInterval(function () {
          sendTime--;
          if (sendTime <= 0) {
            that.setData({
              codeStatus: true,
              codeDisabled: false,
              codeTime: 61,
              codeText: '获取验证码',
            });
            clearInterval(that.data.codeInterval);
          } else {
            that.setData({
              codeText: utils.formatNumber(sendTime) + '秒'
            });
          }
        }, 1000);
        that.sendCodeSubmit('验证码已发送');
      }
    }else{
      utils.alertMsg("请输入正确的手机号码！");
    }
  },
  //获取验证码
  sendCodeSubmit:function(message){
    var that = this;
    var url = app.globalData.apiUrl +'/PartnerApi/SendSms';
    var data = {
      'mobile': that.data.phoneText
    }
    utils.requestLoading(message, url, data, 1, 'POST', function (res) {
      if (res.isSuccess) {
        that.setData({
          backYzm: res.message1
        });
      } else {
        wx.showModal({
          title: '温馨提示',
          content: res.message == '' ? '验证码发送失败，请稍后重新发送！' : res.message,
          showCancel: false,
          confirmColor: '#62b3ff'
        });
        clearInterval(that.data.codeInterval);
      }
    }, function (res) {
      wx.showToast({
        title: '服务器出错...',
        image: '/images/error.png'
      });
    });
  },
  //职位
  bindJob: function (e) {
    var that = this;
    that.setData({
      jobText: e.detail.value
    });
  },
  //注册协议是否选中
  checkboxChange:function(){
    var that = this;
    that.setData({
      checkText: !that.data.checkText
    });
  },
  //点击注册按钮
  signinSubmitBtn:function(){
    var that = this;
    var pattern = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-])|10|20|30|31)\d{2}$)/;
    var reg = /^[1][0,1,2,3,4,5,6,7,8][0-9]{9}$/;
    if (!that.data.nameText) {
      utils.alertMsg("请输入您的姓名！");
      return false;
    }
    if (!that.data.idcardText) {
      utils.alertMsg("请输入您的身份证号码！");
      return false;
    }else if (!pattern.test(that.data.idcardText)){
      utils.alertMsg("请输入正确的身份证号码！");
      return false;
    }
    if (!that.data.phoneText) {
      utils.alertMsg("请输入您的手机号码！");
      return false;
    } else if (!reg.test(that.data.phoneText)){
      utils.alertMsg("请输入正确的手机号码！");
      return false;
    }
    if (!that.data.yzmText) {
      utils.alertMsg("请输入验证码！");
      return false;
    }
    if (!that.data.jobText) {
      utils.alertMsg("请输入职位！");
      return false;
    }
    if(!that.data.checkText){
      utils.alertMsg("请阅读并同意合伙人注册协议！");
      return false;
    }
    if (that.data.backYzm != that.data.yzmText ){
      utils.alertMsg('验证码错误！');
      return false;
    }else{
      that.signinSubmit('提交中...', that.data.nameText, that.data.idcardText, that.data.phoneText, that.data.jobText, that.data.Guid);
    }
 },
  //注册
  signinSubmit: function (message, Name, Daniel, Mobile, Position, Guid){
    var that = this;
    var url = app.globalData.apiUrl +'/PartnerApi/PutUser';
    var data = {
      'Name': Name,//姓名
      'Daniel': Daniel,//身份证号码
      'Mobile': Mobile,//手机号码
      'Position': Position,//职位
      'Guid': Guid,//Guid
    };
    utils.requestLoading(message, url, data, 1, 'POST', function (res) {
      if (res.isSuccess){
        wx.showToast({
          title: '注册成功',
          icon: 'none'
        });
        wx.setStorageSync('MemberUserInfo', res.data);
        setTimeout(function () {
          wx.switchTab({
            url: '../index/index',
          });
        }, 500);
      }else{
        utils.alertMsg(res.message==''?'注册失败，请稍后在注册吧！':res.message);
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
      title: '注册',
      path: '/pages/signin/signin'
    }
  }
})