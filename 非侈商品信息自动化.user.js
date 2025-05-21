// ==UserScript==
// @name         非侈商品信息自动化
// @version      20250521
// @author       kinrt
// @description  复制宝贝数据，快速复制各种信息，打开常用页面等。
// @namespace    https://github.com/kinrt/userScript
// @updateURL    https://raw.githubusercontent.com/kinrt/userScript/main/淘宝工作辅助.js
// @downloadURL  https://raw.githubusercontent.com/kinrt/userScript/main/淘宝工作辅助.js

// @include      https://*.taobao.com/*
// @include      https://*.tmall.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_info
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// ==/UserScript==


// 查找父元素
function findParentElementWithClass(element, targetClass) {
    while (element && element !== document) {
        if (element.classList && element.classList.contains(targetClass)) {
            return element;
        }
        element = element.parentElement;
    }
    return null;
}

function getSallCode(){
    // 监听鼠标点击事件
    document.addEventListener('click', function(event) {
        const target = event.target;
        const parentE = target.parentElement;
        // 检查点击的元素是否是商家编码输入框
        if (parentE.className === 'next-input next-focus next-medium fusion-input') {
            // 获取输入框的值
            var sellCode = document.querySelector('#struct-outerId input').value;
            sellCode = sellCode.replace(/[\u4e00-\u9fa5]/g, ''); // 去除汉字部分
            logPrint('商家编码输入框的值:' + target.value);
            
            // 获取输入框的父元素，直到找到 class="sku-table-row" 的元素
            const skuTableRow = findParentElementWithClass(target, 'sku-table-row');
            const color = skuTableRow.querySelector('td:nth-child(1)').textContent.trim();
            logPrint('颜色:' + color);

            const size = skuTableRow.querySelector('td:nth-child(2)').textContent.trim();
            logPrint('尺码:' + size);
            var sellCodeAll = sellCode+color+size;
            GM_setClipboard(sellCodeAll);
            logPrint(sellCodeAll);
        }
    });
}

function sellItemsPage() {
    // 新出售中的宝贝
    var css = {};
    css["出售中宝贝"] = "tr.next-table-row.row-with-config-list"
    css["宝贝ID"] = "div.sell-manage-component-desc span.product-desc-span:nth-child(2)"
    css["编码"] = "div.sell-manage-component-desc span.product-desc-span:nth-child(3)"
    css["图片"] = "div.sell-manage-component-desc img.product-desc-extend-image"
    css["创建时间"] = "td[label=创建时间] div.product-desc-span:nth-child(1)"
    css["图标"] = "div.sell-manage-component-desc div.mc-tag-list-wrap"
    // 添加查看数据链接
    var intervalId = setInterval(function () {
        try {
            if (document.querySelector(css["图标"]).innerHTML.indexOf("SYCM") < 0) {
                var item = document.querySelectorAll(css["出售中宝贝"]);
                var itemDict = {};
                for (i = 0; i < item.length; i++) {
                    var itemID = item[i].querySelector(css["宝贝ID"]).innerText.slice(3, 18);
                    var image = item[i].querySelector(css["图片"]);
                    var code = item[i].querySelector(css["编码"]);
                    var time = item[i].querySelector(css["创建时间"]);
                    var itemIco = item[i].querySelector(css["图标"]);
                    itemDict[itemID] = {};
                    itemDict[itemID]["ID"] = itemID
                    try {
                        itemDict[itemID]["编码"] = code.innerText.slice(3, 18);
                    }
                    catch {
                        itemDict[itemID]["编码"] =  "";
                    }
                    itemDict[itemID]["图片"] = "https:" + image.getAttribute("src").split(".jpg")[0] + ".jpg";
                    itemDict[itemID]["时间"] = time.innerText.replace(/-/g, "/",).replace(/ \S+/, "");
                    var dmp = "&nbsp;&nbsp;<a target='_blank' class='table-hover-show' href='https://dmp.taobao.com/index_new.html?#!/items/overview/item/cold-boot?period=7&itemId=" + itemID + "'>DMP</a>";
                    var sycm = "&nbsp;&nbsp;<a target='_blank' class='table-hover-show' href='https://sycm.taobao.com/cc/item_archives?activeKey=sale&dateType=recent7&itemId=" + itemID + "'>SYCM</a>";
                    var sousuo = "&nbsp;&nbsp;<a target='_blank' class='table-hover-show' href='https://sycm.taobao.com/flow/monitor/itemsourcedetail?belong=all&childPageType=se_keyword&dateType=recent30&device=2&jumpCalcModel=holoTree&pPageId=30&pageId=23.s1150&pageLevel=2&pageName=%E6%89%8B%E6%B7%98%E6%90%9C%E7%B4%A2&itemId=" + itemID + "'>搜索来源</a>";
                    var copyStr = "&nbsp;&nbsp;<a class='copyStr table-hover-show' href='javascript:void(0);' itemID='" + itemID + "'>复制</a>";
                    itemIco.innerHTML = itemIco.innerHTML + sycm + sousuo + dmp + copyStr;
                    itemIco.querySelector("a.copyStr").addEventListener("click", function(event) {
                        const target = event.target;
                        itemID = target.getAttribute("itemID");
                        data = itemDict[itemID]["ID"] + "\t" +itemDict[itemID]["时间"] + "\t" +itemDict[itemID]["编码"] + "\t" +itemDict[itemID]["图片"]
                        GM_setClipboard(data);
                        logPrint("复制成功:" + data);
                    });
                            
                }
            }
        } catch {
            ;
        }
    }, 500);
}

