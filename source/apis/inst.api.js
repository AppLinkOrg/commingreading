/*******使用方法，下面两句复制到page的js文件的头部

import { ApiConfig } from '../../apis/apiconfig';
import { InstApi } from '../../apis/inst.api';

var instApi=new InstApi();
*******/
import { ApiConfig } from 'apiconfig';
export class InstApi{


    indexbanner(json, callback, showLoading = true) {

        if (showLoading)
            ApiConfig.ShowLoading();

        var header = ApiConfig.GetHeader();
        console.log(header);
        console.log(json);
        wx.request({
            url: ApiConfig.GetApiUrl() + 'inst/indexbanner',
            data: json,
            method: 'POST',
            dataType: 'json',
            header: header,
            success: function (res) {
                if (callback != null) {
                    callback(res.data);
                }
            },
            fail: function (res) {
                console.log(res);
                callback(false);
            },
            complete: function (res) {
                console.log(res);
            
                if (showLoading)
                    ApiConfig.CloseLoading();
            }
        })
    }

    info(json, callback, showLoading = true) {

        if (showLoading)
            ApiConfig.ShowLoading();

        var header = ApiConfig.GetHeader();
        console.log(header);
        console.log(json);
        wx.request({
            url: ApiConfig.GetApiUrl() + 'inst/info',
            data: json,
            method: 'POST',
            dataType: 'json',
            header: header,
            success: function (res) {
                if (callback != null) {
                    callback(res.data);
                }
            },
            fail: function (res) {
                console.log(res);
                callback(false);
            },
            complete: function (res) {
                console.log(res);
            
                if (showLoading)
                    ApiConfig.CloseLoading();
            }
        })
    }

    qwe(json, callback, showLoading = true) {

        if (showLoading)
            ApiConfig.ShowLoading();

        var header = ApiConfig.GetHeader();
        console.log(header);
        console.log(json);
        wx.request({
            url: ApiConfig.GetApiUrl() + 'inst/qwe',
            data: json,
            method: 'POST',
            dataType: 'json',
            header: header,
            success: function (res) {
                if (callback != null) {
                    callback(res.data);
                }
            },
            fail: function (res) {
                console.log(res);
                callback(false);
            },
            complete: function (res) {
                console.log(res);
            
                if (showLoading)
                    ApiConfig.CloseLoading();
            }
        })
    }

    resources(json, callback, showLoading = true) {

        if (showLoading)
            ApiConfig.ShowLoading();

        var header = ApiConfig.GetHeader();
        console.log(header);
        console.log(json);
        wx.request({
            url: ApiConfig.GetApiUrl() + 'inst/resources',
            data: json,
            method: 'POST',
            dataType: 'json',
            header: header,
            success: function (res) {
                if (callback != null) {
                    callback(res.data);
                }
            },
            fail: function (res) {
                console.log(res);
                callback(false);
            },
            complete: function (res) {
                console.log(res);
            
                if (showLoading)
                    ApiConfig.CloseLoading();
            }
        })
    }

    getactivitylist(json, callback, showLoading = true) {

      if (showLoading)
          ApiConfig.ShowLoading();

      var header = ApiConfig.GetHeader();
      console.log(header);
      console.log(json);
      wx.request({
          url: ApiConfig.GetApiUrl() + 'inst/getactivitylist',
          data: json,
          method: 'POST',
          dataType: 'json',
          header: header,
          success: function (res) {
              if (callback != null) {
                  callback(res.data);
              }
          },
          fail: function (res) {
              console.log(res);
              callback(false);
          },
          complete: function (res) {
              console.log(res);
          
              if (showLoading)
                  ApiConfig.CloseLoading();
          }
      })
  }

  getactivitydetail(json, callback, showLoading = true) {

    if (showLoading)
        ApiConfig.ShowLoading();

    var header = ApiConfig.GetHeader();
    console.log(header);
    console.log(json);
    wx.request({
        url: ApiConfig.GetApiUrl() + 'inst/getactivitydetail',
        data: json,
        method: 'POST',
        dataType: 'json',
        header: header,
        success: function (res) {
            if (callback != null) {
                callback(res.data);
            }
        },
        fail: function (res) {
            console.log(res);
            callback(false);
        },
        complete: function (res) {
            console.log(res);
        
            if (showLoading)
                ApiConfig.CloseLoading();
        }
    })
}

applicationpd(json, callback, showLoading = true) {

  if (showLoading)
      ApiConfig.ShowLoading();

  var header = ApiConfig.GetHeader();
  console.log(header);
  console.log(json);
  wx.request({
      url: ApiConfig.GetApiUrl() + 'inst/applicationpd',
      data: json,
      method: 'POST',
      dataType: 'json',
      header: header,
      success: function (res) {
          if (callback != null) {
              callback(res.data);
          }
      },
      fail: function (res) {
          console.log(res);
          callback(false);
      },
      complete: function (res) {
          console.log(res);
      
          if (showLoading)
              ApiConfig.CloseLoading();
      }
  })
}
}
