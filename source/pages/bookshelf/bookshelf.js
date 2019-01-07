// pages/bookshelf/bookshelf.js
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
  }
  onMyShow() {
    var that = this;
    var bookapi = new BookApi();
    var memberinfo = this.Base.getMyData().memberinfo;
    bookapi.readlist({ member_id: memberinfo.id}, (readlist) => {
      this.Base.setMyData({ readlist });

      for (var i = 0; i < readlist.length; i++) {
        bookapi.booklist({ id: 2}, (booklist) => {
          this.Base.setMyData({ booklist });
        });
      }

    });
    
  }
  
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
Page(body)