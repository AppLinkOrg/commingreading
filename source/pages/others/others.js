// pages/others/others.js
import { AppBase } from "../../appbase";
import { ApiConfig } from "../../apis/apiconfig";
import { InstApi } from "../../apis/inst.api.js";
import { BookApi } from "../../apis/book.api.js";
import { TalkApi } from "../../apis/talk.api.js";
import { PostApi } from "../../apis/post.api.js";

class Content extends AppBase {
  constructor() {
    super();
  }

  onLoad(options) {
    this.Base.Page = this;
    //options.readid=2;
    super.onLoad(options);
    this.Base.setMyData({ status:"play" })

    var innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.onPlay(this.bgmOnPlay)

    innerAudioContext.onPause(() => {
      console.log('给我暂停')
      innerAudioContext.pause();
      this.Base.setMyData({ status: "play" })
    })

    innerAudioContext.onStop(() => {
      console.log('播放停止')
      innerAudioContext.stop()
      this.Base.setMyData({ status: "play" })
      //播放结束，销毁该实例
      //innerAudioContext.destroy()
    })

    innerAudioContext.onEnded(() => {
      console.log('播放结束')
      //var bgmlist = this.Base.getMyData().bgmlist;
      //播放结束，销毁该实例
      //innerAudioContext.destroy()
      this.Base.setMyData({ status: "play" })
    })

    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
      //播放错误，销毁该实例
      innerAudioContext.destroy()
    })

    innerAudioContext.onTimeUpdate((res) => {
      var that = this;
      that.Base.setMyData({
        audio_duration: innerAudioContext.duration,
        audio_duration_str: dtime(innerAudioContext.duration),
        audio_value: innerAudioContext.currentTime,
        audio_value_str: dtime(innerAudioContext.currentTime)
      });
    })

    this.Base.innerAudioContext = innerAudioContext;
    var talkapi = new TalkApi();
    var bookapi = new BookApi();
    var that = this;

    bookapi.readinfo({ id: this.Base.options.readid }, (readinfo) => {
      this.Base.setMyData({ readinfo });
      var talkapi = new TalkApi();
      var uploadpath = that.Base.getMyData().uploadpath;
      this.Base.innerAudioContext.autoplay = false;
      this.Base.innerAudioContext.obeyMuteSwitch = false;
      this.Base.innerAudioContext.src = uploadpath + "readfile/" + readinfo.read_file;

      talkapi.messagelist({ read: readinfo.id }, (messagelist) => {
        this.Base.setMyData({ messagelist });
      });

      bookapi.bookinfo({ id: readinfo.book_id }, (bookinfo) => {
        this.Base.setMyData({ bookinfo });
      });

      talkapi.likelist({}, (likelist) => {
        this.Base.setMyData({ likelist });
      });

    });
  }

  onMyShow() {
    var bookapi = new BookApi();
    //member_id: this.Base.getMyData().memberinfo.id
    var api = new PostApi();
    api.poster({id: this.Base.options.readid });

  }

  onUnload() {
    var innerAudioContext = this.Base.innerAudioContext;
    innerAudioContext.stop();
    console.log("停止播放");
    console.log("88888888888888888888888");
  }

  onHide() {
    var innerAudioContext = this.Base.innerAudioContext;
    innerAudioContext.pause();
    console.log("暂停啦")
    console.log("5555555555666666666");
  }


  bgmOnPlay() {
    console.log('开始播放')
    // var that=this;
    // var readinfo = this.Base.getMyData().readinfo;
    // var uploadpath = this.Base.getMyData().uploadpath;
    // wx.playBackgroundAudio({
    //   dataUrl: uploadpath + "readfile/" + readinfo.read_file,
    // })
  }


  Play(e){
      this.Base.setMyData({ status:"stop"})
      var that = this;
      var talkapi = new TalkApi();
      var readinfo = this.Base.getMyData().readinfo;
      var uploadpath = that.Base.getMyData().uploadpath;
      var bgmlist = this.Base.getMyData().bgmlist;
      var innerAudioContext = this.Base.innerAudioContext;
      //var expertsfavid = this.Base.getMyData().info.id;
      talkapi.addlisten({ listen: readinfo.id }, (ret) => {

      if (ret.return != "deleted") {
        this.Base.toast("收听成功");
      } 
      
    })

    innerAudioContext.pause();
    innerAudioContext.play();
  }

  //addlisten
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
    var readinfo=this.Base.getMyData().readinfo;
    //var expertsfavid = this.Base.getMyData().info.id;
    talkapi.addreadlike({  readlike: readinfo.id }, (ret) => {
    
      if (ret.return == "deleted") {
        this.Base.toast("取消点赞成功");
      } else {
        this.Base.toast("点赞成功");
      }

      //this.onMyShow();
      

       var talkapi = new TalkApi();
       talkapi.likelist({ }, (likelist) => {
         this.Base.setMyData({ likelist });
       });


    })
  }

  toread(e) {
    var bookinfo = this.Base.getMyData().bookinfo;
    wx.navigateTo({
      url: '/pages/readaloud/readaloud?id='+bookinfo.id,
    });
  }

  changetotime(e){
    console.log(e);

    var innerAudioContext = this.Base.innerAudioContext;
    console.log(innerAudioContext);
    innerAudioContext.seek(parseInt(e.detail.value));
  }


  poster() {

    var that = this;
    var url = 'https://cmsdev.app-link.org/Users/alucard263096/yngd/upload/read/' + this.Base.options.readid + '_yngdc.png';

    that.Base.viewPhoto({ currentTarget: { id: url } });

    return;
    // wx.downloadFile({
    //   url: 'https://cmsdev.app-link.org/Users/alucard263096/carpost/upload/post/' + this.Base.options.id + '.png', //仅为示例，并非真实的资源
    //   success: function (res) {
    //     // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
    //     if (res.statusCode === 200) {
    //       wx.saveImageToPhotosAlbum({
    //         filePath: res.tempFilePath,
    //       });
    //       wx.showToast({
    //         title: '下载分享图片成功',
    //         icon: "none"
    //       })
    //     } else {
    //       wx.showToast({
    //         title: '下载分享图片失败',
    //         icon: "none"
    //       })
    //     }
    //   }
    // })
    
  }





}



function dtime(t) {
  var t = parseInt(t);
  var minute = parseInt(t / 60);
  var second = parseInt(t % 60);
  minute = minute <= 9 ? "0" + minute.toString() : minute.toString();
  second = second <= 9 ? "0" + second.toString() : second.toString();
  return minute + ":" + second;
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
body.toread = content.toread;
body.changetotime = content.changetotime;
body.poster = content.poster;
Page(body)