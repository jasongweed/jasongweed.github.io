//class defs for player/mummy, locations

function Player(gps_x, gps_y, x, y, sprite){
	//represents the user as a central dot
	let player = Object.create(Player.prototype);
	player.gps_x = gps_x;
	player.gps_y = gps_y;
	player.x = x;
	player.y = y;
	player.sprite=sprite;
	player.sprite.width=50;
	player.sprite.height=50;
	player.gameworld_width=50;
	player.gameworld_height=50;
	player.sprite.anchor.set(0.5);
  	player.sprite.zOrder=1;
	player.alive = true;
	player.score = 0;
  	player.hearts = 1;
  	player.attackMode = false;
  	player.cupcakes = []; //array to add cupcake objects
  	player.lassoStrikes = 10;
  	player.lassoAttractEndTime = 0;
  	player.attackModeEndTime = 0;
	return player;
}

Player.prototype.consoleLogSelf = function(){
	console.log(this.x+" "+this.y);
}

Player.prototype.setPositionByGPS = function(gps_last_timepoint){
	if(devTestSpot==true){
		//pass
	}else{
		//console.log(gps_last_timepoint);
		if (navigator.geolocation && Date.now()%1000<50 && (Date.now() - gps_last_timepoint)>500) {
    		navigator.geolocation.getCurrentPosition(getGeoPosition);
    		console.log("now gps position");
			let pair = txf_GPS_to_gameworld(gps_x_current,gps_y_current, origin_gps_x, origin_gps_y, gps_to_map_scale_factor,long_over_lat_degree_dist_ratio);
			this.x = pair[0];
			this.y = pair[1];
		}
	}
}

Player.prototype.setRenderPosition = function(_player_obj,_pixi_center_x,_pixi_center_y){
	this.sprite.x=_pixi_center_x;//+this.x;
	this.sprite.y=_pixi_center_y;//-this.y;
}

Player.prototype.attackModeOn = function(){
	console.log("attackMode on")
	this.attackMode = true;
	if(devTestSpot){
		this.attackModeEndTime = Date.now()+10000;
	}else{//real gameplay
		this.attackModeEndTime = Date.now()+300000; //5 minutes of attack mode with 300k
	}
	this.sprite.texture=app.loader.resources.playerAttackModeSprite.texture;
}

Player.prototype.mummyDamage = function(){
	if(this.attackMode == false){
			this.hearts = this.hearts - 1;
	}
	console.log("hearts left: "+this.hearts);
	if(this.hearts==0){
		this.sprite.texture=app.loader.resources.bonesSprite.texture;
		this.alive=false;
	}
}

Player.prototype.getCupcakes = function(){
	return this.cupcakes;
}

Player.prototype.addCupcake = function(sprite){
	let i_x=this.x;
    let i_y=this.y;
    let i_sprite=PIXI.Sprite.from(app.loader.resources.cupcakeSprite.texture);
   	i_sprite.anchor.set(0.5);
	i_sprite.zOrder=2;

    app.stage.addChild(i_sprite);
    //add new cupcake to array
    this.cupcakes.push( Cupcake(i_x, i_y, i_sprite) );
    console.log("created cupcake "+i+"location:"+i_x+" "+ i_y);
}

Player.prototype.dropCupcake = function(){
	//note: not yet implemented in gameplay
	for(const b of this.cupcakes){
		if (b.activated==false){
			b.activate(this);
			console.log("cupcake activated");
			break;
		}else{
			console.log("no cupcakes");		}
	}
}

Player.prototype.lassoStrike = function(){
	//uses one lassoStrike in inventory and sets ending time for lassoAttract function
	if(this.lassoStrikes>0){
		this.lassoStrikes = this.lassoStrikes - 1;
		this.lassoAttractEndTime = Date.now()+5000;
	}
}

Player.prototype.lassoAttractIfStrike = function(_site_objs){
	//attracts nearby (perhaps out of reach) reward sites to players after the the lassoStrike function is activated by a button press
	if(Date.now()<this.lassoAttractEndTime){
		for(const site of _site_objs){
			let d = distanceFunctionInGameworld(site.x, site.y, this.x, this.y);
			if(d<80 && site.revealed==false){
				console.log("lassoing");
				let x_dist= site.x - this.x;
				let y_dist= site.y - this.y;
				let total_dist = distanceFunctionInGameworld(site.x,site.y, this.x, this.y);
				if(total_dist!=0){ 
					site.x = site.x - x_dist/total_dist * 100 * 0.002;
					site.y = site.y - y_dist/total_dist * 100 * 0.002;
				}
			}
		}		
	}
}

Player.prototype.increaseScore = function(num){
	this.score = this.score+num;
}


