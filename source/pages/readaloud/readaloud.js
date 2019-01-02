// pages/readaloud/readaloud.js
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
    options.id=2;
    super.onLoad(options);
    this.Base.setMyData({ open: 2 })
    const app = getApp()
    const recorderManager = wx.getRecorderManager()
    const innerAudioContext = wx.createInnerAudioContext()
    var tempFilePath;
    

  }
  onMyShow() {
    var that = this;
    var bookapi = new BookApi();
    bookapi.bookinfo({ id: this.Base.options.id }, (bookinfo) => {
      this.Base.setMyData({ bookinfo });
    });
  }
  begin(e){
    wx.startRecord({
      success(res) {
        const tempFilePath = res.tempFilePath
      }
    })
     //setTimeout(function () {
      // wx.stopRecord() // 结束录音
    //}, 10000)
  }
  submit(e){
    var id = e.currentTarget.id;
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
          wx.navigateTo({
            url: '/pages/endreading/endreading?id='+id,
          }),

          wx.showToast({
            title: '保存成功',
            mask: false
          })
        }
      }
    });
  }

  cutmusic(e){

  }

  Choice(e){

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
    const options = {
    duration: 600000,//指定录音的时长，单位 ms
    sampleRate: 16000,//采样率
    
    numberOfChannels: 1,//录音通道数
    encodeBitRate: 96000,//编码码率
    format: 'mp3',//音频格式，有效值 aac/mp3
    frameSize: 50,//指定帧大小，单位 KB
  }
  //开始录音
  recorderManager.start(options);
  recorderManager.onStart(() => {
    console.log('recorder start')
  });
  //错误回调
  recorderManager.onError((res) => {
    console.log(res);
  })
}

  stop () {
    const recorderManager = wx.getRecorderManager()
    const innerAudioContext = wx.createInnerAudioContext()
  recorderManager.stop();
  recorderManager.onStop((res) => {
    this.tempFilePath = res.tempFilePath;
    console.log('停止录音', res.tempFilePath)
    const { tempFilePath } = res
  })
}

  play () {
    const recorderManager = wx.getRecorderManager()
    const innerAudioContext = wx.createInnerAudioContext()
  innerAudioContext.autoplay = true
  innerAudioContext.src = this.tempFilePath,
    innerAudioContext.onPlay(() => {
      console.log('开始播放')
    })
  innerAudioContext.onError((res) => {
    console.log(res.errMsg)
    console.log(res.errCode)
  })

}



}
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

body.play = content.play;
body.start = content.start; 
body.stop = content.stop; 
Page(body)