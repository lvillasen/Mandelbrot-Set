/*
math.config({
            number: 'BigNumber', // Default type of number: 
            // 'number' (default), 'BigNumber', or 'Fraction'
            precision: 128        // Number of significant digits for BigNumbers
        })
*/
var N_workers = parseFloat(document.getElementById("N_work").value);

M=[];
M_tot =[];

var worker1 =0 ;
var worker2 = 0;
var worker3 = 0;
var worker4 = 0;
var worker5 = 0;
var worker6 = 0;
var worker7 = 0;
var worker8 = 0;
var worker9 =0 ;
var worker10 = 0;
var worker11 = 0;
var worker12 = 0;
var worker13 = 0;
var worker14 = 0;
var worker15 = 0;
var worker16 = 0;

var worker = [worker1,worker2,worker3,worker4,worker5,worker6,worker7,worker8,worker9,worker10,worker11,worker12,worker13,worker14,worker15,worker16];
var M_array =[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]];
function createWorkers() {
  N_workers = parseFloat(document.getElementById("N_work").value);

for (var i = 0; i<N_workers;i++){

worker[i]=new Worker("mandel_worker.js");
worker[i].onmessage = receivedWorkerMessage;
}
}

window.onresize = function(){ 

//start();

  location.reload(); }
var N ;
var N1 ;
var N2 ;
var R = 2;
var R2 = R**2;


var N_rep = parseFloat(document.getElementById("N_rep").value);
 var M =[]; ;

var reset = document.getElementById("reset");
var canvas = document.getElementsByTagName('canvas')[0];


const ctx = canvas.getContext("2d", { willReadFrequently: true });
const canvas2 = document.getElementById("canvas2");
const ctx2 = canvas2.getContext("2d", { willReadFrequently: true });
var rect = canvas.getBoundingClientRect();

var Nx = Math.round(rect.width)
var Ny = Math.round(rect.height)

canvas.width  = Nx;
canvas.height = Ny;

console.log(Nx+ " "+ Ny)
console.log(canvas.width+ " "+ canvas.height)

var imgData = ctx.createImageData(Nx, Ny);
start();

function Complex(real, imaginary) {
  this.real = 0;
  this.imaginary = 0;
  this.real = (typeof real === 'undefined') ? this.real : parseFloat(real);
  this.imaginary = (typeof imaginary === 'undefined') ? this.imaginary : parseFloat(imaginary);
}



var z = new Complex(0, 0)  



 
function mandelbrot(){
  N_workers = parseFloat(document.getElementById("N_work").value);
  document.getElementById('myX0').innerHTML = X0;
  document.getElementById('myY0').innerHTML = Y0;
  document.getElementById('mySideX').innerHTML = sideX;

  max_iter=  parseFloat(document.getElementById("Max_Iter").value);
max_iter += 45;
document.getElementById("Max_Iter").value = max_iter;

const   deltaX = sideX/Nx
  const   deltaY = sideY/Ny

 if (N_workers == 0){

 M_tot =[];
for (N1=0; N1<Ny; N1 +=100){
  M=[];
  N2 = N1 + 100;
  if (N2>Ny){N2=Ny}
    for (let j = N1; j < N2; j++) {
      for (let i = 0; i < Nx; i++) {
      var c = new Complex(X0-sideX/2.+deltaX*i,(Y0+sideY/2.-deltaY*j))
      var h = 0
      z = new Complex(0,0)

      while (h<max_iter && (z.real * z.real + z.imaginary * z.imaginary)<R2) {
        var z1 = z.real**2-z.imaginary**2+c.real
        var z2 = 2*z.real*z.imaginary+ c.imaginary
        z = new Complex(z1,z2)
        h += 1;           
      }
      M.push(h)
    } 
  }
  M_tot = M_tot.concat(M);
  console.log("M_tot size = "+M_tot.length)
 draw(N1,N2,M);
}
 }
 else { 
M=[];
var deltaNy = Math.round(Ny/N_workers);
for (var w = 0; w<N_workers;w++){
N1 = deltaNy*w;
N2 = deltaNy*(w+1);
if (w == N_workers-1){ N2 = Ny}
M_array[w]=[];
worker[w].postMessage(
   { X0: X0,
     Y0: Y0,
     sideX: sideX,
     sideY: sideY,
     max_iter: max_iter,
     Nx: Nx,
     Ny: Ny,
    N1:N1,
    N2: N2});
console.log("postMessage sent "+ X0 + " " +Y0+" "+sideX+ " "+sideY+ " "+ max_iter+" "+ Nx+" "+Ny+" "+N1+" "+N2)
worker[w].onmessage = receivedWorkerMessage;
}
}
  
}

let canvasElem = document.querySelector("canvas");
canvasElem.addEventListener("mousedown", function(e){
  getMousePosition(canvasElem, e);
});

/* window.onresize = function(event) {
        applyOrientation();
    }
*/
/*
function applyOrientation() {
  if (window.innerHeight > window.innerWidth) {
      //alert("You are now in portrait");
      canvas.width = window.innerWidth;
      //canvas.height = (window.innerHeight);
      canvas.height = canvas.width*400/700;
  } else {
      //alert("You are now in landscape");
      canvas.width = window.innerWidth;
      canvas.height = (window.innerHeight);
  }
}
*/

