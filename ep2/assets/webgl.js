var canvas;
var gl;
var program;

var modelView;
var gravity = -9.81;
var speed = 0;
var radius = 4;
var objects = [{xpos:0,ypos:5,zpos:0,dir:45,clockwise:0},
               {xpos:0,ypos:7,zpos:0,dir:45,clockwise:1}
              ];
var control_dir = 1;
var rotate_flag = 0;

var eye;
var at = vec3(0.0, -0.8, 0.0);
var up = vec3(0.0, 1.0, 0.0);

var projection;
var left = -10;
var right = 10;
var ytop = 0.0;
var bottom = -10.0;
var near = -25;
var far = 25;
var signal = -1;

var vertices = [];
var square_vertices = [];
var normals = [];
var square_normals = [];
var indices = [];
var index = 0;
var ballDivision = 1;

var ballStyle;

var lightx = 1.0, lighty = 1.0, lightz = 1.0;
var lightPosition;
var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
var lightDiffuse = vec4( 0.2, 0.1, 0, 0.5 );
var lightSpecular = vec4( 0.2, 0.1, 0.0, 1.0 );

var materialAmbient = vec4( 1, 0.0, 0.0, 1.0 );
var materialDiffuse = vec4( 0.5, 0.0, 0.0, 1.0 );
var materialSpecular = vec4( 0.2, 0.1, 0.0, 1.0 );
var materialShininess = 0.1;

var rotationQuaternion;
var rotationQuaternionLoc;

var angle = 0.0;
var axis = [0, 0, 1];

var trackingMouse = false;
var trackballMove = false;

var lastPos = [0, 0, 0];
var curx, cury;
var startX, startY;

var square_index = 0;
var square = [
  vec4( -0.5, -0.5,  0.5, 1.0 ),
  vec4( -0.5,  0.5,  0.5, 1.0 ),
  vec4(  0.5,  0.5,  0.5, 1.0 ),
  vec4(  0.5, -0.5,  0.5, 1.0 ),
  vec4( -0.5, -0.5, -0.5, 1.0 ),
  vec4( -0.5,  0.5, -0.5, 1.0 ),
  vec4(  0.5,  0.5, -0.5, 1.0 ),
  vec4(  0.5, -0.5, -0.5, 1.0 )
];

var texSize = 64;
var texCoordsArray = [];
var texture;
var texCoord = [
    vec2(0, 0),
    vec2(0, 1),
    vec2(1, 1),
    vec2(1, 0)
];

function configure_texture(image, i) {
    texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0 + i);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB,
         gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
                      gl.NEAREST_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
}

function quad(  a,  b,  c,  d ) {
  var t1 = subtract(square[b], square[a]);
  var t2 = subtract(square[c], square[a]);
  var normal = normalize(cross(t2, t1));
  normal = vec4(normal);
  normal[3] = 0.0;

  square_index += 6;

  square_normals.push(normal);
  texCoordsArray.push(texCoord[0]);
  square_vertices.push(square[a]);
  square_normals.push(normal);
  texCoordsArray.push(texCoord[1]);
  square_vertices.push(square[b]);
  square_normals.push(normal);
  texCoordsArray.push(texCoord[2]);
  square_vertices.push(square[c]);
  square_normals.push(normal);
  texCoordsArray.push(texCoord[0]);
  square_vertices.push(square[a]);
  square_normals.push(normal);
  texCoordsArray.push(texCoord[2]);
  square_vertices.push(square[c]);
  square_normals.push(normal);
  texCoordsArray.push(texCoord[3]);
  square_vertices.push(square[d]);
}


function cube() {
  quad( 1, 0, 3, 2 );
  quad( 2, 3, 7, 6 );
  quad( 3, 0, 4, 7 );
  quad( 6, 5, 1, 2 );
  quad( 4, 5, 6, 7 );
  quad( 5, 4, 0, 1 );
}

function multq( a,  b)
{
  var s = vec3(a[1], a[2], a[3]);
  var t = vec3(b[1], b[2], b[3]);
  return(vec4(a[0]*b[0] - dot(s,t), add(cross(t, s), add(scale(a[0],t), scale(b[0],s)))));
}

function trackballView( x,  y ) {
  var d, a;
  var v = [];

  v[0] = x;
  v[1] = y;

  d = v[0]*v[0] + v[1]*v[1];
  if (d < 1.0)
    v[2] = Math.sqrt(1.0 - d);
  else {
    v[2] = 0.0;
    a = 1.0 /  Math.sqrt(d);
    v[0] *= a;
    v[1] *= a;
  }
  return v;
}

