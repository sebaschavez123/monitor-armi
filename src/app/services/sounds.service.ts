import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SoundsService {

  constructor() { }

  notification(){
    // this.play(new Audio('assets/sounds/nofitication_sound.mp3'));
  }

  alert(){
    this.play(new Audio('assets/sounds/alert_sound.mp3'));
  }

  private play(audio){
    const stopAttempt = setInterval(() => {
      const playPromise = audio.play();
      if (playPromise) {
        playPromise.then(() => {
          clearInterval(stopAttempt)
        }).catch(e=>{})
      }
  }, 100 )
  }
}
