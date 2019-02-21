// pages/searchbook/searchbook.js
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
    //options.new=1;
    super.onLoad(options);
    var json = {
      searchrecomm: ""
    };

    if (options.new != undefined) {
      json.newphone = "N";
    }
    var bookapi = new BookApi();
    this.Base.setMyData({ keyword: this.options.keyword});
    console.log("MMMMMMMMMMMMMMMMMMMMMMM" + this.Base.getMyData().keyword)
  }
  onMyShow() {
    wx.showLoading({
      title: '加载中...',
    })
    var that = this;

    var json = {};
    json.searchkeyword = this.Base.getMyData().keyword;
    console.log("SSSSSSSSSSSSSSSSSSSSSSSSSSS" + json.searchkeyword)

    var bookapi = new BookApi();
    bookapi.booklist(json, (result) => {
      this.Base.setMyData({ result });

      wx.hideLoading();
    });



  }
  // skey(e) {
  //   var keyword = e.detail.value;
  //   console.log(keyword);
  //   this.Base.setMyData({
  //     keyword: e.detail.value
  //   })
  // }

  search(e) {
    //console.log(e.detail.value);

    //setTimeout(() => {
      var json = {};
      json.searchkeyword = this.Base.getMyData().keyword;
      console.log("SSSSSSSSSSSSSSSSSSSSSSSSSSS" + json.searchkeyword)
      
      var bookapi = new BookApi();
      bookapi.booklist(json, (result) => {
        this.Base.setMyData({ result });

        wx.hideLoading();
      });
    //}, 200);

  }
   todetails(e) {
     var id = e.currentTarget.id;
     wx.navigateTo({
       url: '/pages/mytalkdetails/mytalkdetails?id=' + id,
     })
   }

}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.skey = content.skey;
body.search = content.search;
body.todetails = content.todetails;
Page(body)