function mouseMotion( x,  y)
{
  var dx, dy, dz;

  var curPos = trackballView(x, y);
  if(trackingMouse) {
    dx = curPos[0] - lastPos[0];
    dy = curPos[1] - lastPos[1];
    dz = curPos[2] - lastPos[2];

    if (dx || dy || dz) {
      angle = -5.5 * Math.sqrt(dx*dx + dy*dy + dz*dz);


      axis[0] = lastPos[1]*curPos[2] - lastPos[2]*curPos[1];
      axis[1] = lastPos[2]*curPos[0] - lastPos[0]*curPos[2];
      axis[2] = lastPos[0]*curPos[1] - lastPos[1]*curPos[0];

      lastPos[0] = curPos[0];
      lastPos[1] = curPos[1];
      lastPos[2] = curPos[2];
    }
  }
}

function startMotion( x,  y)
{
  trackingMouse = true;

  lastPos = trackballView(x, y);
  trackballMove=true;
}

function stopMotion( x,  y)
{
  trackingMouse = false;
  angle = 0.0;
  trackballMove = false;
}

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


window.onload = function init()
{
  canvas = document.getElementById( "gl-canvas" );

  gl = WebGLUtils.setupWebGL( canvas );
  if ( !gl ) { alert( "WebGL isn't available" ); }
  ballStyle = gl.TRIANGLES;

  gl.viewport( 0, 0, canvas.width, canvas.height );
  gl.clearColor(0.0, 0.0, 0.1, 1.0);
  gl.enable( gl.DEPTH_TEST );

  program = initShaders( gl, "vertex-shader", "fragment-shader" );
  gl.useProgram( program );

  canvas.addEventListener("mousedown", function(event){
    var x = 2*event.clientX/canvas.width-1;
    var y = 2*(canvas.height-event.clientY)/canvas.height-1;
    startMotion(x, y);
  });

  canvas.addEventListener("mouseup", function(event){
    var x = 2*event.clientX/canvas.width-1;
    var y = 2*(canvas.height-event.clientY)/canvas.height-1;
    stopMotion(x, y);
  });

  canvas.addEventListener("mousemove", function(event){
    var x = 2*event.clientX/canvas.width-1;
    var y = 2*(canvas.height-event.clientY)/canvas.height-1;
    mouseMotion(x, y);
  });

  build();

  render();
};

var image;
var image1;
function build(){
  var specularProduct = mult(lightSpecular, materialSpecular);

  cube();

  sphere([0.0, 0.0, -1.0, 1], [0.0, 0.942809, 0.333333, 1], [-0.816497, -0.471405, 0.333333, 1], [0.816497, -0.471405, 0.333333, 1], ballDivision);

  vertices.push(10.0,0.0,10.0,1, -10.0,0.0,10.0,1, 10.0,0.0,-10.0,1,-10.0,0.0,-10.0,1);
  normals.push(0,1,0,0, 0,1,0,0, 0,1,0,0, 0,1,0,0);
  

  modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
  projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );
  normalMatrixLoc = gl.getUniformLocation( program, "normalMatrix" );

  gl.uniform4fv( gl.getUniformLocation(program,
     "specularProduct"),flatten(specularProduct) );
  gl.uniform1f( gl.getUniformLocation(program,
     "shininess"),materialShininess );

  var tBuffer = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
  gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW );

  var vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
  gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vTexCoord );

  image = document.getElementById("texImage");
  image1 = document.getElementById("texImage1");
  image2 = document.getElementById("texImage2");
  image3 = document.getElementById("texImage3");
  configure_texture(image,0);
  configure_texture(image1,1);
  configure_texture(image2,2);
  configure_texture(image3,3);

  rotationQuaternion = vec4(1, 0, 0, 0);
  rotationQuaternionLoc = gl.getUniformLocation(program, "r");
  gl.uniform4fv(rotationQuaternionLoc, flatten(rotationQuaternion));

  projection = ortho( left, right, bottom, ytop, near, far );
  eye = vec3(0, 0, 6*Math.cos(0));
}