function setCampaign() {
    var css = {};
    css["批量设置"] = "div.next-dialog.next-closeable.next-overlay-inner";
    css["价格来源"] = "div#priceSettingMode input";
    css["折扣比例"] = "input#percentage";
    css["减去金额"] = "input#subtractor";
    css["加上金额"] = "input#addend";
    css["是否取整"] = "div#roundMode input";

    var interval = 300;
    var intervalId = setInterval(function () {
        var page = document.querySelector(css["批量设置"]);
        if (page != null) {
            try {
                page.querySelectorAll(css["价格来源"])[0].click();
                page.querySelectorAll(css["是否取整"])[1].click();
            } catch (error) {
                debug(error, 40);
            }
        }
    }, interval);
}

function refund() {
    var css = {};
    css["退款SKU名称"] = "a[class*=cell_sku-desc]";
    setInterval(function () {
        var items = document.querySelectorAll(css["退款SKU名称"]);
        for (var i = 0; i < items.length; i++) {
            outerHTML = items[i].outerHTML;
            if (outerHTML.slice(0, 2) == "<a") {
                items[i].outerHTML = "<b" + outerHTML.slice(2, outerHTML.length - 5) + "</b>"
            }
        }
    }, 300);
}

function detailItme() {
    // 新详情页
    var itemID = document.getElementById("aliww-click-trigger").getAttribute("data-item");
    function openSYCM() {
        window.open("https://sycm.taobao.com/cc/item_archives?activeKey=sale&dateType=recent7&itemId=" + itemID);
    }
    function openDMP() {
        window.open("https://dmp.taobao.com/index_new.html?#!/items/overview/item/cold-boot?period=7&itemId=" + itemID);
    }
    function openSS() {
        window.open("https://sycm.taobao.com/flow/monitor/itemsourcedetail?belong=all&childPageType=se_keyword&dateType=recent30&device=2&jumpCalcModel=holoTree&pPageId=30&pageId=23.s1150&pageLevel=2&pageName=%E6%89%8B%E6%B7%98%E6%90%9C%E7%B4%A2&itemId=" + itemID);
    }
    function getDataOneSKU() {
        var css = {};
        css["选择的SKU"] = "div[class*=isSelected] span";
        var selected = document.querySelector(css["选择的SKU"]);
        if (selected != null) {
            // copyStr = "选择颜色分类：" + selected + " 这个链接下单：" + window.location.href;
            data = "已经为您选择：" + selected.innerText + "\n点击下面链接进入页面，就可以下单了。" + window.location.href;
            GM_setClipboard(data);
            logPrint("复制成功");
            return data;
        } else {
            logPrint("请选择一个SKU后再使用！", 30)
            return false;
        }
    }

    function getDataAllSKU() {
        var css = {};
        // 商品页面
        css["所有的SKU"] = "div[class*=valueItem] span";
        var data = "";
        var items = document.querySelectorAll(css["所有的SKU"]);
        for (var i = 0; i < items.length; i++) {
            if (items[i].innerText.length > 0) {
                data += items[i].innerText + "\n";
            }
        }
        data = data.substring(0, data.length - 1);
        GM_setClipboard(data);
        logPrint("复制成功");
        return data;
    }

    function copyAttr() {
        // 新详情页
        var data = "";
        data = data + "商品id：" + document.getElementById("aliww-click-trigger").getAttribute("data-item") + "\n";
        var mainPic = document.querySelectorAll("li[class*=thumbnail--] img");
        var mainPic = [].slice.apply(mainPic).slice(-5);
        for (i = 0; i < mainPic.length; i++) {
            data = data + "主图" + (i + 1) + "：" + mainPic[i].getAttribute("src").replace("_q50.jpg_.webp", "") + "\n";
        }
        var Arrts = document.querySelectorAll("div[class*=infoItem--]");
        for (i = 0; i < Arrts.length; i++) {
            var infoItemTitle = Arrts[i].querySelector("div[class*=infoItemTitle--]").innerText;
            var infoItemContent = Arrts[i].querySelector("div[class*=infoItemContent--]").innerText;
            if (infoItemContent != "") {
                data = data + infoItemTitle + ":" + infoItemContent + "\n";
            }
        }
        GM_setClipboard(data);
        logPrint("复制成功");
        return data;
    }
    var tools = ToolsPanel("Tools");
    tools.add("生意参谋", openSYCM, 1)
    tools.add("达摩盘", openDMP, 2)
    tools.add("搜索", openSS, 3)
    tools.add("复制选择的SKU", getDataOneSKU, 4)
    tools.add("复制所有的SKU", getDataAllSKU, 5)
    tools.add("复制其他数据", copyAttr, 6)
}

