// pages/subtitles/subtitles.js
import { AppBase } from "../../appbase";
import { ApiConfig } from "../../apis/apiconfig";
import { InstApi } from "../../apis/inst.api.js";
import { MemberApi } from '../../apis/member.api';

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
    var memberinfo = this.Base.getMyData().memberinfo;
    if (memberinfo.velocity==0){
      memberinfo.velocity=3;
    }
    
  }
  slider4change(e){
    var change = e.detail.value;
    var memberapi = new MemberApi();
    var memberinfo = this.Base.getMyData().memberinfo;
    this.Base.setMyData({
      change: e.detail.value
    })
    console.log(change);
    memberapi.addvelocity({ id: memberinfo.id, velocity: change}, (addvelocity) => {
      this.Base.setMyData({ addvelocity });
    });
  }
  switch1Change(e){
    var change = e.detail.value;
    console.log('携带值为', change)
    if(change==false){
      this.Base.setMyData({s:"N"})
    }else{
      this.Base.setMyData({ s: "Y" })
    }
    var s=this.Base.getMyData().s;
    //return;

    var memberapi = new MemberApi();
    var memberinfo = this.Base.getMyData().memberinfo;
    console.log(memberinfo.id);
    //return;
    memberapi.switch({ id: memberinfo.id, switch: s }, (sswitch) => {
      this.Base.setMyData({ sswitch });
    });
  }

}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow; 
body.slider4change = content.slider4change; 
body.switch1Change = content.switch1Change;
Page(body)