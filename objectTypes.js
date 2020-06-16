//class defs for player/mummy, locations

function Player(gps_x, gps_y, x, y, sprite){
	//represents the user as a central dot
	let player = Object.create(Player.prototype);
	player.gps_x = gps_x;
	player.gps_y = gps_y;
	player.x = x;
	player.y = y;
	player.sprite=sprite;
	player.alive = true;
	//player.sprite.x = 100;
  	//player.sprite.y = 100;
  	player.sprite.anchor.set(0.5);
  	player.sprite.zOrder=1;
  	player.hearts = 4;
	return player;
}

Player.prototype.consoleLogSelf = function(){
	console.log(this.x+" "+this.y);
}

Player.prototype.setRenderPosition = function(_player_obj,_pixi_center_x,_pixi_center_y){
	this.sprite.x=_pixi_center_x;//+this.x;
	this.sprite.y=_pixi_center_y;//-this.y;
}

Player.prototype.mummyDamage = function(){
	this.hearts = this.hearts - 1;
	console.log("hearts left: "+this.hearts);
	if(this.hearts==0){
		this.sprite.texture=app.loader.resources.bonesSprite.texture;
	}
}


function Mummy (x, y, speed, sprite){
	//represents the mummies as agents that are activated and chase the user
	let mummy = Object.create(Mummy.prototype);
	mummy.x = x;
	mummy.y = y;
	mummy.speed = speed;
	mummy.active= false;
	mummy.alive = true;
	mummy.sprite=sprite;
	mummy.sprite.anchor.set(0.5);
	mummy.sprite.zOrder=2;
	return mummy;
}

Mummy.prototype.activate_if_player_close = function(_player_obj){
	let dist_from_player_sq = Math.pow(this.x-_player_obj.x,2)+Math.pow(this.y-_player_obj.y,2);
	let dist = Math.sqrt(dist_from_player_sq);
	if(dist<60 && this.active==false && this.alive){
		this.active=true;
		this.sprite.texture=app.loader.resources.mummySprite.texture;
	}
}

Mummy.prototype.attack_if_player_close = function(_player_obj){
	let dist_from_player_sq = Math.pow(this.x-_player_obj.x,2)+Math.pow(this.y-_player_obj.y,2);
	let dist = Math.sqrt(dist_from_player_sq);
	if(dist<15 && this.active){
		this.active=false;
		this.alive=false;
		_player_obj.mummyDamage();
		this.sprite.texture=app.loader.resources.bonesSprite.texture;
	}
}


Mummy.prototype.chase = function(_player_obj) {
	if (this.alive && this.active){
		this.x += (_player_obj.x-this.x)/(50*this.speed);
		this.y += (_player_obj.y-this.y)/(50*this.speed);
	}
}

Mummy.prototype.consoleLogSelf = function() {
	console.log(this.x+" "+this.y+" "+this.sprite.x+" "+this.sprite.y+" "+this.speed);
}

Mummy.prototype.setRenderPosition = function(_pixi_center_x,_pixi_center_y,_player_obj_x, player_obj_y) {
	//users player object's location as a reference point
	let pairXY = txf_gameworld_to_UI([this.x,this.y], _pixi_center_x, _pixi_center_y, _player_obj_x, player_obj_y);
	this.sprite.x = pairXY[0];
	this.sprite.y = pairXY[1];
	//console.log("mummy render position:"+this.sprite.x+" "+this.sprite.y )
}




function Digsite(x, y, digsiteFunction, sprite){
	let digsite = Object.create(Digsite.prototype);
	digsite.x = x;
	digsite.y = y;
	digsite.digsiteFunction = digsiteFunction; //passes a function to perform on player or mummies (or whatever)
	digsite.sprite = sprite;
	digsite.revealed = false;
	return digsite;
}


