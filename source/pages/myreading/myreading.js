// pages/myreading/myreading.js
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
import {
  TalkApi
} from "../../apis/talk.api.js";

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


    bookapi.booktypelist({}, (booktypelist) => {
      //this.Base.setMyData({ booktypelist });

      //for (var i = 0; i < booktypelist.length; i++) {


      bookapi.rdlist({
        member_id: memberinfo.id
      }, (rdlist) => {

        this.Base.setMyData({
          rdlist
        });

        // for (var n = 0; n < readlist.length; n++) {
        //   mine.push(readlist[n]); 
        //   mi.push(readlist[n].booktype_name); 
        // }

      });



    });





  }
  deleteread(e) {
    var that=this;
    console.log(e);
    wx.showModal({
      title: '',
      content: '是否确定删除？',
      showCancel: true,

      cancelText: '取消',
      cancelColor: '#EE2222',
      confirmText: '确定',
      confirmColor: '#2699EC',
      success: function(res) {
        if (res.confirm) {
          var bookapi = new BookApi();
          bookapi.deleteread({idlist:e.currentTarget.id}, () => {
            that.onMyShow();
          });
        }

      }
    });
  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.deleteread = content.deleteread;
Page(body)