function start(){
  
  var my_element = document.getElementById("my_element");
max_iter=  parseFloat(document.getElementById("Max_Iter").value);
    my_element.scrollIntoView({
  behavior: "smooth",
  block: "start",
  inline: "nearest"
});

  rect = canvas.getBoundingClientRect();

var Nx = Math.round(rect.width)
var Ny = Math.round(rect.height)
console.log(Nx+ " "+ Ny)

  if (N_workers >0){createWorkers();}
  X0=-.5;Y0=0;

  sideX=5
  sideY = sideX*Ny/Nx
 document.getElementById('myX0').innerHTML = X0;
  document.getElementById('myY0').innerHTML = Y0;
  document.getElementById('mySideX').innerHTML = sideX;
    //document.getElementById('mySideY').innerHTML = sideY;
  
  document.getElementById("Max_Iter").value = '200';
  mandelbrot();
  plot_colormap();
}



function getMousePosition(canvas, event) {
  let rect = canvas.getBoundingClientRect();
  let x = event.clientX - rect.left;
  let y = event.clientY - rect.top ;
  X0 = X0-sideX/2+sideX*(x/rect.width)
  Y0 = Y0+sideY/2-sideY*(y/(rect.height))
  
  sideX = sideX /10
  sideY = sideY /10
  console.log("x y width heigth "+x +" " +y+" " +rect.width+ " "+ rect.height)
  mandelbrot();
}


function plot_colormap() {
  var N_colormap = 100;
  colormap = document.getElementById("colormap").value;
  N_rep = parseFloat(document.getElementById("N_rep").value);
  ctx.beginPath();
  for (let k=0;k<N_rep;k++){
    for (let j=0; j<N_colormap; j++) {
      var value = value = j/N_colormap;
      if (value > 1) value = 1;
      if (colormap === "custom"){myrgb=[0,0,0];}
      else{
      var myrgb = evaluate_cmap(value, colormap, false);
    }
      ctx2.fillStyle  = 'rgb(' + myrgb + ')';
      ctx2.fillRect( ((k*N_colormap +j)*canvas2.width/N_colormap/N_rep), 0, (canvas2.width/N_colormap/N_rep),canvas2.height);
    }
  }
}

function draw(N1,N2,M) { 
var imgData = ctx.createImageData(Nx, N2-N1); 
Nx = Math.round(rect.width)
var Ny = Math.round(rect.height)
console.log(Nx+ " "+ Ny)
max_iter=  parseFloat(document.getElementById("Max_Iter").value);
console.log("size of ImageData "+ imgData.data.length)

colormap = document.getElementById("colormap").value;
  N_rep = parseFloat(document.getElementById("N_rep").value);
var pixel = 0;
  for (let j = N1; j < N2; j++) {
      for (let i = 0; i < Nx; i++) {

if (colormap === "custom"){
  
var factor = Math.round(max_iter/160);
  var value = M[Math.round(pixel/4)]%(Math.round(max_iter/10));
  if (value < 1*factor){ myrgb = [66 , 30,  15 ];}
  else if (value < 2*factor){ myrgb = [25 , 7  ,26 ];}
  else if (value < 3*factor) {myrgb = [9  , 1  ,47 ];}
  else if (value < 4*factor) {myrgb = [4   ,4  ,73 ];}
  else if (value < 5*factor) {myrgb = [ 0   ,7 ,100 ];}
  else if (value < 6*factor){ myrgb = [12  ,44 ,138 ];}
  else if (value < 7*factor){ myrgb = [24 , 82 ,177  ];}
  else if (value < 8*factor) {myrgb = [57 ,125 ,209  ];}
  else if (value < 9*factor) {myrgb = [134 ,181, 229 ];}
  else if (value < 10*factor) {myrgb = [211 ,236 ,248 ];}
  else if (value < 11*factor) {myrgb = [241 ,233 ,191 ];}
  else if (value < 12*factor) {myrgb = [248 ,201  ,95 ];}
  else if (value < 13*factor) {myrgb = [255 ,170   ,0 ];}
  else if (value < 14*factor) {myrgb = [204 ,128   ,0 ];}
  else if (value < 15*factor) {myrgb = [153  ,87   ,0 ];}
    else if (value <16*factor) {myrgb = [106 , 52  , 3 ];}

  else{myrgb = [57 ,125 ,209  ];}
} else {


  var value = (M[Math.round(pixel/4)]%(Math.round(max_iter/N_rep)))/Math.round(max_iter/N_rep);
  if (value > 1) value = 1;
  var myrgb = evaluate_cmap(value, colormap, false);

}

  imgData.data[pixel++] = myrgb[0];
  imgData.data[pixel++] = myrgb[1];
  imgData.data[pixel++] = myrgb[2];
  imgData.data[pixel++] = 255;
}
}
ctx.putImageData(imgData, 0,N1);

  plot_colormap()

if (colormap === "custom"){
  
  document.getElementById("N_rep").style.backgroundColor = 'rgb(' + 0 + ',' + 0+ ',' + 0 + ')';
} else{
  document.getElementById("N_rep").style.backgroundColor = 'rgb(' + 255 + ',' + 255+ ',' + 255 + ')';
}

}


function receivedWorkerMessage(event) {
 N1= event.data.N1 ;
 N2 = event.data.N2;
 console.log("worker received ...... N1 = "+ N1 + " N2 = "+N2)
 var w = Math.round(N1/Math.round(Ny/N_workers));
 M_array[w]= event.data.DATA;
 M = M_array[w];
console.log("worker received ...... M.length = "+w+" " +M_array[w].length);
draw(N1,N2,M);

var points = 0;
 M_tot =[];
 for (var i = 0; i < N_workers;i++){
   points += M_array[i].length;
   //console.log["worker "+ i + " points = " + points];

   if (points == Nx*Ny){

    for (var j = 0; j<N_workers;j++){
   M_tot = M_tot.concat(M_array[j]);
   
   }
   
   } 

}

}

function redraw(){
console.log("M_tot size in redraw = "+M_tot.length)
draw(0,Ny,M_tot);
}
