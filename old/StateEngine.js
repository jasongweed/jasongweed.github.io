var geo_x;
var geo_y;
var geo_offset_lat = 40.74045; 
var geo_offset_long = -73.98359;


function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(getGeoPosition);
    console.log("Got geolocation information");
  } else { 
    console.log("Geolocation is not supported.");
  }
}

function getGeoPosition(position) {
  geo_y = position.coords.latitude;
  geo_x = position.coords.longitude;
}


class Player {
	constructor(){
		this.isAlive=true;
		this.location = [0.0,0.0];
		this.invincible = false;
		this.fightLeft=3;
		//this.inventory = new Inventory();
		this.x = geo_x-geo_offset_long;
		this.y = geo_y-geo_offset_lat;
	}

	move(){
		//TODO: getlocation is a global funcition and geo_x and geo_y are global, consider localizing
		getLocation();
		this.x = geo_x-geo_offset_long; //correct for ap location
		this.y = geo_y-geo_offset_lat;
		console.log("1 geo_x", geo_x, ", geo_y ", geo_y);	
		console.log("2 player.x", this.x, ", player.x ", this.y);	

	}

	update(){
		this.move();
	}

};

class Mummy {
	constructor(message){
		this.x = Math.floor(Math.random())/100;
		this.y = Math.floor(Math.random())/100;
		this.visited = false;
		//this.currentIcon = "asdf"; //deal with image stuff later
		this.message = message;
		this.distanceFromPlayer = this.getDistanceFromPlayer();
	}

	getDistanceFromPlayer(){
		console.log("distance away, ", Math.sqrt(Math.pow(this.x-player.x,2)+Math.pow(this.y-player.y,2)));

		return Math.sqrt(Math.pow(this.x-player.x,2)+Math.pow(this.y-player.y,2));
	}

	move(){
		this.x += (player.x-this.x)/10;
		this.y += (player.y-this.y)/10;

	}

	update(){
		this.move();
		console.log(`3 mummy x is at ${this.x}, ${this.y}`);
		this.distanceFromPlayer = this.getDistanceFromPlayer();
	}

}


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}




function updateGameState(){
		player.update();
		mummy.update();
}

function updateRender(){
	$( "#playerLocation" ).text(`player is at ${player.x}, ${player.y}`);
	$( "#destLocation" ).text(`mummy is at ${mummy.x}, ${mummy.y}`);
	$( "#distance" ).text(`distance from player to mummy is ${mummy.distanceFromPlayer}`);
	$( "#" ).text(`distance from player to mummy is ${mummy.distanceFromPlayer}`);
}

//TODO
//-> initialize 'player' and then location
const player = new Player();
const mummy = new Mummy("this is a message");
var time_millis = new Date().getTime();


//setup game
function setupGame(){
}

// make game loop
async function startGameLoop(argument) {
	while(true){//
		updateGameState();
		updateRender();
		await sleep(2000);
		console.log("slept 2 seconds, at ", new Date().getTime());
	} 
}


//main
setupGame();
startGameLoop();





/*
class Inventory = {
	constructor(){
		this.hasKillAll = false;
		this.hasAddFight = false;
		this.hasLullaby = false;
		this.hasPacman = false;
		this.hasKillOne = false;
	}
	//TODO: implement inventory functions
}
*/