// ==UserScript==
// @name         网页数据定时发送到钉钉提醒
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  将部分网页数据，统计为需要的样式，通过钉钉机器人，发送提醒信息。
// @author       kinrt
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

//https://developers.dingtalk.com/document/app/custom-robot-access

var setting = {};
var scriptName = '网页数据定时发送到钉钉提醒';
setting['巨量推广'] = {
    'url' : 'https://ad.oceanengine.com/pages/promotion.html',   // 统计数据的网页地址
    'Webhook' : 'https://oapi.dingtalk.com/robot/send?access_token=e575b3f34678595c54acb30fdde7eea00e2e3aafa41bf05616f15c5d0eed322c',   // 钉钉机器人发送消息链接
    'interval' : 5 * 60 * 1000,   // 循环监控时间 毫秒
    'msgModel': {
        'msgtype': 'markdown', 
        'markdown': {
            'title':'巨量推广数据监控',
            'text': '### {账户} 账户巨量推广数据\n - 今日消耗：{今日消耗}\n - 账户日预算：{账户日预算}\n - 账户余额：{账户余额}\n - 日消耗进度：{日消耗进度}\n ### {日期} \n - 消耗：{消耗}\n - 直播间订单金额：{直播间订单金额}\n - 展示数：{展示数}\n - 点击数：{点击数}\n - 直播间观看数：{直播间观看数}\n ### {时段} \n - 消耗：{时段消耗}\n - 直播间订单金额：{时段直播间订单金额}\n - 展示数：{时段展示数}\n - 点击数：{时段点击数}\n - 直播间观看数：{时段直播间观看数}'
        }
    },
    'whetherSend' : 'document.querySelectorAll("div.cell-status-label.active").length > 0', // 是否发送消息，一个js语句，用eval运行
    'data' : [
        {
            'name' : '账户' ,
            'cssSelector' : 'div[class$="header-user-account-name"]',
        },{
            'name' : '投放中' ,
            "eval" : 'document.querySelectorAll(".cell-status-label.active").length',
        },{
            'name' : '今日消耗' ,
            'cssSelector' : 'div.ad-d-flex-start > div:nth-child(1) > span.promotion-header-money',
            'type' : 'num',
        },{
            'name' : '账户日预算' ,
            'cssSelector' : 'div.ad-d-flex-start > div:nth-child(2) > span.promotion-header-money',
            'type' : 'num',
        },{
            'name' : '账户余额' ,
            'cssSelector' : 'div.ad-d-flex-start > div:nth-child(4) > span.promotion-header-money',
            'type' : 'num',
        },{
            'name' : '日消耗进度' ,
            'cssSelector' : 'div.ad-d-flex-start > div:nth-child(5) > div.promotion-header-money',
        },{
            'name' : '日期' ,
            'cssSelector' : 'input.bui-input.bui-input-with-suffix',
            'getValue' : 'value',
        },{
            'name' : '消耗' ,
            'cssSelector' : 'table tr:nth-child(2) > th:nth-child(14)',
            'getValue' : 'innerText',
            'type' : 'num',
        },{
            'name' : '直播间订单金额' ,
            'cssSelector' : 'table tr:nth-child(2) > th:nth-child(15)',
            'getValue' : 'innerText',
            'type' : 'num',
        },{
            'name' : '展示数' ,
            'cssSelector' : 'table tr:nth-child(2) > th:nth-child(16)',
            'getValue' : 'innerText',
            'type' : 'num',
        },{
            'name' : '点击数' ,
            'cssSelector' : 'table tr:nth-child(2) > th:nth-child(18)',
            'getValue' : 'innerText',
            'type' : 'num',
        },{
            'name' : '直播间观看数' ,
            'cssSelector' : 'table tr:nth-child(2) > th:nth-child(21)',
            'getValue' : 'innerText',
            'type' : 'num',
        },{
            'name' : '时间' ,
            "eval" : 'new Date().Format("hh:mm:ss")',
        },{
            'name' : '时段' ,
            "eval" : 'globalData[globalData.length - 1]["时间"] + " 至 " + currentData["时间"]',
        },{
            'name' : '时段消耗' ,
            "eval" : 'currentData["消耗"] - globalData[globalData.length - 1]["消耗"]',
        },{
            'name' : '时段直播间订单金额' ,
            "eval" : 'currentData["直播间订单金额"] - globalData[globalData.length - 1]["直播间订单金额"]',
        },{
            'name' : '时段展示数' ,
            "eval" : 'currentData["展示数"] - globalData[globalData.length - 1]["展示数"]',
        },{
            'name' : '时段点击数' ,
            "eval" : 'currentData["点击数"] - globalData[globalData.length - 1]["点击数"]',
        },{
            'name' : '时段直播间观看数' ,
            "eval" : 'currentData["直播间观看数"] - globalData[globalData.length - 1]["直播间观看数"]',
        },
    ]
}

