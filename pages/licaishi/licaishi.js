//获取应用实例
var app = getApp()
var util = require('../../utils/util.js');

Page( {
  data: {
    reportList: [],
    loadingHidden: false
  },

  onLoad: function() {
    this.requestLicaishi();
  },

  // 获取新浪理财师数据
  requestLicaishi: function() {
    var that = this;
    var url = 'http://licaishi.sina.com.cn/web/index';// 理财师URL

    wx.request( {
      url: url,
      data: {ind_id: 1, fee: "all"},
      header: { "Content-Type": "application/json" },
      method: 'GET',
      success: function( res ) {
        that.setData( {
          reportList: that.parseLicaishiPage( res.data ) // 分析获取到的网页信息并呈现在界面
        });
      },
      fail: function( res ) {
        console.log( '访问理财师失败' );
      },
      complete: function(res){
        that.setData({loadingHidden: true});
      }
    })
  },

  // 分析获取到的网页信息
  parseLicaishiPage: function( licaishiPage ) {
    var reportList = [];
    var reportsReg = /<div class=\"s_widget w_vp\" data-ptime=[\s\S]*?(<\/div>\s*?){4}<\/div>/gmi; 
    var reports = licaishiPage.match( reportsReg );   // 根据正则式，将理财师第一页的报告拆分成数组
    var oneReport = null;

    for( var i = 0;i < reports.length;i++ ) {
      oneReport = this.parseOneReport( reports[ i ] ); // 逐条分解理财师报告的数据，包括姓名、logo、标题、正文、发布时间
      oneReport.id = "report-" + i;
      reportList.push(oneReport);
    }

    return reportList;
  },

  parseOneReport: function( reportPage ) {
    var reportReg = /<div class="s_widget w_vp" data-ptime="(.*?)">[\s\S]*?img src="(.*?)" alt=""><[\s\S]*?"avatar">(.*?)<\/a><span class="w_vp_sp">(.*?)<\/span>[\s\S]*?href="(.*?)"[\s\S]*?>(.*?)<\/a>[\s\S]*?"w_vp_cs">([\s\S]*?)<\/a>/gmi
    var report = new Object();

    reportReg.test( reportPage );
    report.pTime = util.completeTime(RegExp.$1);
    report.masterLogo = RegExp.$2;
    report.masterName = RegExp.$3;
    report.masterCompany = RegExp.$4;
    report.detailLink = 'http://licaishi.sina.com.cn' + RegExp.$5;  // 没有全部正文，但有个链接
    report.title = util.regular(RegExp.$6);
    report.content = util.regular(RegExp.$7.trim()); // 发表的前半部分在这里
    report.isFullContent = false;

    return report;
  },

  queryReportContent: function (event) {
    var that = this;
    var index = event.currentTarget.id.split('-')[1];
    var url = this.data.reportList[index].detailLink; // 待展开理财师报告的地址
    var content = "";

    if (this.data.reportList[index].isFullContent == true) return;

    that.setData({loadingHidden: false});
    wx.request({
      url: url,
      data: {},
      header: { "Content-Type": "application/json" },
      method: 'GET',
      success: function (res) {
        content = util.parse(url, res.data);
        if (content != "") {
          that.data.reportList[index].isFullContent = true;
          that.data.reportList[index].content = content;
          that.setData({reportList: that.data.reportList});
        }
      },
      fail: function (res) {
        console.log('获取详细报告失败：' + queryURL);
      },
      complete: function(res){
        that.setData({loadingHidden: true});
      }
    });
  }
})
