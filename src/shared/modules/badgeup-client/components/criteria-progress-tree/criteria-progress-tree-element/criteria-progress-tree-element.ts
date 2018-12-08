import { Component, Input, ViewChild } from '@angular/core';
import { tween } from 'shifty';

@Component({
    selector: 'criteria-progress-tree-element',
    templateUrl: 'criteria-progress-tree-element.html'
})
export class CriteriaProgressTreeElementComponent {
    @ViewChild('progressPath') private progressPath;
    @Input() public percentComplete: number = 0;

    public ngAfterViewInit() {
        tween({
            from: { offset: 100 },
            to: { offset: 100 * (1 - this.percentComplete) },
            duration: 1000,
            easing: 'easeOutCubic',
            step: (state) => {
                this.progressPath.nativeElement.style.strokeDashoffset = state.offset;
            }
        });
    }
}
