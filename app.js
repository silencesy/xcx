//app.js
const util = require('./utils/util.js');
App({
  onLaunch: function () {
    // 展示本地存储能力
    var that = this;
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log(res.code);
        util.request("post", util.api.login, { code: res.code}, function (res) {
          let isRegister = res.data.isRegister;
          let token = res.data.token;
          let unionid = res.data.unionid;
          let session_key = res.data.session_key;
          let openid = res.data.openid;
          /**
           * signOut  标识用户退出登录 那么小程序重新加载时就不用设置用户信息 只有登录的状态再次加载小程序才加载用户信息。
           * 如果第一次获取signOut失败 那说明用户是没有退出过登录就按照原来的流程走。
           * 
           */
          that.globalData.userInfo = res.data.userInfo;
          wx.getStorage({
            key: 'signOut',
            success(res) {
              console.log(res.data)
              if (res.data != 1) {
                wx.setStorage({
                  key: 'isRegister',
                  data: isRegister
                });
                wx.setStorage({
                  key: 'token',
                  data: token
                });
              }
            },
            fail() {
              if (isRegister == 1) {
                wx.setStorage({
                  key: 'isRegister',
                  data: isRegister
                });
                wx.setStorage({
                  key: 'token',
                  data: token
                });
              }
            }
          })
          // 失效
          // wx.setStorage({
          //   key: 'unionid',
          //   data: unionid
          // });
          wx.setStorage({
            key: 'session_key',
            data: session_key
          });
          wx.setStorage({
            key: 'openid',
            data: openid
          });
        },false);
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    addressId: null
  }
})