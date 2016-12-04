//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  testSomething: function(){
    let url = "http://licaishi.sina.com.cn/apic1/plannerDetail?fr=lcs_client&fc_v=2.3.4&wb_actoken=2.00VIbzLD44bScD181340fbc90lQIJ3&token_fr=&channel=sina_android&client_token=18f042415530762aaa72802cdbcb4557556445825d15d&page=1&info_trim=6842&p_uid=1239417764&num=2";
    wx.request({
      url: url,
      data: {},
      method: 'GET',
      header: { "Content-Type": "application/json" },
      success: function (res) {
        console.log("============>");
        console.log(res.data);
      }
    });
  },
  globalData:{
    userInfo:null
  }
})