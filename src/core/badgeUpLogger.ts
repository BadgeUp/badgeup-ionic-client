import { Injectable } from '@angular/core';

/* tslint:disable:no-console */

@Injectable()
/**
 * The `BadgeUpLogger` service is used to log messages of different types,
 * including: warnings, errors, information.
 */
export class BadgeUpLogger {
    warn(message) {
        console.warn('[BadgeUp warning]' + message);
    }

    error(message) {
        console.error('[BadgeUp error] ' + message);
    }
}
