import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { OverviewProvider } from '../../core/providers/overview';
import { AchievementAndProgress } from '../../core/providers/provider-classes';

@Component({
    selector: 'nextup-achmt',
    templateUrl: 'nextup-achmt.html'
})
export class NextUpAchmtComponent {

    public nextUpObs: Observable<AchievementAndProgress[]>;
    public showDetails: boolean = false;

    constructor(
        private overviewProvider: OverviewProvider
    ) {
        this.nextUpObs = this.overviewProvider.nextUp;
    }
}
