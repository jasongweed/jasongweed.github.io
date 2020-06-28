



function gameLoop(){
  if (gps_location_loaded){
    getKeyBoardInput();
    updatePlayer();
    updateMummies();
    updateDigsites();
  }else{
    //if location not loaded, retry
    getLocationInit();
  }
}



function updateMummies(){
  for(const m of mummies){
      m.activate_if_player_close(player_obj);
      m.chase(player_obj);
      m.setRenderPosition(pixi_center_x,pixi_center_y,player_obj.x,player_obj.y);  
      m.attack_if_player_close(player_obj);
      //m.consoleLogSelf();
  }
}

function updateDigsites(){
  let i=0;
  for(const s of digsites){
      if(s.type=="cupcake"){
        s.activate_if_player_close(player_obj, player_obj);
      }else if(s.type=="infinity"){
        s.activate_if_player_close(player_obj,player_obj);
      }
      s.setRenderPosition(pixi_center_x,pixi_center_y,player_obj.x,player_obj.y);
      //m.consoleLogSelf();
  }
}


function updatePlayer(){
  player_obj.setPositionByGPS();
  player_obj.setRenderPosition(player_obj,pixi_center_x,pixi_center_y);
  player_obj.updateTimerStateVars();
  map_obj.setRenderPosition(player_obj,pixi_center_x,pixi_center_y,UI_zoomFactor);
  for(const b of player_obj.cupcakes){
      b.convertMummyIfClose(mummies,player_obj);
  }
  //console.log("player obj GW coords"+player_obj.x, player_obj.y);
}