setting['巨量百应'] = {
    'url' : 'https://buyin.jinritemai.com/dashboard/live/control',   // 统计数据的网页地址
    'Webhook' : 'https://oapi.dingtalk.com/robot/send?access_token=e575b3f34678595c54acb30fdde7eea00e2e3aafa41bf05616f15c5d0eed322c',   // 钉钉机器人发送消息链接
    'interval' : 5 * 60 * 1000,   // 循环监控时间 毫秒
    'msgModel': {
        'msgtype': 'markdown', 
        'markdown': {
            'title':'巨量百应数据监控',
            'text': '### {账户} 账户巨量百应数据\n - 实时在线人数：{实时在线人数}\n - 累计观看人数：{累计观看人数}\n - 新增粉丝数：{新增粉丝数}\n - 成交金额：{成交金额}\n - 成交订单数：{成交订单数}\n - 成交人数占比：{成交人数占比}\n  ### {时段} \n - 观看人数：{时段观看人数}\n - 新增粉丝数：{时段新增粉丝数}\n - 成交金额：{时段成交金额}\n - 成交订单数：{时段成交订单数}'
        }
    },
    'whetherSend' : 'currentData["实时在线人数"] > 0', // 发送消息条件
    'data' : [
        {
            'name' : '账户' ,
            'cssSelector' : 'span.btn-item-role-exchange-name__title',
        },{
            'name' : '实时在线人数' ,
            "cssSelector" : 'div._2KvJ-eq-5G29FBROFDuwel:nth-child(1) > p:nth-child(2)',
            'type' : 'num',
        },{
            'name' : '累计观看人数' ,
            "cssSelector" : 'div._2KvJ-eq-5G29FBROFDuwel:nth-child(2) > p:nth-child(2)',
            'type' : 'num',
        },{
            'name' : '新增粉丝数' ,
            "cssSelector" : 'div._2KvJ-eq-5G29FBROFDuwel:nth-child(3) > p:nth-child(2)',
            'type' : 'num',
        },{
            'name' : '成交金额' ,
            "cssSelector" : 'div._2KvJ-eq-5G29FBROFDuwel:nth-child(4) > p:nth-child(2)',
            'type' : 'num',
        },{
            'name' : '成交订单数' ,
            "cssSelector" : 'div._2KvJ-eq-5G29FBROFDuwel:nth-child(5) > p:nth-child(2)',
            'type' : 'num',
        },{
            'name' : '成交人数占比' ,
            "cssSelector" : 'div._2KvJ-eq-5G29FBROFDuwel:nth-child(6) > p:nth-child(2)',
        },{
            'name' : '时间' ,
            "eval" : 'new Date().Format("hh:mm:ss")',
        },{
            'name' : '时段' ,
            "eval" : 'globalData[globalData.length - 1]["时间"] + " 至 " + currentData["时间"]',
        },{
            'name' : '时段观看人数' ,
            "eval" : 'currentData["累计观看人数"] - globalData[globalData.length - 1]["累计观看人数"]',
        },{
            'name' : '时段新增粉丝数' ,
            "eval" : 'currentData["新增粉丝数"] - globalData[globalData.length - 1]["新增粉丝数"]',
        },{
            'name' : '时段成交金额' ,
            "eval" : 'currentData["成交金额"] - globalData[globalData.length - 1]["成交金额"]',
        },{
            'name' : '时段成交订单数' ,
            "eval" : 'currentData["成交订单数"] - globalData[globalData.length - 1]["成交订单数"]',
        },
    ]
}

for(var name in setting){
    if(window.location.href.indexOf(setting[name].url) != -1 ) { //判断是否取到
        var settingData = setting[name];
        settingData['name'] = name;
        var globalData = GM_getValue(setting.name) || []; // 读取已存储数据[];
        var currentData = {};  // 存储此次获取的数据
        setTimeout(function (){
            statistics(settingData);
            var data = JSON.stringify(settingData.msgModel).format(currentData);
            postData(data, eval(settingData.whetherSend));
        }, 6000);
    }
}

window.onbeforeunload = function(){
    if(settingData){
        GM_setValue(settingData.name, {});
        console.log("关闭页面，清空数据。");
    }
};

