import { Component, OnInit } from '@angular/core';
import { Achievement, Award } from '@badgeup/badgeup-browser-client';
import { NavParams } from 'ionic-angular';
import { ColorLoaderProvider } from '../../core/providers/color-loader';

const BASE_ICON = 'https://achievement-icons.useast1.badgeup.io/s8403d3pl/4egf7dpjj1/1poA6LDamOurjE9mUcPvLmOqxM.png';

@Component({
    selector: 'achievement-earned-popup',
    templateUrl: 'achievement-earned-popup.html',
})
export class AchievementEarnedPopupComponent implements OnInit {
    public achievement: Achievement;
    public earnedAwards: Award[];
    public get icon() {
        return this.achievement.meta.icon || BASE_ICON;
    }

    public baseColor: string;

    constructor(
        public navParams: NavParams,
        private colorLoader: ColorLoaderProvider
    ) {
        this.baseColor = this.colorLoader.BASE_RED_COLOR;

        // we have to get the achievement data this way because injecting a provider would be a circular dependency
        this.achievement = this.navParams.get('achievement');
        this.earnedAwards = this.navParams.get('earnedAwards');
    }

    public async ngOnInit() {

        const url = this.icon;

        try {
            const newPrimaryColor = await this.colorLoader.getColor(url);
            if(newPrimaryColor) {
                this.baseColor = newPrimaryColor;
            }
        // unable to set color here
        } catch(e) {}
    }

    private parseRGB(color: string): { r: number, g: number, b: number } {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(this.baseColor);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    public get boxShadow(): string {

        let rgb = this.parseRGB(this.baseColor);
        if(!rgb) {
            rgb = this.parseRGB(this.colorLoader.BASE_RED_COLOR);
        }

        // the normal box shadow CSS for below the icon
        const boxShadow = '0px 23px 18px';
        return `${boxShadow} rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.29)`;
    }
}
