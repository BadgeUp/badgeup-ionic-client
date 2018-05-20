import { BadgeUpClient } from './badgeUpClient';
import { BadgeUp as JSClient, Event as BadgeUpEvent, Achievement } from '@badgeup/badgeup-node-client';
import { BadgeUpSettings } from '../config';
import { BadgeUpStorage, BadgeUpEarnedAchievement, BadgeUpStoredEvent, BadgeUpNotificationType } from '../declarations';
import { BadgeUpLogger } from './badgeUpLogger';
import { BadgeUpToast } from './badgeUpToast';
import { BadgeUpLocalStorage } from './badgeUpLocalStorage';

import * as sinon from 'sinon';

// fake API key with correct format
const API_KEY = 'eyJhY2NvdW50SWQiOiJ0aGViZXN0IiwiYXBwbGljYXRpb25JZCI6IjEzMzciLCJrZXkiOiJpY2VjcmVhbWFuZGNvb2tpZXN5dW0ifQ=='
const APPLICATION_ID = '1337';

describe('BadgeUpClient', () => {

    let mockToast: BadgeUpToast = {
        showNewAchievementEarned: (badgeUpEarnedAchievement: Achievement) => { }
    };

    let mockLogger: BadgeUpLogger = {
        warn: message => { },
        error: message => { }
    };

    const mockSettings: BadgeUpSettings = { apiKey: API_KEY };
    const mockStorage: BadgeUpStorage = new BadgeUpLocalStorage();
    const jsClient = new JSClient({ apiKey: API_KEY });

    it('should receive notification when a new achievement is earned', (done) => {

        const achievementId = '10';
        const earnedAchievementId = '20';

        // events
        const eventCreateStub = sinon.stub(jsClient.events, "create");
        eventCreateStub.onFirstCall().returns(Promise.resolve({
            progress: [{
                // return a new, complete achievement
                isComplete: true,
                isNew: true,
                achievementId,
                earnedAchievementId
            }]
        }));

        // achievements
        const achievementGetStub = sinon.stub(jsClient.achievements, "get");
        achievementGetStub.onFirstCall().returns(Promise.resolve({
            applicationId: APPLICATION_ID,
            achievementId: achievementId,
            name: 'test-achievement',
            description: 'test achievement used for testing'
        }));

        const badgeUpClient = new BadgeUpClient(
            mockLogger,
            mockToast,
            mockSettings,
            mockStorage,
            jsClient
        );

        badgeUpClient.subscribe((notificationType: BadgeUpNotificationType, data: any) => {

            expect(eventCreateStub.callCount).toEqual(1);
            expect(achievementGetStub.callCount).toEqual(1);

            // check the event that passed in
            const callEvent = eventCreateStub.getCall(0).args[0];
            expect(callEvent).toEqual({
                subject: 'unknown', // should default to this
                modifier: { '@inc': 1 }, // should default to this
                key: 'badgeup:test'
            });

            if (notificationType === BadgeUpNotificationType.NewAchievementEarned) {
                let ea: BadgeUpEarnedAchievement = <BadgeUpEarnedAchievement>data;
                expect(ea.earnedAchievementId).toBe(earnedAchievementId);
                done();
            }
        });
        debugger;

        badgeUpClient.emit({
            key: 'badgeup:test'
        });
    });


    describe('browser client', () => {
        it('should expose the underlying browser client', () => {
            let badgeUpClient = new BadgeUpClient(
                mockLogger,
                mockToast,
                mockSettings,
                mockStorage,
                jsClient
            );

            expect(badgeUpClient.badgeUpJSClient).not.toBe(undefined);
        });
    });
});
