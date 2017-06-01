import { Injectable } from '@angular/core';

@Injectable()
/**
 * The `BadgeUpLogger` service is used to log messages of different types,
 * including: warnings, errors, information.
 */
export class BadgeUpLogger {
    warn(message) {
        console.log('[BadgeUp warning]' + message);
    }

    error(message) {
        console.log('[BadgeUp error] ' + message);
    }
}