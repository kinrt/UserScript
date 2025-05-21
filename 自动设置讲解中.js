


setInterval(function() {
    console.log("自动发送讲解中……");
    fetch("https://buyin.jinritemai.com/api/livepc/author/setcurrent/", {
        "headers": {
          "accept": "application/json, text/plain, */*",
          "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-US;q=0.7",
          "cache-control": "no-cache",
          "content-type": "application/x-www-form-urlencoded",
          "pragma": "no-cache",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin"
        },
        "referrer": "https://buyin.jinritemai.com/dashboard/live/list",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": "promotion_id=3449099337529987523&cancel=false",
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
      });
    }, 4000);