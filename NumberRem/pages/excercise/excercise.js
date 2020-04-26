var util = require('../../utils/util.js')

Page({
  data: {
    coverIsShow: false,
    currentNumbers: '',
    allNumbers: [],
    excTimes: 0,
    showState: '记住',
    currentPoint: 0,
    allPoint:0,//当前组得分
    allRightCount:0,//总正确个数
    inputNumbers:'',
    allExcPoint:0, //总分
  },
  onLoad: function() {
    var allNumbers = new Array();
    this.allNumbers = allNumbers;
    var times = 0;
    this.excTimes = times;
    this.allExcPoint = 0;
    this.currentPoint = 0;
    this.inputNumbers = '';
    this.allRightCount = 0;
  },
  onHide: function() {
    this.storageNum();
  },
  onShow: function() {
    console.log('on show called');
    var timestamp = util.formartDate(new Date());
    this.readStore(timestamp);
    // this.writeToFile(timestamp);
  },
  readStore: function(passdate) {
    // console.log(date);
    //读取缓存
    try {
      passdate = passdate.toString();
      console.log('passdate' + passdate);
      var content = wx.getStorageSync(passdate);
      // var point = wx.getStorageSync('allPoint');
      console.log('contet' + content);
      if (Object.keys(content).length != 0) {

        this.allNumbers = content;
        this.setData({
          coverIsShow: false,
          currentNumbers: '',
          allNumbers: this.allNumbers
        })
      } else {
        console.log('i am not right');
        this.setData({
          coverIsShow: false,
          currentNumbers: '',
          allNumbers: [],
          excTimes: 0,
          showState: '记住',
          currentPoint: 0
        })
      }
    } catch (e) {
      console.log('读取缓存错误');
    }
  },
  //存入缓存
  storageNum: function() {
    var timestamp = util.formartDate(new Date());

    timestamp = timestamp.toString();
    console.log('timestamp--' + timestamp);
    var currAllNumbers = this.allNumbers;
    try {
      wx.setStorageSync({timestamp:currAllNumbers});
      console.log('store success');
    } catch (e) {
      console.log('store fail');
    }
  },
  //写入文件
  writeToFile: function(currentDate) {
    wx.saveFile({
      tempFilePath: wx.env.USER_DATA_PATH + "/" + currentDate,
      success: function (res) {
        var savedFilePath = res.savedFilePath;
        console.log("write success");
        console.log(savedFilePath);
      }
    })
  },
  //读取文件
  readToFile: function (currentDate){
    wx.getSavedFileList({
      success: function (res) {
        console.log(res.fileList)
      }
    })
  },
  // 产生随机数
  produceNewNum: function() {
    this.excTimes = this.allNumbers.length;
    var lastStr = '';
    for (var i = 0; i < 30; i++) {
      var tempArr = new Array();
      var left = Math.floor(Math.random() * 100);
      var right = Math.floor(Math.random() * 100);
      tempArr.push(left < 10 ? '0' + left.toString() : left.toString());
      tempArr.push(right < 10 ? '0' + right.toString() : right.toString());
      var str = tempArr.join("");
      lastStr = lastStr + str + " ";

    }
    this.currentNumbers = lastStr;

    this.allNumbers.push({
      serial: this.excTimes,
      content: lastStr,
      status: "isInit"
    });
    console.log(this.allNumbers);

  },

  //生产新数字
  makeNum: function(e) {
    this.produceNewNum(),
      this.coverIsShow = e.currentTarget.dataset.show;
      var allNumCount = this.allNumbers.length;
      var basePoint = 100 / (allNumCount * 30);
      console.log('allRightCount--' + this.allRightCount);
      this.allExcPoint = basePoint.toFixed(2) * this.allRightCount;
      this.setData({
        coverIsShow: this.coverIsShow,
        currentNumbers: this.currentNumbers,
        excTimes: this.excTimes + 1,
        allNumbers: this.allNumbers,
        showState: '记住',
        allExcPoint: this.allExcPoint
      })
  },
  //隐藏当前数字显示
  hiddenBig: function(e) {
    this.coverIsShow = e.currentTarget.dataset.show,
      this.setData({
        coverIsShow: this.coverIsShow,
      })
  },
  //显示历史数据
  showHistory: function(e) {
    var idx = e.currentTarget.dataset.idx;
    this.coverIsShow = e.currentTarget.dataset.show;
    var conDict = this.allNumbers[idx];
    var state = '记住';
    if (conDict['status'] == 'isFinished') {
      state = '提交';
    } else if (conDict['status'] == 'isJudged') {
      state = '';
      this.currentPoint = conDict['allPoint'];
      this.inputNumbers = conDict['input']
    }
    var currentNumbers = conDict['content'];
    this.setData({
      coverIsShow: this.coverIsShow,
      currentNumbers: currentNumbers,
      excTimes: idx + 1,
      showState: state,
      currentPoint: this.currentPoint,
      inputNumbers:this.inputNumbers
    })
  },
  //点击记忆完成
  remember: function(e) {
    var idx = e.currentTarget.dataset.idx;
    var status = e.currentTarget.dataset.status;
    var tempDic = this.allNumbers[idx];
    tempDic["status"] = status;

    this.allNumbers[idx] = tempDic;
    this.setData({
      allNumbers: this.allNumbers,
      coverIsShow: this.coverIsShow

    })

  },
  //提交
  submit: function(e) {
    var idx = e.currentTarget.dataset.idx;
    var status = e.currentTarget.dataset.status;
    var tempDic = this.allNumbers[idx];
    tempDic["status"] = status;
    this.allNumbers[idx] = tempDic;
    this.coverIsShow = false;
    this.setData({
      allNumbers: this.allNumbers,
      coverIsShow: this.coverIsShow
    })

  },
  //打分
  judge: function(idx) {
    var tempDic = this.allNumbers[idx];
    var inputStr = tempDic["input"];
    var originStr = tempDic["content"];
    var originArr = originStr.split(" ");
    var inputArr = inputStr.split("-");
    var lastCount = 0;
    console.log(inputArr);
    for (var i = 0; i < inputArr.length; i++) {
      if (inputArr[i] == originArr[i]) {
        lastCount += 1;
      }
    }
    tempDic["allPoint"] = lastCount;
    this.allNumbers[idx] = tempDic;
    this.allRightCount += lastCount;
  },
  //输入框
  input: function(e) {
    var idx = e.currentTarget.dataset.idx;
    var conDict = this.allNumbers[idx];
    var inputStr = e.detail.value;
    conDict['input'] = e.detail.value;
    this.judge(idx);
    var currentPo = conDict["allPoint"];
    var allNumCount = this.allNumbers.length;
    var basePoint = 100 / (allNumCount * 30);
    console.log('base' + basePoint.toFixed(2));
    var newPo = basePoint.toFixed(2) * currentPo;
    this.allExcPoint += newPo;
    this.allNumbers[idx] = conDict;
    this.setData({
      allNumbers: this.allNumbers,
      allExcPoint:this.allExcPoint
    });
    console.log(this.allNumbers);
    console.log(this.allExcPoint);
  },
  //显示日期
  bindDateChange: function(e) {
    this.writeToFile(e.detail.value);
    this.readStore(e.detail.value);
    var timestamp = util.formartDate(new Date());
    if (timestamp == e.detail.value) {

    } else {

    }
    this.setData({
      date: e.detail.value
    })
  },
})
