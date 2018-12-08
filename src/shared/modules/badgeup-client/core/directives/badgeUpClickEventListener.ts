import { Directive, ElementRef, Injectable, Input } from '@angular/core';
import { EventManager } from '@angular/platform-browser';

import { BadgeUpClient } from '../badgeUpClient';
import { BadgeUpLogger } from '../badgeUpLogger';
import { BadgeUpEventListener } from './badgeUpEventListener';

@Injectable()
@Directive({
  selector: '[badgeUpClickEvent]'
})
/**
 * The `BadgeUpClickEvent` directive can be used in HTML to create new events, such as user interaction events.
 *
 * If you want to send event to BadgeUp when someone clicks a button, add badgeup-click-event directive that has an event key as value.
 * For example, if you want to track list refreshes as event key "list:refresh", you would use the following code:
 *
 * ```html
 * <button badgeUpClickEvent="list:refresh">Refresh the list</button>
 * ```
 *
 * You can also easily pass data using the badgeUpClickEventData attribute:
 *
 * ```html
 * <button badgeUpClickEvent="list:refresh"
 *        badgeUpClickEventData="my custom data">Refresh the list</button>
 * ```
 *
 * You can also provide your own event modifier. The following code would decrement the value by one when you click 'Refresh the list'.
 * ```html
 * <button badgeUpClickEvent="list:refresh"
 *        badgeUpClickEventModifier="@dec"
 *        badgeUpClickEventModifierValue="1">Refresh the list</button>
 * ```
 *
 * If you'd like to pass dynamic data to any of the attributes, you'd have to use property binding syntax. Just add square brackets:
 * ```html
 * <button badgeUpClickEvent="list:refresh"
 *        [badgeUpClickEventData]="{isFemale: isUserFemale()}">
 *        Refresh the list
 * </button>
 * ```
 */
export class BadgeUpClickEventListener extends BadgeUpEventListener {

    @Input('badgeUpClickEvent') private badgeUpEventKey: string;
    @Input('badgeUpClickEventData') private badgeUpEventData: string;

    @Input('badgeUpClickEventModifier') private badgeUpEventModifier: string;
    @Input('badgeUpClickEventModifierValue') private badgeUpEventModifierValue: string;

    constructor(
        elRef: ElementRef,
        badgeUpClient: BadgeUpClient,
        badgeUpLogger: BadgeUpLogger,
        eventManager: EventManager
    ) {
        super(elRef, badgeUpClient, badgeUpLogger, eventManager, {
            eventName: 'click',

            getEventKey: () => this.badgeUpEventKey,
            getEventData: () => this.badgeUpEventData,

            getEventModifier: () => this.badgeUpEventModifier,
            getEventModifierValue: () => this.badgeUpEventModifierValue
        });
    }
}
