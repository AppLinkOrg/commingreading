// pages/myreading/myreading.js
import { AppBase } from "../../appbase";
import { ApiConfig } from "../../apis/apiconfig";
import { InstApi } from "../../apis/inst.api.js";
import { BookApi } from "../../apis/book.api.js";
import { TalkApi } from "../../apis/talk.api.js";

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

    
    bookapi.booktypelist({ }, (booktypelist) => {
      //this.Base.setMyData({ booktypelist });
      
      //for (var i = 0; i < booktypelist.length; i++) {
        
      
      bookapi.rdlist({member_id:memberinfo.id }, (rdlist) => {

          this.Base.setMyData({ rdlist });

        // for (var n = 0; n < readlist.length; n++) {
        //   mine.push(readlist[n]); 
        //   mi.push(readlist[n].booktype_name); 
        // }
        
      });
        
      

    });





  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
Page(body)