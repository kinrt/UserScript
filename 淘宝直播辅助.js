// ==UserScript==
// @name         淘宝直播辅助
// @namespace    http://tampermonkey.net/
// @version      20220718
// @description  淘宝直播辅助,自动弹商品，发现新评价提醒
// @author       kinrt
// @match        https://liveplatform.taobao.com/restful/index/live/control*
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==



function Audio() {
    // 创建新的音频上下文接口
    var audioCtx = new AudioContext();
    var arrFrequency = [196.00, 220.00, 246.94, 261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25, 587.33, 659.25, 698.46, 783.99, 880.00, 987.77, 1046.50];
    for (let index = 0; index < arrFrequency.length; index++) {
        setTimeout(function() {
            var frequency = arrFrequency[index];
            // 创建一个OscillatorNode, 它表示一个周期性波形（振荡），基本上来说创造了一个音调
            var oscillator = audioCtx.createOscillator();
            // 创建一个GainNode,它可以控制音频的总音量
            var gainNode = audioCtx.createGain();
            // 把音量，音调和终节点进行关联
            oscillator.connect(gainNode);
            // audioCtx.destination返回AudioDestinationNode对象，表示当前audio context中所有节点的最终节点，一般表示音频渲染设备
            gainNode.connect(audioCtx.destination);
            // 指定音调的类型，其他还有square|triangle|sawtooth
            oscillator.type = 'sine';
            // 设置当前播放声音的频率，也就是最终播放声音的调调
            oscillator.frequency.value = frequency;
            // 当前时间设置音量为0
            gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
            // 0.01秒后音量为1
            gainNode.gain.linearRampToValueAtTime(1, audioCtx.currentTime + 0.01);
            // 音调从当前时间开始播放
            oscillator.start(audioCtx.currentTime);
            // 1秒内声音慢慢降低，是个不错的停止声音的方法
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1);
            // 1秒后完全停止声音
            oscillator.stop(audioCtx.currentTime + 1);
        },100 * index);
    }
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


let pindex = [1,2,3];  // 弹出商品顺序
var interval = 20000;  // 间隔时间

let css = {};
css["弹商品按钮"] = "#livePushed div[style='margin-bottom: 20px;']:nth-child({0}) button"
css["最新评价"] = "#comments-container div.alpw-comment-item:last-child";

// 自动弹商品
setInterval(function() {
    pindex.forEach(function(index) {
        setTimeout(function() {
            document.querySelector(css["弹商品按钮"].format(index)).click();
        },interval * index);
    });
}, interval*pindex.length + 100);

// 检查是否有新评价
var oldComment = ""
setInterval(function() {
    try {
        var comment = document.querySelector(css["最新评价"]).innerText;
    } catch (error) {
        var comment = "";
    }
    if(oldComment != comment){
        oldComment = comment;
        Audio();
    }
}, 1000);


