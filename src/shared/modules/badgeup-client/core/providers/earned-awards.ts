import { Injectable } from '@angular/core';
import { BadgeUpClient } from '../badgeUpClient';
import { AwardAndEarnedAward } from './provider-classes';
import { SubjectProvider } from './subject';
import { EarnedAchievement } from '@badgeup/badgeup-browser-client';

@Injectable()
export class EarnedAwardsProvider {

    constructor(private client: BadgeUpClient, private subjectProvider: SubjectProvider) {
    }

    /**
     * Retrieve earned awards with IDs in an earned achievement record
     */
    public async getAwardDetailsByEarnedAchievement(earnedAchievement: EarnedAchievement): Promise<AwardAndEarnedAward[]> {
        // award details
        const awardsProm = this.client.badgeUpJSClient.achievements.getAchievementAwards(earnedAchievement.achievementId);
        // earned award details
        const earnedAwardsProm = this.client.badgeUpJSClient.earnedAwards.query().earnedAchievementId(earnedAchievement.id).getAll();

        const [ awards, earnedAwards ] = await Promise.all([awardsProm, earnedAwardsProm]);

        return earnedAwards.map((eAward) => new AwardAndEarnedAward(awards.find((a) => eAward.awardId === a.id), eAward));
    }

    /**
     * Retrieve a week of earned achievements
     */
    public async getEarnedAwards(): Promise<AwardAndEarnedAward[]> {
        // get the current subject
        const subject = this.subjectProvider.subjectSubject.value;
        const allAwards = await this.client.badgeUpJSClient.awards.getAll();
        let earnedAwards = await this.client.badgeUpJSClient.earnedAwards
            .query()
            .subject(subject)
            .getAll();

        // TODO add query filters for this functionality
        earnedAwards = earnedAwards.filter((eAward) => (eAward.state === 'approved' || eAward.state === 'created'));
        return earnedAwards.map((eAward) => new AwardAndEarnedAward(allAwards.find((award) => eAward.awardId === award.id), eAward));
    }
}
