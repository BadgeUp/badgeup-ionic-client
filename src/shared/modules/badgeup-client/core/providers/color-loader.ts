
import { Injectable } from '@angular/core';

@Injectable()
/**
 * The `ColorLoaderProvider` service is used to retrieve the color associated with an icon.
 */
export class ColorLoaderProvider {

    public readonly BASE_RED_COLOR = '#F12049';

    /**
     * Retrieves the primary color as a hex color string
     * @param url achievement icon image URL
     */
    public async getColor(url: string): Promise<string> {
        const res = await fetch(url, { method: 'HEAD' });
        return res.headers.get('x-goog-meta-primarycolor');
    }
}
