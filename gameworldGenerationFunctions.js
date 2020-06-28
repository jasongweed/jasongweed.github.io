
function createPlayerAndAddToStage(){  //uses global variables
  let playerSprite = PIXI.Sprite.from(app.loader.resources.playerSprite.texture);
  player_obj=Player(gps_x_current, gps_y_current, 0, 0, playerSprite);
  app.stage.addChild(playerSprite);
}

function createMummiesAndAddToStage(_number_of_mummies_to_generate){ //uses global variables
  for(i=0;i<_number_of_mummies_to_generate;i++){
    let i_x=get_ranged_rand_avoid_origin(0,max_location_range_gameworld_coords_x);
    let i_y=get_ranged_rand_avoid_origin(0, -1*max_location_range_gameworld_coords_y);
    let i_speed=Math.floor(Math.random() * 20 +5);
    let i_sprite=PIXI.Sprite.from(app.loader.resources.questionMarkSprite.texture);
    app.stage.addChild(i_sprite);
    mummies.push( Mummy(i_x, i_y, i_speed, i_sprite) );
    console.log(mummies[i]);
  } 
}

function createDigsitesAndAddToStage(_number_of_digsites_to_generate){ //uses global variables
  //cupcake sites
  for(i=0;i<_number_of_digsites_to_generate;i++){
    let i_x=get_ranged_rand_avoid_origin(0,max_location_range_gameworld_coords_x);
    let i_y=get_ranged_rand_avoid_origin(0,-1*max_location_range_gameworld_coords_y);
    let i_sprite=PIXI.Sprite.from(app.loader.resources.pickBlueSprite.texture);
    app.stage.addChild(i_sprite);
    digsites.push( Digsite(i_x, i_y, digsiteAddsHearts, i_sprite,"cupcake"));
    console.log("created dig site "+i+"location:"+i_x+" "+ i_y);
  }
}
function createInfinitySitesAndAddToStage(_number_of_infinitysites_to_generate){
  for(i=0;i<_number_of_infinitysites_to_generate;i++){
    let i_x=get_ranged_rand_avoid_origin(0, max_location_range_gameworld_coords_x);
    let i_y=get_ranged_rand_avoid_origin(0, -1*max_location_range_gameworld_coords_y);
    let i_sprite=PIXI.Sprite.from(app.loader.resources.infinitySprite.texture);
    app.stage.addChild(i_sprite);
    let infinity="infinity";
    digsites.push(Digsite(i_x, i_y, digsiteAttackModeOn, i_sprite,infinity));
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





function get_ranged_rand_avoid_origin(_min_location_range_gameworld_coords_i,_max_location_range_gameworld_coords_i){
    let rnum = _min_location_range_gameworld_coords_i + ((Math.random()) * 2 -1) * _max_location_range_gameworld_coords_i;
    if(rnum>0){rnum=rnum+50;}
    if(rnum<0){rnum=rnum-50;}
    return rnum;
}