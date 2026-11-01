import { useStore } from '../store.jsx';
import { activeLangs, trOf } from '../i18n.js';

// Shows the learner's chosen translations for a term under the English.
// mode: 'term' = translated term only (lists), 'brief' = term + definition (cards, quiz), 'full' = term, definition and example.
export function Translations({ id, mode = 'brief', className = '' }) {
  const { s } = useStore();
  const rows = activeLangs(s).map((l) => [l, trOf(id, l.id)]).filter(([, t]) => t);
  if (!rows.length) return null;
  if (mode === 'term') {
    return (
      <span className={`tr-terms ${className}`}>
        {rows.map(([l, t]) => <span key={l.id} className="tr-term" lang={l.id}><b>{l.tag}</b> {t[0]}</span>)}
      </span>
    );
  }
  return (
    <div className={`tr-box ${className}`}>
      {rows.map(([l, t]) => (
        <div key={l.id} className="tr-row" lang={l.id}>
          <span className="tr-tag">{l.tag}</span>
          <div className="col" style={{ gap: 2 }}>
            <span className="label">{t[0]}</span>
            <span className="small muted">{t[1]}</span>
            {mode === 'full' && t[2] && <span className="small faint">“{t[2]}”</span>}
          </div>
        </div>
      ))}
    </div>
  );
}

// Multi-select of translation languages (Profile and Onboarding).
export function LangPicker({ value, onChange }) {
  const toggle = (id) => onChange(value.includes(id) ? value.filter((x) => x !== id) : [...value, id]);
  return (
    <div className="row wrap gap8">
      {[['vi', 'Vietnamese', 'Tiếng Việt'], ['ko', 'Korean', '한국어'], ['fr', 'French', 'Français']].map(([id, n, nat]) => {
        const on = value.includes(id);
        return (
          <button key={id} type="button" className={`check-chip ${on ? 'on' : ''}`} aria-pressed={on} onClick={() => toggle(id)}>
            <span className={`box ${on ? 'on' : ''}`} style={{ width: 18, height: 18 }}>{on && '✓'}</span>{n} <span className="caption faint">{nat}</span>
          </button>
        );
      })}
    </div>
  );
}
