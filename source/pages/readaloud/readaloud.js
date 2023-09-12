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
import getContent from "../../utils/getcontent"

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
      firstpaly: 0,
      contentList: [],
      type: 1,
      typeNum: 0,
      scrollnum: 0,
      isEnglish: false,
      scrollable: false
    })

    var tempFilePath;
    var recorderManager = wx.getRecorderManager()
    var myaudio = wx.createInnerAudioContext();
    var that = this;

    var innerAudioContext = wx.createInnerAudioContext()
    // innerAudioContext.src="https://alioss.app-link.org/alucard263096/yngd/bgm_file/1884a18d36edb96866d20944dddfb3fb_19012910006.mp3"
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
      // wx.showToast({
      //   title: res.errMsg,
      // })
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
    console.log(that.Base.zimutimer);
    clearInterval(that.Base.zimutimer);
    clearInterval(that.data.timer)
    this.suspend();
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
    var isEnglish = this.Base.getMyData().isEnglish;
    var bookapi = new BookApi();

    //const myaudio = wx.createInnerAudioContext();

    bookapi.bookinfo({
      id: this.Base.options.id
    }, (bookinfo) => {
      //判断是否为英文诗
      var englishPattern = /^[A-Za-z]+$/;
      if (englishPattern.test(bookinfo.book_content[0])) {
        this.Base.setMyData({
          isEnglish: true
        })

        var book_content = bookinfo.book_content;

        var lines = book_content.split("\n");

        var count1 = 0;

        for (var i = 0; i < lines.length; i++) {
          var line = [];
          var resultArray = lines[i].split(/(\s|,)/g);
          var result = resultArray.map(item => item.trim());
          for (var j = 0; j < result.length; j++) {
            if (result[j] == "") {
              result[j] = " ";
            }
            line.push({
              num: count1++,
              c: result[j]
            });
          }
          lines[i] = line;
        }

        console.log(lines);

        this.Base.setMyData({
          bookinfo,
          lines: lines
        });
      } else {
        var datastr = bookinfo.book_content;
        var list = [];
        var count = 0;
        for (var i = 0; i < datastr.length; i++) {
          var pinyin = getContent.getPinyinChar(datastr[i]);
          var symbolPattern = /^[~`!@#$%^&*()\-_=+[\]{}|;:'",.<>/?\\！￥……（）——【】｛｝；：‘’“”，《。》、？]+$/; //去除符号
          if (symbolPattern.test(pinyin)) {
            pinyin = '';
          }
          var content = "a";
          if (datastr[i] != '\n') {
            content = datastr[i];
          }

          var jihe = {
            content: content,
            pinyin: pinyin,num:count++
          }
          // if(datastr[i]!='\n'){
          list.push(jihe);
          // }
        }
        this.getType(list);
        if (this.Base.getMyData().type == 2) { //添加换行
          var jihe={content:'',pinyin:''}
             list.splice(0, 0, jihe)
          var list = this.AddList(list);
        }
        this.Base.setMyData({
          bookinfo,
          contentList: list
        });
      }



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
  // 判断一行显示8个还是小于8个
  getType(list) {
    var contentlist = list;
    var num = 0;
    console.log(contentlist)
    for (var i = 0; i < contentlist.length; i++) {
      var symbolPattern = /^[~`!@#$%^&*()\-_=+[\]{}|;:'",.<>/?\\！￥……（）——【】｛｝；：‘’“”，《。》、？]+$/; //去除符号
      // if(symbolPattern.test(contentlist[i].content)){
      if (contentlist[i].content == '，' || contentlist[i].content == '。' || contentlist[i].content == '？' || contentlist[i].content == '！') {
      console.log(num)
      if (num >= 6) {
        //type==2的时候，一行显示8个
        this.Base.setMyData({
          type: 2
        })
        break;
      }

      this.Base.setMyData({
        typeNum: num + 1
      })
      num = 0;
    } else {
      if (contentlist[i].content != 'a') {
        num = num + 1;
      }

    }
  }
}
  //逗号的时候，换行
  AddList(list){
    
    for(var j=0;j<list.length;j++){
      if(list[j].content=='a'){
       var num=(j+1)%9;//要添加几个的空白数据
       if(num==1){//如果换行符处于一行的首个，就删除
         list.splice(j,1);
         if(list[j].content=='a'){
           list.splice(j,1);
         }
         var jihe={content:'',pinyin:''}
         list.splice(j, 0, jihe)
       }else{
         if(num!=0){
           for(var i=1;i<=(10-num);i++){
             var jihe={content:'',pinyin:''}
             list.splice(j + i, 0, jihe)
           }
         }else{
          var jihe={content:'',pinyin:''}
          list.splice(j+1, 0, jihe)
         }
       }
      
      }
    }
    
    return list;
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
    var isEnglish = that.Base.getMyData().isEnglish;
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
    this.Base.setMyData({
      scrollable: true
    })
    setTimeout(() => {
      this.startScroll();
    }, 3000);
    //开始录音
    var countDownNum = 0;
    //var now = dtime();
    var timer = this.Base.getMyData().timer;
    clearInterval(timer);
    that.setData({
      timer: setInterval(function () {
        countDownNum++;
        that.setData({
          countDownNum: dtime(countDownNum)
        })

      }, 1000)
    });
    that.Base.setMyData({
      zimucount: -1
    });
    that.Base.setMyData({
      "kkt": "vj"
    });

    recorderManager.onStart(() => {

    });

    //错误回调
    recorderManager.onError((res) => {
      console.log(res);
    })
    recorderManager.stop();
    that.tempFilePath = null;
    recorderManager.start({
      duration: 600000
    });
    console.log('录音开始')
    that.Base.setMyData({
      "kkt": "0"
    });
    var speed = Number(that.Base.getMyData().speed);
    that.Base.setMyData({
      "kkt": "01"
    });
    var memberinfo = that.Base.getMyData().memberinfo;

    //console.log(memberinfo.velocity / 1000+"打算离开")
    //return;
    that.Base.setMyData({
      "kkt": "1"
    });
    if (memberinfo.velocity == 0) {
      this.Base.setMyData({
        velocity: 3
      })
    } else {
      this.Base.setMyData({
        velocity: memberinfo.velocity
      })
    }
    that.Base.setMyData({
      "kkt": "2"
    });
    clearInterval(that.Base.zimutimer);
    that.Base.setMyData({
      zimucount: -1
    });

    that.Base.setMyData({
      "kkt": "3"
    });
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
    that.Base.setMyData({
      "kkt": "4"
    });

    that.Base.zimutimer = setInterval(() => {
      var zimucount = parseInt(that.Base.getMyData().zimucount);
      zimucount++;
      that.Base.setMyData({
        zimucount: zimucount
      });
    }, speed);

    that.Base.setMyData({
      "kkt": "5"
    });
  }

  startScroll() {

    var memberinfo = this.Base.getMyData().memberinfo;
    var velocity = memberinfo.velocity;

    var type = this.Base.getMyData().type;
    var list = this.Base.getMyData().contentList;
    var isEnglish = this.Base.getMyData().isEnglish;
    var duration = 0;

    if (type == 1) {
      if (velocity <= 3) {
        duration = (list.length / 6) * 1800; // 滚动持续时间（毫秒）
      }
      if (velocity == 4) {
        duration = (list.length / 9) * 1800; // 滚动持续时间（毫秒）
      }
      if (velocity == 5) {
        duration = (list.length / 11) * 1800; // 滚动持续时间（毫秒）
      }

      if (isEnglish) {
        var index = 0;
        var lines = this.Base.getMyData().lines;
        for (var i = 0; i < lines.length; i++) {
          index += lines[i].length;
        }
        if (velocity <= 3) {
          duration = (index / 4) * 2000; // 滚动持续时间（毫秒）
        }
        if (velocity == 4) {
          duration = (index / 7) * 2000; // 滚动持续时间（毫秒）
        }
        if (velocity == 5) {
          duration = (index / 12) * 2000; // 滚动持续时间（毫秒）
        }
      }
    } else {
      if (velocity <= 3) {
        duration = (list.length / 8) * 3000; // 滚动持续时间（毫秒）
      }
      if (velocity == 4) {
        duration = (list.length / 11) * 2200; // 滚动持续时间（毫秒）
      }
      if (velocity == 5) {
        duration = (list.length / 16) * 2000; // 滚动持续时间（毫秒）
      }

    }
    console.log(duration)
    var interval = 44; // 每次滚动的时间间隔（毫秒）
    if (isEnglish) {
      interval = 100; // 每次滚动的时间间隔（毫秒）
      if (velocity == 2) {
        interval = 44;
      }
    }
    const distance = 1; // 每次滚动的距离

    const query = wx.createSelectorQuery();
    query.select('#scrollView').boundingClientRect();
    query.select('#content').boundingClientRect();
    query.exec((res) => {
      const scrollViewRect = res[0];
      const contentRect = res[1];

      if (scrollViewRect && contentRect) {
        const maxScrollTop = contentRect.height - scrollViewRect.height;
        console.log(maxScrollTop)
        let scrollTop = 0;
        const startTime = Date.now();

        const scrollStep = () => {
          const currentTime = Date.now();
          const elapsedTime = currentTime - startTime;

          if (elapsedTime >= duration) {

            // 滚动到底部完成
            this.setData({
              scrollnum: maxScrollTop,
              scrollable: false
            });
          } else {
            const progress = elapsedTime / duration;
            const scrollDistance = Math.round(progress * maxScrollTop);
            scrollTop = Math.min(scrollDistance, maxScrollTop);

            this.setData({
              scrollnum: scrollTop
            });

            setTimeout(scrollStep, interval);
          }
        };

        scrollStep();
      }
    });

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
    var timer = this.Base.getMyData().timer;
    clearInterval(timer);
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

    clearInterval(that.Base.zimutimer);
    clearInterval(that.data.timer)
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
      success: function (res) {
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
          setTimeout(() => {
            that.tempFilePath = null;
          }, 1000);
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
      success: function (res) {
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
    console.log(innerAudioContext)
    // innerAudioContext.pause();
    console.log("暂停1")
    innerAudioContext.loop = true;
    innerAudioContext.obeyMuteSwitch = false;
    innerAudioContext.src = uploadpath + "bgm_file/" + src;
    setTimeout(() => {
      innerAudioContext.play(this.Base.setMyData({
        bg1: 1
      }));
    }, 200);

    this.Base.setMyData({
      music_name: name,
      open: 2
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
      success: function (res) {
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

            if (that.Base.options.type == "A") {
              api.addlangdu({
                again: "Y",
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
                    url: '/pages/endreading/endreading?id=' + book_id + '&retid=' + ret.return+'&time=' + time,
                  })

                  //that.onMyShow();
                } else {
                  that.Base.info(ret.result);
                }
              });
            } else(
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
body.getType = content.getType;
body.AddList = content.AddList;
body.startScroll = content.startScroll;
Page(body)