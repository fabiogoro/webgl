function pause(e){
  $(e).attr('onclick', 'play(this);');
  $(e).html('<i class="fa fa-play"></i>');
  window.cancelAnimationFrame(animation);
}

function play(e){
  $(e).attr('onclick', 'pause(this);');
  $(e).html('<i class="fa fa-pause"></i>');
  render();
}

function restart(){
  window.cancelAnimationFrame(animation);
  speed = 0;
  objects = [{xpos:0,ypos:5,zpos:0,dir:45,clockwise:0},
    {xpos:0,ypos:7,zpos:0,dir:45,clockwise:1}
  ];
  render();
}

function add_fly(){
  var dir = objects[1].dir-0.10;
  for(i=2;i<objects.length;i++) {
    if(dir-objects[i].dir<0.2) dir = 0;
  }
  if(dir!=0) objects.push({xpos:0,ypos:7,zpos:0,dir:dir,clockwise:-objects[1].clockwise});
}

function remove_fly(){
  if(objects.length!=2) objects.pop();
}

function perspective_view(){
  aspect =  canvas.width/canvas.height;
  fovy = 45.0;  
  far = 100.0;
  near = 0.3;
  at = vec3(0.0, 5.0, 0);
  up = vec3(0.0, 1.0, 0.0);
  projection = perspective(fovy, aspect, near, far);
  var radius = -15;
  var theta  = -0.1;
  var phi    = -10.0;
  eye = vec3(radius*Math.sin(theta)*Math.cos(phi),
        radius*Math.sin(theta)*Math.sin(phi), radius*Math.cos(theta));
  signal = 1;
  clock();
}

function ortho_view(){
  at = vec3(0.0, -0.8, 0.0);
  up = vec3(0.0, 1.0, 0.0);
  left = -10;
  right = 10;
  ytop = 0.0;
  bottom = -10.0;
  near = -25;
  far = 25;
  projection = ortho( left, right, bottom, ytop, near, far );
  eye = vec3(0, 0, 6*Math.cos(0));
  signal = -1;
  clock();
}

function clock(){
  control_dir = signal*(-1); 
  rotate_flag = 0;
}

function counterclock(){
  control_dir = signal*1; 
  rotate_flag = 1.6;
}
