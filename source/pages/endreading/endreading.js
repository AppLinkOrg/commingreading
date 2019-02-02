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
    wx.showToast({
      title: '保存成功',
      mask: false
    })
    this.Base.setMyData({status:"play",time:this.Base.options.time});

    var innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.onPlay(this.bgmOnPlay)
    innerAudioContext.onStop(() => {
     
    })
    innerAudioContext.onEnded(() => {
      console.log('播放结束')
      
      //播放结束，销毁该实例
      innerAudioContext.destroy()
    });


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
  }
  onMyShow() {
    var that = this;
    var bookapi = new BookApi();
    bookapi.bookinfo({ id: this.Base.options.id }, (bookinfo) => {
      this.Base.setMyData({ bookinfo });
    });

    bookapi.readinfo({ id: this.Base.options.retid}, (readinfo) => {
      var uploadpath = this.Base.getMyData().uploadpath;
      this.Base.innerAudioContext.src = uploadpath + "readfile/" + readinfo.read_file;
       this.Base.setMyData({ readinfo });
     });
  }
  bgmOnPlay(e){
   console.log("播放");
    wx.hideLoading();
    this.Base.setMyData({ status: "stop" })
  }

  tobookshelf(e){
    var that = this;
    var innerAudioContext = this.Base.innerAudioContext;
    innerAudioContext.stop();
    wx.reLaunch({
      url: '/pages/bookshelf/bookshelf',
    })
  }
   Play(e) {
     wx.showLoading({
       title: '加载中',
     });

     var that = this;
     var readinfo = this.Base.getMyData().readinfo;
     var uploadpath = that.Base.getMyData().uploadpath;
    var bgmlist = this.Base.getMyData().bgmlist;
     var index = e.currentTarget.dataset.index;
     var innerAudioContext = this.Base.innerAudioContext;
     try{

       innerAudioContext.pause();
     }catch(e){

     }
     console.log("暂停")

     innerAudioContext.play();
     //setTimeout(()=>{
     //innerAudioContext.autoplay = true;
     console.log("111111");
     innerAudioContext.loop = true
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
    console.log(bookinfo.id+"第一");
    console.log(this.Base.options.retid+"第二");
    
    // wx.reLaunch({
    //   url: '/pages/recordagain/recordagain?id=' + this.Base.options.retid + '&bookid=' + bookinfo.id,
    // })
    wx.reLaunch({
      url: '/pages/readaloud/readaloud?retid=' + this.Base.options.retid + '&id=' + bookinfo.id+'&type=A',
     })

  }

  onUnload(){

    var innerAudioContext = this.Base.innerAudioContext;
    innerAudioContext.stop();
  }


  changetotime(e) {
    console.log(e);

    var innerAudioContext = this.Base.innerAudioContext;
    console.log(innerAudioContext);
    innerAudioContext.seek(parseInt(e.detail.value));
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
body.tobookshelf = content.tobookshelf; 
body.recordagain = content.recordagain;
body.bgmOnPlay = content.bgmOnPlay; 
body.Play = content.Play;
body.Stop = content.Stop;
body.changetotime = content.changetotime;
Page(body)