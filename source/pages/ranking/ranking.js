// pages/ranking/ranking.js
import { AppBase } from "../../appbase";
import { ApiConfig } from "../../apis/apiconfig";
import { InstApi } from "../../apis/inst.api.js";
import { BookApi } from "../../apis/book.api.js";
import { MemberApi } from '../../apis/member.api';

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);
    this.Base.setMyData({ctt:1})
    
  }
  onMyShow() {
    wx.showLoading({
      title: '加载中',
      mask: true
    })

    var that = this;
    var bookapi = new BookApi();
    var memberapi = new MemberApi();
    
    
    bookapi.booklist({ orderby: 'r_main.id desc'}, (monthlist) => {
      this.Base.setMyData({ monthlist });
    });
    bookapi.booklist({ orderby: 'r_main.id'}, (alllist) => {
      this.Base.setMyData({ alllist });
    });

    bookapi.readlist({ groupby:'r_main.member_id,r_main.read_date' }, (readlist) => {
      this.Base.setMyData({ readlist });
      var t_sum = 0;
      for (var i = 0; i < readlist.length; i++) {
        var t_num = readlist[i].wordnumber;
        t_sum += parseFloat(t_num);

        this.Base.setMyData({ t_sum });
      }
    });



    memberapi.getall({ }, (todaygetall) => {
      this.Base.setMyData({ todaygetall });
      
    });
    
    memberapi.getall({ orderby: 'r_main.id desc' }, (weekgetall) => {
      this.Base.setMyData({ weekgetall });
      wx.hideLoading(
      )
    });
    
  }
  
  bindwaitcompleted(e) {
    this.Base.setMyData({ ctt: 2 });
    this.onMyShow();
  }
  bindcontact(e) {
    this.Base.setMyData({ ctt: 1 });
    this.onMyShow();
  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.bindwaitcompleted = content.bindwaitcompleted;
body.bindcontact = content.bindcontact;
Page(body)