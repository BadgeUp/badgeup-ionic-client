import { Injectable } from '@angular/core';
import { BadgeUpEarnedAchievement } from '../declarations';
import get from 'lodash.get';

import $iziToast from '../plugins/iziToast/iziToast';
import badgeUpLogoBase64 from 'base64-image-loader!../assets/badgeup-logo.png';


@Injectable()
/**
 * The `BadgeUpToast` service is used to create notifications
 * when user unlocks new achievements.
 */
export class BadgeUpToast {
    showNewAchievementEarned(badgeUpEarnedAchievement: BadgeUpEarnedAchievement) {
        $iziToast.show({
            title: `Achievement earned: ${badgeUpEarnedAchievement.name}!`,
            message: badgeUpEarnedAchievement.description || '',

            color: 'dark',
            position: 'bottomCenter',
            transitionIn: 'flipInX',
            transitionOut: 'flipOutX',
            progressBarColor: 'rgb(0, 255, 184)',
            image: get(badgeUpEarnedAchievement, 'achievement.meta.icon', badgeUpLogoBase64),
            imageWidth: 70,
            layout: 2
        });
    }
}