Player.prototype.updateTimerStateVars = function(){
	let now = Date.now();
	//see if attack mode active or expired
	if(this.attackMode && now>this.attackModeEndTime){
		this.attackMode = false;
		this.sprite.texture=app.loader.resources.playerSprite.texture;
		console.log("attack mode off");
	}

	//see if cupcakes active
	for(const b of this.cupcakes){
		//6/17/20: currently working on adding button to activate gathered explosive cupcakes
		if (b.activated && !b.dead){
			b.setRenderPosition(pixi_center_x,pixi_center_y,this.x, this.y);
		}
	}
}



function Cupcake (x,y,sprite){
	let cupcake = Object.create(Cupcake.prototype);
	cupcake.x=x;
	cupcake.y=y;
	cupcake.gameworld_width = 30;
	cupcake.gameworld_height = 30;
	cupcake.sprite=sprite;
	cupcake.dead=false;
	cupcake.activated=false;
	cupcake.sprite.visible = false;
	cupcake.indestructible = Math.random() < 0.2; // 20% chance of indestructible cupcake
	if(cupcake.indestructible){cupcake.sprite.texture=app.loader.resources.blackHoleSprite.texture;}
	console.log("made cupcake");
	return cupcake;
}

Cupcake.prototype.activate = function(_player_obj){
	this.x = _player_obj.x;
	this.y = _player_obj.y;
	this.activated = true;
	this.sprite.visible = true;
	this.sprite.height=30;
	this.sprite.width=30;
	this.setRenderPosition(_player_obj.sprite.x,_player_obj.sprite.y,_player_obj.x, player_obj.y);
	app.stage.addChild(this.sprite);
	console.log("cupcake render position:"+this.sprite.x+" "+this.sprite.y )
}

Cupcake.prototype.convertMummyIfClose = function(_mummies,_player_obj){
	for(const m of _mummies){
		if(m.alive && m.active){
			let d = distanceFunctionInGameworld(m.x, m.y, this.x, this.y);
			if(d < 15 && this.activated && !this.dead){
				m.die(_player_obj);
				//play sound
				soundEffect.src = 'sounds/eatcupcake.mp3';
				soundEffect.play();

				if(this.indestructible == false){
					this.dead = true;
					this.sprite.visible = false;
				}
			}
		}
	}
}

Cupcake.prototype.remove = function(){

}

Cupcake.prototype.setRenderPosition = function(_pixi_center_x,_pixi_center_y,_player_obj_x, player_obj_y) {
	//users player object's location as a reference point
	let pairXY = txf_gameworld_to_UI([this.x,this.y], _pixi_center_x, _pixi_center_y, _player_obj_x, player_obj_y,UI_zoomFactor);
	this.sprite.x = pairXY[0];
	this.sprite.y = pairXY[1];
}

//need to implement cupcake explode function


function Mummy (x, y, speed, sprite){
	//represents the mummies as agents that are activated and chase the user
	let mummy = Object.create(Mummy.prototype);
	mummy.x = x;
	mummy.y = y;
	mummy.gameworld_width = 80;
	mummy.gameworld_height = 80;
	mummy.speed = speed;
	mummy.wakingModeEndTime = 0;
	mummy.awaking = false;
	mummy.active= false;
	mummy.alive = true;
	mummy.sprite= sprite;
	mummy.sprite.anchor.set(0.5);
	mummy.sprite.zOrder=2;
	mummy.targetOtherThanPlayer_GW_xy = [];
	return mummy;
}

Mummy.prototype.activate_if_player_close = function(_player_obj){
	let dist_from_player_sq = Math.pow(this.x-_player_obj.x,2)+Math.pow(this.y-_player_obj.y,2);
	let dist = Math.sqrt(dist_from_player_sq);
	if(dist<50 && this.active==false && this.alive && _player_obj.alive){
		if(devTestSpot==true){
			this.wakingModeEndTime = Date.now()+3000;
		}else{
			this.wakingModeEndTime = Date.now()+20000;
		}
		if(this.awaking==false){
			//play sound
			// later on when you actually want to play a sound at any point without user interaction
			soundEffect.src = 'sounds/trespass.mp3';
			soundEffect.play();
			//let trespassSound = new sound("sounds/trespass.mp3");
			//trespassSound.play();
		}
		this.awaking = true;
		this.sprite.texture = app.loader.resources.mummyWakingSprite.texture;
		this.gameworld_width = 30;
		this.gameworld_height = 30;
	}
}

Mummy.prototype.attack_if_player_close = function(_player_obj){
	let now = Date.now();
	let dist_from_player_sq = Math.pow(this.x-_player_obj.x,2)+Math.pow(this.y-_player_obj.y,2);
	let dist = Math.sqrt(dist_from_player_sq);
	if(dist<10 && this.active && _player_obj.alive && _player_obj.attackMode==false && this.wakingModeEndTime<now){
		this.die(_player_obj);
		_player_obj.mummyDamage();
	}else if(dist<3 && this.active && _player_obj.alive && _player_obj.attackMode==true){
		//attack mode, no damage from mummies
		this.die(_player_obj);
	}
}


