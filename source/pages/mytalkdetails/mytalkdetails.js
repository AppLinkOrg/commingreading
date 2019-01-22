// pages/mytalkdetails/mytalkdetails.js
import { AppBase } from "../../appbase";
import { ApiConfig } from "../../apis/apiconfig";
import { InstApi } from "../../apis/inst.api.js";
import { ApiUtil } from "../../apis/apiutil.js";
import { BookApi } from "../../apis/book.api.js"; 
import { TalkApi } from "../../apis/talk.api.js";

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=2;
    super.onLoad(options);
    this.Base.setMyData({ date: ApiUtil.updatetime(new Date()),type:this.options.type});

  }
  onMyShow() {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var that = this;
    var formattime = [];
    var bookapi = new BookApi();
    bookapi.bookinfo({id:this.Base.options.id}, (bookinfo) => {
      this.Base.setMyData({ bookinfo });
      var talkapi = new TalkApi();
      
      talkapi.messagelist({ company_id:bookinfo.id }, (messagelist) => {
        this.Base.setMyData({ messagelist });
        wx.hideLoading();
      });
    }); 
    
    
    bookapi.readlist({ book_id: this.Base.options.id, orderby: 'r_main.created_date desc'}, (readlist) => {
      this.Base.setMyData({ readlist });
      
      for (var i = 0; i < readlist.length; i++) {
        formattime.push(ApiUtil.updatetime(readlist[i].created_date));
      }
      
      this.Base.setMyData({
        formattime
      });
    });
    
  }
  setPageTitle(instinfo) {
    wx.setNavigationBarTitle({
      title: "朗读详情",
    })
  }
  toread(e){
    var id=e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/readaloud/readaloud?id='+id,
    })
  }

}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.toread = content.toread;
Page(body)