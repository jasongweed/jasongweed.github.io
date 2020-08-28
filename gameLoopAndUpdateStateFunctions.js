
function gameLoop(){
  if (gps_location_loaded){
    getKeyBoardInput();
    updatePlayer();
    updateMummies();
    updateDigsites();
    updateHUD(player_obj);
    updateMusic()
  }else{
    //if location not loaded, retry
    getLocationInit();
  }
}

function updateHUD(_player_obj){
  //
  updateScore(_player_obj);
}

function updateMummies(){
  let chase_mode = false;
  for(const m of mummies){
    //update state
    m.activate_if_player_close(player_obj);
    m.chase(player_obj);
    m.attack_if_player_close(player_obj);
    //update UI rendering
    m.setRenderPosition(pixi_center_x,pixi_center_y,player_obj.x,player_obj.y);  
    m.sprite.width = m.gameworld_width*UI_zoomFactor;
    m.sprite.height = m.gameworld_height*UI_zoomFactor;
     
  } 
}

function updateDigsites(){
  let i=0;
  for(const s of digsites){
      //update state
      if(s.type=="cupcake"){
        s.activate_if_player_close(player_obj, player_obj);
      }else if(s.type=="infinity"){
        s.activate_if_player_close(player_obj,player_obj);
      }

      //update UI rendering
      s.setRenderPosition(pixi_center_x,pixi_center_y,player_obj.x,player_obj.y);
      s.sprite.width = s.gameworld_width*UI_zoomFactor;
      s.sprite.height = s.gameworld_height*UI_zoomFactor;
  }
}


function updatePlayer(){
  //update player state
  player_obj.setPositionByGPS(gps_last_timepoint);
  player_obj.setRenderPosition(player_obj,pixi_center_x,pixi_center_y); //always in center
  player_obj.updateTimerStateVars();
  
  //update player UI rendering
  map_obj.setRenderPosition(player_obj,pixi_center_x,pixi_center_y,UI_zoomFactor);
  player_obj.sprite.width = player_obj.gameworld_width*UI_zoomFactor;
  player_obj.sprite.height = player_obj.gameworld_height*UI_zoomFactor;

  //update player's assets state and UI rendering
  for(const c of player_obj.cupcakes){
      c.convertMummyIfClose(mummies,player_obj);
      c.sprite.width = c.gameworld_width*UI_zoomFactor;
      c.sprite.height = c.gameworld_height*UI_zoomFactor;
  }

  //lasso in nearby sites if player using lasso strike
  player_obj.lassoAttractIfStrike(digsites);

}

/*function updateMusic(){
  
  let chase_mode = false;
  
  for(const m of mummies){
    if(m.isActive()==true){
      chase_mode=true;
    } 
  }
  
  let getUrl = window.location;
  let bg_audio_promise_fulfilled = false;
  getUrl = getUrl.protocol + "//" + getUrl.host;// + "/" + getUrl.pathname.split('/')[1];
  if(chase_mode==true && user_has_interacted_with_UI==true) {
    //console.log("here is src: "++soundEffect2.src);
    if(soundEffect2.src==(getUrl+"/sounds/fesliyan_chase.mp3")) {
      //pass
    }else {
      //console.log("start chase");
      soundEffect2.src=getUrl+"/sounds/fesliyan_chase.mp3";
      soundEffect2.play();
      bg_audio_promise_fulfilled = false; //resets a boolean to false so it can be activated when switch to bg music
    }  
  }else if (user_has_interacted_with_UI==true){ 
    //chase mode is false
    if(soundEffect2.src==(getUrl+"/sounds/calm_bg.mp3") && bg_audio_promise_fulfilled==true) {
      //already loaded bg music and playing, so let it keep playing
    }else if (bg_audio_promise_fulfilled==false) { 
      //code for switching to bg music at random timepoint
      console.log("start bg music");
      soundEffect2.src=getUrl+"/sounds/calm_bg.mp3";
      let se2_promise = soundEffect2.play();
      //to load and switch to random timepoint, first need to check loaded (via promise), then move to timepoint
      //if (se2_promise!=undefined)
      //{
      //  let time1 = Math.floor(Math.random()*500);
      //  soundEffect2.currentTime = time1; 
      //  console.log(time1);
      //}

    }
  }
}
*/
