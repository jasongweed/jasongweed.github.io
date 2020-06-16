//controls

function movePlayerWithMouse(e){
  //move player with mouse
  let pos = e.data.global;
  player_obj.x=pos.x-pixi_center_x;
  player_obj.y=pixi_center_y-pos.y;
}

function getKeyBoardInput(){
  if(keys['37']){
    //console.log("keyboard move left");
    player_obj.x-=2;
    }
  if(keys['39']){
    //console.log("keyboard move right");
    player_obj.x+=2; //right
  }
  if(keys['38']){
    //console.log("keyboard move");
    player_obj.y+=2;
  }
  if(keys['40']){
    //console.log("keyboard move");
    player_obj.y-=2; 
  }
}


function keysDown(e){
  //console.log(e.keycode);
  keys[e.keyCode]=true;
}

function keysUp(e){
  //console.log(e.keyCode);
  keys[e.keyCode]=false;
}
