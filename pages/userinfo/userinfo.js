var app = getApp();
var utils = require('../../utils/util.js');
Page({
  data: {
    Guid:'',//用户ID
    userid:'',//被浏览的用户ID
    isFollow:'',//是否被关注
    Name: '',//姓名
    Sex: '',//性别
    Position: '',//职业
    Mobile: '',//联系电话
    Images: '',//头像
    BirthDate: '',//出生日期
    Marriage: '',//婚姻状况
    NativePlace: '',//籍贯
    RegisteredResidence: '',//户口所在地
    Education: '',//学历
    GraduationDate: '',//毕业日期
    PoliticalOutlook: '',//政治面貌
    UniversityCollege: '',//毕业院校
    Major: '',//专业
    EnglishLeve: '',//英语水平
    Mandarin: '',//普通话
    Computer: '',//计算机
    Software: '',//软件
    Experience: '',//社会经历信息
    ExperienceIntention: ''//合作意向
  },
  onLoad:function(options){
    var that = this;
    var getMemberInfo = wx.getStorageSync("MemberUserInfo");
    if (getMemberInfo.Guid) {
      if (options.userid != undefined && options.userid != '') {
        that.setData({
          Guid: getMemberInfo.Guid,
          userid: options.userid
        });
        that.getUserInfo('努力加载中...');
        that.browseFollowSubmit('');
      }
    } else {
      wx.redirectTo({
        url: '../login/login',
      });
    }
  },
  //点击沟通 跳转到留言
  jumpChat:function(){
    var that = this;
    wx.navigateTo({
      url: '../leavemsg/leavemsg?InformId=' + that.data.userid,
    });
  },
  //关注
  followFriendBtn:function(){
    var that = this;
    wx.showModal({
      title: '关注好友',
      content: '确认要关注此好友吗？',
      confirmText:'关注',
      confirmColor:'#b50029',
      success:function(res){
        if(res.confirm){
          if (that.data.isFollow=="1"){
            utils.alertMsg('已经关注过该好友了，不能重复关注！');
          }else{
            that.followSubmit('');
          }
        }
      }
    })
  },
  followSubmit:function(message){
    var that = this;
    var url = app.globalData.apiUrl + '/PartnerApi/PutFollow';
    var data = {
      'Userid': that.data.Guid,
      'OtherID': that.data.userid,
      'type':1
    };
    utils.requestLoading(message, url, data, 1, 'POST', function (res) {
      if (res.isSuccess) {
        wx.showToast({
          title: '关注成功',
          icon: 'none'
        });
        setTimeout(function () {
          wx.switchTab({
            url: '../index/index',
          });
        }, 500);
      }else{
        wx.showModal({
          title: '温馨提示',
          content: res.message==''?'关注失败，请稍后再试吧！':res.message,
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
  //添加浏览用户
  browseFollowSubmit: function (message) {
    var that = this;
    var url = app.globalData.apiUrl + '/PartnerApi/PutFollow';
    var data = {
      'Userid': that.data.Guid,
      'OtherID': that.data.userid,
      'type': 0
    };
    utils.requestLoading(message, url, data, 1, 'POST', function (res) {
      if (!res.isSuccess) {
        wx.showToast({
          title: '服务器出错...',
          image: '/images/error.png'
        });
      }
    }, function (res) {
      wx.showToast({
        title: '服务器出错...',
        image: '/images/error.png'
      });
    });
  },
  //获取个人信息
  getUserInfo:function(message){
    var that = this;
    var url = app.globalData.apiUrl + '/PartnerApi/GetUserByGuId';
    var data = {
      'userid': that.data.userid
    };
    utils.requestLoading(message, url, data, 0, 'GET', function (res) {
      if (res.isSuccess) {
        var resData = res.data;
        that.setData({
          Name: resData.Name,//姓名
          Sex: resData.Sex,//性别
          Position: resData.Position,//职业
          Mobile: resData.Mobile,//联系电话
          Images: resData.Images,//头像
          BirthDate: resData.BirthDate,//出生日期
          Marriage: resData.Marriage,//婚姻状况
          NativePlace: resData.NativePlace,//籍贯
          RegisteredResidence: resData.RegisteredResidence,//户口所在地
          Education: resData.Education,//学历
          GraduationDate: resData.GraduationDate,//毕业日期
          PoliticalOutlook: resData.PoliticalOutlook,//政治面貌
          UniversityCollege: resData.UniversityCollege,//毕业院校
          Major: resData.Major,//专业
          EnglishLeve: resData.EnglishLeve,//英语水平
          Mandarin: resData.Mandarin,//普通话
          Computer: resData.Computer,//计算机
          Software: resData.Software,//软件
          Experience: resData.Experience,//社会经历信息
          ExperienceIntention: resData.ExperienceIntention,//合作意向
          isFollow: res.message
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
      title: '好友信息',
      path: '/pages/userinfo/userinfo'
    }
  }
})