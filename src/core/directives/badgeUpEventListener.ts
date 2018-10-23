import { AfterContentInit, ElementRef } from '@angular/core';
import { EventManager } from '@angular/platform-browser';

import { BadgeUpClient } from '../badgeUpClient';
import { BadgeUpLogger } from '../badgeUpLogger';

import { BadgeUpPartialEvent } from '../../declarations';

export class BadgeUpEventListenerSettings {
  eventName: string;

  getEventKey: () => string;
  getEventData: () => string;

  getEventModifier: () => string;
  getEventModifierValue: () => string;
}

export class BadgeUpEventListener implements AfterContentInit {

  private el: any;

  constructor(
    private elRef: ElementRef,
    private badgeUpClient: BadgeUpClient,
    private badgeUpLogger: BadgeUpLogger,
    private eventManager: EventManager,
    private eventListenerSettings: BadgeUpEventListenerSettings
  ) {
    this.el = this.elRef.nativeElement;
  }

  ngAfterContentInit() {
    this.eventManager.addEventListener(this.el, this.eventListenerSettings.eventName || 'click', (event: any) => {
      try {
        // wrapped in try/catch in order to
        // prevent "event" bubbling in the DOM
        // and silently warn the user in case of an exception
        this.emitEvent(event);
      } catch (e) {
        this.badgeUpLogger.error('BadgeUpEventListener: ' + e);
      }
    });
  }

  public emitEvent(event: BadgeUpEventListenerSettings) {
    const eventKey = this.eventListenerSettings.getEventKey();
    const eventData = this.eventListenerSettings.getEventData();

    const eventModifier = this.eventListenerSettings.getEventModifier();
    const eventModifierValue = this.eventListenerSettings.getEventModifierValue();

    const constructedEvent: BadgeUpPartialEvent = {
      key: eventKey,
      data: eventData
    };

    if (eventModifier) {
      const value = parseFloat(eventModifierValue);
      if (isNaN(value)) {
        this.badgeUpLogger.warn(`BadgeUpEventListener: Unable to convert "${eventModifierValue}" to a number`);
        return; // unable to convert, bail
      }

      constructedEvent.modifier = {
        [eventModifier]: value
      };
    }

    this.badgeUpClient.emit(constructedEvent);
  }
}
