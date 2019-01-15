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
    var that = this;
    var bookapi = new BookApi();
    var memberapi = new MemberApi();
    bookapi.booklist({ orderby: 'r_main.id desc'}, (monthlist) => {
      this.Base.setMyData({ monthlist });
    });
    bookapi.booklist({ orderby: 'r_main.id'}, (alllist) => {
      this.Base.setMyData({ alllist });
    });
    memberapi.getall({ }, (todaygetall) => {
      this.Base.setMyData({ todaygetall });
    });
    memberapi.getall({ orderby: 'r_main.id desc' }, (weekgetall) => {
      this.Base.setMyData({ weekgetall });
    });
  }
  
  bindwaitcompleted(e) {
    this.Base.setMyData({ ctt: 2 })
  }
  bindcontact(e) {
    this.Base.setMyData({ ctt: 1 })
  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.bindwaitcompleted = content.bindwaitcompleted;
body.bindcontact = content.bindcontact;
Page(body)