import { Injectable } from '@angular/core';
import endOfWeek from 'date-fns/endOfWeek';
import subWeeks from 'date-fns/subWeeks';
import { BadgeUpClient } from '../badgeUpClient';
import { AchievementAndEarnedAchievement } from './provider-classes';
import { SubjectProvider } from './subject';
import pMap from 'p-map';
import QuickLRU from 'quick-lru';
import { Achievement, EarnedAchievement } from '@badgeup/badgeup-browser-client';
import { ColorLoaderProvider } from './color-loader';

const LRU_SIZE = 20;
const MAX_ACH_CONCURRENCY = 3;

@Injectable()
export class EarnedAchievementsProvider {
    // TODO commit and load LRU to/from storage, likely in another provider
    private lru = new QuickLRU({ maxSize: LRU_SIZE });

    constructor(private client: BadgeUpClient, private subjectProvider: SubjectProvider, private colorLoader: ColorLoaderProvider) {
    }

    /**
     * Retrieve an achievement, using a cache
     */
    private async retrieveAchievementById(id: string): Promise<Achievement> {
        const cachedVal = this.lru.get(id) as Achievement;
        if (cachedVal) {
            return cachedVal;
        } else {
            const fetchedVal = await this.client.badgeUpJSClient.achievements.get(id);
            this.lru.set(id, fetchedVal);
            return fetchedVal;
        }
    }

    /**
     * Retrieve a week of earned achievements
     * @param weekNum prior week number to fetch. To get the most recent week, pass in 0. Must be a positive integer.
     */
    public async getWeekOfEarnedAchievements(weekNum: number): Promise<AchievementAndEarnedAchievement[]> {
        // get the current subject
        const thisWeek = endOfWeek(new Date());
        const subject = this.subjectProvider.subjectSubject.value;
        const all = await this.client.badgeUpJSClient.earnedAchievements
            .query()
            .subject(subject)
            .until(subWeeks(thisWeek, weekNum))
            .since(subWeeks(thisWeek, weekNum + 1))
            .getAll();

        all.sort((a, b) => new Date(b.meta.created).getTime() - new Date(a.meta.created).getTime());

        const mapper = async (ea: EarnedAchievement) => {
            const ach = await this.retrieveAchievementById(ea.achievementId);
            const color = await this.colorLoader.getColor(ach.meta.icon);
            return new AchievementAndEarnedAchievement(ach, ea, color || this.colorLoader.BASE_RED_COLOR);
        };

        const results = await pMap(all, mapper, { concurrency: MAX_ACH_CONCURRENCY });

        return results;
    }
}
