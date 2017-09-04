import { BadgeUpClient } from './badgeUpClient';
import { BadgeUpSettings } from '../config';
import { BadgeUpStorage, BadgeUpEarnedAchievement, BadgeUpEvent, BadgeUpStoredEvent, BadgeUpNotificationType } from '../declarations';
import { BadgeUpLogger } from './badgeUpLogger';
import { BadgeUpToast } from './badgeUpToast';
import { BadgeUpLocalStorage } from './badgeUpLocalStorage';

describe('BadgeUpClient', () => {

    const achievementId = '10';
    const earnedAchievementId = '20';
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
                return Promise.resolve({
                    achievementId: achievementId,
                    name: 'test-achievement',
                    description: 'test achievement used for testing'
                });
            }
        },

        events: {
            create: (event: BadgeUpEvent) => {
                return Promise.resolve({
                    progress: [{
                        isComplete: true,
                        achievementId,
                        earnedAchievementId
                    }]
                });
            }
        }
    };

    it('should receive notification when a new achievement is earned', (done) => {
        let badgeUpClient = new BadgeUpClient(
            mockLogger,
            mockToast,
            mockSettings,
            mockStorage,
            mockBrowserClient);

        badgeUpClient.subscribe((notificationType: BadgeUpNotificationType, data: any) => {
            if (notificationType === BadgeUpNotificationType.NewAchievementEarned) {
                let earnedAchievement: BadgeUpEarnedAchievement = <BadgeUpEarnedAchievement>data;
                expect(earnedAchievement.id).toBe(earnedAchievementId);
                done();
            }
        });

        badgeUpClient.emit({
            key: 'badgeup:test'
        });
    });


    describe('browser client', () => {
        it('should expose the underlying browser client', (done) => {
            let badgeUpClient = new BadgeUpClient(
                mockLogger,
                mockToast,
                mockSettings,
                mockStorage,
                mockBrowserClient);

                expect(badgeUpClient.badgeUpBrowserClient).not.toBe(undefined);
        });
    });
});
