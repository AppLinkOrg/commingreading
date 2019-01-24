// pages/mine/mine.js
import { AppBase } from "../../appbase";
import { ApiConfig } from "../../apis/apiconfig";
import { InstApi } from "../../apis/inst.api.js";
import { BookApi } from "../../apis/book.api.js";
import { ApiUtil } from "../../apis/apiutil.js";

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
    

    bookapi.readlist({ member_id:memberinfo.id }, (readlist) => {
      this.Base.setMyData({ readlist });
      
    });

    bookapi.readlist({ member_id: memberinfo.id, tiaojian:"Y" }, (list) => {
      this.Base.setMyData({ list });
      
    });

    bookapi.rdlist({ member_id: memberinfo.id}, (rdlist) => {
      this.Base.setMyData({ rdlist });

    });

  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
Page(body)