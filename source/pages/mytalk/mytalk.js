// pages/mytalk/mytalk.js
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
  BookApi
} from "../../apis/book.api.js";
import {
  TalkApi
} from "../../apis/talk.api.js";

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);
  }
  onMyShow() {
    var that = this;
    var talkapi = new TalkApi();
    var bookapi = new BookApi();
    var memberinfo = this.Base.getMyData().memberinfo;
    talkapi.messagelist({
      member_id: memberinfo.id
    }, (messagelist) => {
      this.Base.setMyData({
        messagelist
      });
      
      


    });






  }
  todetails(e) {
    var id = e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/others/others?readid=' + id,
    })
  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.todetails = content.todetails;
Page(body)