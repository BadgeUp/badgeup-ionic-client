import { Component, Input, ViewChild, AfterViewInit } from '@angular/core';
import { Achievement } from '@badgeup/badgeup-browser-client';
import * as get from 'lodash.get';
import { tween } from 'shifty';

const RADIUS = 46;
const STROKE_OFFSET = RADIUS * Math.PI * 2;

@Component({
    selector: 'icon-progress',
    templateUrl: 'icon-progress.html'
})
export class AchievementIconComponent implements AfterViewInit {
    @Input() public achievement: Achievement;
    @Input() public percentComplete: number = 0;
    @Input() public showPercentage = true;
    @Input() public size: string = 'big'; // TODO: enum: big, small

    @ViewChild('progressPath') private progressPath;

    public ngAfterViewInit() {
        tween({
            from: { offset: STROKE_OFFSET },
            to: { offset: STROKE_OFFSET * (1 - this.percentComplete || 0) },
            duration: 1000,
            easing: 'easeOutCubic',
            step: (state) => {
                this.progressPath.nativeElement.style.strokeDashoffset = state.offset;
            }
        });
    }

    get icon() {
        return get(this.achievement, 'meta.icon');
    }

    get circleGraphSizeClass() {
        return this.size === 'small'
            ? 'badgeup-icon-progress--size-small'
            : 'badgeup-icon-progress--size-big';
    }

    get circleGraphPercentageHiddenClass() {
        return !this.showPercentage
            ? 'badgeup-icon-progress--percentage-hidden'
            : '';
    }
}
