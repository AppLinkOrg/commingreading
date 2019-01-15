// pages/typedetail/typedetail.js
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
    //options.type=7;
    super.onLoad(options);
  }
  onMyShow() {
    var that = this;
    var bookapi = new BookApi();
    var memberinfo = this.Base.getMyData().memberinfo;
    bookapi.booklist({
      booktype: this.Base.options.type
    }, (booklist) => {
      this.Base.setMyData({
        booklist
      });
    });

    bookapi.booktypelist({  }, (booktypelist) => {
      this.Base.setMyData({
        booktypelist
      });
    });

  }

}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
Page(body)