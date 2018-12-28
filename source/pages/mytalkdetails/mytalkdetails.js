// pages/mytalkdetails/mytalkdetails.js
import { AppBase } from "../../appbase";
import { ApiConfig } from "../../apis/apiconfig";
import { InstApi } from "../../apis/inst.api.js";
import { ApiUtil } from "../../apis/apiutil.js";
import { BookApi } from "../../apis/book.api.js";

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);
    this.Base.setMyData({ date: ApiUtil.updatetime(new Date()),type:this.options.type});
  }
  onMyShow() {
    var that = this;
    var bookapi = new BookApi();
    bookapi.bookinfo({id:this.Base.options.id}, (bookinfo) => {
      this.Base.setMyData({ bookinfo });
    });
  }
  setPageTitle(instinfo) {
    wx.setNavigationBarTitle({
      title: "朗读详情",
    })
  }


}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
Page(body)