var app = getApp();
var utils = require('../../utils/util.js');
Page({
  data: {
    Guid: '',//用户ID
    Daniel: '',//身份证号码
    Name:'',//用户姓名
    Sex: '',//用户性别
    Position: '',//职位
    Mobile:'',//用户联系方式
    bornText:'',//出生日期
    marriageText:'',//婚姻状况
    nativeplaceText:'',//籍贯
    addressText:'',//户口所在地
    educationText:'',//学历
    graduationText:'',//毕业日期
    politicalText:'',//政治面貌
    schoolText:'',//毕业院校
    majorText:'',//专业
    englishText:'',//英语水平水平
    mandarinText:'',//普通话水平
    computerText:'',//计算机水平
    softwareText:'',//软件
    experienceText:'',//社会经历
    cooperationText:'',//合作意向
  },
  onShow:function(){
    var that = this;
    var getMemberInfo = wx.getStorageSync("MemberUserInfo");
    if (getMemberInfo.Guid) {
      that.setData({
        wx_avatarUrl: getMemberInfo.Images,
        Daniel: getMemberInfo.Daniel,
        Guid: getMemberInfo.Guid,
        Name: getMemberInfo.Name == null ? '' : getMemberInfo.Name,
        Sex: getMemberInfo.Sex == null ? '' : getMemberInfo.Sex,
        Position: getMemberInfo.Position == null ? '' : getMemberInfo.Position,
        Mobile: getMemberInfo.Mobile == null ? '' : getMemberInfo.Mobile,
        bornText: getMemberInfo.BirthDate == null ? '' : getMemberInfo.BirthDate,//出生日期
        marriageText: getMemberInfo.Marriage == null ? '' : getMemberInfo.Marriage,//婚姻状况
        nativeplaceText: getMemberInfo.NativePlace == null ? '' : getMemberInfo.NativePlace,//籍贯
        addressText: getMemberInfo.RegisteredResidence == null ? '' : getMemberInfo.RegisteredResidence,//户口所在地
        educationText: getMemberInfo.Education == null ? '' : getMemberInfo.Education,//学历
        graduationText: getMemberInfo.GraduationDate == null ? '' : getMemberInfo.GraduationDate,//毕业日期
        politicalText: getMemberInfo.PoliticalOutlook == null ? '' : getMemberInfo.PoliticalOutlook,//政治面貌
        schoolText: getMemberInfo.UniversityCollege == null ? '' : getMemberInfo.UniversityCollege,//毕业院校
        majorText: getMemberInfo.Major = null ? '' : getMemberInfo.Major,//专业
        englishText: getMemberInfo.EnglishLeve == null ? '' : getMemberInfo.EnglishLeve,//英语水平
        mandarinText: getMemberInfo.Mandarin == null ? '' : getMemberInfo.Mandarin,//普通话水平
        computerText: getMemberInfo.Computer == null ? '' : getMemberInfo.Computer,//计算机水平
        softwareText: getMemberInfo.Software == null ? '' : getMemberInfo.Software,//软件
        experienceText: getMemberInfo.Experience == null ? '' : getMemberInfo.Experience,//社会经历
        cooperationText: getMemberInfo.ExperienceIntention == null ? '' : getMemberInfo.ExperienceIntention,//合作意向
      });
    } else {
      wx.redirectTo({
        url: '../login/login',
      });
    }
  },
  //点击消息 跳转到留言列表页面
  jumpMessage:function(){
    wx.navigateTo({
      url: '../talk/talk',
    });
  },
  //点击发布 跳转到发布页面
  jumpRelease:function(){
    wx.navigateTo({
      url: '../release/release',
    });
  },
  //出生日期 毕业日期
  bindDataSelect: function (e) {
    var that= this;
    var datetype = e.currentTarget.dataset.datetype;
    if(datetype=='born'){
      that.setData({
        bornText: e.detail.value
      });
    } else if (datetype =='education'){
      that.setData({
        graduationText: e.detail.value
      });
    }
  },
  //婚姻选择
  marriageSelect: function () {
    var that = this;
    wx.showActionSheet({
      itemList: ['未知', '已婚', '未婚'],
      success: function (res) {
        if (!res.cancel) {
          var index = res.tapIndex;
          if (index == 0) {
            that.setData({
              marriageText: '未知'
            });
          } else if (index == 1) {
            that.setData({
              marriageText: '已婚'
            });
          } else if (index == 2) {
            that.setData({
              marriageText: '未婚'
            });
          }
        }
      }
    });
  },
  //籍贯
  bindNativePlace:function(e){
    var that = this;
    that.setData({
      nativeplaceText:e.detail.value
    });
  },
  //户口所在地
  bindAddress:function(e){
    var that = this;
    that.setData({
      addressText:e.detail.value
    });
  },
  //学历
  educationSelect: function () {
    var that = this;
    wx.showActionSheet({
      itemList: ['博士', '硕士', '本科', '大专', '高中', '初中及一下'],
      success: function (res) {
        if (!res.cancel) {
          var index = res.tapIndex;
          if (index == 0) {
            that.setData({
              educationText: '博士'
            });
          } else if (index == 1) {
            that.setData({
              educationText: '硕士'
            });
          } else if (index == 2) {
            that.setData({
              educationText: '本科'
            });
          } else if (index == 3){
            that.setData({
              educationText: '大专'
            });
          } else if (index == 4){
            that.setData({
              educationText: '高中'
            });
          } else if (index == 5){
            that.setData({
              educationText: '初中及一下'
            });
          }
        }
      }
    });
  },
  //政治面貌
  politicalOutlookSelect:function(){
    var that = this;
    wx.showActionSheet({
      itemList: ['群众', '少先队员', '共青团员','中共党员'],
      success: function (res) {
        if (!res.cancel) {
          var index = res.tapIndex;
          if (index == 0) {
            that.setData({
              politicalText: '群众'
            });
          } else if (index == 1) {
            that.setData({
              politicalText: '少先队员'
            });
          } else if (index == 2) {
            that.setData({
              politicalText: '共青团员'
            });
          } else if (index == 3){
            that.setData({
              politicalText: '中共党员'
            });
          }
        }
      }
    });
  },
  //毕业院校
  bindSchool:function(e){
    var that = this;
    that.setData({
      schoolText:e.detail.value
    }); 
  },
  //专业
  bindMajor:function(e){
    var that = this;
    that.setData({
      majorText:e.detail.value
    });
  },
  //英语水平
  englishLevelSelect:function(){
    var that = this;
    wx.showActionSheet({
      itemList: ['公共四级', '公共六级', '专业四级', '专业八级'],
      success: function (res) {
        if (!res.cancel) {
          var index = res.tapIndex;
          if (index == 0) {
            that.setData({
              englishText: '公共四级'
            });
          } else if (index == 1) {
            that.setData({
              englishText: '公共六级'
            });
          } else if (index == 2) {
            that.setData({
              englishText: '专业四级'
            });
          } else if (index == 3) {
            that.setData({
              englishText: '专业八级'
            });
          }
        }
      }
    });
  },
  //普通话
  mandarinSelect:function(){
    var that = this;
    wx.showActionSheet({
      itemList: ['一级甲等', '一级乙等', '二级甲等', '二级乙等', '三级甲等', '三级乙等'],
      success: function (res) {
        if (!res.cancel) {
          var index = res.tapIndex;
          if (index == 0) {
            that.setData({
              mandarinText: '一级甲等'
            });
          } else if (index == 1) {
            that.setData({
              mandarinText: '一级乙等'
            });
          } else if (index == 2) {
            that.setData({
              mandarinText: '二级甲等'
            });
          } else if (index == 3) {
            that.setData({
              mandarinText: '二级乙等'
            });
          } else if (index == 4) {
            that.setData({
              mandarinText: '三级甲等'
            });
          } else if (index == 5) {
            that.setData({
              mandarinText: '三级乙等'
            });
          }
        }
      }
    });
  },
  //计算机
  computerLevelSelect:function(){
    var that = this;
    wx.showActionSheet({
      itemList: ['一级', '二级', '三级', '四级'],
      success: function (res) {
        if (!res.cancel) {
          var index = res.tapIndex;
          if (index == 0) {
            that.setData({
              computerText: '一级'
            });
          } else if (index == 1) {
            that.setData({
              computerText: '二级'
            });
          } else if (index == 2) {
            that.setData({
              computerText: '三级'
            });
          } else if (index == 3) {
            that.setData({
              computerText: '四级'
            });
          }
        }
      }
    });
  },
  //软件
  bindSoftware:function(e){
    var that = this;
    that.setData({
      softwareText:e.detail.value
    });
  },
  //社会经历
  bindExperience:function(e){
    var that = this;
    that.setData({
      experienceText:e.detail.value
    });
  },
  //合作意向
  bindCooperation:function(e){
    var that = this;
    that.setData({
      cooperationText:e.detail.value
    });
  },
  //点击确定按钮
  userInfoSubmitBtn:function(){
    var that = this;
    if (!that.data.bornText){
      utils.alertMsg('请选择您的出生日期！');
      return false;
    }
    if (!that.data.marriageText){
      utils.alertMsg('请选择您的婚姻状况！');
      return false;
    }
    if (!that.data.nativeplaceText) {
      utils.alertMsg('请输入您的籍贯！');
      return false;
    }
    if (!that.data.addressText) {
      utils.alertMsg('请输入您的户口所在地！');
      return false;
    }
    if (!that.data.educationText) {
      that.alertMsg('请选择您的学历！');
      return false;
    }
    if (!that.data.graduationText) {
      utils.alertMsg('请选择您的毕业日期！');
      return false;
    }
    if (!that.data.politicalText) {
      utils.alertMsg('请选择您的政治面貌！');
      return false;
    }
    if (!that.data.schoolText) {
      utils.alertMsg('请输入您的毕业院校！');
      return false;
    }
    if (!that.data.majorText) {
      utils.alertMsg('请输入您的专业！');
      return false;
    }
    if (!that.data.englishText) {
      utils.alertMsg('请选择您的英语水平！');
      return false;
    }
    if (!that.data.mandarinText) {
      utils.alertMsg('请选择您的普通话水平！');
      return false;
    }
    if (!that.data.computerText) {
      utils.alertMsg('请选择您的计算机水平！');
      return false;
    }
    if (!that.data.softwareText) {
      utils.alertMsg('请输入您学习的软件！');
      return false;
    }
    if (!that.data.experienceText) {
      utils.alertMsg('请输入您的社会经历！');
      return false;
    }
    if (!that.data.cooperationText) {
      utils.alertMsg('请输入您的合作意向！');
      return false;
    }
    that.userInfoSubmit('提交中...');
  },
  userInfoSubmit:function(message,){
    var that = this;
    var url = app.globalData.apiUrl + '/PartnerApi/PutUser';
    var data = {
      'Guid': that.data.Guid,//用户ID
      'Daniel': that.data.Daniel,//身份证号码
      'BirthDate': that.data.bornText,//出生日期
      'Marriage': that.data.marriageText,//婚姻状况
      'NativePlace': that.data.nativeplaceText,//籍贯
      'RegisteredResidence': that.data.addressText,//户口所在地
      'Education': that.data.educationText,//学历
      'GraduationDate': that.data.graduationText,//毕业日期
      'PoliticalOutlook': that.data.politicalText,//政治面貌
      'UniversityCollege': that.data.schoolText,//毕业院校
      'Major': that.data.majorText,//专业
      'EnglishLeve': that.data.englishText,//英语水平
      'Mandarin': that.data.mandarinText,//普通话水平
      'Computer': that.data.computerText,//计算机水平
      'Software': that.data.softwareText,//软件
      'Experience': that.data.experienceText,//社会经历
      'ExperienceIntention': that.data.cooperationText//合作意向
    };
    utils.requestLoading(message, url, data, 1, 'POST', function (res) {
      if (res.isSuccess) {
        wx.showToast({
          title: '个人信息提交成功！',
          icon: 'none'
        });
        wx.setStorageSync('MemberUserInfo', res.data);   
        setTimeout(function () {
          wx.switchTab({
            url: '../index/index',
          });
        }, 1000);
      } else {
        utils.alertMsg(res.message==''?'个人信息提交失败，请稍后在提交吧！':res.message);
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
      title: '个人资料',
      path: '/pages/psersonal/psersonal'
    }
  }
})