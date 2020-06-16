//global variables, constants


//basic gps setup
var gps_to_map_scale_factor = 20000; //default is 100000 
var devTestSpot = false;
var origin_gps_x = null; //this is a latitude based on initial gps coordinates obtained
var origin_gps_y = null; 
let gps_location_loaded = false;
//var to keep track of current gps coordinates
var gps_x_current; 
var gps_y_current;

//pixi and game vars
let app;
let playerSprite;
let mummySprite;
let map_obj;
let pixi_center_x;  //x coordinate center of UI, to be instantiate when pixi loads
let pixi_center_y;  //y coordinate center of UI, to be instantiate when pixi loads
let map;
let mummies = [];
let digsites = [];
let keys = {}; //for accumulating pressed keyboard keys


//aligning map: must be precise
//grammery map lower right: 40.738650, -73.980678. Upper left: 40.742877, -73.985388
//river map, brooklyn area bottom right 40.727728,-73.935025  . bryant park 40.753611,-73.983399
var mapTopLeftGpsCoordX = -73.983399;
var mapTopLeftGpsCoordY = 40.753611;
var mapBottomRightGpsCoordX = -73.935025;
var mapBottomRightGpsCoordY = 40.727728;
var long_over_lat_degree_dist_ratio = 1.40;

window.onload = function(){
    app = new PIXI.Application( //jgw this creates a canvas element
    {
      width: 600,
      height: 800,
      backgroundColor: 0xAAAAAA
    }
  );
  document.querySelector("#gameDiv").appendChild(app.view); //app itself doesn't go in

  //preload assets
  app.loader.baseUrl = "images";
  app.loader.add("playerSprite","player.png").add("mummySprite","mummy.png").add("mapGrammercySprite","mapGreatLawn.png");
  app.loader.add("questionMarkSprite","question_mark.png").add("bonesSprite","bones.png").add("diamondSprite","diamond.png");
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

function getLocationInit() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(getGeoPosition);
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
    gps_x_current=-73.967025; //-73.982065;  
    gps_y_current=40.780900;//40.737862;
  }else{
    gps_x_current = position.coords.longitude;
    gps_y_current = position.coords.latitude;
    //alert(gps_y_current);
    if(gps_location_loaded==false){
      origin_gps_x=gps_x_current;
      origin_gps_y=gps_y_current;
    }                          
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
  createMummiesAndAddToStage();
  //load digsite as sprites and place in objects
  createDigsitesAndAddToStage()
  //load player on center stage as a Player type object, based on GPS coordinates
  createPlayerAndAddToStage();

  //game loop
  app.ticker.add(gameLoop);
}


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





function createPlayerAndAddToStage(){  //uses global variables
  playerSprite = PIXI.Sprite.from(app.loader.resources.playerSprite.texture);
  player_obj=Player(gps_x_current, gps_y_current, 0, 0, playerSprite);
  app.stage.addChild(playerSprite);
}

function createMummiesAndAddToStage(){ //uses global variables
  for(i=0;i<5;i++){
    let i_x=Math.floor((Math.random()-0.5) * 2 * Math.floor(300));
    let i_y=Math.floor((Math.random()-0.5) * 2 * Math.floor(500));
    let i_speed=Math.floor(Math.random() * 20);
    let i_sprite=PIXI.Sprite.from(app.loader.resources.questionMarkSprite.texture);
    app.stage.addChild(i_sprite);
    mummies.push( Mummy(i_x, i_y, i_speed, i_sprite) );
    console.log(mummies[i]);
  }
}

function createDigsitesAndAddToStage(){ //uses global variables
  for(i=0;i<5;i++){
    let i_x=Math.floor((Math.random()-0.5) * 2 * Math.floor(300));
    let i_y=Math.floor((Math.random()-0.5) * 2 * Math.floor(500));
    let i_sprite=PIXI.Sprite.from(app.loader.resources.diamondSprite.texture);
    app.stage.addChild(i_sprite);
    digsites.push( Digsite(i_x, i_y, digsiteAddsHearts, i_sprite) );
    console.log("created dig site "+i+"location:"+i_x+" "+ i_y);
  }
}

function createMapAndAddToStage(){   //uses global variables
  //load map as sprite store within a Map type object
  mapSprite = PIXI.Sprite.from(app.loader.resources.mapGrammercySprite.texture);
  app.stage.addChild(mapSprite);
  map_obj = Map (mapSprite,
    mapTopLeftGpsCoordX, mapTopLeftGpsCoordY, 
    mapBottomRightGpsCoordX, mapBottomRightGpsCoordY,
      origin_gps_x, origin_gps_y,
      gps_to_map_scale_factor, long_over_lat_degree_dist_ratio,
      pixi_center_x, pixi_center_y);
  console.log("map location: "+map_obj.sprite.x+" "+map_obj.sprite.y);
  console.log("map width height: "+map_obj.sprite.width+" "+map_obj.sprite.height)
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
      s.activate_if_player_close(player_obj, player_obj);
      s.setRenderPosition(pixi_center_x,pixi_center_y,player_obj.x,player_obj.y);
      //m.consoleLogSelf();
  }
}


function updatePlayer(){
  player_obj.setRenderPosition(player_obj,pixi_center_x,pixi_center_y);
  map_obj.setRenderPosition(player_obj,pixi_center_x,pixi_center_y);
  //console.log("player obj GW coords"+player_obj.x, player_obj.y);
}









