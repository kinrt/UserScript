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

Date.prototype.Format = function (fmt) { //author: meizz 
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

trigger(countData);  // 页面数据发生变化触发数据统计

function trigger(func, oldData = false, interval = 500){
    var iIntervalID = setInterval(function() {
        for(var name in setting){
            if(window.location.href.indexOf(setting[name].url) != -1 ) { //判断是否取到
                settingData = setting[name];
                settingData["name"] = name;
                func(settingData);
                clearInterval(iIntervalID);
                break;
            }
        }
    }, interval);
}

function countData(settingData){
    // if(myLog == false) myLog = LogPanel(scriptName);


    
    if( document.querySelectorAll(settingData.itemCss).length > settingData.itemNum) { //判断宝贝是否全部加载
        var items = document.querySelectorAll(settingData.itemCss);
        myLog.print("发现【" + settingData["name"] + "】数据 数量：" + items.length);
        for(var index=0; index<items.length; index++){
            for (var coli=0; coli<settingData.dataCol.length; coli++) {
                try {
                    if(settingData.dataCol[coli].item){
                        var parentElement = items[index];
                    }else{
                        var parentElement = document;
                    }
                    var data = getData(parentElement,settingData, coli);
                } catch (error) {
                    data = "False";
                    console.log(scriptName + " 错误：" + error);
                }
                // 记录数据
                settingData.dataCol[coli].data.push(data);
            }
            if(settingData.itemLog){
                var logStr = "NO." + (index+1);
                for (var log=0; log<settingData.dataCol.length; log++) {
                    if(settingData.dataCol[log].logPrint){
                        logStr += "  " + settingData.dataCol[log].name + ":" + settingData.dataCol[log].data[index]
                    }
                }
                myLog.print(logStr);
            }
        }
        // 按照基础设置，输出分析日志
        logPrint(items.length);
    }
}

function downData(dataArr, name="") {
    dataStr = ""
    try{
        for (var coli=0; coli < setting[name]["dataCol"].length; coli++){
            dataStr += setting[name]["dataCol"][coli]["name"] + ",";
        }
        dataStr += "\n";
    }catch (e) {
        console.log("写入标题栏数据到CSV错误！");
        dataStr = "";
    }
    for (var rowi=0; rowi < dataArr.length; rowi++){
        for (var coli=0; coli < dataArr[0].length; coli++){
            tmp = String(dataArr[rowi][coli]).trim();
            tmp = tmp.replace('"','""');
            if(tmp.indexOf(",")>=0 || tmp.indexOf('"')>=0 || tmp.indexOf("\n")>=0){
                tmp = '"' + tmp + '"';
            }
            dataStr += tmp + ",";
        }
        dataStr += "\n";
    }
    // console.log(dataStr);
    csvData = new Blob(["\uFEFF" + dataStr], { type: 'text/csv' }); 
    var csvUrl = URL.createObjectURL(csvData);
    var a = document.createElement('a');
    a.download = name + new Date().Format("yyyy-MM-dd hhmmss") + '.csv';
    a.href =  csvUrl;
    document.body.appendChild(a);
    a.click();
}

function toList(data, analysis){
    // console.log(data);
    // console.log(analysis);
    intercept = analysis["intercept"];
    dataCol = analysis["dataCol"];
    path = analysis["path"];
    for (i=0; i < intercept.length; i++){
        // 截取需要的字符串
        startIndex = data.indexOf(intercept[i]["start"]);
        endIndex = data.lastIndexOf(intercept[i]["end"]);
        if(startIndex >= 0 && endIndex >= 0){
            data = data.substring(startIndex,endIndex + intercept[i]["end"].length);
        }
    }
    data = JSON.parse(data);
    for (i=0; i < path.length; i++){
        // 截取需要的json数据
        data = data[path[i]]
    }
    var list = [];
    if(data.length){
        // 数据是数组
        for (i=0; i < data.length; i++){
            list[i] = [];
            for (var coli=0; coli < dataCol.length; coli++){
                try{
                    tmpData = data[i];
                    if (dataCol[coli]["path"] instanceof Array){
                        // dataCol是数组
                        for (var colii=0; colii < dataCol[coli]["path"].length; colii++){
                            tmpData = tmpData[dataCol[coli]["path"][colii]];
                        }
                    }
                    else{
                        tmpData = tmpData[dataCol[coli]["path"]];
                    }
                } catch (e) {
                    tmpData = "";
                }
                list[i][coli] = String(tmpData);
            }
        }
    }
    else{
        // 数据是字典
        for (var coli=0; coli < dataCol.length; coli++){
            tmpData = data;
            try{
                if (dataCol[coli]["path"] instanceof Array){
                    // dataCol是数组
                    for (var colii=0; colii < dataCol[coli]["path"].length; colii++){
                        tmpData = tmpData[dataCol[coli]["path"][colii]];
                    }
                }
                else{
                    tmpData = tmpData[dataCol[coli]["path"]];
                }
            } catch (e) {
                tmpData = "";
            }
                // console.log("tmpData");
                // console.log(tmpData);
            for (i=0; i < tmpData.length; i++){
                if(list[i] == undefined){
                    list[i] = [];
                }
                list[i][ti] = String(tmpData[i]);
            }
        }
    }
    return list;
}

var setting = {
    "生意参谋-内容效果-单条分析" : {
        "url":"https://sycm.taobao.com/xsite/contentanalysis/content_effect",
        "intercept":[],
        "path":["content","data","data"],
        "dataCol":[
            {"path":"contentId","name":"内容ID"},
            {"path":"contentTitle","name":"标题"},
            {"path":"feedPublishTime","name":"发布时间"},
            {"path":"contentUv","name":"内容浏览人数"},
            {"path":"snsMbrCnt","name":"内容互动人数"},
            {"path":"contentGuideShopUv","name":"引导进店人数"},
            {"path":"flwMbrAddCnt","name":"新增粉丝数"},
            {"path":"contentPv","name":"内容浏览次数"},
            {"path":"snsItctCnt","name":"内容互动次数"},
            {"path":"contentGuideShopPv","name":"引导进店次数"},
            {"path":"contentGuidePayOrdAmt","name":"引导支付金额"},
            {"path":"statDate","name":"统计数据截止时间"}
            ],
        "userInput":{
            "token":{
                "prompt":"token值",
                "value":"8c78e149c",
                "help":"字符串格式，在请求地址中找到此数据。"
            },
            "startTime":{
                "prompt":"开始时间",
                "value":"2020-06-12",
                "help":"日期格式：2020-03-13，间隔不能超过90天。"
            },
            "endTime":{
                "prompt":"结束时间",
                "value":"2020-07-11",
                "help":"日期格式：2020-03-13，间隔不能超过90天。"
            },
            "startPage":{
                "prompt":"开始页码",
                "value":1,
                "help":"整数，开始页码，不能小于1。"
            },
            "endPage":{
                "prompt":"结束页码",
                "value":100,
                "help":"整数，不能大于 内容数量÷20，因为每次请求20条数据。"
            },

        },
        "fetch":function(){
            var fetchList = [];
            for (var i=this.userInput.startPage["value"]; i<=this.userInput.endPage["value"]; i++){
                timeStr = new Date().getTime();
                url = "https://sycm.taobao.com/xsite/content/analysis/cnt/effect/entry.json?dateRange={0}%7C{1}&dateType=recent30&pageSize=20&page={2}&order=desc&orderBy=contentPv&contType=all&keyword=&contentRelation=all&indexCode=contentPv%2CsnsItctCnt%2CcontentGuideShopPv%2CcontentGuidePayOrdAmt%2CflwMbrAddCnt&_={3}&token={4}".format(this.userInput.startTime["value"], this.userInput.endTime["value"], i, timeStr, this.userInput.token["value"]);
                // body = encodeURI('_input_charset=UTF-8&qs={0}&settingItemIdAndTimes=[]&cancelItemIds={1}'.format(qs, itemIds[i]))
                body = null;  // GET 请求
                referrer = "https://sycm.taobao.com/xsite/contentanalysis/content_effect?contentTypeId=1000&dateRange=2020-03-13%7C2020-06-10&dateType=range&spm=a21ag.13199200.LeftMenu.d288.35b4410c2gHh0B";
                pr = new Promise((resolve)=>{
                    fetch(url, {
                        "headers": {
                            "accept": "application/json, text/javascript, */*; q=0.01",
                            "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-US;q=0.7",
                            "cache-control": "no-cache",
                            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                            "pragma": "no-cache",
                            "sec-fetch-dest": "empty",
                            "sec-fetch-mode": "cors",
                            "sec-fetch-site": "same-origin",
                            "x-requested-with": "XMLHttpRequest"
                        },
                        "referrer": referrer,
                        "referrerPolicy": "no-referrer-when-downgrade",
                        "body": body,
                        "method": "POST",
                        "mode": "cors",
                        "credentials": "include"
                    }).then(response => response.text())
                        .then(data => resolve(data));
                });
                fetchList.push(pr);
            }
            return fetchList;
        }

    },
    "淘宝-素材中心-我的视频" : {
        "url":"https://ugc.taobao.com/video/videoxman.htm",
        "intercept":[],
        "path":["model","rows"],
        "dataCol":[
            {"path":"videoId","name":"videoId"},
            {"path":"title","name":"标题"},
            {"path":"typeCategoryId","name":"分类ID"},
            {"path":"formatedPublishTime","name":"上传时间"},
            {"path":"editContentLockReason","name":"编辑权限"},
            {"path":"aspectRatio","name":"尺寸比例"},
            {"path":"coverUrl","name":"封面"},
            {"path":["pushInfo","weitao"],"name":"同步微淘"},
            ],
        "userInput":{
            "_tb_token_":{
                "prompt":"token值",
                "value":"f8e4d9f75f583",
                "help":"字符串格式，在请求地址中找到此数据。"
            },
            "startPage":{
                "prompt":"开始页码",
                "value":1,
                "help":"整数，开始页码，不能小于1。"
            },
            "endPage":{
                "prompt":"结束页码",
                "value":106,
                "help":"整数，不能大于 内容数量÷30，因为每次请求30条数据。"
            },

        },
        "fetch":function(){
            var fetchList = [];
            for (var i=this.userInput.startPage["value"]; i<=this.userInput.endPage["value"]; i++){
                timeStr = new Date().getTime();
                url = "https://ugc.taobao.com/content/ajax/queryList.do?pageSize=30&pageNum={0}&keyword=&accountType&mainItem=0&_tb_token_={1}".format( i, this.userInput._tb_token_["value"]);
                // body = encodeURI('_input_charset=UTF-8&qs={0}&settingItemIdAndTimes=[]&cancelItemIds={1}'.format(qs, itemIds[i]))
                body = null;  // GET 请求
                referrer = "https://ugc.taobao.com/video/videoxman.htm?spm=a2113j.8649368.0.0.6111372aRf5VNc&switchAccount=2";
                pr = new Promise((resolve)=>{
                    fetch(url, {
                        "headers": {
                            "accept": "*/*",
                            "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-US;q=0.7",
                            "cache-control": "no-cache",
                            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                            "pragma": "no-cache",
                            "sec-fetch-dest": "empty",
                            "sec-fetch-mode": "cors",
                            "sec-fetch-site": "same-origin",
                            "x-requested-with": "XMLHttpRequest"
                        },
                        "referrer": referrer,
                        "referrerPolicy": "no-referrer-when-downgrade",
                        "body": null,
                        "method": "GET",
                        "mode": "cors",
                        "credentials": "include"
                    }).then(response => response.text())
                        .then(data => resolve(data));
                });
                fetchList.push(pr);
            }
            return fetchList;
        }

    }
}

function main() {
    scriptName = "生意参谋-内容效果-单条分析";
    var fetchList = setting[scriptName].fetch();
    var listData = [];
    Promise.all(fetchList).then(function(fetchDataList){
        for (var i=0; i<fetchDataList.length; i++){
            data = toList(fetchDataList[i], setting[scriptName]);
            listData = listData.concat(data);
        }
        // console.log(listData);
        downData(listData,scriptName);
        console.log("全部完成");
    })
}

main();


// .then(function(text) {
//     list = toList(text,setting["生意参谋-内容效果-单条分析"]);
//     resolve(list);
// }