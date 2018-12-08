import { Injectable } from '@angular/core';
import { EventRequest } from '@badgeup/badgeup-browser-client';
import { BadgeUpStorage, BadgeUpStoredEvent } from '../declarations';

@Injectable()
export class BadgeUpLocalStorage implements BadgeUpStorage {

    private inMemoryStorage: { [s: string]: BadgeUpStoredEvent; } = {};
    private localStorageSupported: boolean;

    private readonly eventStorageKey: string = 'BADGEUP_EVENTSYNC';

    constructor() {
        this.localStorageSupported = !!window.localStorage;
    }

    public storeEvent(badgeUpEvent: EventRequest): void {

        const storedEvent = new BadgeUpStoredEvent(badgeUpEvent);

        if (this.localStorageSupported) {
            let eventLocalStorage: any = localStorage.getItem(this.eventStorageKey);
            if (eventLocalStorage) {
                eventLocalStorage = JSON.parse(eventLocalStorage);
            } else {
                eventLocalStorage = {};
            }

            eventLocalStorage[storedEvent.id] = storedEvent;
            localStorage.setItem(this.eventStorageKey, JSON.stringify(eventLocalStorage));
        } else {
            this.inMemoryStorage[storedEvent.id] = storedEvent;
        }
    }

    public getEvents(): Promise<BadgeUpStoredEvent[]> {
        let eventStorage = this.inMemoryStorage;
        const badgeUpEvents: BadgeUpStoredEvent[] = [];
        if (this.localStorageSupported) {
            const eventLocalStorage = localStorage.getItem(this.eventStorageKey);
            if (eventLocalStorage) {
                eventStorage = JSON.parse(eventLocalStorage);
            } else {
                eventStorage = {};
            }
        }

        for (const key in eventStorage) {
            if (eventStorage.hasOwnProperty(key)) {
                badgeUpEvents.push(eventStorage[key]);
            }
        }

        return Promise.resolve(badgeUpEvents);
    }

    public removeEvents(badgeUpEvents: BadgeUpStoredEvent[]): void {
        if (this.localStorageSupported) {
            const storageContents = localStorage.getItem(this.eventStorageKey);
            if (storageContents) {
                const eventLocalStorage = JSON.parse(storageContents);
                for (const event of badgeUpEvents) {
                    delete eventLocalStorage[event.id];
                }

                localStorage.setItem(this.eventStorageKey, JSON.stringify(eventLocalStorage));
            }
        } else {
            for (const event of badgeUpEvents) {
                delete this.inMemoryStorage[event.id];
            }
        }
    }
}
