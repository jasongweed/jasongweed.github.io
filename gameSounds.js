

function updateMusic(){
  
  let chase_mode = false;
  
  for(const m of mummies){
    if(m.isActive()==true){
      chase_mode=true;
    } 
  }
  
  let getUrl = window.location;
  let bg_audio_promise_fulfilled = false;
  getUrl = getUrl.protocol + "//" + getUrl.host;// + "/" + getUrl.pathname.split('/')[1];
  if(chase_mode==true && user_has_interacted_with_UI==true) {
    //console.log("here is src: "++soundEffect2.src);
    if(soundEffect2.src==(getUrl+"/sounds/fesliyan_chase.mp3")) {
      //pass
    }else {
      //console.log("start chase");
      soundEffect2.src=getUrl+"/sounds/fesliyan_chase.mp3";
      soundEffect2.play();
      bg_audio_promise_fulfilled = false; //resets a boolean to false so it can be activated when switch to bg music
    }  
  }else if (user_has_interacted_with_UI==true){ 
    //chase mode is false
    if(soundEffect2.src==(getUrl+"/sounds/calm_bg.mp3") && bg_audio_promise_fulfilled==true) {
      //already loaded bg music and playing, so let it keep playing
    }else if (bg_audio_promise_fulfilled==false) { 
      //code for switching to bg music at random timepoint
      console.log("start bg music");
      soundEffect2.src=getUrl+"/sounds/calm_bg.mp3";
      let se2_promise = soundEffect2.play();
      //to load and switch to random timepoint, first need to check loaded (via promise), then move to timepoint
      //if (se2_promise!=undefined)
      //{
      //  let time1 = Math.floor(Math.random()*500);
      //  soundEffect2.currentTime = time1; 
      //  console.log(time1);
      //}

    }
  }
}








//currently this is not being used


function Sound(src) {
      let soundy = Object.create(Sound.prototype);
      soundy = document.createElement("audio");
      soundy.src = src;
      soundy.setAttribute("preload", "auto");
      soundy.setAttribute("controls", "none");
      soundy.style.display = "none";
      document.body.appendChild(this.soundy);
      this.play = function(){
        this.sound.play();
      }
      this.stop = function(){
        this.sound.pause();
      }
}

Sound.prototype.play_or_continue_track(trackname) = function(){
  if(this.sound.src!=trackname){
    this.play(trackname);
  }
}




