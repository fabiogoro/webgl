var order = 3;
function bspline(vertices){
  var scale = .4;
  var num_points = vertices.length-1;
  var x = [];
  var y = [];
  for(var i=0; i<vertices.length;i++){
    x.push(vertices[i][0]);
    y.push(vertices[i][1]);
  }
  
  var nti = num_points+order+1;
  var pt = [];
  for(var i=0;i<nti;i++) pt.push(i);
  var Px = new Float64Array(x),
      Py = new Float64Array(y),
      ti = new Float64Array(pt);
  var to = ti[0], dt = ti[nti-1]-to;
  for (var i = 0; i < nti; i++) ti[i] = (ti[i]-to)/dt;
  var width = 600;
  var height = 600;
  var N = new Float64Array(nti*width);
  basis_function();
  return bspline_vertices();

  function basis_function(){
    var step = (ti[nti-1]-ti[0])/width;
    for (var j = 0; j < nti*width; j++) N[j] = 0;
    var i1 = 0, t = ti[0];
    for (var l = 0; l < width; l++){
      while (t >= ti[i1] ) i1++;
      var i = i1-1, ntil = nti*l;
      N[i + ntil] = height;
      for (var m = 2; m <= order; m++){
        var jb = i-m+1;  if (jb < 0) jb = 0;
        for (var j = jb; j <= i; j++)
          N[j + ntil] = N[j + ntil]*(t - ti[j])/(ti[j+m-1] - ti[j]) +
          N[j+1 +ntil]*(ti[j+m] - t)/(ti[j+m] - ti[j+1]);
      }
      t += step;
    }
    for (var j = 0; j < num_points+1; j++){
      t = ti[0];
      for (var l = 1; l < width; l++){
        t += step;
      }
    }
  }
  function bspline_vertices(){
    var curve_vertices = [];
    var step = (ti[nti-1]-ti[0])/width;
    var to = Math.floor(((ti[order-1] - ti[0])/step)) + 1;
    var sX = sY = 0, ntii = to*nti;
    for (var m = 0; m < num_points+1; m++){
      sX += Px[m]*N[m + ntii];
      sY += Py[m]*N[m + ntii];
    }
    for (var j = order-1; j < num_points+1; j++){
      var t = Math.floor((ti[j+1] - ti[0])/step);
      curve_vertices.push(vec2(sX/width,sY/height));
      for (var i = to; i < t; i++){
        sX = sY = 0;
        ntii += nti;
        for (var m = 0; m < num_points+1; m++){
          sX += Px[m]*N[m + ntii];  sY += Py[m]*N[m + ntii];}
          curve_vertices.push(vec2(sX/width,sY/height));
      }
      to = t;
    }
    return curve_vertices;
  }
} 
