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

    var innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.onPlay(this.bgmOnPlay)
    innerAudioContext.onStop(() => {
      console.log('播放暂停')
      innerAudioContext.stop()
      //播放结束，销毁该实例
      innerAudioContext.destroy()
    })
    innerAudioContext.onEnded(() => {
      console.log('播放结束')
      bgmlist[index].audioStatus = false;
      this.Base.setMyData({
        bgmlist: bgmlist,
      })
      //播放结束，销毁该实例
      innerAudioContext.destroy()
    })

    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
      //播放错误，销毁该实例
      innerAudioContext.destroy()
    })

    this.Base.innerAudioContext = innerAudioContext;

  }
  
  onMyShow() {
    var that = this;
    var bookapi = new BookApi();
    

    bookapi.readinfo({ id: this.Base.options.readid }, (readinfo) => {
      this.Base.setMyData({ readinfo });

      var talkapi = new TalkApi();

      talkapi.messagelist({ read: readinfo.id}, (messagelist) => {
        this.Base.setMyData({ messagelist });
      });

      bookapi.bookinfo({ id: readinfo.book_id }, (bookinfo) => {
        this.Base.setMyData({ bookinfo });
      });

    }); 

    var talkapi = new TalkApi();
    talkapi.likelist({}, (likelist) => {
      this.Base.setMyData({ likelist });
    });

  }

  bgmOnPlay() {

    console.log('开始播放')

  }

  Play(e){
    this.Base.setMyData({ status:"stop"})

      var that = this;
      var readinfo = this.Base.getMyData().readinfo;
      var uploadpath = that.Base.getMyData().uploadpath;
      var bgmlist = this.Base.getMyData().bgmlist;
      var index = e.currentTarget.dataset.index;
      var innerAudioContext = this.Base.innerAudioContext;

      innerAudioContext.pause();
      //console.log("暂停")

      //innerAudioContext.play();
      //setTimeout(()=>{
      //innerAudioContext.autoplay = true;
      console.log("111111")

      innerAudioContext.obeyMuteSwitch = false;

    innerAudioContext.src = uploadpath + "readfile/" + readinfo.read_file;
      innerAudioContext.play();
      console.log(innerAudioContext.src);

      //bgmlist[i].audioStatus = false
      
  }
  Stop(e){
    this.Base.setMyData({ status: "play" })

    var innerAudioContext = this.Base.innerAudioContext;

    innerAudioContext.pause();
    console.log("暂停")
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
      talkapi.addtalk({ comment: comment, read: that.Base.options.readid,member_id:memberinfo.id }, (rst) => {
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
body.bgmOnPlay = content.bgmOnPlay;
Page(body)