
var R = 2;
var R2 = R**2;


onmessage = function(event) {
  // The object that the web page sent is stored in the event.data property.
  var X0 = event.data.X0;
  var Y0 = event.data.Y0;
  var side = event.data.side;
  var max_iter = event.data.max_iter;
  var N = event.data.N;
  var N1 = event.data.N1;
  var N2 = event.data.N2;

  // Using that number range, perform the prime number search.
  var data_M = mandelbrot(X0, Y0,side,max_iter,N,N1,N2);

  // Now the search is finished. Send back the results.
  postMessage({N1: N1,N2:N2,DATA:data_M});
};
//const zeros = (m, n) => [...Array(m)].map(e => Array(n).fill(0));



function Complex(real, imaginary) {
  this.real = 0;
  this.imaginary = 0;
  this.real = (typeof real === 'undefined') ? this.real : parseFloat(real);
  this.imaginary = (typeof imaginary === 'undefined') ? this.imaginary : parseFloat(imaginary);
}



function mandelbrot(X0,Y0,side,max_iter,N,N1,N2) {
  // (The boring prime number calculations go in this function.)


  // Code for worker here



  var L=[];
  const   delta = side/N
  for (let i = N1; i < N2; i++) {
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

  return L;
}