function render() {
  resize(canvas);
  axis = normalize(axis);
  var c = Math.cos(angle/2.0);
  var s = Math.sin(angle/2.0);

  var rotation = vec4(c, s*axis[0], s*axis[1], s*axis[2]);
  rotationQuaternion = multq(rotationQuaternion, rotation);

  gl.uniform4fv(rotationQuaternionLoc, flatten(rotationQuaternion));

  lightPosition = vec4(lightx, lighty, lightz, 0.0 );
  gl.uniform4fv( gl.getUniformLocation(program,
      "lightPosition"),flatten(lightPosition) );

  gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
  speed += gravity/1000;
  objects[0].ypos += speed;

  if(objects[0].ypos<3.5){
    speed = -speed;
    objects[0].ypos = 3.5;
  }

  objects[0].dir += control_dir*Math.abs(speed)*0.2;
  objects[0].xpos = radius*Math.cos(objects[0].dir);
  objects[0].zpos = radius*Math.sin(objects[0].dir);

  for(i=1;i<objects.length;i++) {
    objects[i].dir += objects[i].clockwise*0.01;
    objects[i].xpos = radius*Math.cos(objects[i].dir);
    objects[i].zpos = radius*Math.sin(objects[i].dir);
  }

  for(i=1;i<objects.length;i++) {
    for(j=i+1;j<objects.length;j++) {
      if((Math.pow((objects[i].xpos-objects[j].xpos),2)+Math.pow((objects[i].zpos-objects[j].zpos),2))<=0.0625){
        objects[i].clockwise=-objects[i].clockwise;
        objects[j].clockwise=-objects[j].clockwise;
      }
    }
  }

  draw_floor();
  draw_sky();
  draw_bird();
  for(i=1;i<objects.length;i++) draw_fly(i);
  
  animation = window.requestAnimFrame(render);
}

function draw_floor(){
  gl.uniform1i(gl.getUniformLocation(program, "texture"), 2);
  var nBuffer = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
  gl.bufferData( gl.ARRAY_BUFFER, flatten(normals), gl.STATIC_DRAW );

  var vNormal = gl.getAttribLocation( program, "vNormal" );
  gl.vertexAttribPointer( vNormal, 4, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vNormal);

  var vBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

  var vPosition = gl.getAttribLocation( program, "vPosition");
  gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  var indexBufferId = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBufferId);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
  materialAmbient = vec4( 0, 1.0, 0.0, 1.0 );
  var ambientProduct = mult(lightAmbient, materialAmbient);
  gl.uniform4fv( gl.getUniformLocation(program,
     "ambientProduct"),flatten(ambientProduct) );

  modelView = lookAt( eye, at, up );
  normalMatrix = [
      vec3(modelView[0][0], modelView[0][1], modelView[0][2]),
      vec3(modelView[1][0], modelView[1][1], modelView[1][2]),
      vec3(modelView[2][0], modelView[2][1], modelView[2][2])
  ];

  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelView) );
  gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projection) );
  gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix) );

  gl.drawArrays(gl.TRIANGLES, index, 3);
  gl.drawArrays(gl.TRIANGLES, index+1, 3);
}

function draw_sky(){
  gl.uniform1i(gl.getUniformLocation(program, "texture"), 3);
  materialAmbient = vec4( 1, 1, 1, 1.0 );
  var ambientProduct = mult(lightAmbient, materialAmbient);
  gl.uniform4fv( gl.getUniformLocation(program,
     "ambientProduct"),flatten(ambientProduct) );

  modelView = lookAt( eye, at, up );
  modelView = mult(modelView, rotate(180/Math.PI,[1,0,0]));
  modelView = mult(modelView, translate(0, -10, -15));
  normalMatrix = [
      vec3(modelView[0][0], modelView[0][1], modelView[0][2]),
      vec3(modelView[1][0], modelView[1][1], modelView[1][2]),
      vec3(modelView[2][0], modelView[2][1], modelView[2][2])
  ];

  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelView) );
  gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projection) );
  gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix) );

  gl.drawArrays(gl.TRIANGLES, index, 3);
  gl.drawArrays(gl.TRIANGLES, index+1, 3);
}

