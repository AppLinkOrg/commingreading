// pages/endreading/endreading.js
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
    this.Base.setMyData({status:"stop"})
  }
  onMyShow() {
    var that = this;
    var bookapi = new BookApi();
    bookapi.bookinfo({ id: this.Base.options.id }, (bookinfo) => {
      this.Base.setMyData({ bookinfo });
    });
  }
  tobookshelf(e){
    wx.reLaunch({
      url: '/pages/bookshelf/bookshelf',
    })
  }
  Play(e) {
    this.Base.setMyData({ status: "stop" })
  }
  Stop(e) {
    this.Base.setMyData({ status: "play" })
  }

}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow; 
body.tobookshelf = content.tobookshelf;
body.Play = content.Play;
body.Stop = content.Stop;
Page(body)