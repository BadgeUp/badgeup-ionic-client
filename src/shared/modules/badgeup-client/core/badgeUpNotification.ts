import { Injectable } from '@angular/core';
import { Achievement, Award } from '@badgeup/badgeup-browser-client';
import { ModalController } from 'ionic-angular';
import { AchievementEarnedPopupComponent } from '../components/achievement-earned-popup/achievement-earned-popup';

@Injectable()
/**
 * The `BadgeUpNotification` service is used to create notifications
 * when user earns new achievements.
 */
export class BadgeUpNotification {
    constructor(private modalCtrl: ModalController) {
    }

    public showNewAchievementEarned(achievement: Achievement, earnedAwards: Award[]) {
      const modalPage = this.modalCtrl.create(AchievementEarnedPopupComponent, { achievement, earnedAwards });
      modalPage.present();
    }
}
