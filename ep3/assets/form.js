var form_canvas;
var gl2;
var program2;
var form_vertices;

function resize_form() {
  var displayWidth  = form_canvas.clientWidth;
  var displayHeight = form_canvas.clientHeight;

  if (form_canvas.width  != displayWidth ||
      form_canvas.height != displayHeight) {
    form_canvas.width  = displayWidth;
    form_canvas.height = displayHeight;

    gl2.viewport(0, 0, form_canvas.width, form_canvas.height);
  }   
}

function init_form()
{
  form_canvas = document.getElementById("gl-canvas-form");

  gl2 = WebGLUtils.setupWebGL(form_canvas);
  if (!gl2) { alert("WebGL isn't available"); }

  gl2.viewport(0, 0, form_canvas.width, form_canvas.height);
  gl2.clearColor(0.0, 0.0, 0.0, 1.0);

  program2 = initShaders( gl2, "vertex-shader", "fragment-shader" );
  gl2.useProgram( program2 );

  render_form();
};


function render_form() {
  resize_form(form_canvas)
  gl2.clear(gl2.COLOR_BUFFER_BIT);

  var bufferId = gl2.createBuffer();
  gl2.bindBuffer(gl2.ARRAY_BUFFER, bufferId);
  gl2.bufferData(gl2.ARRAY_BUFFER, flatten(axis), gl2.STATIC_DRAW);

  var vPosition = gl2.getAttribLocation(program2, "vPosition");
  gl2.vertexAttribPointer(vPosition, 2, gl2.FLOAT, false, 0, 0);
  gl2.enableVertexAttribArray(vPosition);

  gl2.drawArrays(gl2.LINES, 0, axis.length);

  var bufferId = gl2.createBuffer();
  gl2.bindBuffer(gl2.ARRAY_BUFFER, bufferId);
  gl2.bufferData(gl2.ARRAY_BUFFER, flatten(form_vertices), gl2.STATIC_DRAW);

  var vPosition = gl2.getAttribLocation(program2, "vPosition");
  gl2.vertexAttribPointer(vPosition, 2, gl2.FLOAT, false, 0, 0);
  gl2.enableVertexAttribArray(vPosition);

  if(form_vertices.length>0){
    gl2.drawArrays(gl2.LINES, 0, form_vertices.length);
  }
  
  var vPosition = gl2.getAttribLocation(program2, "vPosition");
  gl2.vertexAttribPointer(vPosition, 2, gl2.FLOAT, false, 0, 0);
  gl2.enableVertexAttribArray(vPosition);

  window.requestAnimFrame(render_form);
}

function form(){
  form_vertices = [];
  if(curve_vertices && surface_vertices && curve_vertices.length>0 && surface_vertices.length>0){
    var temp = curve_vertices;
    var a = surface_vertices.slice();
    var min = a.sort(function(a, b) {
      return a[0] - b[0];
    })[0][0] * 0.1;
    var max = a[a.length-1][0] * 0.1;
    for(v in curve_vertices){
      a = [curve_vertices[v][0] + min, temp[v][1]];
      form_vertices.push(a);
      a = [curve_vertices[v][0] + max, temp[v][1]];
      form_vertices.push(a);
    }
  }
}
