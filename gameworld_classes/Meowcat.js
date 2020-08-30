

function Meowcat (x,y,sprite){
	let meowcat = Object.create(Meowcat.prototype);
	meowcat.x=x;
	meowcat.y=y;
	meowcat.gameworld_width = 30;
	meowcat.gameworld_height = 30;
	meowcat.sprite=sprite;
	meowcat.dead=false;
	meowcat.activated=false;
	meowcat.sprite.visible = false;
	meowcat.indestructible = Math.random() < 0.0; // 0% chance of indestructible meowcat
	if(meowcat.indestructible){meowcat.sprite.texture=app.loader.resources.blackHoleSprite.texture;}
	console.log("made meowcat");
	return meowcat;
}

Meowcat.prototype.activate = function(_player_obj){
	this.x = _player_obj.x;
	this.y = _player_obj.y;
	this.activated = true;
	this.sprite.visible = true;
	this.sprite.height=30;
	this.sprite.width=30;
	this.setRenderPosition(_player_obj.sprite.x,_player_obj.sprite.y,_player_obj.x, player_obj.y);
	app.stage.addChild(this.sprite);
	console.log("meowcat render position:"+this.sprite.x+" "+this.sprite.y )
}

Meowcat.prototype.convertMummyIfClose = function(_mummies,_player_obj){
	for(const m of _mummies){
		if(m.alive && m.active){
			let d = distanceFunctionInGameworld(m.x, m.y, this.x, this.y);
			if(d < (this.sprite.height/2+m.sprite.height/3) && this.activated && !this.dead){
				_player_obj.increaseScore(100);
				sfx_1.meowExplode();
				m.die(_player_obj);

				if(this.indestructible == false){
					this.dead = true;
					this.sprite.visible = false;
				}
			}
		}
	}
}

Meowcat.prototype.remove = function(){

}

Meowcat.prototype.setRenderPosition = function(_pixi_center_x,_pixi_center_y,_player_obj_x, player_obj_y) {
	//users player object's location as a reference point
	let pairXY = txf_gameworld_to_UI([this.x,this.y], _pixi_center_x, _pixi_center_y, _player_obj_x, player_obj_y,UI_zoomFactor);
	this.sprite.x = pairXY[0];
	this.sprite.y = pairXY[1];
}

//need to implement meowcat explode function