Mummy.prototype.chase = function(_player_obj) {
	let now = Date.now();
	let target_x =_player_obj.x;
	let target_y =_player_obj.y;
	if(this.alive && (this.active || this.awaking) && _player_obj.alive && this.wakingModeEndTime<now){

		//chase a cupcake if it's nearby instead of the player
		for(const c of _player_obj.getCupcakes()){
			let d = distanceFunctionInGameworld(c.x, c.y, this.x, this.y)
			if(c.activated && c.dead==false && d<50 ){
				target_x = c.x;
				target_y = c.y;
				break;
			}
		}

		//do waking steps and change to active mode if first awaking
		if(this.awaking){
			this.sprite.texture = app.loader.resources.mummySprite.texture;
			//play sound
			soundEffect.src = 'sounds/mummyAwaken.mp3';
			soundEffect.play();
			this.awaking=false;
			this.active = true;
		}

		//physically chase
		let x_dist= target_x - this.x;
		let y_dist= target_y - this.y;
		let total_dist = distanceFunctionInGameworld(this.x,this.y, target_x, target_y);
		if(total_dist!=0){ 
			this.x = this.x + x_dist/total_dist * this.speed * 0.002;
			this.y = this.y + y_dist/total_dist * this.speed * 0.002;
		}

		//play heartbeat sound if close 
		if(target_x==_player_obj.x && target_y==_player_obj.y && total_dist<80){

			if (soundEffect.duration > 0 && !soundEffect.paused) {
				//do nothing
			}else{
				soundEffect.src = 'sounds/shortheartbeat.mp3';
				soundEffect.play();
			}
		}
		//this.x += (_player_obj.x-this.x)/(50*this.speed);
		//this.y += (_player_obj.y-this.y)/(50*this.speed);

	}
}

Mummy.prototype.consoleLogSelf = function() {
	console.log(this.x+" "+this.y+" "+this.sprite.x+" "+this.sprite.y+" "+this.speed);
}

Mummy.prototype.die = function(_player_obj){
		this.active=false;
		this.alive=false;
		this.sprite.texture=app.loader.resources.bonesSprite.texture;
		_player_obj.increaseScore(1);
}

Mummy.prototype.setRenderPosition = function(_pixi_center_x,_pixi_center_y,_player_obj_x, player_obj_y) {
	//users player object's location as a reference point
	let pairXY = txf_gameworld_to_UI([this.x,this.y], _pixi_center_x, _pixi_center_y, _player_obj_x, player_obj_y, UI_zoomFactor);
	this.sprite.x = pairXY[0];
	this.sprite.y = pairXY[1];
}




function Digsite(x, y, digsiteFunction, sprite, type){
	let digsite = Object.create(Digsite.prototype);
	digsite.x = x;
	digsite.y = y;
	digsite.gameworld_width = 30;
	digsite.gameworld_height = 30;
	digsite.type = type;
	digsite.digsiteFunction = digsiteFunction; //passes a function to perform on player or mummies (or whatever)
	digsite.sprite = sprite;
	digsite.sprite.anchor.set(0.5);
	digsite.sprite.zOrder=3;
	digsite.revealed = false;
	return digsite;
}


Digsite.prototype.activate_if_player_close = function(obj_to_act_on,_player_obj){
	let dist_from_player_sq = Math.pow(this.x-_player_obj.x,2)+Math.pow(this.y-_player_obj.y,2);
	let dist = Math.sqrt(dist_from_player_sq);
	if(dist<30 && this.revealed==false && _player_obj.alive){
		//play sound
		let digsiteSound = new sound("sounds/digsite.mp3");
		digsiteSound.play();
		this.awaking=false;
		this.revealed=true;
		this.sprite.texture=app.loader.resources.pickRedSprite.texture;
		this.digsiteFunction(obj_to_act_on);
	}
}

Digsite.prototype.revealsite = function(){
	console.log("revealing digsite index: "+digsite.index);
}

//some digsite functions
function digsiteAddsHearts(_player_obj){
	_player_obj.hearts = _player_obj.hearts + 1;
	console.log("hearts: "+_player_obj.hearts+" "+Date.now());
	_player_obj.addCupcake();
}

function digsiteAttackModeOn(_player_obj){
	_player_obj.attackModeOn();	
}

Digsite.prototype.setRenderPosition = function(_pixi_center_x,_pixi_center_y,_player_obj_x, player_obj_y) {
	//users player object's location as a reference point
	let pairXY = txf_gameworld_to_UI([this.x,this.y], _pixi_center_x, _pixi_center_y, _player_obj_x, player_obj_y, UI_zoomFactor);
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
	console.log("map init x,y: "+this.init_UI_x+" "+this.init_UI_y+" "+_player_obj.x+" "+_player_obj.y);
	//this.init_UI_x;

}





/*

notes from a webdigsite: 

Difference between class- and prototype-based inheritance: 
class defines type to be instantiated at runtime, whereas a 
 prototype is itself an object instance. 

JavaScript doesn’t have a concept of 'methods' as assets of a class. functions are first class cits

*/


