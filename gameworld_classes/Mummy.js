

function Mummy (x, y, speed, sprite){
	//represents the mummies as agents that are activated and chase the user
	let mummy = Object.create(Mummy.prototype);
	mummy.x = x;
	mummy.y = y;
	mummy.gameworld_width = 80;
	mummy.gameworld_height = 80;
	mummy.speed = speed;
	mummy.distanceTraveled = 0;
	mummy.wakingModeEndTime = 0;
	mummy.awaking = false;
	mummy.active= false;
	mummy.alive = true;
	mummy.sprite= sprite;
	mummy.sprite.anchor.set(0.5);
	mummy.sprite.zOrder=2;
	mummy.targetOtherThanPlayer_GW_xy = [];
	console.log('mummy made');
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
	if(dist<(this.sprite.height/2+_player_obj.sprite.height/3) && this.active && _player_obj.alive && _player_obj.attackMode==false && this.wakingModeEndTime<now){
		this.die(_player_obj); //mummy dies
		_player_obj.increaseScore(-100); //penalty to score
		_player_obj.mummyDamage();
	}else if(dist<3 && this.active && _player_obj.alive && _player_obj.attackMode==true){
		//attack mode, no damage from mummies
		_player_obj.increaseScore(100);
		this.die(_player_obj);
	}
}

Mummy.prototype.isActive = function(){
	return this.active;
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
			//soundEffect2.src = 'sounds/fesliyan_chase.mp3'; now this is done in the update mummies function
			//soundEffect2.play();
			this.awaking=false;
			this.active = true;
		}

		//physically chase
		let x_dist= target_x - this.x;
		let y_dist= target_y - this.y;
		let total_dist = distanceFunctionInGameworld(this.x,this.y, target_x, target_y);
		if(total_dist!=0){ 
			let diff_x = x_dist/total_dist * this.speed * 0.002;
			let diff_y = y_dist/total_dist * this.speed * 0.002;
			this.x = this.x + diff_x;
			this.y = this.y + diff_y;
			let diff_xy = Math.sqrt((Math.pow(diff_x,2))+(Math.pow(diff_y,2)));
			this.distanceTraveled += diff_xy;
			
			//add a score bonus for continued chasing, unless attackMode in which case subtract
			if(_player_obj.attackMode == false){
				_player_obj.score += 1/3*diff_xy;
			}else{
				_player_obj.score -= 1/3*diff_xy;
			}

			
		}

		//die if chase over distance limit
		if(this.distanceTraveled >= 600){
			this.die(_player_obj);
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
		//play sound
		soundEffect.src = 'sounds/mummy_die_catbomb_public.mp3';
		soundEffect.play();
}

Mummy.prototype.setRenderPosition = function(_pixi_center_x,_pixi_center_y,_player_obj_x, player_obj_y) {
	//users player object's location as a reference point
	let pairXY = txf_gameworld_to_UI([this.x,this.y], _pixi_center_x, _pixi_center_y, _player_obj_x, player_obj_y, UI_zoomFactor);
	this.sprite.x = pairXY[0];
	this.sprite.y = pairXY[1];
}
