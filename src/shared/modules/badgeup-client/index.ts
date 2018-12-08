/**
 * @module
 *
 * BadgeUpModule
 */

import {
    ModuleWithProviders,
    NgModule,
    Optional,
    SkipSelf
} from '@angular/core';
import { IonicModule } from 'ionic-angular';

import { BadgeUpClient } from './core/badgeUpClient';
import { BadgeUpLogger } from './core/badgeUpLogger';
import { BadgeUpNotification } from './core/badgeUpNotification';

import { BadgeUpClickEventListener } from './core/directives/badgeUpClickEventListener';

import { PreloaderComponent } from './components/preloader/preloader';
import { NextUpAchmtComponent } from './components/nextup-achmt/nextup-achmt';
import { OverviewComponent } from './components/overview/overview';
import { RecentAchmtComponent } from './components/recent-achmt/recent-achmt';
import { RecentAchmtDetailsComponent } from './components/recent-achmt-details/recent-achmt-details';
import { UpcomingAchmtComponent } from './components/upcoming-achmt/upcoming-achmt';

import { CriteriaProgressTreeComponent } from './components/criteria-progress-tree/criteria-progress-tree';
import { CriteriaProgressTreeElementComponent } from './components/criteria-progress-tree/criteria-progress-tree-element/criteria-progress-tree-element';

import { BADGEUP_FORROOT_GUARD, BADGEUP_JS_CLIENT, BADGEUP_SETTINGS, BadgeUpSettings } from './config';
import { BadgeUpLocalStorage } from './core/badgeUpLocalStorage';
import { BADGEUP_STORAGE } from './declarations';

import { CommonModule } from '@angular/common';
import { BadgeUp } from '@badgeup/badgeup-browser-client';
import { AllEarnedComponent } from './components/all-earned/all-earned';
import { AllEarnedAwardsComponent } from './components/all-earned/all-earned-awards/all-earned-awards';
import { AchievementIconComponent } from './components/icon-progress/icon-progress';
import { AchievementEarnedPopupComponent } from './components/achievement-earned-popup/achievement-earned-popup';
import { OfflineFooterComponent } from './components/offline-footer/offline-footer';

import { EarnedAchievementDetailsComponent } from './components/earned-achievement-details/earned-achievement-details';

import { EarnedAchievementsProvider } from './core/providers/earned-achievements';
import { OverviewProvider } from './core/providers/overview';
import { SubjectProvider } from './core/providers/subject';
import { EarnedAwardsProvider } from './core/providers/earned-awards';
import { AchievementDetailsProvider } from './core/providers/achievement-details';

export { BadgeUpClient, BadgeUpSettings };
export { BadgeUpNotificationType, BadgeUpEarnedAchievement } from './declarations';

export function provideForRootGuard(badgeUpClient: BadgeUpClient): any {
    if (badgeUpClient) {
        throw new Error('[BadgeUp] BadgeUp already initialised.');
    }

    return 'guarded';
}

//
// EXPORTS
//
export {
    AchievementEarnedPopupComponent,
    OverviewComponent,
    AllEarnedComponent
};

export function badgeUpJSClient(badgeUpSettings: BadgeUpSettings) {
    return new BadgeUp(badgeUpSettings);
}

@NgModule({
    imports: [CommonModule, IonicModule],
    declarations: [
        BadgeUpClickEventListener,
        PreloaderComponent,
        OverviewComponent,
        RecentAchmtComponent,
        RecentAchmtDetailsComponent,
        NextUpAchmtComponent,
        UpcomingAchmtComponent,
        AchievementIconComponent,
        OfflineFooterComponent,
        AchievementEarnedPopupComponent,
        AllEarnedComponent,
        AllEarnedAwardsComponent,
        EarnedAchievementDetailsComponent,
        CriteriaProgressTreeComponent,
        CriteriaProgressTreeElementComponent
    ],
    // components that are created dynamically
    entryComponents: [
        AchievementEarnedPopupComponent,
        OverviewComponent,
        AllEarnedComponent
    ],
    exports: [
        BadgeUpClickEventListener,
        OverviewComponent,
        AllEarnedComponent
    ],
    providers: []
})
/**
 * The `BadgeUpModule` Ionic module
 *
 * Register this module in order to start sending BadgeUp events,
 * you have to provide apiKey in order to communicate with the BadgeUp API.
 *
 * The API key can be generated from BadgeUp dashboard.
 *
 * API key needs to have the following permissions:
 *  - event:create
 *  - achievement:read
 *
 * in order to create new events, and read achievements.
 */
export class BadgeUpModule {

    public static forRoot(badgeUpSettings: BadgeUpSettings): ModuleWithProviders {

        return {
            ngModule: BadgeUpModule,
            providers: [
                SubjectProvider,
                BadgeUpLogger,
                BadgeUpNotification,
                {
                    provide: BADGEUP_SETTINGS,
                    useValue: badgeUpSettings
                },
                {
                    provide: BADGEUP_JS_CLIENT,
                    useFactory: badgeUpJSClient,
                    deps: [BADGEUP_SETTINGS]
                },
                {
                    provide: BADGEUP_STORAGE,
                    useClass: BadgeUpLocalStorage
                },
                BadgeUpClient,
                OverviewProvider,
                EarnedAchievementsProvider,
                EarnedAwardsProvider,
                AchievementDetailsProvider,
                {
                    provide: BADGEUP_FORROOT_GUARD,
                    useFactory: provideForRootGuard,
                    deps: [[BadgeUpClient, new Optional(), new SkipSelf()]]
                }
            ]
        };
    }
}
