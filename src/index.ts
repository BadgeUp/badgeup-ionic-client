/**
 * @module
 *
 * BadgeUpModule
 */

import {
  NgModule,
  ModuleWithProviders,
  Inject,
  Optional,
  SkipSelf,
  APP_INITIALIZER
} from '@angular/core';

import { BadgeUpClient } from './core/badgeUpClient';
import { BadgeUpLogger } from './core/badgeUpLogger';
import { BadgeUpToast } from './core/badgeUpToast';

import { BadgeUpClickEventListener } from './core/directives/badgeUpClickEventListener';


import { BadgeUpLocalStorage } from './core/badgeUpLocalStorage';
import { BadgeUpSettings, BADGEUP_FORROOT_GUARD, BADGEUP_SETTINGS, BADGEUP_JS_CLIENT } from './config';
import { BADGEUP_STORAGE } from './declarations';

import { BadgeUp } from '@badgeup/badgeup-node-client';
export { Event as BadgeUpEvent } from '@badgeup/badgeup-node-client';

export { BadgeUpClient } from './core/badgeUpClient';
export { BadgeUpSettings } from './config';
export { BadgeUpNotificationType, BadgeUpEarnedAchievement } from './declarations';

export function provideForRootGuard(badgeUpClient: BadgeUpClient): any {
  if (badgeUpClient) {
    throw new Error("[BadgeUp] BadgeUp already initialised.");
  }

  return 'guarded';
}

@NgModule({
  declarations: [ BadgeUpClickEventListener ],
  exports: [ BadgeUpClickEventListener ]
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
  constructor(@Optional() @Inject(BADGEUP_FORROOT_GUARD) guard: any) {}

  static forRoot(badgeUpSettings: BadgeUpSettings): ModuleWithProviders {

    if(!badgeUpSettings) {
      throw new Error("[BadgeUp] Please provide instance of BadgeUpSettings in forRoot()");
    }

    if(!badgeUpSettings.apiKey) {
      throw new Error("[BadgeUp] Please provide API key (can be generated from dashboard) with event:create and achievement:read permissions");
    }

    return {
      ngModule: BadgeUpModule,
      providers: [
        {
          provide: BADGEUP_FORROOT_GUARD,
          useFactory: provideForRootGuard,
          deps: [[BadgeUpClient, new Optional(), new SkipSelf()]]
        },
        {
          provide: BADGEUP_SETTINGS,
          useValue: badgeUpSettings
        },
        {
          provide: BADGEUP_STORAGE,
          useFactory: () => {
            return new BadgeUpLocalStorage();
          },
        },
        {
          provide: BADGEUP_JS_CLIENT,
          useFactory: () => {
            return new BadgeUp(badgeUpSettings);
          }
        },

        // If the module has been registered & application is being initialized,
        // send an event to BadgeUp
        {
            'provide': APP_INITIALIZER,
            'useFactory': (badgeUpClient: BadgeUpClient) => {
              return () => {
                badgeUpClient.emit({
                  key: 'badgeup:plugin:initialized'
                });
              };
            },
            'deps': [BadgeUpClient],
            'multi': true,
        },
        BadgeUpClient,
        BadgeUpLogger,
        BadgeUpToast
      ]
    };
  }

  static forChild(): ModuleWithProviders {
    return {
      ngModule: BadgeUpModule,
      providers: []
    };
  }
}
