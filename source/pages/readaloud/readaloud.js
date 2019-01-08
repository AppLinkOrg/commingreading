// pages/readaloud/readaloud.js
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
  innerAudioContext = null;

  onLoad(options) {
    this.Base.Page = this;
    //options.id = 2;
    super.onLoad(options);
    this.Base.setMyData({
      open: 2,
      isplay: false,
      play:"begin"
    })

    var tempFilePath;

    var innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.onPlay(this.bgmOnPlay)
    innerAudioContext.onStop(() => {
      console.log('播放暂停')
      innerAudioContext.stop()
      //播放结束，销毁该实例
      innerAudioContext.destroy()
    })
    innerAudioContext.onEnded(() => {
      var bgmlist = this.Base.getMyData().bgmlist;
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
 
  onUnload(){
    var innerAudioContext = this.Base.innerAudioContext;

    innerAudioContext.stop();
    console.log("暂停播放")
    console.log("88888888888888888888888");

  }
  bgmOnPlay() {

    console.log('开始播放')

  }

  onMyShow() {
    var that = this;
    var bookapi = new BookApi();
    //const myaudio = wx.createInnerAudioContext();
    bookapi.bookinfo({
      id: this.Base.options.id
    }, (bookinfo) => {
      this.Base.setMyData({
        bookinfo
      });
    });
    bookapi.bgmlist({
      orderby: "r_main.id"
    }, (bgmlist) => {
      this.Base.setMyData({
        bgmlist
      });
    });
  }

  begin(e){

    this.Base.setMyData({ play: "suspend" })
    wx.showToast({
      title: '录音开始',
      mask: false,
      icon: 'none',
    })

    var that = this;
    
    var uploadpath = that.Base.getMyData().uploadpath;
    var bgmlist = this.Base.getMyData().bgmlist;
    for (var i = 0; i < bgmlist.length; i++) {
      var src = this.Base.getMyData().bgmlist[i].music;
    }
    var index = e.currentTarget.dataset.index;
    var innerAudioContext = this.Base.innerAudioContext;

    innerAudioContext.loop = true
    console.log("111111")
    innerAudioContext.obeyMuteSwitch = false;
    innerAudioContext.src = uploadpath + "bgm_file/" + src;
    innerAudioContext.play();
    console.log(innerAudioContext.src);
    for (var i = 0; i < bgmlist.length; i++) {
      bgmlist[i].audioStatus = false
    }
    bgmlist[0].audioStatus = true;
    console.log("序号" + index)

    const recorderManager = wx.getRecorderManager()
    const myaudio = wx.createInnerAudioContext();
    const options = {
      duration: 600000, //指定录音的时长，单位 ms
      sampleRate: 16000, //采样率

      numberOfChannels: 1, //录音通道数
      encodeBitRate: 96000, //编码码率
      format: 'mp3', //音频格式，有效值 aac/mp3
      frameSize: 50, //指定帧大小，单位 KB
    }
    //开始录音
    recorderManager.start(options);
    recorderManager.onStart(() => {
      console.log('录音开始')
    });

    //错误回调
    recorderManager.onError((res) => {
      console.log(res);
    })
  }

  suspend(e) {
    this.Base.setMyData({ play: "play" })

    wx.showToast({
      title: '录音结束',
      mask: false,
      icon: 'none',
    })

    const recorderManager = wx.getRecorderManager()

    const myaudio = wx.createInnerAudioContext();


    var innerAudioContext = this.Base.innerAudioContext;

    innerAudioContext.pause();
    console.log("暂停播放")

    recorderManager.stop();
    recorderManager.onStop((res) => {
      this.tempFilePath = res.tempFilePath;
      console.log('停止录音', res.tempFilePath)
      const {
        tempFilePath
      } = res

    })
  }

  playrecord(e) {
    this.Base.setMyData({ play: "stop" })
    wx.showToast({
      title: '播放录音',
      mask: false,
      icon: 'none',
    })
    const recorderManager = wx.getRecorderManager()
    var innerAudioContext = this.Base.innerAudioContext;
    innerAudioContext.autoplay = true
    innerAudioContext.loop = true
    
    innerAudioContext.src = this.tempFilePath,
      innerAudioContext.onPlay(() => {
        console.log('开始播放')
      })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
  }
  luyinstop(e){
    this.Base.setMyData({ play: "play" })
    var innerAudioContext = this.Base.innerAudioContext;
    innerAudioContext.pause();
    console.log("暂停")
  }
  againrecord(e){
    var that=this;
    wx.showModal({
      title: '',
      content: '确认重新录制？',
      showCancel: true,
      
      cancelText: '取消',
      cancelColor: '#EE2222',
      confirmText: '确定',
      confirmColor: '#2699EC',
      success: function (res) {
        if (res.confirm) {
          that.Base.setMyData({ play: "begin" }) 
          wx.showToast({
            title: '请点击重新录制',
            mask: false,
            icon: 'none',
          })
          that.onMyShow();
        }
        
      }
    });
    
  }

  submit(e) {
    var id = e.currentTarget.id;
    wx.showModal({
      title: '提交',
      content: '确认提交并保存录音？',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#EE2222',
      confirmText: '确定',
      confirmColor: '#2699EC',
      success: function(res) {
        if (res.confirm) {
          wx.navigateTo({
              url: '/pages/endreading/endreading?id=' + id,
            }),

            wx.showToast({
              title: '保存成功',
              mask: false
            })
        }
      }
    });
  }

  bindclosedetails(e) {
    this.Base.setMyData({
      open: 2
    })

  }
  btnopendetails() {
    this.Base.setMyData({
      open: 1
    })
  }


  shangchuan(e) {

  }

  




  playbgm(e) {
    var that = this;
    var src = e.currentTarget.dataset.src;
    var uploadpath = that.Base.getMyData().uploadpath;
    var bgmlist = this.Base.getMyData().bgmlist;
    var index = e.currentTarget.dataset.index;
    var innerAudioContext = this.Base.innerAudioContext;

    innerAudioContext.pause();
    console.log("暂停")
    console.log("111111")
    innerAudioContext.obeyMuteSwitch = false;
    innerAudioContext.src = uploadpath + "bgm_file/" + src;
    innerAudioContext.play();
    console.log(innerAudioContext.src);
    for (var i = 0; i < bgmlist.length; i++) {
      bgmlist[i].audioStatus = false
    }
    bgmlist[index].audioStatus = true;
    console.log("序号" + index)

  }

  zt(e) {
    var that = this;
    var innerAudioContext = this.Base.innerAudioContext;
    innerAudioContext.stop();

  }

  confirm(e) {
    console.log(e);
    var that = this;
    var api = new BookApi();

    //var vonice = this.tempFilePath;
    var ve = this.tempFilePath;
    
    var book_id = this.Base.getMyData().bookinfo.id;
    var name = this.Base.getMyData().bookinfo.book_name;
    if (ve == null) {
      this.Base.info("请录音再上传");
      return;
    }
    console.log(ve);


    wx.showModal({
      title: '提交',
      content: '确认提交并保存录音？',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#EE2222',
      confirmText: '确定',
      confirmColor: '#2699EC',
      success: function (res) {
        if (res.confirm) {


          that.Base.uploadFile("readfile", "录音文件《" + name + "》", ve, (ret) => {
            var vonice = that.Base.getMyData().ve;
            

            that.Base.setMyData({
              vonice: ret
            });
            
            var talker = that.Base.getMyData().memberinfo;

            //console.log("wwwwwwwwww" + talker)

            //return;

            api.addlangdu({
              status: "A",
              book_id: book_id,
              member_id: talker.id,
              read_file: that.Base.getMyData().vonice
            }, (ret) => {
              console.log(666666666666666);
              var book_id = that.Base.getMyData().bookinfo.id;
              console.log("辣椒炒肉"+that.Base.getMyData().vonice);
              if (ret.code == 0) {
                console.log('提交成功');
                
                wx.reLaunch({
                  url: '/pages/endreading/endreading?id=' + book_id + '&retid=' + ret.return,
                })

                wx.showToast({
                  title: '保存成功',
                  mask: false
                })
                //that.onMyShow();
              } else {
                that.Base.info(ret.result);
              }

            });

          });

          
        }
      }
    });



    //return;this.Base.uploadImage("post",(ret)=>{
    

  }

}
//var innerAudioContext = null;
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
body.begin = content.begin; 
body.suspend = content.suspend;
body.playrecord = content.playrecord; 
body.luyinstop = content.luyinstop;
body.againrecord = content.againrecord; 

body.submit = content.submit;
body.cutmusic = content.cutmusic;
body.Choice = content.Choice;
body.btnopendetails = content.btnopendetails;
body.bindclosedetails = content.bindclosedetails;
body.playVoice = content.playVoice;
body.playbgm = content.playbgm;
body.play = content.play;
body.start = content.start;
body.stop = content.stop;
body.zt = content.zt;
body.shangchuan = content.shangchuan;
body.confirm = content.confirm;
body.uploadvonice = content.uploadvonice;
body.bgmOnPlay = content.bgmOnPlay;

Page(body)