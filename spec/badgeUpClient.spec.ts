import { Achievement, BadgeUp as JSClient, EventResults } from '@badgeup/badgeup-node-client';
import {} from 'jasmine';
import { BadgeUpSettings } from '../src/config';
import { BadgeUpClient } from '../src/core/badgeUpClient';
import { BadgeUpLocalStorage } from '../src/core/badgeUpLocalStorage';
import { BadgeUpLogger } from '../src/core/badgeUpLogger';
import { BadgeUpToast } from '../src/core/badgeUpToast';
import { BadgeUpEarnedAchievement, BadgeUpNotificationType, BadgeUpStorage } from '../src/declarations';

import * as sinon from 'sinon';

// fake API key with correct format
const API_KEY = 'eyJhY2NvdW50SWQiOiJ0aGViZXN0IiwiYXBwbGljYXRpb25JZCI6IjEzMzciLCJrZXkiOiJpY2VjcmVhbWFuZGNvb2tpZXN5dW0ifQ==';
const APPLICATION_ID = '1337';

describe('BadgeUpClient', () => {

    const mockToast: BadgeUpToast = {
        showNewAchievementEarned: (badgeUpEarnedAchievement: Achievement) => { /* do nothing */ }
    };

    const mockLogger: BadgeUpLogger = {
        warn: (message) => { /* do nothing */ },
        error: (message) => { /* do nothing */ }
    };

    const mockSettings: BadgeUpSettings = { apiKey: API_KEY };
    const mockStorage: BadgeUpStorage = new BadgeUpLocalStorage();
    const jsClient = new JSClient({ apiKey: API_KEY });

    it('should receive notification when a new achievement is earned', (done) => {

        const achievementId = '10';
        const earnedAchievementId = '20';

        const eventResults: EventResults = {
            results: [
                {
                    event: null,
                    cause: 'x',
                    progress: [
                        {
                            isNew: true,
                            isComplete: true,
                            percentComplete: 1,
                            progressTree: null,
                            achievementId,
                            earnedAchievementId
                        }
                    ]
                }
            ]
        };

        // events
        const eventCreateStub = sinon.stub(jsClient.events, 'create');
        eventCreateStub.onFirstCall().returns(Promise.resolve(eventResults));

        // achievements
        const achievementGetStub = sinon.stub(jsClient.achievements, 'get');
        achievementGetStub.onFirstCall().returns(Promise.resolve({
            applicationId: APPLICATION_ID,
            achievementId,
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
                const ea: BadgeUpEarnedAchievement = data;
                expect(ea.earnedAchievementId).toBe(earnedAchievementId);
                done();
            }
        });

        badgeUpClient.emit({
            key: 'badgeup:test'
        });
    });

    describe('browser client', () => {
        it('should expose the underlying browser client', () => {
            const badgeUpClient = new BadgeUpClient(
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
