// pages/mine/mine.js
import { AppBase } from "../../appbase";
import { ApiConfig } from "../../apis/apiconfig";
import { InstApi } from "../../apis/inst.api.js";
import { BookApi } from "../../apis/book.api.js";
import { ApiUtil } from "../../apis/apiutil.js";
import { MemberApi } from "../../apis/member.api.js";

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);
  }
  onMyShow() {
    var that = this;
    var bookapi = new BookApi();
    var memberapi = new MemberApi();

    var memberinfo = this.Base.getMyData().memberinfo;
    

    memberapi.info({ }, (info) => {
      this.Base.setMyData({ info });
      console.log(info.zishu+"MKMKMKMKMK");
      if (info.zishu>10000){
        this.Base.setMyData({ todaynum: (info.zishu / 10000).toFixed(1) + '万' })
      }
      else{
        this.Base.setMyData({ todaynum: info.zishu })
      }
      if (info.zongzishu>10000){
        this.Base.setMyData({ allnum: (info.zongzishu/10000).toFixed(1) + '万' })
      }
      else{
        this.Base.setMyData({ allnum: info.zongzishu })
        //this.Base.setMyData({ allnum: ((info.zongzishu / 10000) + 100).toFixed(1) + '万' })
      }
    });

    bookapi.readlist({ member_id: memberinfo.id, tiaojian: "Y" }, (list) => {
      this.Base.setMyData({ list });
      
    });

    bookapi.rdlist({ member_id: memberinfo.id}, (rdlist) => {
      this.Base.setMyData({ rdlist });

    });

  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
Page(body)