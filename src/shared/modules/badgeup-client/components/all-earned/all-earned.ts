import { Component, ViewChild, AfterViewInit } from '@angular/core';
import subWeeks from 'date-fns/subWeeks';
import startOfWeek from 'date-fns/startOfWeek';
import format from 'date-fns/format';
import { InfiniteScroll } from 'ionic-angular';
import { EarnedAchievementsProvider } from '../../core/providers/earned-achievements';
import { AchievementAndEarnedAchievement } from '../../core/providers/provider-classes';
import { Achievement } from '@badgeup/badgeup-browser-client';

export interface EarnedAchievementPage {
    label: string;
    value: AchievementAndEarnedAchievement[];
}

/* number of columns in the view */
const NUM_COLUMNS = 3;
const ACTIVE_CLASS = 'achmt-activated';

@Component({
    selector: 'all-earned',
    templateUrl: 'all-earned.html'
})
export class AllEarnedComponent implements AfterViewInit {
    @ViewChild('contents') private contents;

    public allEarned: EarnedAchievementPage[] = [];
    public isLoading: boolean = false;

    private readonly startingWeek = startOfWeek(new Date());
    private weekCtr = -1;

    public prevSelectedElement: HTMLInputElement = null;
    public selectedAchievementIndex: string = null;

    constructor(
        private earnedAchievements: EarnedAchievementsProvider
    ) {}

    public async ngAfterViewInit() {
        await this.getMore(); // this week
        await this.getMore(); // last week

        const pageHeight = document.body.scrollHeight || 0;
        const getContentsHeight = () => this.contents.nativeElement.scrollHeight;
        let count = 10;
        while (--count > 0 && getContentsHeight() < pageHeight) {
            await this.getMore();
        }
    }

    public async getMore(infiniteScroll?: InfiniteScroll) {
        const weekCounter = ++this.weekCtr;
        this.isLoading = true;
        const data = await this.earnedAchievements.getWeekOfEarnedAchievements(weekCounter);

        this.allEarned.splice(weekCounter, 0, {
            label: generateLabel(this.startingWeek, weekCounter),
            value: data
        });

        if (infiniteScroll) {
            infiniteScroll.complete();
        }

        this.isLoading = false;
    }

    /**
     * Called when the user taps on an earned achievement
     */
    public tapOnAchievementItem(selectedAchievement: Achievement, target: HTMLInputElement, index: number, parentIndex: number) {
        const position = Math.floor(index / NUM_COLUMNS) * NUM_COLUMNS + NUM_COLUMNS - 1;
        const maxCols = this.allEarned[parentIndex].value.length - 1;
        this.selectedAchievementIndex = `${parentIndex}-${Math.min(maxCols, position)}`;

        if (this.prevSelectedElement) {
            this.prevSelectedElement.classList.remove(ACTIVE_CLASS);
        }

        this.prevSelectedElement = target;
        target.classList.add(ACTIVE_CLASS);
    }
}

/**
 * Generates a date range label for infinite scrolling display
 * E.g. January 4th 2018
 */
function generateLabel(startingDate: Date, weekCounter: number): string {
    switch (weekCounter) {
        case -1:
            return 'in the Future!';
        case 0:
            return 'this week';
        case 1:
            return 'last week';
        default:
            return 'the week of '
                + format(subWeeks(startingDate, weekCounter), 'MMMM do yyyy');
    }
}