//添加工具面板
function ToolsPanel(name = "菜单", fun = "") {
    var userScriptToolsPanel = new Object();
    userScriptToolsPanel.name = name;
    userScriptToolsPanel.toolsPanel = document.createElement("div");
    userScriptToolsPanel.style = document.createElement("style");
    userScriptToolsPanel.init = function () {
        this.toolsPanel.innerHTML = '<div class="aside-menu" title="' + name + '">' + name + '</div>';
        this.toolsPanel.id = "userScriptToolsPanel";
        if (document.querySelector("body")) {
            document.body.appendChild(this.toolsPanel);
        } else {
            document.documentElement.appendChild(this.toolsPanel);
        }
        this.style.type = "text/css";
        this.style.innerHTML = `
            #userScriptToolsPanel {
                position: fixed;
                right: 50px;
                z-index: 9999999 !important;
                top: 350px;
                width: 150px;
                height: 150px;
                user-select: none;
                opacity: .75;
                font-family: PingFang SC, Microsoft YaHei, Roboto, Helvetica Neue, Helvetica, Tahoma, Arial !important;
            }

            #userScriptToolsPanel .aside-menu {
                position: absolute;
                width: 70px;
                height: 70px;
                border-radius: 50%;
                background: #17a2b8;
                left: 0;
                top: 0;
                right: 0;
                bottom: 0;
                margin: auto;
                text-align: center;
                line-height: 70px;
                color: #fff;
                font-size: 20px;
                z-index: 1;
                cursor: move;
                overflow: hidden;
            }

            #userScriptToolsPanel .menu-item {
                position: absolute;
                width: 60px;
                height: 60px;
                background-color: #17a2b8;
                left: 0;
                top: 0;
                right: 0;
                bottom: 0;
                margin: auto;
                padding: 10px 5px;
                text-align: center;
                border-radius: 50%;
                text-decoration: none;
                color: #fff;
                transition: all .5s;
                font-size: 14px;
                box-sizing: border-box;
                overflow: hidden;
                cursor:pointer;
            }

            #userScriptToolsPanel .menu-item:hover {
                background: #a9c734;
            }

            #userScriptToolsPanel:hover {
                opacity: 1;
            }

            #userScriptToolsPanel:hover .aside-menu {
                animation: jello 1s;
            }

            #userScriptToolsPanel:hover .menu1 {
                transform: translate3d(0, -135%, 0);
            }

            #userScriptToolsPanel:hover .menu2 {
                transform: translate3d(-120%, -70%, 0);
            }

            #userScriptToolsPanel:hover .menu3 {
                transform: translate3d(-120%, 70%, 0);
            }

            #userScriptToolsPanel:hover .menu4 {
                transform: translate3d(0, 135%, 0);
            }

            #userScriptToolsPanel:hover .menu5 {
                transform: translate3d(120%, 70%, 0);
            }

            #userScriptToolsPanel:hover .menu6 {
                transform: translate3d(120%, -70%, 0);
            }

            @keyframes jello {
                from,
                11.1%,
                to {
                    transform: none
                }
                22.2% {
                    transform: skewX(-12.5deg) skewY(-12.5deg)
                }
                33.3% {
                    transform: skewX(6.25deg) skewY(6.25deg)
                }
                44.4% {
                    transform: skewX(-3.125deg) skewY(-3.125deg)
                }
                55.5% {
                    transform: skewX(1.5625deg) skewY(1.5625deg)
                }
                66.6% {
                    transform: skewX(-.78125deg) skewY(-.78125deg)
                }
                77.7% {
                    transform: skewX(0.390625deg) skewY(0.390625deg)
                }
                88.8% {
                    transform: skewX(-.1953125deg) skewY(-.1953125deg)
                }
            }
                `;
        this.toolsPanel.appendChild(this.style);
        if (fun != "") this.toolsPanel.querySelector(".aside-menu").setAttribute('style', "cursor:pointer")
        var flag = 0; //标记是拖曳还是点击
        var disX, disY, L, T, starX, starY;
        this.toolsPanel.addEventListener('mousedown', function (e) {
            flag = 1;
            e.preventDefault(); //阻止触摸时页面的滚动，缩放
            disX = e.clientX - this.offsetLeft;
            disY = e.clientY - this.offsetTop;
            //手指按下时的坐标
            starX = e.clientX;
            starY = e.clientY;
            //console.log(disX);
        });
        this.toolsPanel.addEventListener('mousemove', function (e) {
            if (flag > 0) {
                L = e.clientX - disX;
                T = e.clientY - disY;
                if (L < 0) { //限制拖拽的X范围，不能拖出屏幕
                    L = 0;
                } else if (L > document.documentElement.clientWidth - this.offsetWidth + 100) {
                    L = document.documentElement.clientWidth - this.offsetWidth + 100;
                }
                if (T < 0) { //限制拖拽的Y范围，不能拖出屏幕
                    T = 0;
                } else if (T > document.documentElement.clientHeight - this.offsetHeight) {
                    T = document.documentElement.clientHeight - this.offsetHeight;
                }
                this.style.left = L + 'px';
                this.style.top = T + 'px';
                flag = 2;
            }
        });
        this.toolsPanel.addEventListener('mouseup', function (e) {
            if (flag == 1) {
                // 仅点击，未移动
                if (fun != "") fun();
            }
            flag = 0;
        });
    }

    userScriptToolsPanel.init();

    userScriptToolsPanel.add = function (name, fun, index = 1) {
        var tool = document.createElement("a");
        tool.className = "menu-item menu" + index
        tool.innerHTML = name;
        tool.title = name;
        tool.addEventListener("click", fun);
        this.toolsPanel.appendChild(tool);
    }
    return userScriptToolsPanel;
}

