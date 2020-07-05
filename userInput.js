//controls


//jquery UI stuff
$(document).ready(function(){
  $('#bananaBtn').click(function(){
    //references global variable player_obj
    player_obj.dropCupcake();
  });

  $('#zoomInBtn').click(function(){
    UI_zoomFactor = UI_zoomFactor * 1.2;
    map_obj.rescale(UI_zoomFactor,player_obj, true);
    console.log("UI_zoomFactor: "+UI_zoomFactor);
  });

  $('#zoomOutBtn').click(function(){
    UI_zoomFactor = UI_zoomFactor/1.2;
    map_obj.rescale(UI_zoomFactor,player_obj, false);
    console.log("UI_zoomFactor: "+UI_zoomFactor);
  });

  $('#lassoBtn').click(function(){
    player_obj.lassoStrike();
    console.log("lassoBtn hit");
  });
  
});


//keyboard input using pixi
function getKeyBoardInput(){
  if(keys['37']){
    //console.log("keyboard move left");
    devTestSpot = true;
    player_obj.x-=2;
    }
  if(keys['39']){
    //console.log("keyboard move right");
    devTestSpot = true;
    player_obj.x+=2; //right
  }
  if(keys['38']){
    //console.log("keyboard move");
    devTestSpot = true;
    player_obj.y+=2;
  }
  if(keys['40']){
    //console.log("keyboard move");
    devTestSpot = true;
    player_obj.y-=2; 
  }
  if(keys['32']){ //key for space
    //references global variable player_obj
    devTestSpot = true;
    player_obj.dropCupcake();
  }
  if(keys['49']){ //key for '1'
    //references global variable player_obj
    devTestSpot = true;
    devTestSpot = false;
    console.log("using gps coordinates to GW x,y: "+player_obj.x+" "+player_obj.y);
  }
  


  if(keys.length>0){
    devTestSpot=true;
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
