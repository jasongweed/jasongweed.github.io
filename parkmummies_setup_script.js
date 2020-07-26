



window.onload = function(){
    app = new PIXI.Application( //jgw this creates a canvas element
    {
      width: 300,
      height: 500,
      backgroundColor: 0xAAAAAA
    }
  );
  document.querySelector("#gameDiv").appendChild(app.view); //app itself doesn't go in

  //preload assets
  app.loader.baseUrl = "images";
  app.loader.add("playerSprite","player.png").add("playerAttackModeSprite","playerAttackMode.png");
  app.loader.add("mummySprite","mummy.png").add("mummyWakingSprite","mummyWaking.png");
  app.loader.add("mapGrammercySprite","mapEastRiverPark.png").add("mapCentralParkSprite","centralpark3.png");
  app.loader.add("questionMarkSprite","question_mark.png").add("bonesSprite","bones.png").add("cupcakeSprite","cupcake.png");
  app.loader.add("pickBlueSprite","pickblue.png").add("pickRedSprite","pickred.png").add("blackHoleSprite","blackHole.png");
  app.loader.add("infinitySprite","infinity.png");
  app.loader.onProgress.add(showProgress);
  app.loader.onComplete.add(doneLoading);
  app.loader.onError.add(reportError);
  app.loader.load();



  //turn on mouse stuff
  app.stage.interactive = true;
  //app.stage.on("pointermove",movePlayerWithMouse);

  //turn on keyboard stuff
  window.addEventListener("keydown",keysDown);
  window.addEventListener("keyup",keysUp);

  //start location tracking
  getLocationInit();//this sets gps_x and gps_y vars
}


function geo_error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

var geo_options = {
  enableHighAccuracy: true,
  timeout: 1000,
  maximumAge: 500
};

function getLocationInit() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(getGeoPosition,geo_error,geo_options);
    //console.log("Got geolocation information");
    if(origin_gps_x!=null){
      gps_location_loaded=true;
    }

  } else { 
    console.log("Geolocation is not supported. Will try again");
    getLocationInit();//try again
  }
}



function getGeoPosition(position) {
  if(devTestSpot==true){
    gps_x_current=-73.977826; //-73.982065;  
    gps_y_current=40.731793;//40.737862;
  }else{
    gps_x_current = position.coords.longitude;
    gps_y_current = position.coords.latitude;
    gps_accuracy = position.coords.accuracy;
    console.log("accuracy: "+position.coords.latitude+" "+position.coords.longitude+" "+ position.coords.accuracy);
    //alert(gps_y_current);
    if(gps_location_loaded==false){
      origin_gps_x=gps_x_current;
      origin_gps_y=gps_y_current;
    }
    gps_last_timepoint = Date.now(); //global var                          
  }
}

function showProgress(e){
  console.log(e.progress);
}

function reportError(e){
  console.error("ERROR: " + e.message);
}








function doneLoading(e){


  origin_gps_x=gps_x_current;//set origin to (at this point loaded) initial gps coordinates
  origin_gps_y=gps_y_current;
  pixi_center_x = app.view.width/2.0;
  pixi_center_y = app.view.height/2.0;


  //load map as sprite store within a Map type object
  createMapAndAddToStage();
  //load mummies as sprites and place in objects
  createMummiesAndAddToStage(number_of_mummies_to_generate);
  //load digsite as sprites and place in objects
  createDigsitesAndAddToStage(number_of_digsites_to_generate)
  //load player on center stage as a Player type object, based on GPS coordinates
  createPlayerAndAddToStage();
  createInfinitySitesAndAddToStage(number_of_infsites_to_generate);

  //game loop
  app.ticker.add(gameLoop);






}
