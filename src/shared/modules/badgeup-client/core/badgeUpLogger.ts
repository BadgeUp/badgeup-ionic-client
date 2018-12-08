import { Injectable } from '@angular/core';

/* tslint:disable:no-console */

@Injectable()
/**
 * The `BadgeUpLogger` service is used to log messages of different types,
 * including: warnings, errors, information.
 */
export class BadgeUpLogger {
  public warn(...args: any[]) {
        console.warn('[BadgeUp warning]', ...args);
    }

    public error(...args: any[]) {
        console.error('[BadgeUp error]', ...args);
    }
}
