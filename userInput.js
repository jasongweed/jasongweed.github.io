

//Display score

function updateScore(_player_obj){
  document.getElementById("score").innerHTML = Math.round(_player_obj.score);
}

//controls
//jquery UI stuff
$(document).ready(function(){
  $('#bananaBtn').click(function(){
    //references global variable player_obj
    player_obj.dropMeowcat();
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
  
  $('#pauseBtn').click(function(){
    if(game_paused){
      game_paused=false;
    }else{game_paused=true;}
    console.log("pause button hit");
  });

  $('#gpsBtn').click(function(){
    let latlong_pair=txf_gameworld_to_GPS(player_obj.x, player_obj.y, origin_gps_x, origin_gps_y, gps_to_map_scale_factor,long_over_lat_degree_dist_ratio)
    //console.log("gpsBtn clicked");
    //console.log(latlong_pair[0]+" , "+latlong_pair[1]);
    $('#latlong').html("generated: "+latlong_pair[0]+", "+latlong_pair[1]+"<br> real: "+gps_x_current+", "+gps_y_current+"<br> acc:"+gps_accuracy);

    // onClick of first interaction on page before I need the sounds
    sfx_1.heartbeat();//soundEffect.play();

  });


  $('#bgMusicBtn').click(function(){
    //soundEffect2.src = 'sounds/.mp3';
    //updateMusic();
    //soundEffect2.volume=0.5;
    //soundEffect2.play();
    //soundEffect2.loop=true;
    user_has_interacted_with_UI=true;
    sfx_2.calmMusic();
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
    player_obj.dropMeowcat();
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
