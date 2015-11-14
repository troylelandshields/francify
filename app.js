var els = document.getElementsByClassName("img-stuff")
for(var i=0; i<els.length; i++) {
  els[i].style.display = "none";
}

var multiplier = 10; 
  
Caman.Filter.register("francify", function () {
  var width = this.width;
  this.process("francifyProcess", function (rgba) {
    var currentX = rgba.locationXY().x;
    var currentSection = section(width, currentX);
    
    if(currentSection == 1) {
      rgba.b = rgba.b * multiplier;
      rgba.a = rgba.a / 1.5;
    }
    else if (currentSection == 2){
      rgba.b = rgba.b * 1.5;
      rgba.r = rgba.r * 1.5;
      rgba.g = rgba.g * 1.5;
      rgba.a = rgba.a / 1.5;
    }
    else {
      rgba.r = rgba.r * multiplier;
      rgba.a = rgba.a / 1.5;
    }
  });
});

function section(width, current) {
  if (current < (width / 3)) {
    return 1;
  }
  else if (current < (2 * (width / 3))) {
    return 2
  }
  else {
    return 3
  }
}

function loadImage() {
    var input, file, fr, img;

    if (typeof window.FileReader !== 'function') {
        write("The file API isn't supported on this browser yet.");
        return;
    }

    input = document.getElementById('file');
    if (!input) {
        write("Um, couldn't find the imgfile element.");
    }
    else {
        file = input.files[0];
        fr = new FileReader();
        fr.onload = createImage;
        fr.readAsDataURL(file);
    }

    function createImage() {
        img = new Image();
        img.onload = imageLoaded;
        img.src = fr.result;
    }

    function imageLoaded() {
        
        if(img.height > 1024 && img.height > img.width) {
          var factor = img.height / img.width;
          
          img.height = 1024;
          img.width = img.height / factor;
        }
        else if (img.width > 1024) {
          var factor = img.width / img.height;
          
          img.width = 1024;
          img.height = img.width / factor;
        }
        
        var canvas = document.getElementById("canvas")
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img,0,0, img.width, img.height);
        
        var els = document.getElementsByClassName("img-stuff")
        for(var i=0; i<els.length; i++) {
          els[i].style.display = "block";
        }
        document.getElementById("file-stuff").style.display = "none";
        
        
        load();
    }

    function write(msg) {
        var p = document.createElement('p');
        p.innerHTML = msg;
        document.body.appendChild(p);
    }
}

function save(){
  window.open(document.getElementById("canvas").toDataURL("image/jpg"));
}

function load(){
  var caman = Caman("#canvas", function () {
    this.francify()
    this.render();
  });
  
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  ctx.font = "11px";
  ctx.fillStyle = "white"
  ctx.textAlign = "right";
  ctx.fillText("bit.ly/francify", canvas.width - 2, canvas.height - 2);
  
  //caman.finishInit()
}
