/*
math.config({
            number: 'BigNumber', // Default type of number: 
            // 'number' (default), 'BigNumber', or 'Fraction'
            precision: 128        // Number of significant digits for BigNumbers
        })
*/
var N_workers = parseFloat(document.getElementById("N_work").value);
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
M=[];
M1=[]
M2=[]
M3=[]
M4=[]
M5=[]
M6=[]
M7=[]
M8=[]
M9=[]
M10=[]
M11=[]
M12=[]
M13=[]
M14=[]
M15=[]
M16=[]

var worker = [worker1,worker2,worker3,worker4,worker5,worker6,worker7,worker8];
var M_array =[M1,M2,M3,M4,M5,M6,M7,M8];
function createWorkers() {
  N_workers = parseFloat(document.getElementById("N_work").value);

for (var i = 0; i<N_workers;i++){

worker[i]=new Worker("mandel_worker.js");
worker[i].onmessage = receivedWorkerMessage;
}
}

window.onresize = function(){ location.reload(); }
var N =  parseFloat(document.getElementById("value_N").value);
var N1 ;
var N2 ;

var max_iter=  parseFloat(document.getElementById("Max_Iter").value);

var back_bool = 0;
var total_time = 0;
document.getElementById('myX0').innerHTML = X0;

var R = 2;
var R2 = R**2;
var X0_vec=[];
var Y0_vec=[];
var side_vec=[];
var pos_vec = -1;

var X0 = -.5
var Y0 = 0
var side = 3


var N_rep = parseFloat(document.getElementById("N_rep").value);
 var M =[]; ;
var M1;
var M2;
var start_stop = document.getElementById("start_stop");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d", { willReadFrequently: true });
const canvas2 = document.getElementById("canvas2");
const ctx2 = canvas2.getContext("2d", { willReadFrequently: true });
var imgData = ctx.createImageData(N, N);


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

  colormap = document.getElementById("colormap").value;
  document.getElementById('myX0').innerHTML = X0;
  document.getElementById('myY0').innerHTML = Y0;
  document.getElementById('mySide').innerHTML = side;
  N =  parseFloat(document.getElementById("value_N").value);
  max_iter=  parseFloat(document.getElementById("Max_Iter").value);


 if (N_workers == 0){

  var L=[];
  const   delta = side/N
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      var c = new Complex(X0-side/2.+delta*j,(Y0+side/2.-delta*i))
      var h = 0
      z = new Complex(0,0)

      while (h<max_iter && (z.real * z.real + z.imaginary * z.imaginary)<R2) {
        var z1 = z.real**2-z.imaginary**2+c.real
        var z2 = 2*z.real*z.imaginary+ c.imaginary
        z = new Complex(z1,z2)
        h += 1;           
      }
      L.push(h)
    } 
  }
  M = L;
 draw();
 }
 else { 
M=[];

for (var w = 0; w<N_workers;w++){

M_array[w]=[];
worker[w].postMessage(
   { X0: X0,
     Y0: Y0,
     side: side,
     max_iter: max_iter,
     N: N,
    N1:Math.round(N/N_workers)*w,
    N2: Math.round(N/N_workers)*(w+1)}
  );
worker[w].onmessage = receivedWorkerMessage;
}
}
  if (back_bool == 0){
    X0_vec.push(X0);
    Y0_vec.push(Y0);
    side_vec.push(side);
    pos_vec += 1;
  } else {
    back_bool = 0;
  }
}

let canvasElem = document.querySelector("canvas");
canvasElem.addEventListener("mousedown", function(e){
  getMousePosition(canvasElem, e);
});

function coordinate(event) {
  var x=event.clientX;
  var y=event.clientY;
  document.getElementById("X").value=x;
  document.getElementById("Y").value=y;
}










/* window.onresize = function(event) {
        applyOrientation();
    }
*/

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


function start(){

  if (N_workers >0){createWorkers();}
  X0=-.5;Y0=0;side=3;
 

  X0_vec=[];
  Y0_vec=[];
  side_vec=[];
  pos_vec =-1;
  back_bool = 0;
  mandelbrot();
  //draw();
  plot_colormap();
}

function back(){
  if (pos_vec >0){
    back_bool =1;
    pos_vec -= 1;
    X0 = X0_vec[pos_vec];
    Y0 = Y0_vec[pos_vec];
    side = side_vec[pos_vec];
    X0_vec.pop();
    Y0_vec.pop();
    side_vec.pop();
    mandelbrot();
    //draw();
 
  }
}

function getMousePosition(canvas, event) {
  let rect = canvas.getBoundingClientRect();
  let x = event.clientX - rect.left+8;
  let y = event.clientY - rect.top +16;
  X0 = X0-side/2+side*(x/canvas.width)
  Y0 = Y0+side/2-side*(y/canvas.height)
  side = side /10
  mandelbrot();
  //draw();
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
      var myrgb = evaluate_cmap(value, colormap, false);
      ctx2.fillStyle  = 'rgb(' + myrgb + ')';
      ctx2.fillRect( ((k*N_colormap +j)*canvas2.width/N_colormap/N_rep), 0, (canvas2.width/N_colormap/N_rep),canvas2.height);
    }
  }
}

function draw() {  

  colormap = document.getElementById("colormap").value;
  N_rep = parseFloat(document.getElementById("N_rep").value);

  for (var i = 0; i < 4*N**2; i += 4) {

  var value = (M[Math.round(i/4)]%(Math.round(max_iter/N_rep)))/Math.round(max_iter/N_rep);
  if (value > 1) value = 1;
  var myrgb = evaluate_cmap(value, colormap, false);
  imgData.data[i + 0] = myrgb[0];
  imgData.data[i + 1] = myrgb[1];
  imgData.data[i + 2] = myrgb[2];
  imgData.data[i + 3] = 255;
}

ctx.putImageData(imgData, 0,0);


  plot_colormap()
}


function receivedWorkerMessage(event) {
  // Get the prime number list.
 N1= event.data.N1 ;
 N2 = event.data.N2;
 var w = Math.round(N1/Math.round(N/N_workers));
 M_array[w]= event.data.DATA;
 var points = 0;
 for (var i = 0; i < N_workers;i++){
   points += M_array[i].length;
   console.log["worker "+ w + " points = " + points];
   }
   if (points == N**2){

    for (var i = 0; i<N_workers;i++){
   M = M.concat(M_array[i]);
   }
   draw();
   } 
}
