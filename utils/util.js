function requestLoading(message, url, data, headerChoose, method, success, fail) {
  if (message != '') {
    wx.showToast({
      title: message,
      image: '/images/smile.png'
    });
  }
  var headerType = [
    {'content-type': 'application/json;charset=UTF-8'},
    {'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'}
  ]
  wx.request({
    url: url,
    data: data,
    dataType: 'json',
    header: headerType[headerChoose],
    method: method,
    success: function (res) {
      if (parseInt(res.statusCode) === 200) {
        success(res.data);
      } else {
        fail();
      }
    },
    fail: function (res) {
      fail();
    },
    complete:function(){
      if (message != '') {
        setTimeout(function () {
          wx.hideToast();
        }, 300);
      }
    }  
  })
}
function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}
function alertMsg(msg){
  wx.showModal({
    title: '温馨提示',
    content: msg,
    showCancel: false,
    confirmColor: '#b50029'
  });
}
module.exports = {
  requestLoading: requestLoading,
  formatNumber: formatNumber,
  alertMsg: alertMsg
}