var canvas;
var gl;
var program;
var vertices;
var axis;
var curve_vertices;
var clicked = -1;
var curve_pixels = 1000;

function resize() {
  var displayWidth  = canvas.clientWidth;
  var displayHeight = canvas.clientHeight;

  if (canvas.width  != displayWidth ||
      canvas.height != displayHeight) {
    canvas.width  = displayWidth;
    canvas.height = displayHeight;

    gl.viewport(0, 0, canvas.width, canvas.height);
  }   
}

function motion(x,y)
{
  if(clicked>-1) {
    vertices[clicked] = vec2(x,y);
    curve();
  }
}

function startMotion(x,y)
{
  for(v in vertices)
    if(vertices[v][0]<x+0.04 && vertices[v][0]>x-0.04 && vertices[v][1]<y+0.02 && vertices[v][1]>y-0.02)
      clicked = v;
  if(clicked === -1){
    vertices.push(vec2(x,y));
    clicked = vertices.length-1;
  }
}

function stopMotion(x,y)
{
  if(clicked>-1) {
    vertices[clicked] = vec2(x,y);
    curve();
  }
  clicked = -1;
}

window.onload = function init()
{
  canvas = document.getElementById("gl-canvas");

  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) { alert("WebGL isn't available"); }

  canvas.addEventListener("mousedown", function(event){
    var x = 2*(event.clientX-$(window).width()*0.3320)/canvas.width-1;
    var y = ((2*(canvas.height-event.clientY))/(canvas.height)-1);
    startMotion(x, y);
  });

  canvas.addEventListener("mouseup", function(event){
    var x = 2*(event.clientX-$(window).width()*0.3320)/canvas.width-1;
    var y = ((2*(canvas.height-event.clientY))/(canvas.height)-1);
    stopMotion(x, y);
  });

  canvas.addEventListener("mousemove", function(event){
    var x = 2*(event.clientX-$(window).width()*0.3320)/canvas.width-1;
    var y = ((2*(canvas.height-event.clientY))/(canvas.height)-1);
    motion(x, y);
  });


  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  program = initShaders( gl, "vertex-shader", "fragment-shader" );
  gl.useProgram( program );

  vertices = [
    vec2(-0.5,0),
    vec2(-0.5,0.5),
    vec2(0.5,0.5),
    vec2(0.5,0)
  ];
  curve();

  axis = [
    vec2(1.5,0),
    vec2(-1.5,0),
    vec2(0,1.5),
    vec2(0,-1.5)
  ];

  var bufferId = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  render();
  init_form();
  init_surface();
};


function render() {
  resize(canvas)
  gl.clear(gl.COLOR_BUFFER_BIT);
  if(vertices.length>0){
    gl.drawArrays(gl.POINTS, 0, vertices.length);
    gl.drawArrays(gl.LINES, 0, vertices.length);
    gl.drawArrays(gl.LINES, 1, vertices.length-1);
  }

  var bufferId = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(axis), gl.STATIC_DRAW);

  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  gl.drawArrays(gl.LINES, 0, axis.length);

  var bufferId = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(curve_vertices), gl.STATIC_DRAW);

  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  if(curve_vertices.length>0){
    gl.drawArrays(gl.LINES, 0, curve_vertices.length);
    gl.drawArrays(gl.LINES, 1, curve_vertices.length-1);
  }

  var bufferId = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  window.requestAnimFrame(render);
}

function curve() {
  curve_vertices = bspline(vertices);
  form();
}
