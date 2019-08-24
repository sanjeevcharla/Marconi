import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Station, Constants } from './app.models';


declare var JogDial: Function;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'marconi';

  stationsList: { [key: string]: Station[] } = {};
  languageName: string;
  volume: number = 0.6;
  language: number = 2;
  needleLeft: number;
  selectedURL: string;
  lgw: number = 50;//Language Gutter Width
  playing: boolean;
  crossorigin: string = "";

  constructor() { }

  ngOnInit() {
    this.stationsList[Constants.LAN_TE] = [
      { Name: "AIR-VJW", URL: "http://airlsmp-lh.akamaihd.net/i/AIRLSMP026_1@855159/master.m3u8" },
      { Name: "AIR-VSP", URL: "http://airlsmp-lh.akamaihd.net/i/AIRLSMP012_1@28711/master.m3u8" },
      { Name: "AIR-TPY", URL: "http://airlsmp-lh.akamaihd.net/i/AIRLSMP034_1@855168/master.m3u8" },
      { Name: "AIR-HYD", URL: "http://airtelugu-lh.akamaihd.net/i/airtelugu_1@507818/master.m3u8" },
      { Name: "AIR-RBW", URL: "http://fmrainbow-lh.akamaihd.net/i/fmrainbow_1@507812/master.m3u8" },
      { Name: 'AIR-VVB', URL: "http://vividhbharati-lh.akamaihd.net/i/vividhbharati_1@507811/master.m3u8" },
      { Name: "MANSTH", URL: "http://sc8.shoutcaststreaming.us:8008/;stream/1" }
    ];
    this.stationsList[Constants.LAN_EN] = [
      { Name: "BBC-RD1", URL: "http://bbcmedia.ic.llnwd.net/stream/bbcmedia_radio1_mf_p" },
      { Name: "BBC-RD2", URL: "http://bbcmedia.ic.llnwd.net/stream/bbcmedia_radio2_mf_p" },
      { Name: "BBC-WRD", URL: "http://bbcwssc.ic.llnwd.net/stream/bbcwssc_mp1_ws-eieuk" },
      { Name: "BBC-ASA", URL: "http://bbcmedia.ic.llnwd.net/stream/bbcmedia_asianet_mf_p" }
    ];
    this.stationsList[Constants.LAN_HI] = [
      { Name: "AIR-VDB", URL: "http://vividhbharati-lh.akamaihd.net/i/vividhbharati_1@507811/master.m3u8" },
      { Name: "AIR-FGD", URL: "http://airfmgold-lh.akamaihd.net/i/fmgold_1@507591/master.m3u8" },
      { Name: "AIR-MMB", URL: "http://nondelhi-lh.akamaihd.net/i/rainmumb_1@830454/master.m3u8" },
      { Name: "AIR-VRN", URL: "http://nondelhi-lh.akamaihd.net/i/varanasi_1@830459/master.m3u8" },
      { Name: "AIR-LCK", URL: "http://airlsmp-lh.akamaihd.net/i/AIRLSMP029_1@855162/master.m3u8" }
    ];

    this.moveNeedle(0);

    var dialOne = JogDial(document.getElementById('jog_dial_example'), { wheelSize: '200px', knobSize: '70px', minDegree: 0, maxDegree: 360, degreeStartAt: 0 });
    dialOne.on('mousemove', (evt) => {
      this.moveNeedle(evt);
    });

    //equalizer
    //this.configAudioContext();    
  }

  configAudioContext() {
    var canvas = document.querySelector('canvas');
    var context = canvas.getContext('2d');
    var audio = document.querySelector('audio') as HTMLMediaElement;
    audio.src = this.selectedURL;
    var audioContext = new AudioContext();
    var elementSource = audioContext.createMediaElementSource(audio);
    var analyser = audioContext.createAnalyser();
    elementSource.connect(analyser);
    analyser.connect(audioContext.destination);
    setInterval(function () {
      var freqData = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(freqData);
      context.clearRect(0, 0, 300, 150);
      for (var i = 0; i < freqData.length; i++) {
        if (i % 2 == 0) {
          context.fillRect(i * 2, 60, 3, -freqData[i] * 0.25);
        }
      }
    }, 30);
  }

  moveNeedle(evt: any) {
    var positionRatio = (evt == null || evt.target == null) ? 0 : ((evt.target.rotation / 360) * 100);
    var stationsList = document.getElementById('stationsList');
    var scaleStart = stationsList.offsetLeft + this.lgw;
    var needlePostion = scaleStart + ((positionRatio / 100) * (stationsList.offsetWidth - 2 * this.lgw));
    var needle = document.getElementById('needle');
    this.needleLeft = needlePostion + 20;
    this.updateStation();
  }

  updateStation() {
    this.playing = false;
    var currentLang = document.getElementById('lang_' + this.language);
    if (currentLang) {
      var y = currentLang.getBoundingClientRect().top + 5;
      var language = currentLang.getAttribute('data-lang');
      var station = document.elementFromPoint(this.needleLeft, y);
      if (station) {
        this.languageName = station.getAttribute('data-name');
        this.selectedURL = station.getAttribute('data-url');
      }
    }
  }

  onPlaying(event) {
    this.playing = true;
  }

  onStopped(event) {
    this.playing = false;
  }
}
