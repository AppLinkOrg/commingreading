// pages/content/content.js
import { AppBase } from "../../appbase";
import { ApiConfig } from "../../apis/apiconfig";
import { InstApi } from "../../apis/inst.api.js";
import { BookApi } from "../../apis/book.api.js";
class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);
    this.Base.setMyData({
      ctt:1
    })
  }
  onMyShow() {
    var that = this;
    var instapi = new InstApi();
    instapi.indexbanner({}, (indexbanner) => {
      this.Base.setMyData({ indexbanner });
    }); 
    var bookapi = new BookApi();
    bookapi.booklist({ booktype:1 }, (booklist) => {
      this.Base.setMyData({ booklist });
    });

    bookapi.booklist({ booktype: 2}, (everydaylist) => {
      this.Base.setMyData({ everydaylist });
    });

    bookapi.booklist({ booktype: 3 }, (newlist) => {
      this.Base.setMyData({ newlist });
    });


  }

  bindcompleted(e) {
    this.Base.setMyData({  ctt: 3 })
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
body.bindcompleted = content.bindcompleted;
body.bindwaitcompleted = content.bindwaitcompleted;
body.bindcontact = content.bindcontact;
Page(body)