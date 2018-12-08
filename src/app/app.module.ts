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
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
