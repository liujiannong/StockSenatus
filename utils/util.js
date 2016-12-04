function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function completeTime(strTime) {
  var now = new Date();

  if (strTime.search(/[^0-9:-\s]/gmi) != -1) strTime = this.formatTime(now);
  else if (strTime.length <= 5) strTime = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate() + ' ' + strTime; // hh:mm格式补足
  else if (strTime.length <= 11) strTime = now.getFullYear() + '-' + strTime; // mon-day hh:mm格式补足

  return strTime;
}

function beforeHours(strTime){
  var now = new Date();
  var tmpTime = new Date( Date.parse( strTime ));
  return (now -  tmpTime) / 3600 / 1000;
}

function concatList(list1, list2){
  if (list1 == null || list1.length == 0) return list2;
  if (list2 == null || list2.length == 0) return list1;

  for (var i = 0; i < list2.length; i++) list1.push(list2[i]);
  return list1;
}

function parse(url, reportPage) {
  var contentReg = null;
  var content;
  if (url.search("blog.sina") != -1) contentReg = /<div class="BNE_cont" id="sina_keyword_ad_area2">([\s\S]*?)<\/div>/gmi;
  else if (url.search("licaishi.sina") != -1) contentReg = /<div class="p_article">([\s\S]*?)<\/div>/gmi;
  else return "";

  content = contentReg.exec(reportPage);
  if (content == null) return "";

  return regular(content[1]);
}

function regular(str) {
  return str.replace(/<[\s\S]*?>/gmi, "").replace(/&nbsp;/gmi, " ").trim();
}

function sortList(list, key){
  var tmp = {};
  if (list == null || list == "") return list;

  for (var i = 0; i < list.length; i++){
    for (var j = i + 1; j < list.length; j++){
      if (list[i][key] < list[j][key]){
        tmp = list[i];
        list[i] = list[j];
        list[j] = tmp;
      }
    }
  }
  return list;
}

function setID(list, tag){
    if (list == null || list == "") return list;

    for(var i = 0; i < list.length; i++){
      list[i].id = tag +"-" + i;
    }
}

module.exports = {
  formatTime: formatTime,
  completeTime: completeTime,
  beforeHours: beforeHours,
  concatList: concatList,
  sortList: sortList,
  setID: setID,
  parse: parse,
  regular: regular
}
