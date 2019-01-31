import { Component, OnInit, Input } from '@angular/core';
import formatDistance from 'date-fns/formatDistance';
import { get } from 'dot-prop';
import { AchievementAndEarnedAchievement, AwardAndEarnedAward } from '../../core/providers/provider-classes';
import { EarnedAwardsProvider } from '../../core/providers/earned-awards';

@Component({
    selector: 'recent-achmt-details',
    templateUrl: 'recent-achmt-details.html'
})
export class RecentAchmtDetailsComponent implements OnInit {

    @Input() public recent: AchievementAndEarnedAchievement;
    public awards: AwardAndEarnedAward[];

    constructor(
        public earnedAwardsProvider: EarnedAwardsProvider
    ) {
    }

    public async ngOnInit() {
        this.awards = await this.earnedAwardsProvider.getAwardDetailsByEarnedAchievement(this.recent.earnedAchievement);
    }

    public get timeAgo(): string {
        const d = get(this.recent, 'earnedAchievement.meta.created');
        return 'Earned ' + formatDistance(d, new Date()) + ' ago.';
    }
}
