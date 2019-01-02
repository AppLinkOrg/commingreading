// pages/others/others.js
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
    this.Base.setMyData({ status:"play" })
  }
  
  onMyShow() {
    var that = this;
    var bookapi = new BookApi();
    bookapi.bookinfo({ id: this.Base.options.id }, (bookinfo) => {
      this.Base.setMyData({ bookinfo });
      var talkapi = new TalkApi();
      talkapi.messagelist({ book_id: bookinfo.id }, (messagelist) => {
        this.Base.setMyData({ messagelist });
      });
    }); 
    var talkapi = new TalkApi();

    talkapi.likelist({}, (likelist) => {
      this.Base.setMyData({ likelist });
    });
  }
  Play(e){
    this.Base.setMyData({ status:"stop"})
  }
  Stop(e){
    this.Base.setMyData({ status: "play" })
  }
  changeComment(e) {
    this.Base.setMyData({ comment: e.detail.value });
  } 

  sendComment() {
    var that = this;
    var memberinfo = this.Base.getMyData().memberinfo;
    var comment = this.Base.getMyData().comment;
    if (comment != "" && comment != undefined) {
      var talkapi = new TalkApi();
      talkapi.addtalk({ comment: comment, book_id: that.Base.options.id,member_id:memberinfo.id }, (rst) => {
        this.Base.setMyData({
          comment: ""
        });
        that.onMyShow();
      })
    }
    else {
      this.Base.info("至少说点什么吧");
    }
  }

  dianzan() {
    var that = this;
    var talkapi = new TalkApi();
    var memberinfo=this.Base.getMyData().memberinfo;
    //var expertsfavid = this.Base.getMyData().info.id;
    talkapi.addreadlike({status:"A",member_id:memberinfo.id,id:this.Base.options.id }, (ret) => {
      that.onMyShow();
      if (ret.return == "") {
        this.Base.toast("取消点赞成功");
      } else {
        this.Base.toast("点赞成功");
      }
    })
  }

}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.Play = content.Play;
body.Stop = content.Stop;
body.sendComment = content.sendComment;
body.changeComment = content.changeComment; 
body.dianzan = content.dianzan;
Page(body)