// 全局日志等级，默认为 10（debug）
let debugLevel = 10;

// 日志等级常量
const LOG_LEVELS = {
    DEBUG: 10,
    INFO: 20,
    WARN: 30,
    ERROR: 40,
    OFF: 100  // 关闭所有日志
};

// debug 函数
function debug(data, level = LOG_LEVELS.INFO) {
    // 如果当前日志等级高于传入的日志等级，则不打印
    if (level < debugLevel) {
        return;
    }

    // 获取当前时间戳（时分秒）
    const now = new Date();
    const timestamp = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    // 根据日志等级设置日志前缀
    let logPrefix;
    switch (level) {
        case LOG_LEVELS.DEBUG:
            logPrefix = "DEBUG";
            break;
        case LOG_LEVELS.INFO:
            logPrefix = "INFO";
            break;
        case LOG_LEVELS.WARN:
            logPrefix = "WARN";
            break;
        case LOG_LEVELS.ERROR:
            logPrefix = "ERROR";
            break;
        default:
            logPrefix = "UNKNOWN";
    }

    // 格式化数据
    let formattedData;
    if (data === undefined) {
        formattedData = "No data provided.";
    } else if (typeof data === "object" && data !== null) {
        try {
            formattedData = JSON.stringify(data, null, 2);
        } catch (e) {
            formattedData = data.toString();
        }
    } else {
        formattedData = String(data);
    }

    // 打印日志
    console.groupCollapsed(`[${timestamp}] UserScript [${logPrefix}]`);
    console.trace(); // 打印调用栈
    console.log("Data:");
    console.log(formattedData);
    console.groupEnd();
}

