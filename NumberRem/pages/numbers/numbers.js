//logs.js


Page({
  data: {
    pics: [],
    
    buttonStatus:0,
    coverIsShow:false,
    coverSrc:''
  },
  onLoad: function () {

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
    this.pics = tempPics;
    this.setData({
      pics:this.pics
    })
  },
  changeLayout:function(e) {

    switch (e.currentTarget.dataset.style) {
      case 0:{

        this.buttonStatus = 1;
        this.setData({

          buttonStatus:this.buttonStatus,
        })
      }
        break;
      case 1:{

        this.buttonStatus = 2;
        this.setData({

          buttonStatus:this.buttonStatus,
        })
      }
          break;
      case 2:{

            this.buttonStatus = 0;
            this.setData({

              buttonStatus:this.buttonStatus,
            })
          }
              break;
      default:

    }
  },
  showBig: function (e) {

    this.coverIsShow = e.currentTarget.dataset.show,
    this.coverSrc = e.currentTarget.dataset.content,
    this.setData({
      coverIsShow:this.coverIsShow,
      coverSrc:this.coverSrc,
    })
  },
  hiddenBig:function (e) {
    this.coverIsShow = e.currentTarget.dataset.show,
    console.log(e);
    this.setData({
      coverIsShow:this.coverIsShow,
    })
  }
})
