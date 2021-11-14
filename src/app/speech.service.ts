import { Injectable } from '@angular/core';
declare var webkitSpeechRecognition: any;

@Injectable({
  providedIn: 'root'
})
export class SpeechService {
 recognition =  new webkitSpeechRecognition();
  isStoppedSpeechRecog = false;
  text = [];
  tempWords;

  constructor() { }

  init() {

    this.recognition.interimResults = true;
    this.recognition.lang = 'de-DE';

    this.recognition.addEventListener('result', (e) => {
      const transcript = Array.from(e.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join('');
      this.tempWords = transcript;
    });
  }

  start() {
    this.isStoppedSpeechRecog = false;
    this.recognition.start();
    console.log("Speech recognition started")
    this.recognition.addEventListener('end', (condition) => {
      if (this.isStoppedSpeechRecog) {
        this.recognition.stop();
        console.log("End speech recognition")
      } else {
        this.wordConcat()
        this.recognition.start();
      }
    });
  }

  stop() {
    this.isStoppedSpeechRecog = true;
    this.wordConcat()
    this.recognition.stop();
    console.log("End speech recognition")
    return this.text;
  }

  wordConcat() {
    this.text.push(...this.tempWords.split(" "));
    this.tempWords = '';
    console.log(this.text);
  }
}