function logPrint(logStr, level = 10, autoClose = 3) {
    var div = document.getElementById("logPrint")
    if (div == null) {
        div = document.createElement("div");
        div.id = "logPrint";
        div.className = "container";
    } else {
        div.style.left = "50%";
    }
    if (level == 10) {
        div.className = "alert alert-success alert-dismissible";
    } else if (level == 20) {
        div.className = "alert alert-info alert-dismissible";
    } else if (level == 30) {
        div.className = "alert alert-warning alert-dismissible";
    } else if (level == 40) {
        div.className = "alert alert-danger alert-dismissible";
    } else {
        div.className = "alert alert-primary alert-dismissible";
    }
    debug(logStr, level);
    div.innerHTML = '<button onclick="this.parentNode.remove()" type="button" class="close" data-dismiss="alert">&times;</button>' + logStr;
    document.body.append(div);
    div.style.left = (div.offsetLeft - div.offsetWidth / 2) + "px";
    if (autoClose) {
        setTimeout(function () { div.style = "top:100%; opacity:0; transition: all 0.3s;"; }, autoClose * 1000);
        setTimeout(function () { div.remove(); }, autoClose * 1000 + 300);
    }
}

var bootstrapcss = `
.alert {
    position: fixed; 
    top: 85%; 
    left: 50%;
    z-index: 9999999; 
    padding: .75rem 1.25rem;
    padding-right: 4rem;
    border: 1px solid transparent;
    border-radius: .25rem;
    font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";
    font-size: 1.2rem;
}
.alert-success {
    color: #155724;
    background-color: #d4edda;
    border-color: #c3e6cb;
}
.alert-info {
    color: #0c5460;
    background-color: #d1ecf1;
    border-color: #bee5eb;
}
.alert-warning {
    color: #856404;
    background-color: #fff3cd;
    border-color: #ffeeba;
}
.alert-danger {
    color: #721c24;
    background-color: #f8d7da;
    border-color: #f5c6cb;
}
.alert-primary {
    color: #004085;
    background-color: #cce5ff;
    border-color: #b8daff;
}
.alert-dismissible .close {
    position: absolute;
    top: 0;
    right: 0;
    padding: .75rem 1.25rem;
    color: inherit;
}
.btn {
    display: inline-block;
    font-weight: 400;
    color: #212529;
    text-align: center;
    vertical-align: middle;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    cursor: pointer;
    background-color: transparent;
    border: 1px solid transparent;
    padding: .375rem .75rem;
    margin: 0 8px 8px 8px;
    font-size: 1rem;
    line-height: 1.5;
    border-radius: .25rem;
    transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
    font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";
}
.btn-group-sm>.btn, .btn-sm {
    padding: .25rem .5rem;
    font-size: .875rem;
    line-height: 1.5;
    border-radius: .2rem;
}
.btn-group-lg>.btn, .btn-lg {
    padding: .5rem 1rem;
    font-size: 1.25rem;
    line-height: 1.5;
    border-radius: .3rem;
}
button.close {
    padding: 0;
    background-color: transparent;
    border: 0;
    cursor: pointer;
    -webkit-appearance: none;
    float: right;
    font-size: 1.5rem;
    font-weight: 700;
    line-height: 1;
    color: #000;
    text-shadow: 0 1px 0 #fff;
    opacity: .5;
}
.btn-primary {
    color: #fff;
    background-color: #007bff;
    border-color: #007bff;
}
.btn-primary:hover {
    color: #fff;
    background-color: #0069d9;
    border-color: #0062cc;
}
.btn-secondary {
    color: #fff;
    background-color: #6c757d;
    border-color: #6c757d;
}
.btn-secondary:hover {
    color: #fff;
    background-color: #5a6268;
    border-color: #545b62;
}
.btn-success {
    color: #fff;
    background-color: #28a745;
    border-color: #28a745;
}
.btn-success:hover {
    color: #fff;
    background-color: #218838;
    border-color: #1e7e34;
}
.btn-info {
    color: #fff;
    background-color: #17a2b8;
    border-color: #17a2b8;
}
.btn-info:hover {
    color: #fff;
    background-color: #138496;
    border-color: #117a8b;
}
.btn-warning {
    color: #212529;
    background-color: #ffc107;
    border-color: #ffc107;
}
.btn-warning:hover {
    color: #212529;
    background-color: #e0a800;
    border-color: #d39e00;
}
.btn-danger {
    color: #fff;
    background-color: #dc3545;
    border-color: #dc3545;
}
.btn-danger:hover {
    color: #fff;
    background-color: #c82333;
    border-color: #bd2130;
}
.btn-dark {
    color: #fff;
    background-color: #343a40;
    border-color: #343a40;
}
.btn-dark:hover {
    color: #fff;
    background-color: #23272b;
    border-color: #1d2124;
}
`;
GM_addStyle(bootstrapcss);


var oldURL = "原来的URL";
setInterval(function () {
    var URL = window.location.href.split("?")[0];
    if (URL == oldURL) return;
    try {
        // 网址变化后，清除工具面板。
        document.getElementById("userScriptToolsPanel").remove();
    } catch (error) {
        ;
    }
    oldURL = URL;
    if (URL.indexOf("item.upload.taobao.com/sell/v2/publish.htm") != -1) {
        // 自动获取商家编码
        getSallCode();
    }
    if (URL.indexOf("https://detail.tmall.com/") != -1 || URL.indexOf("https://item.taobao.com/item.htm") != -1) {
        // 新详情页
        setTimeout(function () {
            detailItme();
        }, 1000);
    }
    if (URL.indexOf("sale/seller/campaign/item.htm") != -1) {
        // 活动报名页面
        setCampaign();
    }
    if (URL.indexOf("taobao.com/home.htm/SellManage/") != -1) {
        // 出售中
        setTimeout(sellItemsPage, 2000);
    }
    if (URL.indexOf(".taobao.com/home.htm/trade-platform/tp/sold") != -1) {
        // 新复制售出的SKU
        ToolsPanel("复制售出的SKU", getDataTrade);
    }
}, 500);