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
    //options.id=5;
    super.onLoad(options);
    this.Base.setMyData({  })
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

}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow; 
body.begin = content.begin; 
body.submit = content.submit;
body.cutmusic = content.cutmusic;
Page(body)