import { AchievementsOverviewModalComponent } from './achievements-overview-modal/achievements-overview-modal';
import { BadgeUpModule } from '../shared/modules/badgeup-client';
import { CommonModule } from '@angular/common';
import { EarnedAchievementsModalComponent } from './earned-achievements-modal/earned-achievements-modal';
import { IonicModule } from 'ionic-angular';
import { NgModule } from '@angular/core';

const BADGEUP_API_KEY = 'eyJhY2NvdW50SWQiOiJzODQwM2QzcGwiLCJhcHBsaWNhdGlvbklkIjoieWFuZTJsbmZzNSIsImtleSI6ImNqcDd1YXVpNTJweTNvMmJqZmViZnJ1ZWoifQ==';

/*
 * Components feature module
 */
@NgModule({
    imports: [
        CommonModule,
        IonicModule,
        BadgeUpModule.forRoot({ apiKey: BADGEUP_API_KEY })
    ],
    declarations: [
        EarnedAchievementsModalComponent,
        AchievementsOverviewModalComponent
    ],
    exports: [
        EarnedAchievementsModalComponent,
        AchievementsOverviewModalComponent
    ]
})
export class AppComponentsModule { }
