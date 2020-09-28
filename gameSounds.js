

function updateMusic(){
  
  let chase_mode = false;
  
  for(const m of mummies){
    if(m.isActive()==true){
      chase_mode=true;
    } 
  }
  
  let getUrl = window.location;
  //let bg_audio_promise_fulfilled = false;
  getUrl = getUrl.protocol + "//" + getUrl.host;// + "/" + getUrl.pathname.split('/')[1];
  if(chase_mode==true && user_has_interacted_with_UI==true) {
    //console.log("here is src: "++soundEffect2.src);
    if(sfx_2.bg_music.src==(getUrl+"/sounds/fesliyan_chase.mp3")) {
      //pass
    }else {
      //console.log("start chase");
      sfx_2.chaseMusic();
    }  
  }else if (user_has_interacted_with_UI==true){ 
    //chase mode is false
    if(sfx_2.bg_music.src==(getUrl+"/sounds/calm_bg.mp3")){
      //already loaded bg music and playing, so let it keep playing
    }else if (true) { 
      console.log("start bg music");
      sfx_2.calmMusic(); 
    }
  }
}





function SoundFX(){

	let sfx = Object.create(SoundFX.prototype);

  sfx.soundEffect = new Audio(); //short SFX
  sfx.bg_music = new Audio(); //background music
  sfx.getUrl = window.location;
  sfx.getUrlBase = sfx.getUrl.protocol + "//" + sfx.getUrl.host;

  sfx.soundEffect.onended = function() {
    console.log("track ended");
    sfx.soundEffect.src=""; //release the track from the audio one complete
  };

  console.log('sfx made');
  return sfx;
}


SoundFX.prototype.heartbeat = function () {
    if(this.soundEffect.src != (this.getUrlBase+'/sounds/shortheartbeat.mp3')){
      this.soundEffect.src = '/sounds/shortheartbeat.mp3';
      this.soundEffect.play(); 
    }
 }

SoundFX.prototype.trespass = function () {
    if(this.soundEffect.src != (this.getUrlBase+ '/sounds/trespass.mp3')){
      this.soundEffect.src = '/sounds/trespass.mp3';
      this.soundEffect.play();
    }
  }

SoundFX.prototype.mummyAwaken = function () {
    if(this.soundEffect.src != (this.getUrlBase+ '/sounds/mummyAwaken.mp3')){
      this.soundEffect.src = '/sounds/mummyAwaken.mp3';
      this.soundEffect.play();
    }
  }


SoundFX.prototype.mummyFall = function () {
    if(this.soundEffect.src != (this.getUrlBase+ '/sounds/fall_public.wav')){
      this.soundEffect.src = '/sounds/fall_public.wav';
      this.soundEffect.play();
    }
  }


SoundFX.prototype.bell = function () {
    if(this.soundEffect.src != (this.getUrlBase+ '/sounds/digsite.mp3')){
      this.soundEffect.src = '/sounds/digsite.mp3';
      this.soundEffect.play();
    }
  }


SoundFX.prototype.meowExplode = function () {
    if(this.soundEffect.src != (this.getUrlBase+ 'mummy_die_catbomb_public.mp3')){
      this.soundEffect.src = '/sounds/mummy_die_catbomb_public.mp3';
      this.soundEffect.play();
    }
  }

SoundFX.prototype.chaseMusic = function () {
    console.log(this.bg_music.src);
    if(this.bg_music.src != (this.getUrlBase+'/sounds/fesliyan_chase.mp3')){
      this.bg_music.src = '/sounds/fesliyan_chase.mp3';
      this.bg_music.play();
    }
}

   
SoundFX.prototype.calmMusic = function () {
    if(this.bg_music.src != (this.getUrlBase+'/sounds/calm_bg.mp3')){
      this.bg_music.src = '/sounds/calm_bg.mp3';
      this.bg_music.play();
    }
}
