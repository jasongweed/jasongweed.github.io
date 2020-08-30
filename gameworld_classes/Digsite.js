

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
		sfx_1.bell();
        
        _player_obj.increaseScore(50);
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
	_player_obj.addMeowcat();
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
