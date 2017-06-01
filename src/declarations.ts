import {
  OpaqueToken
} from '@angular/core';

export const BADGEUP_STORAGE = new OpaqueToken('BADGEUP_STORAGE');

/**
 * Used to configure BadgeUp event options
 *
 * @interface BadgeUpEventOptions
 */
export interface BadgeUpEventOptions {
    /**
     * Determines if the event should be discarded after it is processed.
     * This option should be used if there will be a high volume of repetitive events.
     */
    discard: boolean;
}

/**
 * Used to send events to BadgeUp servers
 *
 */
export class BadgeUpEvent {
    /**
     * The ID of the event.
     *
     * This has to be left blank when creating new event,
     * because server will generate the event,
     * and send back event with real ID.
    */
    id?: number;

    /**
     * The subject of the event.
     *
     * This can be usually left as undefined or NULL,
     * as the badgeUp client will use the default subject provider,
     * that is configured through badgeUpClient.setSubjectProvider(..)
     *
     * Subject is used to associate an event with the user,
     * so often it's an email of the user, or user's ID
    */
    subject?: string;

    /**
     * The metric key that will be modified as a result of this event.
     *
     * Every event has key. This doesn't have to be predefined
     * anywhere.
     *
     * Try to follow hierarchial convention, for example:
     *
     * - app:refresh
     * - game:distance:run
     *
     * as it makes pattern matching easier in the dashboard.
    */
    key: string;

    /**
     * Metric modifier key/value pair. Key may be one of @inc, @dec, @mult, @div, @set, @min, @max.
     *
     * For example, to set inc modifier:
     *
     * modifier = {};
     * modifier['@inc'] = 1;
    */
    modifier?: any;

    /**
     * Object creation date/time string, represented in the UTC ISO 8601 format.
     * Leave it as undefined, and it will be auto-generated
    */
    timestamp?: number;

    /**
     * 	Options that affect the state and operability of this event.
    */
    options?: BadgeUpEventOptions;

    /**
     * Arbitrary data that can be included to assist with achievement criteria evaluation.
    */
    data?: any;
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
     * Id of achievement the user has earned
     */
    achievementId: number;
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