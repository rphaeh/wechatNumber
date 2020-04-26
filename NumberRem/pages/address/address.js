
Page({
  data:{
    warpArr:[]
  },
  onLoad:function() {

    var tempPics = [];
    for(var i=0;i<100;i++){
      var name ="",title;
      if (i<10) {
        name += "../../images/0" + i + ".jpg";
        title = "0" + i;
      }else {
        name += "../../images/" + i + ".jpg";
        title = "" + i;
      }
      // var dic = [image:name,title:i];
      tempPics[tempPics.length] = {image:name,title:title} ;
    }
    this.warpArr = tempPics;
    this.setData({
      warpArr:this.warpArr
    })
  }
})
