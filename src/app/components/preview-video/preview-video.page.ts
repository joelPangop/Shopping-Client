import { Component, OnInit } from '@angular/core';
import {ModalController, NavParams} from '@ionic/angular';
import {StreamingMedia, StreamingVideoOptions} from '@ionic-native/streaming-media/ngx';

@Component({
  selector: 'app-preview-video',
  templateUrl: './preview-video.page.html',
  styleUrls: ['./preview-video.page.scss'],
})
export class PreviewVideoPage implements OnInit {
  private files: any;

  constructor(private navParams: NavParams, private modalController: ModalController,
              private streamingVideo: StreamingMedia) { }

  ngOnInit() {
    this.files = this.navParams.get('files');
    // const $source: any = document.getElementById('video_here');
    // $source.src = URL.createObjectURL(this.files);
    // $source.parentElement.load();
    this.startVideo();
  }

  dismiss() {
    this.modalController.dismiss({
      dismissed: true
    });
  }


  startVideo(){
    let options: StreamingVideoOptions = {
      successCallback: ()=>{console.log()},
      errorCallback: ()=>{console.log()},
      orientation: 'portrait'
    };

    this.streamingVideo.playVideo(this.files, options);
  }

}
