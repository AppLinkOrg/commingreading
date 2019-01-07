// pages/endreading/endreading.js
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
    //options.id=2;
    //options.retid=25;
    super.onLoad(options);
    this.Base.setMyData({status:"play"})
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
    bookapi.bookinfo({ id: this.Base.options.id }, (bookinfo) => {
      this.Base.setMyData({ bookinfo });
    });

    bookapi.readinfo({ id: this.Base.options.retid}, (readinfo) => {
       this.Base.setMyData({ readinfo });
     });
  }
  bgmOnPlay(e){
   console.log("播放")
  }

  tobookshelf(e){
    wx.reLaunch({
      url: '/pages/bookshelf/bookshelf',
    })
  }
   Play(e) {
     this.Base.setMyData({ status: "stop" })

     var that = this;
     var readinfo = this.Base.getMyData().readinfo;
     var uploadpath = that.Base.getMyData().uploadpath;
    var bgmlist = this.Base.getMyData().bgmlist;
     var index = e.currentTarget.dataset.index;
     var innerAudioContext = this.Base.innerAudioContext;

     innerAudioContext.pause();
     console.log("暂停")

     innerAudioContext.play();
     //setTimeout(()=>{
     //innerAudioContext.autoplay = true;
     console.log("111111")

     innerAudioContext.obeyMuteSwitch = false;

     innerAudioContext.src = uploadpath + "readfile/" + readinfo.read_file;
     innerAudioContext.play();
   console.log(innerAudioContext.src);

     //bgmlist[i].audioStatus = false

   }
   Stop(e) {
     this.Base.setMyData({ status: "play" })

     var innerAudioContext = this.Base.innerAudioContext;

     innerAudioContext.pause();
     console.log("暂停")
   }
  recordagain(e){
    var bookinfo = this.Base.getMyData().bookinfo;
    console.log(bookinfo.id);
    wx.reLaunch({
      url: '/pages/recordagain/recordagain?id=' + this.Base.options.retid + '&bookid=' + bookinfo.id,
    })

  }

}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow; 
body.tobookshelf = content.tobookshelf; 
body.recordagain = content.recordagain;
body.bgmOnPlay = content.bgmOnPlay; 
body.Play = content.Play;
body.Stop = content.Stop;
Page(body)