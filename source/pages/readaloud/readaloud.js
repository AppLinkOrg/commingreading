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
import {
  ApiUtil
} from "../../apis/apiutil.js";
import {
  TalkApi
} from "../../apis/talk.api.js";


class Content extends AppBase {
  constructor() {
    super();
  }
  innerAudioContext = null;
  recorderManager = null;
  timer = '';
  zimutimer = null;
  onLoad(options) {
    this.Base.Page = this;
    //options.id = 2;
    super.onLoad(options);


    this.Base.setMyData({
      open: 2,
      isplay: false,
      play: "begin",
      bg1: 2,
      date: ApiUtil.updatetime(new Date()),
      precord: "N",
      lines: [],
      speed: 1,
      zimucount: -1,
      readcount: 0,
      firstpaly: 0
    })

    var tempFilePath;
    var recorderManager = wx.getRecorderManager()
    var myaudio = wx.createInnerAudioContext();
    var that = this;

    var innerAudioContext = wx.createInnerAudioContext()

    innerAudioContext.onPlay(this.bgmOnPlay);
    innerAudioContext.onPause(() => {
      console.log("stop here");
    });
    innerAudioContext.onStop(() => {
      console.log('播放停止')
      //innerAudioContext.stop()
      //播放结束，销毁该实例
      //innerAudioContext.destroy()
    })

    innerAudioContext.onEnded(() => {
      console.log('播放结束')
      //播放结束，销毁该实例
      //innerAudioContext.destroy()
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
    this.loadingdata();
  }

  onUnload() {
    var that = this;
    var innerAudioContext = this.Base.innerAudioContext;
    innerAudioContext.stop();
    console.log("暂停播放")
    console.log("88888888888888888888888");
    clearInterval(that.Base.zimutimer);
  }
  
  
  bgmOnPlay() {
    var that = this;
    console.log('开始播放')
    var speed = Number(that.Base.getMyData().speed);
    var memberinfo = this.Base.getMyData().memberinfo;
    if (memberinfo.velocity == 0) {
      this.Base.setMyData({
        velocity: 3
      })
    } else {
      this.Base.setMyData({
        velocity: memberinfo.velocity 
      })
    }

    /*
    clearInterval(that.Base.zimutimer);

    var firstpaly = parseInt(that.Base.getMyData().firstpaly);
    if (firstpaly == 0) {
      that.Base.setMyData({
        zimucount: -1,
        firstpaly: 0
      });
    }

    that.Base.zimutimer = setInterval(() => {
      var zimucount = parseInt(that.Base.getMyData().zimucount);
      var readcount = parseInt(that.Base.getMyData().readcount);
      zimucount++;
      if (readcount >= zimucount) {
        that.Base.setMyData({
          zimucount: zimucount
        });
      }
    }, 1000 / this.Base.getMyData().velocity);
    */
  }

  qweqwe(e) {
    console.log(e.currentTarget.id);

    wx.getImageInfo({
        src: e.currentTarget.id,
        success(qwe) {
          console.log(qwe);
          console.log(12313);
        }
      }

    );
  }
  loadingdata() {
    wx.showLoading({
      title: '加载中',
      mask: true
    })

    var that = this;

    var bookapi = new BookApi();

    //const myaudio = wx.createInnerAudioContext();

    bookapi.bookinfo({
      id: this.Base.options.id
    }, (bookinfo) => {
      
      var book_content = bookinfo.book_content;

      var lines = book_content.split("\n");

      var count = 0;

      for (var i = 0; i < lines.length; i++) {
        var line = [];
        for (var j = 0; j < lines[i].length; j++) {
          line.push({
            num: count++,
            c: lines[i][j]
          });
        }
        lines[i] = line;
      }

console.log(lines);

      this.Base.setMyData({
        bookinfo,
        lines: lines
      });

    });
    bookapi.bgmlist({
      orderby: "r_main.id"
    }, (bgmlist) => {
      this.Base.setMyData({
        bgmlist
      });
      wx.hideLoading();
    });
  }

  begin(e) {
    //return;
    this.Base.setMyData({
      play: "suspend"
    })
    var that = this;
    //return;
    wx.showToast({
      title: '录音开始',
      mask: false,
      icon: 'none',
    })
    var that = this;
    var uploadpath = that.Base.getMyData().uploadpath;
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
    var countDownNum = 0;
    //var now = dtime();
    var timer=this.Base.getMyData().timer;
    clearInterval(timer);
    that.setData({
      timer: setInterval(function () {
        countDownNum++;
        that.setData({
          countDownNum: dtime(countDownNum)
        })
        console.log(countDownNum);

      }, 1000)
    });
    that.Base.setMyData({
      zimucount: -1
    });
    that.Base.setMyData({ "kkt": "vj" });

    recorderManager.onStart(() => {
      
    });

    //错误回调
    recorderManager.onError((res) => {
      console.log(res);
    })
    recorderManager.stop();
    that.tempFilePath = null;
    recorderManager.start({ duration: 600000 });
    console.log('录音开始')
    that.Base.setMyData({ "kkt": "0" });
    var speed = Number(that.Base.getMyData().speed);
    that.Base.setMyData({ "kkt": "01" });
    var memberinfo = that.Base.getMyData().memberinfo;

    //console.log(memberinfo.velocity / 1000+"打算离开")
    //return;
    that.Base.setMyData({ "kkt": "1" });
    if (memberinfo.velocity == 0) {
      this.Base.setMyData({
        velocity: 3
      })
    } else {
      this.Base.setMyData({
        velocity: memberinfo.velocity
      })
    }
    that.Base.setMyData({ "kkt": "2" });
    clearInterval(that.Base.zimutimer);
    that.Base.setMyData({
      zimucount: -1
    });

    that.Base.setMyData({ "kkt": "3" });
    var velocity = this.Base.getMyData().velocity;
    var speed = 1000;
    if (velocity == 1) {
      speed = 600;
    }
    if (velocity == 2) {
      speed = 500;
    }
    if (velocity == 3) {
      speed = 400;
    }
    if (velocity == 4) {
      speed = 300;
    }
    if (velocity == 5) {
      speed = 200;
    }
    that.Base.setMyData({ "kkt": "4" });
    that.Base.zimutimer = setInterval(() => {
      var zimucount = parseInt(that.Base.getMyData().zimucount);
      zimucount++;

      that.Base.setMyData({
        zimucount: zimucount
      });
    }, speed);

    that.Base.setMyData({ "kkt": "5" });
  }

  suspend(e) {
    var that = this;
    this.Base.setMyData({
      play: "play",
      bg1: 2
    })
    var that = this;
    wx.showToast({
      title: '录音结束',
      mask: false,
      icon: 'none',
    })

    const recorderManager = wx.getRecorderManager()

    const myaudio = wx.createInnerAudioContext();


    var innerAudioContext = this.Base.innerAudioContext;

    innerAudioContext.stop(this.Base.setMyData({
      bg1: 2,
      music_name: null,
      precord: "S"
    }));
    console.log("暂停播放")

    recorderManager.stop(
      //录音停止清除计时器

      clearInterval(that.data.timer)

    );
    recorderManager.onStop((res) => {
      this.tempFilePath = res.tempFilePath;
      console.log('停止录音', res.tempFilePath)
      const {
        tempFilePath
      } = res;

      clearInterval(that.Base.zimutimer);
      //读的字数在这里
      var readcount = that.Base.getMyData().zimucount;
      console.log("字数统计读结果在这里，提交就提交这个:" + readcount);
      that.Base.setMyData({
        readcount
      });

    })
  }

  playrecord(e) {
    this.Base.setMyData({
      play: "stop"
    })
    wx.showToast({
      title: '播放录音',
      mask: false,
      icon: 'none',
    })
    //const recorderManager = wx.getRecorderManager()
    var innerAudioContext = this.Base.innerAudioContext;
    innerAudioContext.autoplay = true
    innerAudioContext.loop = true
    innerAudioContext.src = this.tempFilePath,
      innerAudioContext.play(this.Base.setMyData({
        precord: "Y"
      }));

  }



  luyinstop(e) {
    this.Base.setMyData({
      play: "play"
    })
    var innerAudioContext = this.Base.innerAudioContext;
    innerAudioContext.pause();

    clearInterval(this.Base.zimutimer);
    console.log("暂停2")
  }

  againrecord(e) {
    var that = this;

    //innerAudioContext.destroy();

    wx.showModal({
      title: '',
      content: '确认重新录制？',
      showCancel: true,

      cancelText: '取消',
      cancelColor: '#EE2222',
      confirmText: '确定',
      confirmColor: '#2699EC',
      success: function(res) {
        if (res.confirm) {
          that.Base.setMyData({
            play: "begin",
            bg1: 2,
            music_name: null,
            precord: "N"
          });

          clearInterval(that.Base.zimutimer);
          that.Base.setMyData({
            zimucount: -1
          });
          var innerAudioContext = that.Base.innerAudioContext;
          innerAudioContext.stop();
          setTimeout(()=>{
            that.tempFilePath = null;
          },1000);
          wx.showToast({
            title: '请点击录音重新录制',
            mask: false,
            icon: 'none',
          });

          that.loadingdata();
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

          that.onUnload();
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
    var precord = this.Base.getMyData().precord;
    if (precord == "Y") {
      wx.showToast({
        title: '播放录音中',
        icon: 'none'
      })
      return;
    }
    if (precord == "S") {
      wx.showToast({
        title: '录音已完成',
        icon: 'none'
      })
      return;
    } else {
      this.Base.setMyData({
        open: 1
      })
    }

  }


  shangchuan(e) {

  }






  playbgm(e) {
    var that = this;
    var src = e.currentTarget.dataset.src;
    var uploadpath = that.Base.getMyData().uploadpath;
    var bgmlist = this.Base.getMyData().bgmlist;
    var index = e.currentTarget.dataset.index;
    var name = e.currentTarget.dataset.music_name;
    var innerAudioContext = this.Base.innerAudioContext;

    innerAudioContext.pause();
    console.log("暂停1")
    innerAudioContext.loop=true;
    innerAudioContext.obeyMuteSwitch = false;
    innerAudioContext.src = uploadpath + "bgm_file/" + src;
    innerAudioContext.play(this.Base.setMyData({
      bg1: 1
    }));

    console.log(innerAudioContext.src);
    this.Base.setMyData({
      music_name: name
    });

    for (var i = 0; i < bgmlist.length; i++) {
      bgmlist[i].audioStatus = false
    }

    bgmlist[index].audioStatus = true;
    console.log("序号" + index)

  }

  zt(e) {
    var that = this;
    var innerAudioContext = this.Base.innerAudioContext;
    innerAudioContext.pause(this.Base.setMyData({
      bg1: 2
    }));

  }

  confirm(e) {
    console.log(e);
    var that = this;
    var api = new BookApi();
    var talkapi = new TalkApi();
    //var vonice = this.tempFilePath;
    var ve = this.tempFilePath;
    console.log(ve);
    //var bookinfo=this.Base.getMyData().bookinfo;
    var book_id = this.Base.getMyData().bookinfo.id;
    var book_type = this.Base.getMyData().bookinfo.booktype;
    console.log(book_type + "qqqqqqqqqqqqqqqqqqqq");
    //return;
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
      success: function(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '加载中',
            mask: true
          })

          talkapi.addreadcount({
            book: book_id,
            status: "A"
          }, (ret) => {

            // if (ret.return != "deleted") {
            //   this.Base.toast("收听成功");
            // }

          })


          that.Base.uploadFile("readfile", "录音文件《" + name + "》", ve, (ret) => {
            var vonice = that.Base.getMyData().ve;


            that.Base.setMyData({
              vonice: ret
            });

            var talker = that.Base.getMyData().memberinfo;
            var readcount = that.Base.getMyData().readcount;
            
            var book_id = that.Base.getMyData().bookinfo.id;
            //console.log("wwwwwwwwww" + talker)

            //return;

if(that.Base.options.type=="A"){
  api.addlangdu({
    again:"Y",
    status: "A",
    id: that.Base.options.retid,
    member_id: talker.id,
    book_id: book_id,
    booktype: book_type,
    wordnumber: readcount,
    read_file: that.Base.getMyData().vonice
  }, (ret) => {
    console.log(666666666666666);
    var book_id = that.Base.getMyData().bookinfo.id;
    var time = that.Base.getMyData().countDownNum;
    console.log(time + '666666666666666');
    //return
    console.log("辣椒炒肉" + that.Base.getMyData().vonice);
    if (ret.code == 0) {
      console.log('提交成功');
      that.onUnload();
      wx.navigateTo({
        url: '/pages/endreading/endreading?id=' + book_id + '&retid=' + ret.return + '&time=' + time,
      })

      //that.onMyShow();
    } else {
      that.Base.info(ret.result);
    }
  });
}
else(
            api.addlangdu({
              status: "A",
              book_id: book_id,
              member_id: talker.id,
              booktype: book_type,
              wordnumber: readcount,
              read_file: that.Base.getMyData().vonice
            }, (ret) => {
              console.log(666666666666666);
              var book_id = that.Base.getMyData().bookinfo.id;
              var time = that.Base.getMyData().countDownNum;
              console.log(time + '666666666666666');
              //return
              console.log("辣椒炒肉" + that.Base.getMyData().vonice);
              if (ret.code == 0) {
                console.log('提交成功');

                that.onUnload();
                wx.navigateTo({
                  url: '/pages/endreading/endreading?id=' + book_id + '&retid=' + ret.return+'&time=' + time,
                })

                //that.onMyShow();
              } else {
                that.Base.info(ret.result);
              }
            })
)



          });
          wx.hideLoading();
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
body.qweqwe = content.qweqwe;
body.loadingdata = content.loadingdata;
Page(body)