// Learning-content translations. Menus and buttons stay in English; terms, definitions
// and examples can show one or more translations underneath.
import VI from './data/i18n/vi.js';
import KO from './data/i18n/ko.js';
import FR from './data/i18n/fr.js';
import { EXTRA_TR } from './data/terms.js';

export const LANGS = [
  { id: 'vi', tag: 'VI', name: 'Vietnamese', native: 'Tiếng Việt' },
  { id: 'ko', tag: 'KO', name: 'Korean', native: '한국어' },
  { id: 'fr', tag: 'FR', name: 'French', native: 'Français' },
];
export const LANG_BY_ID = Object.fromEntries(LANGS.map((l) => [l.id, l]));

const TABLES = { vi: VI, ko: KO, fr: FR };

// Returns [term, definition, example] in the language, or null if there is no translation.
export const trOf = (id, lang) => (EXTRA_TR[id] && EXTRA_TR[id][lang]) || (TABLES[lang] && TABLES[lang][id]) || null;

// The languages the learner switched on, in a fixed order.
export const activeLangs = (s) => LANGS.filter((l) => (s.langs || []).includes(l.id));