function draw_bird(){
  gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
  materialAmbient = vec4( 1.0, 1.0, 1.0, 1.0 );
  materialDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
  var ambientProduct = mult(lightAmbient, materialAmbient);
  var diffuseProduct = mult(lightDiffuse, materialDiffuse);
  gl.uniform4fv( gl.getUniformLocation(program,
    "ambientProduct"),flatten(ambientProduct) );
  gl.uniform4fv( gl.getUniformLocation(program,
    "diffuseProduct"),flatten(diffuseProduct) );

  modelView = lookAt(eye, at, up);
  modelView = mult(modelView, translate(objects[0].xpos, objects[0].ypos, objects[0].zpos));
  modelView = mult(modelView, rotate(signal*(2*rotate_flag+objects[0].dir)*180/Math.PI,[0,1,0]));
  normalMatrix = [
      vec3(modelView[0][0], modelView[0][1], modelView[0][2]),
      vec3(modelView[1][0], modelView[1][1], modelView[1][2]),
      vec3(modelView[2][0], modelView[2][1], modelView[2][2])
  ];

  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelView) );
  gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix) );

  gl.uniformMatrix4fv( gl.getUniformLocation(program,
          "modelViewMatrix"), false, flatten(modelView) );

  gl.drawElements(ballStyle, index, gl.UNSIGNED_SHORT, 0);
  
  var nBuffer = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
  gl.bufferData( gl.ARRAY_BUFFER, flatten(square_normals), gl.STATIC_DRAW );

  var vNormal = gl.getAttribLocation( program, "vNormal" );
  gl.vertexAttribPointer( vNormal, 4, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vNormal);

  var vBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(square_vertices), gl.STATIC_DRAW);

  var vPosition = gl.getAttribLocation( program, "vPosition");
  gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  var indexBufferId = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBufferId);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(square_index), gl.STATIC_DRAW);

  materialAmbient = vec4(1.0, 1.0, 1.0, 1.0);
  materialDiffuse = vec4(1.0, 1.0, 1.0, 1.0);
  var ambientProduct = mult(lightAmbient, materialAmbient);
  var diffuseProduct = mult(lightDiffuse, materialDiffuse);
  gl.uniform4fv( gl.getUniformLocation(program,
     "ambientProduct"),flatten(ambientProduct) );
  gl.uniform4fv( gl.getUniformLocation(program,
    "diffuseProduct"),flatten(diffuseProduct) );

  modelView = lookAt( eye, at, up );
  modelView = mult(modelView, translate([objects[0].xpos, objects[0].ypos, objects[0].zpos] ));
  modelView = mult(modelView, rotate(signal*objects[0].dir*180/Math.PI,[0,1,0]));
  modelView = mult(modelView, rotate(-(objects[0].ypos-3.9)*90,[0,0,-1]));
 modelView = mult(modelView, translate([-1,0.2,0]));
  modelView = mult(modelView, scale_array([1,1/10,1]));
  normalMatrix = [
      vec3(modelView[0][0], modelView[0][1], modelView[0][2]),
      vec3(modelView[1][0], modelView[1][1], modelView[1][2]),
      vec3(modelView[2][0], modelView[2][1], modelView[2][2])
  ];

  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelView) );
  gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projection) );
  gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix) );
  gl.drawArrays(gl.TRIANGLES, 0, square_index );

  modelView = lookAt( eye, at, up );
  modelView = mult(modelView, translate([objects[0].xpos, objects[0].ypos, objects[0].zpos] ));
    modelView = mult(modelView, rotate(signal*objects[0].dir*180/Math.PI,[0,1,0]));
  modelView = mult(modelView, rotate(-(objects[0].ypos-3.9)*90,[0,0,1]));
  modelView = mult(modelView, translate([1,0.2,0]));
  modelView = mult(modelView, scale_array([1,1/10,1]));
  normalMatrix = [
      vec3(modelView[0][0], modelView[0][1], modelView[0][2]),
      vec3(modelView[1][0], modelView[1][1], modelView[1][2]),
      vec3(modelView[2][0], modelView[2][1], modelView[2][2])
  ];

  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelView) );
  gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projection) );
  gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix) );
  gl.drawArrays(gl.TRIANGLES, 0, square_index );
}

function draw_fly(id){
  gl.uniform1i(gl.getUniformLocation(program, "texture"), 1);
  materialAmbient = vec4(0.1, 0.1, 0.1, 1.0);
  materialDiffuse = vec4(0.1, 0.1, 0.1, 1.0);
  var ambientProduct = mult(lightAmbient, materialAmbient);
  var diffuseProduct = mult(lightDiffuse, materialDiffuse);
  gl.uniform4fv( gl.getUniformLocation(program,
     "ambientProduct"),flatten(ambientProduct) );
  gl.uniform4fv( gl.getUniformLocation(program,
    "diffuseProduct"),flatten(diffuseProduct) );

  draw_body(id);
  draw_wing(id, 170, 0.02);
  draw_wing(id, 190, -0.02);
  draw_wing(id, 10, -0.02);
  draw_wing(id, -10, 0.02);
}

