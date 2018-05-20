import { Injectable } from '@angular/core';
import get from 'lodash.get';

import $iziToast from '../plugins/iziToast/iziToast';
import badgeUpLogoBase64 from 'base64-image-loader!../assets/badgeup-logo.png';
import { Achievement } from '@badgeup/badgeup-node-client';


@Injectable()
/**
 * The `BadgeUpToast` service is used to create notifications
 * when user unlocks new achievements.
 */
export class BadgeUpToast {
    showNewAchievementEarned(ach: Achievement) {
        $iziToast.show({
            title: `Achievement earned: ${ach.name}!`,
            message: ach.description || '',

            color: 'dark',
            position: 'bottomCenter',
            transitionIn: 'flipInX',
            transitionOut: 'flipOutX',
            progressBarColor: 'rgb(0, 255, 184)',
            image: get(ach, 'achievement.meta.icon', badgeUpLogoBase64),
            imageWidth: 70,
            layout: 2
        });
    }
}
