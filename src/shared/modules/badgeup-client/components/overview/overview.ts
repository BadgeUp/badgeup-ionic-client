import { Component, OnInit } from '@angular/core';
import { OverviewProvider } from '../../core/providers/overview';
import { SubjectProvider } from '../../core/providers/subject';

@Component({
    selector: 'overview',
    templateUrl: 'overview.html'
})
export class OverviewComponent implements OnInit {

    constructor(private overviewProvider: OverviewProvider, private subjectProvider: SubjectProvider) {}

    public ngOnInit() {
        // fetch new data, updating the behavior subjects that back the overview components
        this.overviewProvider.load(this.subjectProvider.currentSubject);
    }
}
