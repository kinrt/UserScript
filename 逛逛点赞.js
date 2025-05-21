
var css = {};
css["点赞按钮"] = "img.rax-image.homepage-icon-pic";
css["未点赞图片"] = "//gw.alicdn.com/imgextra/i3/O1CN01Qf9hFV24sm9HC40Ps_!!6000000007447-2-tps-56-50.png_170x10000.jpg"

setInterval(function(){
    itmes = document.querySelectorAll(css["点赞按钮"]);
    for (i = 0; i < itmes.length; i++) {
        try {
            if(itmes[i].outerHTML.indexOf(css["未点赞图片"]) > 0){
                itmes[i].click();
                console.log(i + "点赞")
            }            
        }
        catch (err) { i }
    }
}, 2000);