// pages/aboutus/aboutus.js
import { AppBase } from "../../appbase";
import { ApiConfig } from "../../apis/apiconfig";
import { InstApi } from "../../apis/inst.api.js";
import { AboutusApi } from "../../apis/aboutus.api.js";

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
    var aboutusapi=new AboutusApi();
    aboutusapi.aboutuslist({orderby:'r_main.seq'}, (list) => {
      this.Base.setMyData({ list });
      });
  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
Page(body)