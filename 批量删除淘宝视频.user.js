

function callFetch(data){
    fetch("https://ugc.taobao.com/content/ajax/delete.do", {
    "headers": {
        "accept": "*/*",
        "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-US;q=0.7,ja;q=0.6",
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-requested-with": "XMLHttpRequest"
    },
    "referrer": "https://ugc.taobao.com/video/videoxman.htm?spm=a2113j.8649368.0.0.60ca372ar2y1YZ&switchAccount=2",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": "id=" + data.id + "&_tb_token_=39eb333f817d",
    "method": "POST",
    "mode": "cors",
    "credentials": "include"
    });
}


pageNum = 0
while (pageNum < 2){
    setTimeout(function() {
        fetch("https://ugc.taobao.com/content/ajax/queryList.do?pageSize=20&pageNum=4&keyword=&accountType&mainItem=0&_tb_token_=39eb333f817d", {
            "headers": {
            "accept": "*/*",
            "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-US;q=0.7,ja;q=0.6",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-requested-with": "XMLHttpRequest"
            },
            "referrer": "https://ugc.taobao.com/video/videoxman.htm?spm=a2113j.8649368.0.0.60ca372ar2y1YZ&switchAccount=2",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": null,
            "method": "GET",
            "mode": "cors",
            "credentials": "include"
        }).then(function(response) {
            return response.json();
        }).then(function(myJson) {
            rowsData = myJson["model"]["rows"];
            console.log(rowsData);
            for (var i=0; i<rowsData.length; i++){
                console.log(rowsData[i]);
                callFetch(rowsData[i], i*100);
            }
        });
    }, pageNum * 1000);
    pageNum = pageNum + 1;
}




function callFetch(data){
    fetch("https://tadget.taobao.com/redaction/redaction/json.json?cmd=json_async_delete&_input_charset=utf-8&file_ids=" + data["pictureId"] + "&dir_ids=&delete_type=1&_tb_token_=39eb333f817d", {
    "headers": {
        "accept": "text/javascript, text/html, application/xml, text/xml, */*",
        "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-US;q=0.7,ja;q=0.6",
        "content-type": "application/x-www-form-urlencoded",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site"
    },
    "referrer": "https://sucai.wangpu.taobao.com/",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": null,
    "method": "GET",
    "mode": "cors",
    "credentials": "include"
    });
}


var pageNum = 0;
while (pageNum < 3000){
    setTimeout(function() {
        fetch("https://tadget.taobao.com/redaction/redaction/json.json?cmd=json_batch_query&_input_charset=utf-8&cat_id=0&ignore_cat=0&order_by=0&page=7&client_type=0&deleted=0&status=0&_tb_token_=39eb333f817d", {
            "headers": {
                "accept": "*/*",
                "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-US;q=0.7,ja;q=0.6",
                "sec-fetch-dest": "script",
                "sec-fetch-mode": "no-cors",
                "sec-fetch-site": "same-site"
            },
            "referrer": "https://sucai.wangpu.taobao.com/",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": null,
            "method": "GET",
            "mode": "cors",
            "credentials": "include"
        }).then(function(response) {
            return response.json();
        }).then(function(myJson) {
            fileData = myJson["module"]["file_module"];
            for (var i=0; i<fileData.length; i++){
                callFetch(fileData[i]);
            }
        });
    console.log(pageNum);
    }, pageNum * 400);
    pageNum = pageNum + 1;
}


