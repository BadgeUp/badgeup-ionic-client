import { Component } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { BadgeUpClient } from '../../shared/modules/badgeup-client';
import { AchievementsOverviewModalComponent } from '../../components/achievements-overview-modal/achievements-overview-modal';
import { EarnedAchievementsModalComponent } from '../../components/earned-achievements-modal/earned-achievements-modal';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    constructor(
        private modalCtrl: ModalController,
        public badgeUpClient: BadgeUpClient
    ) {
    }

    public openOverlay() {
        const modalPage = this.modalCtrl.create(AchievementsOverviewModalComponent);
        modalPage.onDidDismiss((data) => {
            if (data && data.kind === 'all-earned') {
                this.openAllEarned();
            }
        });
        modalPage.present();
    }

    public openAllEarned() {
        const modalPage = this.modalCtrl.create(EarnedAchievementsModalComponent);
        modalPage.present();
    }

    public sendEvent() {
        this.badgeUpClient.emit({ key: 'achievement-please' });
    }
}
