// pages/mytalkdetails/mytalkdetails.js
import {
  AppBase
} from "../../appbase";
import {
  ApiConfig
} from "../../apis/apiconfig";
import {
  InstApi
} from "../../apis/inst.api.js";
import {
  ApiUtil
} from "../../apis/apiutil.js";
import {
  BookApi
} from "../../apis/book.api.js";
import {
  TalkApi
} from "../../apis/talk.api.js";

import getContent from "../../utils/getcontent"

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=2;
    super.onLoad(options);
    this.Base.setMyData({
      date: ApiUtil.updatetime(new Date()),
      type: this.options.type,
      contentList: [],
      type: 1,
      typeNum: 0,
      isEnglish: false,
      scrollable: false,
      islandu: false
    });
  }

  onMyShow() {

    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var that = this;
    var formattime = [];
    var bookapi = new BookApi();
    bookapi.bookinfo({
      id: this.Base.options.id
    }, (bookinfo) => {
      //判断是否为英文诗
      var englishPattern = /^[A-Za-z]+$/;
      if (englishPattern.test(bookinfo.book_content[0])) {
        this.Base.setMyData({
          isEnglish: true
        })
      }
      var datastr = bookinfo.book_content;
      console.log(datastr)
      var list = [];

      for (var i = 0; i < datastr.length; i++) {
        var pinyin = getContent.getPinyinChar(datastr[i]);
        // var content=getContent.getContent(str[j]);
        var symbolPattern = /^[~`!@#$%^&*()\-_=+[\]{}|;:'",.<>/?\\！￥……（）——【】｛｝；：‘’“”，《。》、？]+$/; //去除符号
        if (symbolPattern.test(pinyin)) {
          pinyin = '';
        }
        var content = "a";
        if (datastr[i] != '\n') {
          content = datastr[i];
        }

        var jihe = {
          content: content,
          pinyin: pinyin
        }
        // if(datastr[i]!='\n'){
        list.push(jihe);
        // }
      }
      this.getType(list);
      if (this.Base.getMyData().type == 2) { //添加换行
        var jihe = {
          content: '',
          pinyin: ''
        }
        list.splice(0, 0, jihe)
        var list = this.AddList(list);
      }
      console.log(list)
      this.Base.setMyData({
        bookinfo,
        contentList: list
      });

      var talkapi = new TalkApi();

      talkapi.messagelist({
        company_id: bookinfo.id
      }, (messagelist) => {
        this.Base.setMyData({
          messagelist
        });
        wx.hideLoading();
      });
    });


    bookapi.rdlist({
      book_id: this.Base.options.id,
      orderby: 'r_main.created_date desc'
    }, (rdlist) => {
      this.Base.setMyData({
        rdlist
      });

      for (var i = 0; i < rdlist.length; i++) {
        formattime.push(ApiUtil.updatetime(rdlist[i].created_date));
      }

      this.Base.setMyData({
        formattime
      });
    });

    setTimeout(() => {
      // this.startScroll();
    }, 500);
  }
  // 判断一行显示8个还是小于8个
  getType(list) {
    var contentlist = list;
    var num = 0;
    console.log(contentlist)
    for (var i = 0; i < contentlist.length; i++) {
      var symbolPattern = /^[~`!@#$%^&*()\-_=+[\]{}|;:'",.<>/?\\！￥……（）——【】｛｝；：‘’“”，《。》、？]+$/; //去除符号
      // if(symbolPattern.test(contentlist[i].content)){
      if (contentlist[i].content == '，' || contentlist[i].content == '。' || contentlist[i].content == '？' || contentlist[i].content == '！') {
      console.log(num)
      if (num >= 6) {
        //type==2的时候，一行显示8个
        this.Base.setMyData({
          type: 2
        })
        break;
      }

      this.Base.setMyData({
        typeNum: num + 1
      })
      num = 0;
    } else {
      if (contentlist[i].content != 'a') {
        num = num + 1;
      }

    }
  }
}
//逗号的时候，换行
AddList(list) {

  for (var j = 0; j < list.length; j++) {
    if (list[j].content == 'a') {
      var num = (j + 1) % 9; //要添加几个的空白数据
      if (num == 1) { //如果换行符处于一行的首个，就删除
        list.splice(j, 1);
        if (list[j].content == 'a') {
          list.splice(j, 1);
        }
        var jihe = {
          content: '',
          pinyin: ''
        }
        list.splice(j, 0, jihe)
      } else {
        if (num != 0) {
          for (var i = 1; i <= (10 - num); i++) {
            var jihe = {
              content: '',
              pinyin: ''
            }
            list.splice(j + i, 0, jihe)
          }
        } else {
          var jihe = {
            content: '',
            pinyin: ''
          }
          list.splice(j + 1, 0, jihe)
        }
      }

    }
  }

  return list;
}
startScroll() {

  var type = this.Base.getMyData().type;
  var list = this.Base.getMyData().contentList;
  var isEnglish = this.Base.getMyData().isEnglish;
  var duration = 0;
  console.log(type)
  if (type == 1) {
    duration = (list.length / 6) * 1800; // 滚动持续时间（毫秒）
    if (isEnglish) {
      duration = (list.length / 20) * 1800;
    }
  } else {
    duration = (list.length / 8) * 2000; // 滚动持续时间（毫秒）
  }
  const interval = 44; // 每次滚动的时间间隔（毫秒）
  const distance = 1; // 每次滚动的距离

  const query = wx.createSelectorQuery();
  query.select('#scrollView').boundingClientRect();
  query.select('#content').boundingClientRect();
  query.exec((res) => {
    const scrollViewRect = res[0];
    const contentRect = res[1];

    if (scrollViewRect && contentRect) {
      const maxScrollTop = contentRect.height - scrollViewRect.height;

      let scrollTop = 0;
      const startTime = Date.now();

      const scrollStep = () => {
        const currentTime = Date.now();
        const elapsedTime = currentTime - startTime;
        if (elapsedTime >= duration) {
          // 滚动到底部完成
          this.setData({
            scrollnum: maxScrollTop,
            scrollable: false
          });
        } else {
          const progress = elapsedTime / duration;
          const scrollDistance = Math.round(progress * maxScrollTop);
          scrollTop = Math.min(scrollDistance, maxScrollTop);

          this.setData({
            scrollnum: scrollTop
          });

          setTimeout(scrollStep, interval);
        }
      };

      scrollStep();
    }
  });

}
setPageTitle(instinfo) {
  wx.setNavigationBarTitle({
    title: "朗读详情",
  })
}

toread(e) {
  var id = e.currentTarget.id;
  wx.navigateTo({
    url: '/pages/readaloud/readaloud?id=' + id,
  })
}
toothers(e) {
  var id = e.currentTarget.id;
  wx.navigateTo({
    url: '/pages/others/others?readid=' + id,
  })
}
openlist() {
  var that = this
  that.Base.setMyData({
    islandu: !that.Base.getMyData().islandu
  })
}

}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.toread = content.toread;
body.toothers = content.toothers;
body.getType = content.getType;
body.AddList = content.AddList;
body.startScroll = content.startScroll;
body.openlist = content.openlist;
Page(body)