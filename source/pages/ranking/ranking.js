// pages/ranking/ranking.js
import { AppBase } from "../../appbase";
import { ApiConfig } from "../../apis/apiconfig";
import { InstApi } from "../../apis/inst.api.js";
import { BookApi } from "../../apis/book.api.js";
import { MemberApi } from '../../apis/member.api';

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);
    this.Base.setMyData({ctt:1})
    
  }
  onMyShow() {
    wx.showLoading({
      title: '加载中',
      mask: true
    })

    var that = this;
    var bookapi = new BookApi();
    var memberapi = new MemberApi();

    memberapi.getall({ tiaojian:'Y'}, (todaygetall) => {
      this.Base.setMyData({ todaygetall });
    });
    
    memberapi.getall({ }, (weekgetall) => {
      this.Base.setMyData({ weekgetall });
      wx.hideLoading(
      )
    });
  }
  
  bindwaitcompleted(e) {
    this.Base.setMyData({ ctt: 2 });
    this.onMyShow();
  }
  bindcontact(e) {
    this.Base.setMyData({ ctt: 1 });
    this.onMyShow();
  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.bindwaitcompleted = content.bindwaitcompleted;
body.bindcontact = content.bindcontact;
Page(body)