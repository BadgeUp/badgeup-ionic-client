import { Injectable } from '@angular/core';
import { BadgeUpClient } from '../badgeUpClient';
import { SubjectProvider } from './subject';
import { Progress } from '@badgeup/badgeup-browser-client';

@Injectable()
export class AchievementDetailsProvider {
    constructor(private client: BadgeUpClient, private subjectProvider: SubjectProvider) {
    }

    public async getAchievementProgressDetails(id: string): Promise<Progress> {
        const subject = this.subjectProvider.subjectSubject.value;
        const all = await this.client.badgeUpJSClient.progress
            .query()
            .subject(subject)
            .achievementId(id)
            .include('achievement')
            .include('criterion')
            .include('award')
            .getAll();

        return all[0];
    }
}
