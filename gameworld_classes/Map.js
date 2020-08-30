//class defs for player/mummy, locations






function Map (sprite,
	  mapTopLeftGpsCoordX, mapTopLeftGpsCoordY, 
	  mapBottomRightGpsCoordX, mapBottomRightGpsCoordY,
      origin_gps_x,origin_gps_y,
      gps_to_map_scale_factor,long_over_lat_degree_dist_ratio,
      pixi_center_x,pixi_center_y){

	//console.log("for map, origin gps x,y and top left x,y"+origin_gps_x+" "+origin_gps_y+" ; "+mapTopLeftGpsCoordX+" "+mapTopLeftGpsCoordY);
	let map = Object.create(Map.prototype);
	//assign the map image as the sprite	
	map.sprite = sprite;

	//get gameworld coordinate pairs for map's top left corner and map's bottom left corner using gps coordinates, origin reference, and scale factor
	map.map_coords_top_left = txf_GPS_to_gameworld(mapTopLeftGpsCoordX, mapTopLeftGpsCoordY, 
      origin_gps_x,origin_gps_y,gps_to_map_scale_factor,long_over_lat_degree_dist_ratio);
	map.map_coords_bottom_right = txf_GPS_to_gameworld(mapBottomRightGpsCoordX, mapBottomRightGpsCoordY, 
      origin_gps_x,origin_gps_y,gps_to_map_scale_factor,long_over_lat_degree_dist_ratio);
	//console.log("maps GW coord TL, BR: "+map.map_coords_top_left+" ; "+map.map_coords_bottom_right);

	//get UI coordinate pairs for map's top left corner and map's bottom using gameworld coordinates
	map.map_UI_coords_top_left = txf_gameworld_to_UI(map.map_coords_top_left, pixi_center_x,pixi_center_y, 0, 0, UI_zoomFactor);
	map.map_UI_coords_bottom_right = txf_gameworld_to_UI(map.map_coords_bottom_right, pixi_center_x,pixi_center_y, 0, 0,UI_zoomFactor);
	
	//assign map sprite location and store initial location
	map.init_UI_x = Math.round(map.map_UI_coords_top_left[0]);
	map.sprite.x = map.init_UI_x;
	map.init_UI_y = Math.round(map.map_UI_coords_top_left[1]);
	map.sprite.y = map.init_UI_y;

	//determine sprite width and height based on differences between top left and bottom right in terms of x and y
	map.sprite.width = Math.round(map.map_UI_coords_bottom_right[0]-map.map_UI_coords_top_left[0]);
  	map.sprite.height = Math.round(map.map_UI_coords_bottom_right[1]-map.map_UI_coords_top_left[1]);
  	console.log("map width, height: "+map.sprite.width+" "+map.sprite.height);
  	map.sprite.anchor.set(0,0);

	return map;
}

Map.prototype.consoleLogSelf = function() {
	console.log(this.x+" "+this.y+" "+this.speed);
}

Map.prototype.setRenderPosition = function(_player_obj, _pixi_center_x, _pixi_center_y,_UI_zoomFactor) {
	//users player object's location as a reference point
	this.sprite.x= (-1)*_player_obj.x*_UI_zoomFactor+ this.init_UI_x;
	this.sprite.y= _player_obj.y*_UI_zoomFactor + this.init_UI_y;
}

Map.prototype.rescale = function(_UI_zoomFactor,_player_obj, zoomIn){
	if(zoomIn==true){
		formerZoomFactor = _UI_zoomFactor / 1.2;
	}else{
		formerZoomFactor = _UI_zoomFactor * 1.2;
	}
	this.sprite.width = this.sprite.width * _UI_zoomFactor/formerZoomFactor;
	this.sprite.height = this.sprite.height * _UI_zoomFactor/formerZoomFactor;
	console.log("map width,height: "+this.sprite.width+" "+this.sprite.height);
	this.init_UI_x = ((this.init_UI_x-pixi_center_x))*UI_zoomFactor/formerZoomFactor+pixi_center_x;
	this.init_UI_y = ((this.init_UI_y-pixi_center_y))*UI_zoomFactor/formerZoomFactor+pixi_center_y;
	console.log("map init UI_x,UI_y: "+this.init_UI_x+" "+this.init_UI_y+" "+_player_obj.x+" "+_player_obj.y);
	//this.init_UI_x;

}





/*

notes from a webdigsite: 

Difference between class- and prototype-based inheritance: 
class defines type to be instantiated at runtime, whereas a 
 prototype is itself an object instance. 

JavaScript doesn’t have a concept of 'methods' as assets of a class. functions are first class cits

*/


