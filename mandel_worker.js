
var R = 2;
var R2 = R**2;


onmessage = function(event) {
  var X0 = event.data.X0;
  var Y0 = event.data.Y0;
  var sideX = event.data.sideX;
  var sideY = event.data.sideY;
  var max_iter = event.data.max_iter;
  var Nx = event.data.Nx;
  var Ny = event.data.Ny;
  var N1 = event.data.N1;
  var N2 = event.data.N2;

  var data_M = mandelbrot(X0, Y0,sideX,sideY,max_iter,Nx,Ny,N1,N2);

  postMessage({N1: N1,N2:N2,DATA:data_M});
};


function Complex(real, imaginary) {
  this.real = 0;
  this.imaginary = 0;
  this.real = (typeof real === 'undefined') ? this.real : parseFloat(real);
  this.imaginary = (typeof imaginary === 'undefined') ? this.imaginary : parseFloat(imaginary);
}



function mandelbrot(X0, Y0,sideX,sideY,max_iter,Nx,Ny,N1,N2) {
  console.log("Starting worker");

  const   deltaX = sideX/Nx;
  const   deltaY = sideY/Ny;

  var M=[];

    for (let j = N1; j < N2; j++) {
      for (let i = 0; i < Nx; i++) {
      var c = new Complex(X0-sideX/2.+deltaX*i,(Y0+sideY/2.-deltaY*j));
      var h = 0;
      z = new Complex(0,0);

      while (h<max_iter && (z.real * z.real + z.imaginary * z.imaginary)<R2) {
        var z1 = z.real**2-z.imaginary**2+c.real;
        var z2 = 2*z.real*z.imaginary+ c.imaginary;
        z = new Complex(z1,z2);
        h += 1;           
      }
      M.push(h);
    } 
  }

  return M;
}
