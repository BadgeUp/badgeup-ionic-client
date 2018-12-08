import { InjectionToken } from '@angular/core';

export const BADGEUP_FORROOT_GUARD = new InjectionToken('BADGEUP_FORROOT_GUARD');
export const BADGEUP_SETTINGS = new InjectionToken('BADGEUP_SETTINGS');
export const BADGEUP_JS_CLIENT = new InjectionToken('BADGEUP_JS_CLIENT');

/**
 * Used to configure the BadgeUp client
 */
export interface BadgeUpSettings {
    /**
     * The API key to use.
     *
     * The API key can be generated from BadgeUp dashboard.
     *
     * API key needs to have the following permissions:
     *  - event:create
     *  - achievement:read
     *
     * in order to send events and read achievements.
     */
    apiKey: string;

    /**
     * Hide achievement earned notifications
     *
     * By default, if user earns new achievement, a notification pops up.
     *
     * Set this to true if you'd like to disable achievement earned notifications.
     */
    disableAchievementPopups?: boolean;
}

export const DEFAULT_SETTINGS: BadgeUpSettings = {
    apiKey: '',
    disableAchievementPopups: false
};

export const SETTINGS = new InjectionToken<BadgeUpSettings>(
    'Badgeup Settings',
    {
        providedIn: 'root',
        factory: () => DEFAULT_SETTINGS
    }
);
