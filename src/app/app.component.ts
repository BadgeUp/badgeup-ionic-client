/**
 * demo file only, not part of bundled ionic client
 */

import { Component } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Platform } from 'ionic-angular';

import { HomePage } from '../pages/home/home';
import { BadgeUpClient } from '../shared/modules/badgeup-client/index';

@Component({
    templateUrl: 'app.html'
})
export class BadgeupClientDemoApp {
    public rootPage: any = HomePage;

    constructor(
        platform: Platform,
        statusBar: StatusBar,
        splashScreen: SplashScreen,
        badgeUpClient: BadgeUpClient) {
        platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            statusBar.styleDefault();
            splashScreen.hide();

            badgeUpClient.setSubject('mark');
        });
    }

}
