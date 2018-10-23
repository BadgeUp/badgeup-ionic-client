import { InjectionToken } from '@angular/core';
import { Achievement, EventModifier, EventRequest as BadgeUpEvent } from '@badgeup/badgeup-node-client';

export const BADGEUP_STORAGE = new InjectionToken('BADGEUP_STORAGE');

/**
 * plain object for arbitrary data
 */
export interface Data {
    [key: string]: any;
}

/**
 * Used to send events to BadgeUp servers
 */
export class BadgeUpPartialEvent {
    /**
     * The metric key that will be modified as a result of this event.
     */
    key: string;

    /**
     * Metric modifier key/value pair. Key may be one of @inc, @dec, @mult, @div, @set, @min, @max.
     */
    modifier?: EventModifier;

    /**
     * Uniquely identifies the subject the event is for.
     */
    subject?: string;

    /**
     * Arbitrary data that can be included to assist with achievement criteria evaluation.
     */
    data?: Data | string;
}

/**
 * Used to indicate what type the notification is
 *
 * @enum BadgeUpNotificationType
 */
export enum BadgeUpNotificationType {
    /**
     * Just a dummy placeholder
     */
    None = 0,

    /**
     * User has earned a new achievement.
     *
     * The extra data will be held in 'data' property,
     * which can be cast to type BadgeUpEarnedAchievement,
     * to find out the achievementId.
     */
    NewAchievementEarned = 1
}

/**
 * Notification data for earned achievement
 *
 * @interface BadgeUpEarnedAchievement
 */
export interface BadgeUpEarnedAchievement {
    /**
     * A string that uniquely identifies the earned achievement record associated with the achievement
     */
    earnedAchievementId: string;

    /**
     * The original achievement object
     */
    achievement: Achievement;
}

/**
 * Used to store BadgeUp events in local storage,
 * so they can be stored if the device is offline.
 */
export class BadgeUpStoredEvent {
    /**
     * Random arbitrary id
     *
     * Used to track which events have been sent successfully to server,
     * and which ones have not.
     */
    id: string;

    /**
     * BadgeUp event which will be sent to the server.
     */
    badgeUpEvent: BadgeUpEvent;
}

/**
 * BadgeUpStorage is used by badgeUpClient to
 * store the events safely even when there is no internet connection,
 * and then later read them + send them to server, and remove them.
 */
export interface BadgeUpStorage {
    /**
     * Store events to the storage
     */
    storeEvent(badgeUpEvent: BadgeUpEvent);

    /**
     * Get events from the storage
     */
    getEvents(): Promise<BadgeUpStoredEvent[]>;

    /**
     * Remove events from the storage.
     * The removal is done by using the property 'id'
     * on each event.
     */
    removeEvents(badgeUpEvents: BadgeUpStoredEvent[]);
}
