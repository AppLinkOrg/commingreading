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
  onLoad(options) {
    this.Base.Page = this;
    options.id = 2;
    super.onLoad(options);
    this.Base.setMyData({
      open: 1,
      isplay: false
    })

    var tempFilePath;



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

  begin(e) {
    wx.startRecord({
      success(res) {
        const tempFilePath = res.tempFilePath
      }
    })
    //setTimeout(function () {
    // wx.stopRecord() // 结束录音
    //}, 10000)
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

  start(e) {
    const recorderManager = wx.getRecorderManager()
    const innerAudioContext = wx.createInnerAudioContext()


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

  stop() {
    const recorderManager = wx.getRecorderManager()
    const innerAudioContext = wx.createInnerAudioContext()
    const myaudio = wx.createInnerAudioContext();

    recorderManager.stop();
    recorderManager.onStop((res) => {
      this.tempFilePath = res.tempFilePath;
      console.log('停止录音', res.tempFilePath)
      const {
        tempFilePath
      } = res
    })
  }

  play() {
    const recorderManager = wx.getRecorderManager()
    const innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.autoplay = true

    innerAudioContext.src = this.tempFilePath,
      // innerAudioContext.src = 'http://cmsdev.app-link.org/alucard263096/yngd/basemgr/bgm?action=edit&id=3';
      innerAudioContext.onPlay(() => {
        console.log('开始播放')
      })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })

  }

  bgm(e) {
    var that = this;
    var src = e.currentTarget.dataset.src;
    var uploadpath = that.Base.getMyData().uploadpath;
    var bgmlist = this.Base.getMyData().bgmlist;

    const innerAudioContext = wx.createInnerAudioContext()
    var index = e.currentTarget.dataset.index;


    innerAudioContext.autoplay = true;
    innerAudioContext.obeyMuteSwitch = false;
    innerAudioContext.src = uploadpath + "bgm_file/" + src;

    console.log(innerAudioContext.src);


    for (var i = 0; i < bgmlist.length; i++) {
      bgmlist[i].audioStatus = false
    }
    bgmlist[index].audioStatus = true;
    console.log("ffffffff" + index)


    innerAudioContext.onPlay(() => {
      console.log('开始播放')
      this.Base.setMyData({
        bgmlist: bgmlist,
      })
    })

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


  }
  zt(e) {
    var that = this;
    const innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.stop();

  }

  shangchuan(e) {
    wx.uploadFile({

      url: '这里填写路径地址',
      filePath: tempFilePath,
      name: temp,
      header: {
        contentType: "multipart/form-data", //按需求增加
      },
      formData: {
        file: tempFilePath,
        //看后台需要什么传什么过去，这里我传两个，一个是临时路径，一个是录音时长
        time: TimeIng,
      },
      success: function(res) {
        //这里你可以根据后台传过来的res进行任性的操作，是的。。任性！！！
      }
    })
  }

}
//var innerAudioContext = null;
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.begin = content.begin;
body.submit = content.submit;
body.cutmusic = content.cutmusic;
body.Choice = content.Choice;
body.btnopendetails = content.btnopendetails;
body.bindclosedetails = content.bindclosedetails;

body.playVoice = content.playVoice;
body.bgm = content.bgm;
body.play = content.play;
body.start = content.start;
body.stop = content.stop;
body.zt = content.zt;
Page(body)