Digsite.prototype.activate_if_player_close = function(obj_to_act_on,_player_obj){
	let dist_from_player_sq = Math.pow(this.x-_player_obj.x,2)+Math.pow(this.y-_player_obj.y,2);
	let dist = Math.sqrt(dist_from_player_sq);
	if(dist<50 && this.revealed==false){
		this.revealed=true;
		this.digsiteFunction(obj_to_act_on);
	}
}

Digsite.prototype.revealsite = function(){
	console.log("revealing digsite index: "+digsite.index);
}

//some digsite functions
function digsiteAddsHearts(_player_obj){
	_player_obj.hearts = _player_obj.hearts + 2;
}

Digsite.prototype.setRenderPosition = function(_pixi_center_x,_pixi_center_y,_player_obj_x, player_obj_y) {
	//users player object's location as a reference point
	let pairXY = txf_gameworld_to_UI([this.x,this.y], _pixi_center_x, _pixi_center_y, _player_obj_x, player_obj_y);
	this.sprite.x = pairXY[0];
	this.sprite.y = pairXY[1];
	//console.log("mummy render position:"+this.sprite.x+" "+this.sprite.y )
}




function Map (sprite,
	  mapTopLeftGpsCoordX, mapTopLeftGpsCoordY, 
	  mapBottomRightGpsCoordX, mapBottomRightGpsCoordY,
      origin_gps_x,origin_gps_y,
      gps_to_map_scale_factor,long_over_lat_degree_dist_ratio,
      pixi_center_x,pixi_center_y){

	let map = Object.create(Map.prototype);
	
	//assign the map image as the sprite	
	map.sprite = sprite;

	//get gameworld coordinate pairs for map's top left corner and map's bottom left corner using gps coordinates, origin reference, and scale factor
	map.map_coords_top_left = txf_GPS_to_gameworld(mapTopLeftGpsCoordX, mapTopLeftGpsCoordY, 
      origin_gps_x,origin_gps_y,gps_to_map_scale_factor,long_over_lat_degree_dist_ratio);
	map.map_coords_bottom_right = txf_GPS_to_gameworld(mapBottomRightGpsCoordX, mapBottomRightGpsCoordY, 
      origin_gps_x,origin_gps_y,gps_to_map_scale_factor,long_over_lat_degree_dist_ratio);

	//get UI coordinate pairs for map's top left corner and map's bottom using gameworld coordinates
	map.map_UI_coords_top_left = txf_gameworld_to_UI(map.map_coords_top_left, pixi_center_x,pixi_center_y, 0, 0);
	map.map_UI_coords_bottom_right = txf_gameworld_to_UI(map.map_coords_bottom_right, pixi_center_x,pixi_center_y, 0, 0);
	
	//assign map sprite location and store initial location
	map.init_UI_x = Math.round(map.map_UI_coords_top_left[0]);
	map.sprite.x = map.init_UI_x;
	map.init_UI_y = Math.round(map.map_UI_coords_top_left[1]);
	map.sprite.y = map.init_UI_y;

	//determine sprite width and height based on differences between top left and bottom right in terms of x and y
	map.sprite.width = Math.round(map.map_UI_coords_bottom_right[0]-map.map_UI_coords_top_left[0]);
  	map.sprite.height = Math.round(map.map_UI_coords_bottom_right[1]-map.map_UI_coords_top_left[1]);

  	map.sprite.anchor.set(0,0);

	return map;
}

Map.prototype.consoleLogSelf = function() {
	console.log(this.x+" "+this.y+" "+this.speed);
}

Map.prototype.setRenderPosition = function(_player_obj, _pixi_center_x, _pixi_center_y) {
	//users player object's location as a reference point
	this.sprite.x= (-1)*_player_obj.x+ this.init_UI_x;
	this.sprite.y= _player_obj.y + this.init_UI_y;
}






/*

notes from a webdigsite: 

Difference between class- and prototype-based inheritance: 
class defines type to be instantiated at runtime, whereas a 
 prototype is itself an object instance. 

JavaScript doesn’t have a concept of 'methods' as assets of a class. functions are first class cits

*/


