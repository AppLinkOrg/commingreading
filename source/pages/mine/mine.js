// pages/mine/mine.js
import { AppBase } from "../../appbase";
import { ApiConfig } from "../../apis/apiconfig";
import { InstApi } from "../../apis/inst.api.js";
import { BookApi } from "../../apis/book.api.js";
import { ApiUtil } from "../../apis/apiutil.js";

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
    var memberinfo = this.Base.getMyData().memberinfo;
    
    
    bookapi.readlist({ member_id: memberinfo.id, }, (readlist) => {
      this.Base.setMyData({ readlist });
      var sum = 0;
      
      for (var i = 0; i < readlist.length; i++) {
        var num=readlist[i].wordnumber;
        sum += parseFloat(num);
        this.Base.setMyData({ sum });
      }
    });



    bookapi.readlist({ member_id:memberinfo.id,groupby: 'r_main.member_id,r_main.read_date' }, (readlist) => {
      this.Base.setMyData({ readlist });
      var t_sum = 0;
      for (var i = 0; i < readlist.length; i++) {
        var t_num = readlist[i].wordnumber;
        t_sum += parseFloat(t_num);

        this.Base.setMyData({ t_sum });
      }
    });

    bookapi.readlist({ member_id: memberinfo.id, }, (list) => {
      this.Base.setMyData({ list });
      
    });

  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
Page(body)