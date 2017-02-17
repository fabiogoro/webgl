var surface_canvas;
var gl3;
var program3;
var clicked2 = -1;
var vertices2;
var v;
var surface_vertices;

function motion2(x,y)
{
  if(clicked2>-1) {
    vertices2[clicked2] = vec2(x,y);
    surface();
  }
}

function startMotionSurface(x,y)
{
  for(var v in vertices2)
    if(vertices2[v][0]<x+0.02 && vertices2[v][0]>x-0.02 && vertices2[v][1]<y+0.02 && vertices2[v][1]>y-0.02)
      clicked2 = v;
  if(clicked2 === -1){
    vertices2.push(vec2(x,y));
    clicked2 = vertices2.length-1;
  }
}

function stopMotionSurface(x,y)
{
  if(clicked2>-1) {
    vertices2[clicked2] = vec2(x,y);
    surface();
  }
  clicked2 = -1;
}

function resize_surface() {
  var displayWidth  = surface_canvas.clientWidth;
  var displayHeight = surface_canvas.clientHeight;

  if (surface_canvas.width  != displayWidth ||
      surface_canvas.height != displayHeight) {
    surface_canvas.width  = displayWidth;
    surface_canvas.height = displayHeight;

    gl3.viewport(0, 0, surface_canvas.width, surface_canvas.height);
  }   
}

function init_surface()
{
  surface_canvas = document.getElementById("gl-canvas-surface");

  gl3 = WebGLUtils.setupWebGL(surface_canvas);
  if (!gl3) { alert("WebGL isn't available"); }
  
  surface_canvas.addEventListener("mousedown", function(event){
    var x = 2*(event.clientX)/surface_canvas.width-1;
    var y = ((2*(surface_canvas.height-event.clientY))/(surface_canvas.height)-1);
    startMotionSurface(x, y);
  });

  surface_canvas.addEventListener("mouseup", function(event){
    var x = 2*(event.clientX)/surface_canvas.width-1;
    var y = ((2*(surface_canvas.height-event.clientY))/(surface_canvas.height)-1);
    stopMotionSurface(x, y);
  });

  surface_canvas.addEventListener("mousemove", function(event){
    var x = 2*(event.clientX)/surface_canvas.width-1;
    var y = ((2*(surface_canvas.height-event.clientY))/(surface_canvas.height)-1);
    motion2(x, y);
  });

  gl3.viewport(0, 0, surface_canvas.width, surface_canvas.height);
  gl3.clearColor(0.0, 0.0, 0.0, 1.0);

  program3 = initShaders( gl3, "vertex-shader", "fragment-shader" );
  gl3.useProgram( program3 );

  vertices2 = [
    vec2(-0.5,-0.5),
    vec2(-0.5,0.5),
    vec2(0.5,0.5),
    vec2(0.5,-0.5)
  ];
  surface();

  vertices2.push(vertices2[0]);
  var bufferId = gl3.createBuffer();
  gl3.bindBuffer(gl3.ARRAY_BUFFER, bufferId);
  gl3.bufferData(gl3.ARRAY_BUFFER, flatten(vertices2), gl3.STATIC_DRAW);
  vertices2.pop();

  var vPosition = gl3.getAttribLocation(program3, "vPosition");
  gl3.vertexAttribPointer(vPosition, 2, gl3.FLOAT, false, 0, 0);
  gl3.enableVertexAttribArray(vPosition);

  render_surface();
};


function render_surface() {
  resize_surface(surface_canvas)
  gl3.clear(gl3.COLOR_BUFFER_BIT);
  if(vertices2.length>0){
    gl3.drawArrays(gl3.POINTS, 0, vertices2.length+1);
    gl3.drawArrays(gl3.LINES, 0, vertices2.length+1);
    gl3.drawArrays(gl3.LINES, 1, vertices2.length);
  }

  var bufferId = gl3.createBuffer();
  gl3.bindBuffer(gl3.ARRAY_BUFFER, bufferId);
  gl3.bufferData(gl3.ARRAY_BUFFER, flatten(axis), gl3.STATIC_DRAW);

  var vPosition = gl3.getAttribLocation(program3, "vPosition");
  gl3.vertexAttribPointer(vPosition, 2, gl3.FLOAT, false, 0, 0);
  gl3.enableVertexAttribArray(vPosition);

  gl3.drawArrays(gl3.LINES, 0, axis.length);

  var bufferId = gl3.createBuffer();
  gl3.bindBuffer(gl3.ARRAY_BUFFER, bufferId);
  gl3.bufferData(gl3.ARRAY_BUFFER, flatten(surface_vertices), gl3.STATIC_DRAW);

  var vPosition = gl3.getAttribLocation(program3, "vPosition");
  gl3.vertexAttribPointer(vPosition, 2, gl3.FLOAT, false, 0, 0);
  gl3.enableVertexAttribArray(vPosition);

  if(surface_vertices.length>0){
    gl3.drawArrays(gl3.LINES, 0, surface_vertices.length);
    gl3.drawArrays(gl3.LINES, 1, surface_vertices.length-1);
  }

  if(vertices2.length>0)
    vertices2.push(vertices2[0]);
  var bufferId = gl3.createBuffer();
  gl3.bindBuffer(gl3.ARRAY_BUFFER, bufferId);
  gl3.bufferData(gl3.ARRAY_BUFFER, flatten(vertices2), gl3.STATIC_DRAW);
  vertices2.pop();

  var vPosition = gl3.getAttribLocation(program3, "vPosition");
  gl3.vertexAttribPointer(vPosition, 2, gl3.FLOAT, false, 0, 0);
  gl3.enableVertexAttribArray(vPosition);

  window.requestAnimFrame(render_surface);
}

function surface() {
  surface_vertices = [];
  if(vertices2.length>1){
    for(var i=0;i<order;i++)
      vertices2.push(vertices2[i]);
    surface_vertices = bspline(vertices2);
    for(var i=0;i<order;i++)
      vertices2.pop();
    form();
  }
}
