import { Component, Input } from '@angular/core';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { AchievementAndEarnedAchievement } from '../../core/providers/provider-classes';
import formatDistance from 'date-fns/formatDistance';
import { get } from 'dot-prop';

/**
 * Achievement details for earned awards
 */
@Component({
    selector: 'earned-achievement-details',
    templateUrl: 'earned-achievement-details.html'
})
export class EarnedAchievementDetailsComponent implements AfterViewInit {
    @Input() public achItem: AchievementAndEarnedAchievement;

    public ngAfterViewInit() {
        // TODO fetch criteria and progress details
    }

    public get timeAgo(): string {
        const d = get(this.achItem, 'earnedAchievement.meta.created');
        return 'Earned ' + formatDistance(d, new Date()) + ' ago.';
    }
}
