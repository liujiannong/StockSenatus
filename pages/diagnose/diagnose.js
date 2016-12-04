//获取应用实例
var app = getApp();
var util = require('../../utils/util.js');
Page({
  data: {
    stockID: '000001',
    awards: {},
    HSStockInfo: {},
    suggestions: ["卖出", "减持", "中性", "增持", "买入"],
    jettons: [],
    loadingHidden: false
  },

  setStockID: function (e) {
    this.data.stockID = e.detail.value;
  },

  queryStockAwards: function () {
    var that = this;
    var url = 'http://www.iwencai.com/diag/block-detail';

    that.setData({ loadingHidden: false });
    wx.request({
      url: url,
      data: {
        "pid": 8093,
        "codes": that.data.stockID,
        "codeType": "stock",
        //"info":{"view":{"nolazy":1,"parseArr":{"_v":"new","dateRange":[],"staying":[],"queryCompare":[],"comparesOfIndex":[]},"asyncParams":{"tid":137}}}
        "info": { "view": { "nolazy": 1, "asyncParams": { "tid": 137 } } }
      },
      method: 'GET',
      success: function (res) {
        that.setData({ awards: res.data });
        that.queryStockJetton();
      },
      complete: function (res) { that.setData({ loadingHidden: true }); }
    })
  },

  queryStockJetton: function () {
    var that = this;
 
    var url = 'http://doctor.10jqka.com.cn/' + that.data.stockID;
    //http://www.iwencai.com/diag/block-detail?pid=6401&codes=000002&codeType=stock&info={"view":{"nolazy":1,"parseArr":{"_v":"new","dateRange":["20160930","20160930"],"staying":[],"queryCompare":[],"comparesOfIndex":[]},"asyncParams":{"tid":8167}}}
    wx.request({
      url: url,
      data: {},
      method: 'GET',
      success: function (res) {
        that.setData({ jettons: that.parseJetton(res.data) });
      },
    })
  },

  parseJetton: function (page) {
    let jettonReg = /<div class="box3 jgcc indexStat"[\s\S]*?class="hd2">([\s\S]*?)<\/div>[\s\S]*?<div class="jgcc_text fl">([\s\S]*?)<\/div>/gmi;
    let tmpJettons, jettons = [];

    if ((tmpJettons = jettonReg.exec(page)) != null) {
      jettons.push(util.regular(tmpJettons[1]));
      jettons.push(util.regular(tmpJettons[2]));
    }
    return jettons;
  },

  queryHSStockInfo: function () {
    let that = this;
    let url = "http://q.10jqka.com.cn/api.php?t=indexflash&"; // 结果参考http://q.10jqka.com.cn/

    that.setData({ loadingHidden: false });
    wx.request({
      url: url,
      data: {},
      method: 'GET',
      success: function (res) {
        that.setData({ HSStockInfo: res.data });
      },
      complete: function (res) { that.setData({ loadingHidden: true }); }
    })
  },

  onLoad: function () {
    this.queryHSStockInfo();
  }
})
