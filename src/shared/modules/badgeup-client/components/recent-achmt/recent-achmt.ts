import { Component } from '@angular/core';
import * as get from 'lodash.get';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { OverviewProvider } from '../../core/providers/overview';
import { AchievementAndEarnedAchievement } from '../../core/providers/provider-classes';
import { EarnedAwardsProvider } from '../../core/providers/earned-awards';

@Component({
    selector: 'recent-achmt',
    templateUrl: 'recent-achmt.html'
})
export class RecentAchmtComponent {

    public mostRecentObs: Observable<AchievementAndEarnedAchievement[]>;
    public showDetails: boolean = false;

    constructor(
        public earnedAwardsProvider: EarnedAwardsProvider,
        private overviewProvider: OverviewProvider
    ) {
        this.mostRecentObs = this.overviewProvider.mostRecent;
    }

    public get icon$() {
        return this.mostRecentObs.pipe(
            map((mostRecent) => get(mostRecent[0], 'achievement.meta.icon'))
        );
    }
}
