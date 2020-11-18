import {Directive, HostListener, Input, OnInit, Renderer2} from '@angular/core';
import {DomController} from '@ionic/angular';

@Directive({
    selector: '[appHideHeader]'
})
export class HideHeaderDirective implements OnInit {

    @Input('appHideHeader') toolbar: any;
    private toolbarHeight = 44;

    constructor(private renderer: Renderer2, private domCtrl: DomController) {
    }

    ngOnInit() {
        console.log('TEST', this.toolbar);
        this.toolbar = this.toolbar.el;
    }

    @HostListener('ionScroll', ['$event']) onContentScroll($event) {
        let scrollTop = $event.detail.scrollTop;
        if (scrollTop >= 255) {
            scrollTop = 255;
        }

        const hexDist = scrollTop.toString(16);
        this.domCtrl.write(() => {
            this.toolbar.style.setProperty('--background', `#ff8080${hexDist}`);
        });
    }

}
