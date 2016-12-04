//index.js
//获取应用实例
var app = getApp()
Page( {
  data: {
    masterList:  [
      { id:0, name: "胡任标", logo:"http://s3.licaishi.sina.com.cn/180/141104/1728452278.jpeg", url1: "http://blog.sina.com.cn/u/1623562535", url2:"http://licaishi.sina.com.cn/planner/1623562535/4" },
      { id:1, name: "裴毅", logo:"http://p4.sinaimg.cn/1012819331/180/77731359173670", url1: "http://blog.sina.com.cn/u/1012819331", url2: ""}, //http://licaishi.sina.com.cn/web/packageInfo^^pkg_id>>160" },  // 老乐
      { id:2, name: "艾堂明", logo:"http://s3.licaishi.sina.com.cn/200/160901/1358132177.jpeg", url1: "http://licaishi.sina.com.cn/planner/1657765690/4", url2:"" },      
      { id:3, name: "杨怀定", logo:"http://p7.sinaimg.cn/1781737750/180/23981412733043", url1: "http://blog.sina.com.cn/yangbaiwanbk", url2:"" },
      { id:4, name: "殷保华", logo:"http://p2.sinaimg.cn/1766428601/180/3102127804613", url1: "http://blog.sina.com.cn/ybaohuablog", url2:"" },
      //{ id:5, name: "股佬吧", logo:"../../image/aiguxuanS.png", url1: "http://gulaoba", url2:"" },
    ],
    loadingHidden: false
  },

  onLoad: function() {
    var that = this;

    that.setData( {
      loadingHidden: true
    });    
  },

  queryMasterReport: function(event){
    var index = event.target.id.split('-')[1];

    wx.navigateTo({
      url: 'report/report?' + 
            'name=' + this.data.masterList[index].name + '&' +
            'logo=' + this.data.masterList[index].logo + '&' +           
            'url1=' + this.data.masterList[index].url1 + '&' +    
            'url2=' + this.data.masterList[index].url2   
    });
  }
})
