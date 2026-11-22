import {earthEntries} from './layers-earth.js';
import {peopleEntries} from './layers-people.js';
import {regionalEntries} from './layers-regional.js';

export const entries = [...earthEntries,...peopleEntries,...regionalEntries];