function draw_body(id){
  modelView = lookAt( eye, at, up );
  modelView = mult(modelView, translate([objects[id].xpos, objects[id].ypos, objects[id].zpos] ));
  modelView = mult(modelView, rotate(signal*objects[id].dir*180/Math.PI,[0,1,0]));
  modelView = mult(modelView, translate([0,0,0]));
  modelView = mult(modelView, scale_array([1/10,1/10,0.25]));
  normalMatrix = [
      vec3(modelView[0][0], modelView[0][1], modelView[0][2]),
      vec3(modelView[1][0], modelView[1][1], modelView[1][2]),
      vec3(modelView[2][0], modelView[2][1], modelView[2][2])
  ];

  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelView) );
  gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projection) );
  gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix) );
  gl.drawArrays(gl.TRIANGLES, 0, square_index );
}

function draw_wing(id,angle,pos){
  modelView = lookAt( eye, at, up );
  modelView = mult(modelView, translate([objects[id].xpos, objects[id].ypos, objects[id].zpos]));
  modelView = mult(modelView, rotate(signal*objects[id].dir*180/Math.PI,[0,1,0]));
  modelView = mult(modelView, rotate(angle,[0,1,0]));
  modelView = mult(modelView, rotate(-((objects[id].dir)*180)%15+15,[0,0,1]));
  modelView = mult(modelView, translate([0.2,0,pos]));
  modelView = mult(modelView, scale_array([1/5,1/20,1/10]));
  normalMatrix = [
      vec3(modelView[0][0], modelView[0][1], modelView[0][2]),
      vec3(modelView[1][0], modelView[1][1], modelView[1][2]),
      vec3(modelView[2][0], modelView[2][1], modelView[2][2])
  ];

  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelView) );
  gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projection) );
  gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix) );
  gl.drawArrays(gl.TRIANGLES, 0, square_index );
}

function sphere(a, b, c, d, n) {
  divideTriangle(a, b, c, n);
  divideTriangle(a, c, d, n);
  divideTriangle(a, d, b, n);
  divideTriangle(d, c, b, n);
}

function divideTriangle(a, b, c, count) {
  if ( count > 0 ) {
    var ab = [(a[0]+b[0])/2, (a[1]+b[1])/2, (a[2]+b[2])/2, (a[3]+b[3])/2];
    var ac = [(a[0]+c[0])/2, (a[1]+c[1])/2, (a[2]+c[2])/2, (a[3]+c[3])/2];
    var bc = [(c[0]+b[0])/2, (c[1]+b[1])/2, (c[2]+b[2])/2, (c[3]+b[3])/2];

    ab = normalize(ab,true);
    ac = normalize(ac,true);
    bc = normalize(bc,true);

    divideTriangle( ab, bc, ac, count - 1 );
    divideTriangle( bc, c, ac, count - 1 );
    divideTriangle( a, ab, ac, count - 1 );
    divideTriangle( ab, b, bc, count - 1 );
  }
  else {
    triangle( a, b, c );
  }
}

function triangle(a, b, c) {
  for(var i=0; i<4; i++){
    vertices.push(a[i]);
  }
  texCoordsArray.push(texCoord[0],texCoord[1],texCoord[2]);
  indices.push(index++);
  for( i=0; i<4; i++){
    vertices.push(b[i]);
  }
  texCoordsArray.push(texCoord[0],texCoord[2],texCoord[3]);
  indices.push(index++);
  for( i=0; i<4; i++){
    vertices.push(c[i]);
  }
  texCoordsArray.push(texCoord[0],texCoord[1],texCoord[2]);
  indices.push(index++);

  var t1 = subtract(b, a);
  var t2 = subtract(c, a);
  var normal = normalize(cross(t2, t1));
  normal = vec4(normal);
  normal[3] = 0.0;

  texCoordsArray.push(texCoord[0],texCoord[2],texCoord[3]);
  normals.push(normal);
  texCoordsArray.push(texCoord[0],texCoord[1],texCoord[2]);
  normals.push(normal);
  texCoordsArray.push(texCoord[0],texCoord[2],texCoord[3]);
  normals.push(normal);
}
