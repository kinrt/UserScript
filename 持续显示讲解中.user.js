// ==UserScript==
// @name         持续显示讲解中
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  抖音直播中持续显示讲解中，提高商品观看。
// @author       kinrt
// @match        https://buyin.jinritemai.com/dashboard/live/control
// ==/UserScript==



var interval = 5000;
var itemCss = '#app div._3Qe6w8ey99wSZai4rx9JtC';
var intervalID = false;


setInterval(function () {
    var itemArr = document.querySelectorAll(itemCss);
    for (var i = 0; i < itemArr.length; i++) {
        var spanNum = itemArr[i].querySelectorAll('div.RuZSoindrUj0t_SJB6FXI > span').length;
        if (spanNum == 2) {
            var addNode = document.createElement('span');
            addNode.innerHTML = '<a>持续讲解</a>';
            var divNode = itemArr[i].querySelector('div.RuZSoindrUj0t_SJB6FXI')
            divNode.appendChild(addNode);
            addNode.onclick = function(){myClick(addNode);};
        }
    }
}, 500);


function myClick(el) {
    if (intervalID) clearInterval(intervalID);
    var clickNode = el.parentNode.querySelector('span:nth-child(1)');
    if(el.innerText == '持续讲解'){
        el.innerHTML = '<a>取消持续讲解</a>';
        if(clickNode.innerText == '讲解') {
            console.log('点击：' + clickNode.innerText)
            clickNode.click();
        }
        intervalID = setInterval(function () {
            console.log('延时：' + interval)
            if(clickNode.innerText == '取消讲解') {
                console.log('点击：' + clickNode.innerText)
                clickNode.click();
            }
            console.log('延时：' + 500)
            setTimeout(function () {
                if(clickNode.innerText == '讲解') {
                    console.log('点击：' + clickNode.innerText)
                    clickNode.click();
                }
            }, 500);
        }, interval);
    }else{
        el.innerHTML = '<a>持续讲解</a>';
        if(clickNode.innerText == '取消讲解') {
            console.log('点击：' + clickNode.innerText)
            clickNode.click();
        }
    }
}