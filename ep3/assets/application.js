function erase(e){
  vertices = [];
  vertices2 = [];
  curve();
  surface();
}

function restart(){
  vertices = [
    vec2(-0.5,0),
    vec2(-0.5,0.5),
    vec2(0.5,0.5),
    vec2(0.5,0)
  ];
  vertices2 = [
    vec2(-0.5,-0.5),
    vec2(-0.5,0.5),
    vec2(0.5,0.5),
    vec2(0.5,-0.5)
  ];
  curve();
  surface();
}

function change_order(inc){
  order += inc;
  if(order<1) order = 1;
  $('#order').html(order);
  curve();
  surface();
}
