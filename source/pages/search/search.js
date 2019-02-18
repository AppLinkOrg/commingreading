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
    //options.new=1;
    super.onLoad(options);
    var json = {
      searchrecomm: ""
    };
    this.Base.setMyData({show:0});
    
     if (options.new != undefined) {
       json.newphone = "N";
     }


      var bookapi = new BookApi();
      // bookapi.booklist(json, (result) => {
      //   this.Base.setMyData({
      //     result
      //   });
      // });

    // var bookapi = new BookApi();
    // bookapi.booklist(json, (result) => {
    //   this.Base.setMyData({ result });
    // });
    
  }
  onMyShow() {
    var that = this;
  }
  skey(e) {
    var keyword = e.detail.value;
    console.log(keyword);
    this.Base.setMyData({
      keyword: e.detail.value
    })
  }



  search(e) {
    //console.log(e.detail.value);
    this.Base.setMyData({ show: 1 });
    wx.showLoading({
      title: '加载中...',
    })
    setTimeout(()=>{
    var json = {};
    var data=e.detail.value;
    this.Base.setMyData({ value: data});
    json.searchkeyword=data;

    var bookapi = new BookApi();
    bookapi.keywordlist(json, (result) => {
      this.Base.setMyData({ result });
      wx.hideLoading();
    });
    }, 100);

  }

  tosearch(e) {
    var word = this.Base.getMyData().value;
    //console.log(word + "LLLLLLL");
    //return;
    if (word!=null){
      wx.navigateTo({
        url: '/pages/searchbook/searchbook?keyword=' + word,
      })
    }
  }

  todetails(e){
    var name=e.currentTarget.id;
     wx.navigateTo({
       url: '/pages/searchbook/searchbook?keyword=' + name,
    })
  }

}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.skey = content.skey;
body.search = content.search; 
body.tosearch = content.tosearch; 
body.todetails = content.todetails; 
Page(body)