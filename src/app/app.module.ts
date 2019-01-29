/**
 * demo file only, not part of bundled ionic client
 */

import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { HomePage } from '../pages/home/home';
import { BadgeupClientDemoApp } from './app.component';
import { AppComponentsModule } from '../components/app-components.module';
import { EarnedAchievementsModalComponent } from '../components/earned-achievements-modal/earned-achievements-modal';
import { AchievementsOverviewModalComponent } from '../components/achievements-overview-modal/achievements-overview-modal';
import { init, captureException } from '@sentry/browser';

/**
 * Error reports sent to the BadgeUp team
 * Do not use this outside of the demo codebase
 */
init({ dsn: 'https://856122adb81449ea9c92338df37423a1@sentry.io/1381819' });

export class CustomErrorHandler extends IonicErrorHandler {
    constructor() {
        super();
    }

    public handleError(err: any): void {
        super.handleError(err);
        captureException(err);
    }
}

@NgModule({
    declarations: [
        BadgeupClientDemoApp,
        HomePage,
    ],
    imports: [
        BrowserModule,
        AppComponentsModule,
        IonicModule.forRoot(BadgeupClientDemoApp)
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        AchievementsOverviewModalComponent,
        EarnedAchievementsModalComponent,
        BadgeupClientDemoApp,
        HomePage
    ],
    providers: [
        StatusBar,
        SplashScreen,
        { provide: ErrorHandler, useClass: CustomErrorHandler }
    ]
})
export class AppModule { }
