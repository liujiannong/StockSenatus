//获取应用实例
var app = getApp();
var util = require('../../../utils/util.js');

Page({
  data: {
    reportList: [],
    master: { name: "", logo: "", urls: [] },
    loadingHidden: false
  },

  onLoad: function (options) {
    this.data.master.logo = options.logo;
    this.data.master.name = options.name;
    this.data.master.urls[0] = options.url1.replace("^^", "&").replace(">>", "=");
    this.data.master.urls[1] = options.url2.replace("^^", "&").replace(">>", "=");

    this.queryReport(this.data.master.urls, 0);
  },

  queryReport: function (urls, index) {
    var that = this;
    if (index >= urls.length || urls[index] == null || urls[index] == "") return;

    wx.request({
      url: urls[index],
      data: {},
      method: 'GET',
      header: { "Content-Type": "application/json" },
      success: function (res) {
        that.data.reportList = util.concatList(that.data.reportList, that.parseReport(urls[index], res.data));
        util.sortList(that.data.reportList, "pTime");
        util.setID(that.data.reportList, "report");
        index++;
        that.queryReport(urls, index);  // 递归直至结束
      },
      fail: function (res) {
        console.log('获取理财师详细报告失败：' + urls[index]);
      },
      complete: function (res) {
        that.setData({ loadingHidden:true })
      }
    });
  },

  parseReport(url, abstractReportPage) {
    if (url.search("blog.sina") != -1) return this.parseSinaBlogReport(abstractReportPage);
    else if (url.search("licaishi.sina") != -1) return this.parseLicaishiReport(abstractReportPage);
    else return "";
  },

  parseSinaBlogReport: function (abstractReportPage) {
    var abstractReportReg = /<div id=.*?class="blog_title">\s*?<.*?>(.*?)<\/a>[\s\S]*?<span class="time SG_txtc">\((.*?)\)<\/span>[\s\S]*?<div class="content newfont_family">([\s\S]*?)<\/div>[\s\S]*?<span class="SG_more"><a href="(.*?)" target="_blank">查看全文<\/a>/gmi;
    var abstractReport;
    var reportList = [];
    var pTime;

    while ((abstractReport = abstractReportReg.exec(abstractReportPage)) != null) {
      var report = new Object();

      pTime = util.completeTime(abstractReport[2]);
      if (reportList.length > 0 && util.beforeHours(pTime) > 24) break;

      report.title = util.regular(abstractReport[1]);
      report.pTime = abstractReport[2];
      report.content = util.regular(abstractReport[3]);
      report.detailLink = abstractReport[4];
      report.masterName = this.data.master.name;
      report.masterCompany = "博客";
      report.masterLogo = this.data.master.logo;
      report.isFullReport = false;

      reportList.push(report);
    }

    return reportList;
  },

  parseLicaishiReport: function (abstractReportPage) {
    var abstractReportReg = /<span class="w_vp_tag"><.*?>(.*?)<\/a>[\s\S]*?<h2 class="w_vp_h2"><a href="(.*?)"[\s\S]*?title="(.*?)"[\s\S]*?>[\s\S]*?<span[\s\S]*?"w_vp_cs">([\s\S]*?)<\/span>[\s\S]*?<span class="w_vp_de">(.*?)<\/span>/gmi;
    var abstractReport;
    var pTime, pType;
    var reportList = [];

    while ((abstractReport = abstractReportReg.exec(abstractReportPage)) != null) {
      var report = new Object();

      pTime = util.completeTime(abstractReport[5]);
      if (reportList.length > 0 && util.beforeHours(pTime) > 24) break;

      pType = abstractReport[1];
      if (pType != "A股") { continue; }

      report.title = util.regular(abstractReport[3]);
      report.pTime = pTime;
      report.content = util.regular(abstractReport[4]);
      report.detailLink = "http://licaishi.sina.com.cn" + abstractReport[2];
      report.masterName = this.data.master.name;
      report.masterCompany = "新浪理财师";
      report.masterLogo = this.data.master.logo;
      report.isFullReport = false;

      reportList.push(report);
    }

    return reportList;
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
