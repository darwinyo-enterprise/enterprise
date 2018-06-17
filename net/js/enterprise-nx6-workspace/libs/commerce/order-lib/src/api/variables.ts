import { InjectionToken } from '@angular/core';

export const BASE_PATH = new InjectionToken<string>('http://localhost:5102');
export const COLLECTION_FORMATS = {
    'csv': ',',
    'tsv': '   ',
    'ssv': ' ',
    'pipes': '|'
}