function statistics(settingData){
    //
    // 统计数据
    //
    for (var i=0; i<settingData.data.length; i++) {
        try {
            var data = getData(document, settingData, i);
        } catch (error) {
            data = 'False';
            console.log(scriptName + ' 错误：' + error);
        }
        // 记录数据
        currentData[settingData.data[i].name] = data;
    }
    globalData.push(currentData);
    GM_setValue(setting.name, globalData);
    console.log(currentData);
}

function postData(data, whetherSend=true) {
    //
    // 发送数据到钉钉
    //
    if(whetherSend){
        GM_xmlhttpRequest({
            method: 'POST',
            url: settingData.Webhook,
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            data: data,
            onload: function (response) {
                console.log(response.responseText);
            },
            onerror: function (response) {
                console.log('发送消息失败');
            }
        });
    }else{
        console.log('不满足发送消息条件');
    }
}

setInterval(function () {
    location.reload(); // 延时刷新页面
}, settingData.interval);



function getData(parentElement,settingData,i,index){
    //
    // 根据配置的列数据cssSelectors，cssSelector，eval获取值
    // 根据配置的列数据type，格式化获取的值为数字，时间，文本等格式
    //
    index = index || 0 ;
    if(settingData.data[i].cssSelectors){
        var elements = parentElement.querySelectorAll(settingData.data[i].cssSelectors);
        var dataArr = [];
        var data;
        for(var ei=0;ei<elements.length;ei++){
            data = getValue(elements[ei],settingData.data[i].getValue);
            dataArr.push(data);
        }
        data = dataArr.join(' && ');
    }else if(settingData.data[i].cssSelector){
        console.log(settingData.data[i].cssSelector);
        var element = parentElement.querySelector(settingData.data[i].cssSelector);
        data = getValue(element,settingData.data[i].getValue);
    }
    if(settingData.data[i].eval) data = eval(settingData.data[i].eval);  // 运行代码计算数据
    if(settingData.data[i].type == 'num'){
        if(data.length > 10){
            data = '\t' + data;
        }else{
            data = numFormat(data);
        }
    }
    else if(settingData.data[i].type == 'time'){
        data = timeFormat(data);
    }
    else{
        if(typeof(data)=='string') data = data.trim();
    }
    return(data);
}

function getValue(element,getValueStr){
    //
    // 根据配置的列数据getValue值，获取对应的值，可以获取innerHTML，innerText，value，class，id，等属性值
    //
    var data = 'false';
    if(element){
        if(getValueStr){
            if(getValueStr == 'innerHTML'){
                data = element.innerHTML;
            }else if(getValueStr == 'innerText'){
                data = element.innerText;
            }
            else if(getValueStr == 'value'){
                data = element.value;
            }
            else{
                data = element.getAttribute(getValueStr);
            }
        }else{
            data = element.innerText;
        }
    }
    return(data);
}

function timeFormat(data){
    //
    // 日期时间格式化，根据需要调整。
    //
    var replaceData = {
        '年':'/',
        '月':'/',
        '日':'',
        '时':':',
        '分':':',
        '秒':':',
        '-':'/',
    }
    data = String(data)
    for(var key in replaceData){
        data = data.replace(new RegExp(key,'g'), replaceData[key]);
    }
    return(data);
}

function numFormat(data){
    //
    // 数字格式化，根据需要调整。
    //
    var replaceData = {
        '￥':'',
        '¥':'',
        '元':'',
        ',':'',
    }
    data = String(data)
    for(var key in replaceData){
        data = data.replace(new RegExp(key,'g'), replaceData[key]);
    }
    if(data.indexOf('万') != -1 || data.indexOf('W') != -1 || data.indexOf('w') != -1) data = parseFloat(data) * 10000;
    else if(data.indexOf('千') != -1 || data.indexOf('K') != -1 || data.indexOf('k') != -1)  data = parseFloat(data) * 1000;
    else if(data.indexOf('百分之') != -1 || data.indexOf('%') != -1)  data = parseFloat(data) / 100;
    else data = parseFloat(data);
    return(data);
}

String.prototype.format = function(args) {
    var result = this;
    if (arguments.length < 1) {
        return result;
    }
    var data = arguments;       //如果模板参数是数组
    if (arguments.length == 1 && typeof (args) == "object") {
        //如果模板参数是对象
        data = args;
    }
    for (var key in data) {
        var value = data[key];
        if (undefined != value) {
            result = result.replace("{" + key + "}", value);
        }
    }
    return result;
}

Date.prototype.Format = function (fmt) { 
    // author: meizz
    // 日期格式化输出
    //
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
