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
 * The `BadgeUpClickEvent` directive can be used in HTML in order to create new events
 * if user clicks buttons or other objects.
 *
 * If you want to send event to BadgeUp when someone clicks a button, add badgeup-click-event directive that has an event key as value.
 * For example, if you want to track people who press button and fire an event to BadgeUp servers that has event key "game:refresh", you would use the following code:
 *
 * ```html
 * <button badgeUpClickEvent="game:refresh">Refresh the game</button>
 * ```
 *
 * You can also easily pass data using the badgeUpClickEventData attribute:
 *
 * ```html
 * <button badgeUpClickEvent="game:refresh"
 *        badgeUpClickEventData="my custom data">Refresh the game</button>
 * ```
 *
 * You can also provide your own event modifier. The following code would decrement the value by one when you click 'Refresh the game'.
 * ```html
 * <button badgeUpClickEvent="game:refresh"
 *        badgeUpClickEventModifier="@dec"
 *        badgeUpClickEventModifierValue="1">Refresh the game</button>
 * ```
 *
 * If you'd like to pass dynamic data to any of the attributes, you'd have to use property binding syntax. Just add square brackets:
 * ```html
 * <button badgeUpClickEvent="game:refresh"
 *        [badgeUpClickEventData]="{isFemale: isUserFemale()}">
 *        Refresh the game
 * </button>
 * ```
 */
export class BadgeUpClickEventListener extends BadgeUpEventListener {

    @Input('badgeUpClickEvent') badgeUpEventKey: string;
    @Input('badgeUpClickEventData') badgeUpEventData: string;

    @Input('badgeUpClickEventModifier') badgeUpEventModifier: string;
    @Input('badgeUpClickEventModifierValue') badgeUpEventModifierValue: string;

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
