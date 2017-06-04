import { BadgeUpClient } from './badgeUpClient';
import { BadgeUpSettings } from '../config';
import { BadgeUpStorage, BadgeUpEarnedAchievement, BadgeUpEvent, BadgeUpStoredEvent, BadgeUpNotificationType } from '../declarations';
import { BadgeUpLogger } from './badgeUpLogger';
import { BadgeUpToast } from './badgeUpToast';
import { BadgeUpLocalStorage } from './badgeUpLocalStorage';

describe('BadgeUpClient', () => {
    let achievementId = 10;
    let mockToast: BadgeUpToast = {
        showNewAchievementEarned: (badgeUpEarnedAchievement: BadgeUpEarnedAchievement) => { }
    };

    let mockLogger: BadgeUpLogger = {
        warn: message => { },
        error: message => { }
    };

    let mockSettings: BadgeUpSettings = { apiKey: 'xxxxxxx' };
    let mockStorage: BadgeUpStorage = new BadgeUpLocalStorage();

    let mockBrowserClient = {
        achievements: {
            get: (achievementId: number) => {
                return new Promise((resolve, reject) => {
                    resolve({
                        achievementId: achievementId,
                        name: 'test-achievement',
                        description: 'test achievement used for testing'
                    });
                });
            }
        },

        events: {
            create: (event: BadgeUpEvent) => {
                return new Promise((resolve, reject) => {
                    let createdEvent = {
                        progress: [{
                            isComplete: true,
                            achievementId: achievementId
                        }]
                    };

                    resolve(createdEvent);
                });
            }
        }
    };

    it('#should receive notification when new achievement is unlocked', (done) => {
        let badgeUpClient = new BadgeUpClient(
            mockLogger,
            mockToast,
            mockSettings,
            mockStorage,
            mockBrowserClient);

        badgeUpClient.subscribe((notificationType: BadgeUpNotificationType, data: any) => {
            if(notificationType === BadgeUpNotificationType.NewAchievementEarned) {
                let earnedAchievement: BadgeUpEarnedAchievement = <BadgeUpEarnedAchievement>data;
                expect(earnedAchievement.achievementId).toBe(achievementId);
                done();
            }
        });

        badgeUpClient.emit({
            key: 'badgeup:test'
        });
    });
});