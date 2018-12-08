import { Component } from '@angular/core';
import { Achievement, Award } from '@badgeup/badgeup-browser-client';
import { NavParams } from 'ionic-angular';

@Component({
    selector: 'achievement-earned-popup',
    templateUrl: 'achievement-earned-popup.html',
})
export class AchievementEarnedPopupComponent {
    public achievement: Achievement;
    public earnedAwards: Award[];

    constructor(
        public navParams: NavParams
    ) {
        // we have to get the achievement data this way because injecting a provider would be a circular dependency
        this.achievement = this.navParams.get('achievement');
        this.earnedAwards = this.navParams.get('earnedAwards');
    }
}
