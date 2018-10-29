import { Injectable } from '@angular/core';
import { EventRequest } from '@badgeup/badgeup-browser-client';
import { BadgeUpStorage, BadgeUpStoredEvent } from '../declarations';

@Injectable()
export class BadgeUpLocalStorage implements BadgeUpStorage {

    inMemoryStorage: {};
    localStorageSupported: boolean;

    readonly eventStorageKey: string = 'BADGEUP_EVENTSYNC';

    constructor() {
        this.localStorageSupported = !!window.localStorage;
    }

    storeEvent(badgeUpEvent: EventRequest) {

        const id = '' + (Math.floor(Math.random() * 1e6));
        const storedEvent: BadgeUpStoredEvent = {
            id,
            badgeUpEvent
        };

        if (this.localStorageSupported) {
            let eventLocalStorage: any = localStorage.getItem(this.eventStorageKey);
            if (eventLocalStorage) {
                eventLocalStorage = JSON.parse(eventLocalStorage);
            } else {
                eventLocalStorage = {};
            }

            eventLocalStorage[id] = storedEvent;
            localStorage.setItem(this.eventStorageKey, JSON.stringify(eventLocalStorage));
        } else {
            this.inMemoryStorage[id] = storedEvent;
        }
    }

    getEvents(): Promise<BadgeUpStoredEvent[]> {
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

    removeEvents(badgeUpEvents: BadgeUpStoredEvent[]) {
        if (this.localStorageSupported) {
            let eventLocalStorage = localStorage.getItem(this.eventStorageKey);
            if (eventLocalStorage) {
                eventLocalStorage = JSON.parse(eventLocalStorage);
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
