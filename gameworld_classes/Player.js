

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
  	player.hearts = 2;
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
    		//navigator.geolocation.getCurrentPosition(getGeoPosition);
    		console.log("coords: "+gps_x_current+" "+gps_y_current);//+" "+ position.coords.accuracy);
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
		//play sound
		soundEffect.src = 'sounds/scream_public.mp3';
		soundEffect.play();

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