


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




