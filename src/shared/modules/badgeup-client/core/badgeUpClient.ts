import { Inject, Injectable } from '@angular/core';
import { BADGEUP_JS_CLIENT, BADGEUP_SETTINGS, BadgeUpSettings } from '../config';
import { BADGEUP_STORAGE, BadgeUpEarnedAchievement, BadgeUpNotificationType, BadgeUpPartialEvent, BadgeUpStorage } from '../declarations';

import { Achievement, BadgeUp as BadgeUpJSClient, EventProgress, EventRequest, EventResult, Award } from '@badgeup/badgeup-browser-client';
import { BadgeUpLogger } from './badgeUpLogger';
import { BadgeUpNotification } from './badgeUpNotification';
import { SubjectProvider } from './providers/subject';

@Injectable()
/**
 * The `BadgeUpClient` service is used to send events to BadgeUp. It also
 * allows you to subscribe to achievements earned.
 */
export class BadgeUpClient {

    /**
     * Notification callback used to receive BadgeUp notifications
     * about user achievements and awards.
     *
     * @callback notificationCallback
     * @param notificationType - The type of the notification.
     * @param data - Any data that type of notification has. This can be cast depending on the type of notification.
     */
    private notificationCallbacks: Array<(notificationType: BadgeUpNotificationType, data: any) => void> = [];

    /**
     * BadgeUp Ionic client constructor
     * @param badgeUpLogger - Internal logger.
     * @param badgeUpNotification - Provides toast notifications to users.
     * @param badgeUpSettings - Client settings.
     * @param badgeUpStorage - Storage engine for events.
     * @param browserClient - Underlying browser client that the ionic client relies on. https://github.com/BadgeUp/badgeup-browser-client
     */
    constructor(
        private subjectProvider: SubjectProvider,
        private badgeUpLogger: BadgeUpLogger,
        private badgeUpNotification: BadgeUpNotification,
        @Inject(BADGEUP_SETTINGS) private badgeUpSettings: BadgeUpSettings,
        @Inject(BADGEUP_STORAGE) private badgeUpStorage: BadgeUpStorage,
        @Inject(BADGEUP_JS_CLIENT) public badgeUpJSClient: BadgeUpJSClient) {
            this.init();
    }

    private init() {
        this.emit({
            key: 'badgeup:plugin:initialized'
        });
    }

    /**
     * Allows you to configure the default subject provider. If at any point the subject is undefined
     * for some events, this provider will be called.
     *
     * As an input, you get eventKey, which lets you return different subject values based on the event key.
     * For some event keys, you might want to use deviceId as a subject, for others, the user's email.
     * @param subjectProvider - The subject provider to use.
     */
    public setSubject(subject: string) {
        this.subjectProvider.setSubject(subject);
    }

    /**
     * Subscribe to BadgeUp notifications and receive new notifications about the state of system.
     *
     * For example, you can receive 'new achievement' notification that you can use to learn about
     * new achievements user has earned, and display some kind of congratulations modal.
     * @param notificationCallback - The callback to use when notification is received
     */
    public subscribe(notificationCallback: (notificationType: BadgeUpNotificationType, data: any) => void) {
        this.notificationCallbacks.push(notificationCallback);
    }

    /**
     * Unsubscribe from BadgeUp notifications.
     *
     * Unsubscribe if you're done, as failure to do so will lead to memory leaks.
     * @param notificationCallback - The callback to unsubscribe from.
     */
    public unsubscribe(notificationCallback: (notificationType: BadgeUpNotificationType, data: any) => void) {
        const filtredNotificationCallbacks: Array<(notificationType: BadgeUpNotificationType, data: any) => void> = [];
        for (const curNotificationCallback of this.notificationCallbacks) {
            if (curNotificationCallback !== notificationCallback) {
                filtredNotificationCallbacks.push(curNotificationCallback);
            }
        }

        this.notificationCallbacks = filtredNotificationCallbacks;
    }

    /**
     * Send a new BadgeUp event
     *
     * This method works without internet as well, using local storage to store the events.
     * Events will be synced to server once internet is available again.
     * @param badgeUpEvent - The event to send
     */
    public emit(e: BadgeUpPartialEvent) {

        if (!e.key) {
            throw new Error('[BadgeUp] Event key is required');
        } else if (typeof e.key !== 'string') {
            throw new TypeError('[BadgeUp] Event key has to be of type string');
        }

        const subject = e.subject || this.subjectProvider.subjectSubject.getValue();

        const er = new EventRequest(
            subject,
            e.key,
            e.modifier
        );

        // set data
        if (e.data) {
            if (typeof e.data === 'string') {
                er.data = { value: e.data };
            } else {
                er.data = e.data;
            }
        }

        this.badgeUpStorage.storeEvent(er);
        this.flush();
    }

    private fire(eventType: BadgeUpNotificationType, data: any) {
        for (const handler of this.notificationCallbacks) {
            try {
                handler(eventType, data);
            } catch (e) {
                this.badgeUpLogger.error('Notification callback failure ' + e);
            }
        }
    }

    private progressHandler(progress: EventProgress[]): void {
        if (!Array.isArray(progress)) {
            return;
        }

        // get the progress record's related achievement records
        // new, complete achievements only
        const list = progress.filter((p) => (p.isNew && p.isComplete));

        const showAchievement = async (p: EventProgress) => {
            const p1 = this.badgeUpJSClient.achievements.getAchievementAwards(p.achievementId);
            const p2 = this.badgeUpJSClient.achievements.get(p.achievementId);

            const results = await Promise.all([p1, p2]);
            const earnedAwards: Award[] = results[0];
            const achievement: Achievement = results[1];

            const record: BadgeUpEarnedAchievement = {
                earnedAchievementId: p.earnedAchievementId,
                achievement
            };

            this.fire(BadgeUpNotificationType.NewAchievementEarned, record);

            if (!this.badgeUpSettings.disableAchievementPopups) {
                this.badgeUpNotification.showNewAchievementEarned(achievement, earnedAwards);
            }
        };

        for (const l of list) {
            try {
                showAchievement(l);
            } catch (err) {
                this.badgeUpLogger.error('Error presenting earned achievement notification', err);
            }
        }
    }

    /**
     * Sends all events in storage, clearing storage
     */
    private async flush() {

        const storedEvents = await this.badgeUpStorage.getEvents();
        for (const se of storedEvents) {
            try {
                const response = await this.badgeUpJSClient.events.create(se.badgeUpEvent);
                if (!response) {
                    continue;
                }

                // remove from storage
                this.badgeUpStorage.removeEvents([se]);

                const progress: EventProgress[] = response.results.reduce(function(p: EventProgress[], c: EventResult) {
                    p.push(...c.progress);
                    return p;
                }, []);

                // trigger actions to take based on progress
                this.progressHandler(progress);
            } catch (err) {
                this.badgeUpLogger.error(err);

                if (err.message === 'BAD REQUEST') {
                    // remove from storage
                    this.badgeUpStorage.removeEvents([se]);
                }
            }
        }
    }
}
