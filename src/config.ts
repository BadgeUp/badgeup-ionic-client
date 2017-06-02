import {
  OpaqueToken
} from '@angular/core';

export const BADGEUP_FORROOT_GUARD = new OpaqueToken('BADGEUP_FORROOT_GUARD');
export const BADGEUP_SETTINGS = new OpaqueToken('BADGEUP_SETTINGS');
export const BADGEUP_BROWSER_CLIENT = new OpaqueToken('BADGEUP_BROWSER_CLIENT');

/**
 * Used to configure the BadgeUp client
 *
 * @interface BadgeUpSettings
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
     * Hide toast notifications
     * 
     * By default, if user earns new achievement, a toast
     * is shown automatically.
     * 
     * Set this to true if you'd like to hide the toast notifications.
     */
    hideToastNotifications?: boolean;
}