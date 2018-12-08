import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { OverviewProvider } from '../../core/providers/overview';
import { AchievementAndProgress } from '../../core/providers/provider-classes';

@Component({
    selector: 'upcoming-achmt',
    templateUrl: 'upcoming-achmt.html'
})
export class UpcomingAchmtComponent {

    public upcomingObs: Observable<AchievementAndProgress[]>;

    constructor(
        private overviewProvider: OverviewProvider
    ) {
        this.upcomingObs = this.overviewProvider.upcoming3;
    }
}
