import { Achievement, EarnedAchievement, Progress, Award, EarnedAward } from '@badgeup/badgeup-browser-client';

export class AchievementAndEarnedAchievement {
    public achievement: Achievement;
    public earnedAchievement: EarnedAchievement;
    constructor(ach: Achievement, ea: EarnedAchievement) {
        this.achievement = ach;
        this.earnedAchievement = ea;
    }
}

export class AchievementAndProgress {
    public achievement: Achievement;
    public progress: Progress;
    constructor(ach: Achievement, prog: Progress) {
        this.achievement = ach;
        this.progress = prog;
    }
}

export class AwardAndEarnedAward {
    public award: Award;
    public earnedAward: EarnedAward;
    constructor(award: Award, ea: EarnedAward) {
        this.award = award;
        this.earnedAward = ea;
    }
}
