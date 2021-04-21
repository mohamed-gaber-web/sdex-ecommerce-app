import { Component } from '@angular/core';

import { MenuController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TranslateConfigService } from './translate-config.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  currentRoute:any;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private translateConfigService: TranslateConfigService,
    private menu: MenuController
  ) {
    this.initializeApp();
  }

  systemLanguage:any;
  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.statusBar.backgroundColorByHexString("#0470dc");
      this.splashScreen.hide();
      this.updateAppLanguage();
    });
  }

  updateAppLanguage(){
    if(!localStorage.getItem('appLanguage')){
      localStorage.setItem('appLanguage', "en");
      this.systemLanguage = "en";
    }else{
     this.systemLanguage = localStorage.getItem('appLanguage');
    }
    this.translateConfigService.setLanguage(this.systemLanguage);
  } 

  closeMenu(){
    this.menu.close('first');
  }
}