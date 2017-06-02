import { Injectable, Inject } from '@angular/core';
import { BadgeUpSettings, BADGEUP_SETTINGS, BADGEUP_BROWSER_CLIENT } from '../config';
import { BadgeUpStorage, BadgeUpNotificationType, BadgeUpEvent, BadgeUpStoredEvent, BadgeUpEarnedAchievement, BADGEUP_STORAGE } from '../declarations';

import { BadgeUpLogger } from './badgeUpLogger';
import { BadgeUpToast } from './badgeUpToast';


/**
 * Provider for getting the subject by passing in event key
 *
 * @callback subjectProvider
 * @param {int} eventkey - The key of event
 * @return {string} subject - The subject to use
 */

/**
 * Notification callback used to receive BadgeUp notifications
 * about user achievements and awards.
 *
 * @callback notificationCallback
 * @param {BadgeUpNotificationType} notificationType - The type of the notification.
 * @param {Object} data - Any data that type of notification has. This can be cast depending on the type of notification.
 */


@Injectable()
/**
 * The `BadgeUpClient` service is used to send events to BadgeUp. It also
 * allows you to subscribe to achievements earned.
 */
export class BadgeUpClient {

    private notificationCallbacks: ((notificationType: BadgeUpNotificationType, data: any) => void)[] = [];
    private subjectProvider: (eventKey: string) => string = null;

    constructor(
        private badgeUpLogger: BadgeUpLogger,
        private badgeUpToast: BadgeUpToast,
        @Inject(BADGEUP_SETTINGS) private badgeUpSettings: BadgeUpSettings,
        @Inject(BADGEUP_STORAGE) private badgeUpStorage: BadgeUpStorage,
        @Inject(BADGEUP_BROWSER_CLIENT) private badgeUpBrowserClient: any) {
    }

    /**
     * Allows you to configure the default subject provider. If at any point the subject is undefined
     * for some events, this provider will be called.
     *
     * As an input, you get eventKey, which lets you return different subject values based on the event key.
     * For some event keys, you might want to use deviceId as a subject, for others, the user's email.
     * @param {subjectProvider} subjectProvider - The subject provider to use.
     */
    setSubjectProvider(subjectProvider: (eventKey: string) => string) {
        this.subjectProvider = subjectProvider;
    }

    /**
     * Subscribe to BadgeUp notifications and receive new notifications about the state of system.
     *
     * For example, you can receive 'new achievement' notification that you can use to learn about
     * new achievements user has earned, and display some kind of congratulations modal.
     * @param {notificationCallback} notificationCallback - The callback to use when notification is received
     */
    subscribe(notificationCallback: (notificationType: BadgeUpNotificationType, data: any) => void) {
        this.notificationCallbacks.push(notificationCallback);
    }

    /**
     * Unsubscribe from BadgeUp notifications.
     *
     * Unsubscribe if you're done, as failure to do so will lead to memory leaks.
     * @param {notificationCallback} notificationCallback - The callback to unsubscribe from.
     */
    unsubscribe(notificationCallback: (notificationType: BadgeUpNotificationType, data: any) => void) {
        let filtredNotificationCallbacks: ((notificationType: BadgeUpNotificationType, data: any) => void)[] = [];
        for(let curNotificationCallback of this.notificationCallbacks) {
            if(curNotificationCallback !== notificationCallback) {
                filtredNotificationCallbacks.push(curNotificationCallback);
            }
        }

        this.notificationCallbacks = filtredNotificationCallbacks;
    }

    /**
     * Create new BadgeUp event, and send it to server.
     *
     * This method works without internet as well, using local storage to store the events.
     * They will be synced to server once internet is available again.
     * @param {badgeUpEvent} badgeUpEvent - The event to send to server
     */
    emit(badgeUpEvent: BadgeUpEvent) {

        if(!badgeUpEvent.key) {
            throw new Error('[BadgeUp] Event key is required');
        }

        if(typeof badgeUpEvent.key !== 'string') {
            throw new Error('[BadgeUp] Event key has to be of type string');
        }

        let defaultSubject = 'unknown';
        let subject = badgeUpEvent.subject;

        // if the event does not have subject,
        // we'll try to see if user has configured subject provider,
        // and use that. If that doesn't exist or returns null,
        // we'll fall back to our default value.
        if(!subject) {
            subject = this.subjectProvider ? this.subjectProvider(badgeUpEvent.key) : null;
            subject = subject || defaultSubject;
        }

        let newBadgeUpEvent: BadgeUpEvent = {
            subject: subject,
            key: badgeUpEvent.key,
            modifier: badgeUpEvent.modifier || { '@inc': 1},
            timestamp: badgeUpEvent.timestamp || Date.now(),
            options: badgeUpEvent.options,
            data: badgeUpEvent.data,
        };

        // server does not support direct strings,
        // we have to wrap it inside an object.
        if(badgeUpEvent.data && typeof(badgeUpEvent.data) === 'string') {
            newBadgeUpEvent.data = { value: badgeUpEvent.data };
        }

        this.badgeUpStorage.storeEvent(newBadgeUpEvent);
        this.flush();
    }

    private fire(eventType: BadgeUpNotificationType, data: any) {
        for(let handler of this.notificationCallbacks) {
            try {
                handler(eventType, data);
            } catch(e) {
                this.badgeUpLogger.error('Notification callback failure ' + e);
            }
        }
    }

    //

    /**
     * Sends all events in storage, clearing storage
     */
    private flush() {

        const progressHandler = (progress) => {
            if (!Array.isArray(progress)) {
                return;
            }

            progress
                .filter(p => p.isComplete)
                .map(p => {
                    this.badgeUpBrowserClient.achievements
                        .get(p.achievementId)
                        .then(achievement => {

                            const earnedAchievement: BadgeUpEarnedAchievement = {
                                achievementId: p.achievementId,
                                name: achievement.name,
                                description: achievement.description
                            };

                            this.fire(BadgeUpNotificationType.NewAchievementEarned, earnedAchievement);

                            if(!this.badgeUpSettings.hideToastNotifications) {
                                this.badgeUpToast.showNewAchievementEarned(earnedAchievement);
                            }
                    });
                });
        };

        this.badgeUpStorage
            .getEvents()
            .then((storedEvents: BadgeUpStoredEvent[]) => {
                storedEvents.map(storedEvent => {
                return this.badgeUpBrowserClient.events
                    .create(storedEvent.badgeUpEvent)
                    .catch((err) => this.badgeUpLogger.error(err))
                    .then((response) => {
                        if(!response) {
                            return;
                        }

                        // remove from storage
                        this.badgeUpStorage.removeEvents([storedEvent]);

                        // trigger actions to take based on progress
                        progressHandler(response.progress);
                    });
               });
        });
    }
}