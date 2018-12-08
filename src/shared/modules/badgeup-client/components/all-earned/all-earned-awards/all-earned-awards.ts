import { Component } from '@angular/core';
import { EarnedAwardsProvider } from '../../../core/providers/earned-awards';
import { AwardAndEarnedAward } from '../../../core/providers/provider-classes';

@Component({
    selector: 'all-earned-awards',
    templateUrl: 'all-earned-awards.html'
})
export class AllEarnedAwardsComponent {
    public awards: AwardAndEarnedAward[];

    constructor(public earnedAwardsProvider: EarnedAwardsProvider) {
    }

    public async ngOnInit() {
        this.awards = await this.earnedAwardsProvider.getEarnedAwards();
    }
}
