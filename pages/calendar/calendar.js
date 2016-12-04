//获取应用实例
var app = getApp()
Page({
  data: {
    stockCalendar: {},
    loadingHidden: false
  },

  queryStockCalendar: function () {
    let that = this;
    let now = new Date();
    let year = now.getFullYear().toString();
    let month = (now.getMonth() + 1).toString();
    let queryMonth = year + (month.length < 2 ? '0' + month : month);

    let url = 'http://comment.10jqka.com.cn/tzrl/getTzrlData.php?callback=callback_dt&type=data&date=' + queryMonth;
    // 参考http://stock.10jqka.com.cn/fincalendar.shtml#2016-11-05
    that.setData({ loadingHidden: false });
    wx.request({
      url: url,
      data: {},
      method: 'GET',
      success: function (res) {
        that.setData({ stockCalendar: that.formatStockCalendar(res) });
      },
      complete: function (res) { that.setData({ loadingHidden: true }); }
    })
  },

  formatStockCalendar: function (res) {
    let tmpJSON = JSON.parse(res.data.replace("callback_dt(", "").replace(");", ""));
    let result = [];

    if (tmpJSON.stat != "ok") return result;

    for (let i = 0; i < tmpJSON.data.length; i++) {
      let calendarInfo = { "date": "", "week": "", "events": [] };
      calendarInfo.date = tmpJSON.data[i].date;
      calendarInfo.week = tmpJSON.data[i].week;

      for (let j = 0; j < tmpJSON.data[i].events.length; j++) {
        let eventInfo = { "event": "", "concepts": "", "stocks": "" };

        eventInfo.event = tmpJSON.data[i].events[j][0];
        for (let k = 0; k < tmpJSON.data[i].concept[j].length; k++) { eventInfo.concepts += tmpJSON.data[i].concept[j][k].name + " "; }
        for (let k = 0; k < tmpJSON.data[i].field[j].length; k++) { eventInfo.concepts += tmpJSON.data[i].field[j][k].name + " "; }  // concept和field合一
        for (let k = 0; k < tmpJSON.data[i].stocks[j].length; k++) { eventInfo.stocks += tmpJSON.data[i].stocks[j][k].name + " "; }
        calendarInfo.events.push(eventInfo);
      }
      result.push(calendarInfo);
    }

    return result;
  },

  onLoad: function () {
    this.queryStockCalendar();
  }
})
