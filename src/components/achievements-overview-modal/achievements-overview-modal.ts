/**
 * demo file only, not part of bundled ionic client
 */

import { Component } from '@angular/core';
import { ViewController, ModalController } from 'ionic-angular';
import { EarnedAchievementsModalComponent } from '../earned-achievements-modal/earned-achievements-modal';

/**
 * Modal component that simply shows the achievements overview
 */
@Component({
  selector: 'achievements-overview-modal',
  templateUrl: 'achievements-overview-modal.html'
})
export class AchievementsOverviewModalComponent {

    constructor(
        public viewCtrl: ViewController,
        public modalCtrl: ModalController
    ) {}

    public closeModal() {
        this.viewCtrl.dismiss();
    }

    public goToAllEarnedComponent() {
        const modalPage = this.modalCtrl.create(EarnedAchievementsModalComponent);
        modalPage.present();
    }
}
