import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BadgeUpClient } from '../badgeUpClient';
import { AchievementAndEarnedAchievement, AchievementAndProgress } from './provider-classes';
import { SubjectProvider } from './subject';

@Injectable()
export class OverviewProvider {
    // most recent
    private mostRecentSubject: BehaviorSubject<AchievementAndEarnedAchievement[]> = new BehaviorSubject(null);
    public readonly mostRecent: Observable<AchievementAndEarnedAchievement[]> = this.mostRecentSubject.asObservable();

    // next up
    private nextUpSubject: BehaviorSubject<AchievementAndProgress[]> = new BehaviorSubject(null);
    public readonly nextUp: Observable<AchievementAndProgress[]> = this.nextUpSubject.asObservable();

    // upcoming3
    private upcoming3Subject: BehaviorSubject<AchievementAndProgress[]> = new BehaviorSubject(null);
    public readonly upcoming3: Observable<AchievementAndProgress[]> = this.upcoming3Subject.asObservable();

    constructor(private client: BadgeUpClient, private subjectProvider: SubjectProvider) {
        // load initial data
        this.subjectProvider.subject.subscribe((subject: string) => {
            this.load(subject);
        });
    }

    /**
     * load
     */
    public async load(subject: string) {
        await Promise.all([
            this.getMostRecent(subject),
            this.getNextUp(subject),
            this.getTop3(subject)
        ]);
    }

    /**
     * Retrieve the most recent achievement, updating the observable
     * The latest earned achievement is wrapped in an array to make templating code easier to manage
     * @param subject user to get the achievement for
     */
    private async getMostRecent(subject: string): Promise<void> {
        const iterator = this.client.badgeUpJSClient.earnedAchievements.query().subject(subject).orderBy('-created').getIterator();
        const mostRecent = await iterator.next().value;

        if (mostRecent) {
            const ach = await this.client.badgeUpJSClient.achievements.get(mostRecent.achievementId);
            const data = new AchievementAndEarnedAchievement(ach, mostRecent);
            this.mostRecentSubject.next([data]);
        } else {
            // returning an empty array is intentional
            this.mostRecentSubject.next([]);
        }
    }

    /**
     * Retrieve the upcoming achievement, updating the observable
     * The latest earned achievement is wrapped in an array to make templating code easier to manage
     * @param subject user to get the achievement for
     */
    private async getNextUp(subject: string): Promise<void> {
        const all = await this.client.badgeUpJSClient.progress.query()
            .include('achievement')
            .include('criterion')
            .subject(subject)
            .getAll();

        const prog = all
            .filter((item) => item.isComplete === false)
            .sort((a, b) => b.percentComplete - a.percentComplete)[0];

        if (prog) {
            const data = new AchievementAndProgress(prog.achievement, prog);
            this.nextUpSubject.next([data]);
        } else {
            this.nextUpSubject.next([]);
        }
    }

    /**
     * Retrieve the next 3 upcoming achievements, updating the observable
     * @param subject user to get the achievement for
     */
    private async getTop3(subject: string): Promise<void> {
        const list = await this.client.badgeUpJSClient.progress.query().subject(subject).include('achievement').getAll();

        const upcoming3 = list
            .filter((a) => !a.isComplete)
            .sort((a, b) => b.percentComplete - a.percentComplete)
            .slice(1, 4)
            .map((prog) => {
                return new AchievementAndProgress(prog.achievement, prog);
            });

        this.upcoming3Subject.next(upcoming3);
    }
}
