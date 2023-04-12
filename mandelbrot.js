/*
math.config({
            number: 'BigNumber', // Default type of number: 
            // 'number' (default), 'BigNumber', or 'Fraction'
            precision: 128        // Number of significant digits for BigNumbers
        })
*/


window.onresize = function(){ location.reload(); }
var N=  parseFloat(document.getElementById("value_N").value);
var max_iter=  parseFloat(document.getElementById("Max_Iter").value);
var back_bool = 0;
var total_time = 0;
document.getElementById('myX0').innerHTML = X0;
M_old =[];
var R = 2
var X0_vec=[];
var Y0_vec=[];
var side_vec=[];
var pos_vec = -1;
max_iter = 800
var X0 = -.5
var Y0 = 0
var side = 3

var N_rep = parseFloat(document.getElementById("N_rep").value);

var start_stop = document.getElementById("start_stop");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d", { willReadFrequently: true });
const canvas2 = document.getElementById("canvas2");
const ctx2 = canvas2.getContext("2d", { willReadFrequently: true });



var x_left,y_top,delta_x,delta_y;
var start_stop = document.getElementById("start_stop");
const zeros = (m, n) => [...Array(m)].map(e => Array(n).fill(0));


start();

function Complex(real, imaginary) {
  this.real = 0;
  this.imaginary = 0;
  this.real = (typeof real === 'undefined') ? this.real : parseFloat(real);
  this.imaginary = (typeof imaginary === 'undefined') ? this.imaginary : parseFloat(imaginary);
}



var z = new Complex(0, 0)  

function plot_mandelbrot(){ 
  mandelbrot();
  draw();
}


 
function mandelbrot(){
  document.getElementById('myX0').innerHTML = X0;
  document.getElementById('myY0').innerHTML = Y0;
  document.getElementById('mySide').innerHTML = side;
  N=  parseFloat(document.getElementById("value_N").value);
  max_iter=  parseFloat(document.getElementById("Max_Iter").value);
  M=zeros(N,N)
  const   delta = side/N
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      var c = new Complex(X0-side/2.+delta*i,(Y0+side/2.-delta*j))
      var h = 0
      z = new Complex(0,0)
      while (h<max_iter && Math.sqrt(z.real * z.real + z.imaginary * z.imaginary)<R) {
        var z1 = z.real**2-z.imaginary**2+c.real
        var z2 = 2*z.real*z.imaginary+ c.imaginary
        z = new Complex(z1,z2)
        h += 1             
      }
    M[i][j]=h
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

function draw(){    
  colormap = document.getElementById("colormap").value;
  N_rep = parseFloat(document.getElementById("N_rep").value);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  var delta_x_pos = (canvas.width)/N;
  var delta_y_pos = canvas.height/N;
  for (var i = 0; i < N; i++) {
    var x_pos =  Math.round(delta_x_pos*i);
    for (var j = 0; j < N; j++) {
      var value = (M[i][j]%(Math.round(max_iter/N_rep)))/Math.round(max_iter/N_rep);
      if (value > 1) value = 1;
      var myrgb = evaluate_cmap(value, colormap, false);
      ctx.fillStyle  = 'rgb(' + myrgb + ')';
      var y_pos =   Math.round(delta_y_pos*j);
      ctx.beginPath();
      ctx.rect(x_pos, y_pos, x_pos+delta_x_pos, y_pos+delta_y_pos);
      ctx.fill();
    }
  }
  plot_colormap()
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

function getMousePosition(canvas, event) {
  let rect = canvas.getBoundingClientRect();
  let x = event.clientX - rect.left+8;
  let y = event.clientY - rect.top +16;
  X0 = X0-side/2+side*(x/canvas.width)
  Y0 = Y0+side/2-side*(y/canvas.height)
  side = side /10
  mandelbrot();
  draw();

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
    draw();
  }
}

function start(){
  X0=-.5;Y0=0;side=3;L=800
  X0_vec=[];
  Y0_vec=[];
  side_vec=[];
  pos_vec =-1;
  back_bool = 0;
  mandelbrot(X0,Y0,side,max_iter);
  draw();
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
