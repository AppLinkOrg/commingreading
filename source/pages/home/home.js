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
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var that = this;
    var instapi = new InstApi();
    
    // setTimeout(function () {
      
    // }, 500)
    instapi.indexbanner({}, (indexbanner) => {
      this.Base.setMyData({ indexbanner });
    }); 
    var bookapi = new BookApi();
    bookapi.booklist({ ishot:"Y" }, (booklist) => {
      this.Base.setMyData({ booklist });
    });

    bookapi.booklist({ isday: "Y"}, (everydaylist) => {
      this.Base.setMyData({ everydaylist });
    });

    bookapi.booklist({ isnew: "Y" }, (newlist) => {
      this.Base.setMyData({ newlist });
      wx.hideLoading(
      )
    });

  }

  bindcompleted(e) {
    this.Base.setMyData({  ctt: 3 })
    this.onMyShow();
  }
  bindwaitcompleted(e) {
    this.Base.setMyData({ ctt: 2 })
    this.onMyShow();
  }
  bindcontact(e) {
    this.Base.setMyData({ ctt: 1 })
    this.onMyShow();
  }
  
  todetails(e){
    var id=e.currentTarget.id;
    wx.navigateTo({
       url: '/pages/mytalkdetails/mytalkdetails?id='+id+'&type=A',
    })
  }

  tocontent(e){
    wx.navigateTo({
      url: '/pages/news/news',
    })
  }
  tiaozhuan(e){
    console.log(e);
    var url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: `/${url}`
    })
   
  }
}


var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.bindcompleted = content.bindcompleted;
body.bindwaitcompleted = content.bindwaitcompleted;
body.bindcontact = content.bindcontact; 
body.todetails = content.todetails; 
body.tocontent = content.tocontent;
body.tiaozhuan=content.tiaozhuan;
Page(body)