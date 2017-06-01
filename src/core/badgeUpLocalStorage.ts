import { Injectable } from '@angular/core';
import { BadgeUpStorage, BadgeUpEvent, BadgeUpStoredEvent } from '../declarations';

@Injectable()
export class BadgeUpLocalStorage implements BadgeUpStorage {

    inMemoryStorage: {};
    localStorageSupported: boolean;

    eventStorageKey:string = 'BADGEUP_EVENTSYNC';

    constructor() {
        this.localStorageSupported = !!window.localStorage;
    }

    storeEvent(badgeUpEvent: BadgeUpEvent) {

        const id = '' + (Math.floor(Math.random() * 1e6));
        let storedEvent: BadgeUpStoredEvent = {
            id: id,
            badgeUpEvent: badgeUpEvent
        };

        if(this.localStorageSupported) {
            let eventLocalStorage:any = localStorage.getItem(this.eventStorageKey);
            if(eventLocalStorage) {
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
        let promise = new Promise((resolve, reject) => {
            let eventStorage = this.inMemoryStorage;
            let badgeUpEvents: BadgeUpStoredEvent[] = [];
            if(this.localStorageSupported) {
                let eventLocalStorage = localStorage.getItem(this.eventStorageKey);
                if(eventLocalStorage) {
                    eventStorage = JSON.parse(eventLocalStorage);
                } else {
                    eventStorage = {};
                }
            }

            for(let key in eventStorage) {
                if(eventStorage.hasOwnProperty(key)) {
                    badgeUpEvents.push(eventStorage[key]);
                }
            }

            resolve(badgeUpEvents);
        });

        return promise;
    }

    removeEvents(badgeUpEvents: BadgeUpStoredEvent[]) {
        if(this.localStorageSupported) {
            let eventLocalStorage = localStorage.getItem(this.eventStorageKey);
            if(eventLocalStorage) {
                eventLocalStorage = JSON.parse(eventLocalStorage);
                for (let event of badgeUpEvents) {
                    delete eventLocalStorage[event.id];
                }

                localStorage.setItem(this.eventStorageKey, JSON.stringify(eventLocalStorage));
            }
        } else {
            for (let event of badgeUpEvents) {
                delete this.inMemoryStorage[event.id];
            }
        }
    }
}
