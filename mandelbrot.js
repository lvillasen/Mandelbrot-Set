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
var palette =  ["#B41E0F", "#00071A", "#09012F", "#040449", "#000764", "#0C2C8A", "#1852B1", "#007DD1", "#86B5E5","#D3ECF8","#F1E9BF","#F8C95F","#FBAA00","#CC8000","#995700","#6A3403"];


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


  if (N_workers >0){createWorkers();}
  X0=-.5;Y0=0;

  sideX=5
  sideY = sideX*Ny/Nx
 document.getElementById('myX0').innerHTML = X0;
  document.getElementById('myY0').innerHTML = Y0;
  document.getElementById('mySideX').innerHTML = sideX;

  
  document.getElementById("Max_Iter").value = '200';
  mandelbrot();
  plot_colormap();
}



function getMousePosition(canvas, event) {
  let rect = canvas.getBoundingClientRect();
  var x = event.clientX - rect.left;
  var y = event.clientY - rect.top ;
  if (document.getElementById("lines").value > 0) {
    plot_lines(x,y);
}else{
  X0 = X0-sideX/2+sideX*(x/rect.width)
  Y0 = Y0+sideY/2-sideY*(y/(rect.height))
  
  sideX = sideX /10
  sideY = sideY /10


  


  mandelbrot();
}
}

function plot_lines(x,y){
  let rect = canvas.getBoundingClientRect();



  ctx.lineWidth = 1;
  
  
var X_plot = X0-sideX/2+sideX*(x/rect.width)
var Y_plot = Y0+sideY/2-sideY*(y/(rect.height))


  var c = new Complex(X_plot,Y_plot)
      
      z = new Complex(0,0)
  
for (var i = 0;i<document.getElementById("lines").value;i++){
   var r = Math.floor(Math.random() * 256);
  var g = Math.floor(Math.random() * 256);
  var b = Math.floor(Math.random() * 256);
  var RGBColor = "rgb(" + r + "," + g + "," + b + ")";  
    ctx.strokeStyle = RGBColor;
    ctx.beginPath();
    ctx.moveTo(x, y);

        var z1 = z.real**2-z.imaginary**2+c.real
        var z2 = 2*z.real*z.imaginary+ c.imaginary
        z = new Complex(z1,z2)
  
  
  
  var new_x = (z1-(X0-sideX/2))*rect.width/sideX; 
  var new_y = (Y0+sideY/2-z2)*rect.height/sideY

  ctx.lineTo(new_x, new_y);

ctx.stroke();
x = new_x;
y= new_y;
}

}


function plot_colormap() {
  var N_colormap = 100;
  colormap = document.getElementById("colormap").value;
  N_rep = parseFloat(document.getElementById("N_rep").value);
  ctx.beginPath();
  for (let k=0;k<N_rep;k++){
    for (let j=0; j<N_colormap; j++) {
      var value = j/N_colormap;
      
      if (colormap === "custom"){

        var myrgb=custom_colormap(value);
      }
      else{
        if (document.getElementById("reversed").checked ) {value=1-value} ;
          var myrgb = evaluate_cmap(1-value, colormap, false);
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

max_iter=  parseFloat(document.getElementById("Max_Iter").value);

colormap = document.getElementById("colormap").value;
  N_rep = parseFloat(document.getElementById("N_rep").value);
var pixel = 0;
  for (let j = N1; j < N2; j++) {
      for (let i = 0; i < Nx; i++) {
var value = ((M[Math.round(pixel)]-1)%(max_iter/N_rep))/(max_iter/N_rep);

if (colormap === "custom"){
  myrgb = custom_colormap(value);
 // myrgb = [200,20,200];
} else {
  if (document.getElementById("reversed").checked ) {value=1-value} ;
    var myrgb = evaluate_cmap(1-value, colormap, false);

}

  imgData.data[4*pixel+0] = myrgb[0];
  imgData.data[4*pixel+1] = myrgb[1];
  imgData.data[4*pixel+2] = myrgb[2];
  imgData.data[4*pixel+3] = 255;
  pixel++;
}
}
ctx.putImageData(imgData, 0,N1);

  plot_colormap()



}


function receivedWorkerMessage(event) {
 N1= event.data.N1 ;
 N2 = event.data.N2;
 var w = Math.round(N1/Math.round(Ny/N_workers));
 M_array[w]= event.data.DATA;
 M = M_array[w];
draw(N1,N2,M);

var points = 0;
 M_tot =[];
 for (var i = 0; i < N_workers;i++){
   points += M_array[i].length;


   if (points == Nx*Ny){

    for (var j = 0; j<N_workers;j++){
   M_tot = M_tot.concat(M_array[j]);
   
   }
   
   } 

}

}

function redraw(){

if (document.getElementById("lines").value == 0) {canvas.style.cursor = "zoom-in";}
else {canvas.style.cursor = "auto"}
draw(0,Ny,M_tot);
}

function custom_colormap(value){
 // palette = document.getElementById("new_custom").value

 //palette = ["#B41E0F", "#00071A", "#09012F", "#040449", "#000764", "#0C2C8A", "#1852B1", "#007DD1", "#86B5E5","#D3ECF8","#F1E9BF","#F8C95F","#FBAA00","#CC8000","#995700","#6A3403"];
var color_index = Math.floor(value*palette.length);
if (document.getElementById("reversed").checked ) {color_index = palette.length-color_index-1}

  return hexToRgb(String(palette[color_index]));
}

function hexToRgb(hex) {
    var hex1 = hex.substring(1);
    var bigint = parseInt(hex1, 16);
    var r = (bigint >> 16) & 255;
    var g = (bigint >> 8) & 255;
    var b = bigint & 255;

    return [r, g, b];
}

function input_colormap(){

var palette_str = document.getElementById("new_custom").value
palette = palette_str.split(",");
redraw();
}

