/**
 * demo file only, not part of bundled ionic client
 */

import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

/**
 * Modal component that simply shows earned achievements
 */
@Component({
  selector: 'earned-achievements-modal',
  templateUrl: 'earned-achievements-modal.html'
})
export class EarnedAchievementsModalComponent {

    constructor(
        public viewCtrl: ViewController
    ) {}

    public closeModal() {
        this.viewCtrl.dismiss();
    }
}
