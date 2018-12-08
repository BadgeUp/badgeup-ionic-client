import { Component, Input } from '@angular/core';
import { ProgressTreeGroup, Criterion } from '@badgeup/badgeup-browser-client';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';

export interface CriterionProgress {
    name: string;
    description: string;
    percentage: number;
}

@Component({
    selector: 'criteria-progress-tree',
    templateUrl: 'criteria-progress-tree.html'
})
export class CriteriaProgressTreeComponent implements OnInit {

    @Input() public progress: ProgressTreeGroup;
    /* criteria array so we don't have to do additional lookups */
    @Input() public criteria: Criterion[];

    public critProgress: CriterionProgress[];

    public ngOnInit() {
        const criteriaIds = Object.keys(this.progress.criteria);
        this.critProgress = criteriaIds.map((critId): CriterionProgress => {
            const crit = this.criteria.find((c) => c.id === critId);
            return {
                name: crit.name,
                description: crit.description,
                percentage: this.progress.criteria[critId]
            };
        });
    }
}
