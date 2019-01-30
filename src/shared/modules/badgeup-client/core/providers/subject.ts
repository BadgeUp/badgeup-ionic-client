import { BehaviorSubject, Observable } from 'rxjs';

export class SubjectProvider {

    public get currentSubject() {
        return this.subjectSubject.getValue();
    }

    /**
     * The BehaviorSubject containing the current subject to be used in events
     */
    public subjectSubject: BehaviorSubject<string> = new BehaviorSubject('unknown');

    /**
     * Observable for monitoring subject changes
     */
    public readonly subject: Observable<string> = this.subjectSubject.asObservable();

    public setSubject(subject: string) {
        this.subjectSubject.next(subject);
    }
}
