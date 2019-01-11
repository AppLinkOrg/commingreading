// pages/search/search.js
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

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);
    var json = {
      searchrecomm: "Y"
    };
    
    if (options.new != undefined) {
      json.newphone = "Y";
    }
    // var api = new PhoneApi();
    // api.model(json, (result) => {
    //   this.Base.setMyData({
    //     result
    //   });
    // });
  }
  onMyShow() {
    var that = this;
  }
  bindFocus() {
    wx.navigateBack({
      delta: -1
    });
  }
  search(e) {
    console.log(e.detail.value);

    var json = {
    };
    if (e.detail.value == "") {

      json.searchrecomm = "Y";
    } else {
      json.searchkeyword = e.detail.value;
    }

    if (this.Base.options.new != undefined) {
      json.newphone = "Y";
    }


    var api = new PhoneApi();
    // api.model(json, (result) => {
    //   this.Base.setMyData({
    //     result
    //   });
    // });

  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.bindFocus = content.bindFocus;
body.search = content.search;
Page(body)