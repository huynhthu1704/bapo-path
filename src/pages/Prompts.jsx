// Prompt Workbench (sprint 1, behind the `prompts` feature flag; the gate is in PromptGate.jsx).
// This file and the prompt data load as a separate chunk, only when a Workbench page opens.
// Screens: L1 Library, L2 Prompt detail, L3 Workbench, L4 Collections, L5 Collection run, L6 My prompts.
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useStore } from '../store.jsx';
import { Icon, Tag, Crumbs, PageHead, Progress, GoogleButton } from '../components/ui.jsx';
import { activeLangs } from '../i18n.js';
import { ROLES, fill, parts, isNew } from '../data/prompts/index.js';
import { usePromptData, loadPromptData } from '../data/promptStore.js';
import { recordCopy, getStats, getMyRating, ratePrompt, sendFeedback } from '../data/promptApi.js';

loadPromptData(); // switch to the published prompts as soon as this chunk loads

// ---------- helpers ----------
const workPhases = (D) => D.phases.filter((p) => p.id !== 'every');
const inPhase = (D, phase) => D.prompts.filter((p) => p.phase === phase);
// Marks a prompt as used (favourites/recent/ticks) and counts the copy for Insights.
export const useCopied = () => { const { a } = useStore(); return (id) => { a.usePrompt(id); recordCopy(id); }; };

export const ago = (iso) => {
  const m = Math.round((Date.now() - Date.parse(iso)) / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60); if (h < 24) return `${h} h ago`;
  const d = Math.round(h / 24); return d === 1 ? 'yesterday' : `${d} days ago`;
};

// Copies text, with a fallback for browsers or contexts without the async clipboard API.
export async function copyText(text) {
  try { if (navigator.clipboard && window.isSecureContext) { await navigator.clipboard.writeText(text); return true; } } catch (e) { /* use fallback */ }
  const ta = document.createElement('textarea');
  ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
  document.body.appendChild(ta); ta.select();
  let ok = false; try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
  document.body.removeChild(ta); return ok;
}

// Placeholder values are remembered in this browser only (never synced), keyed by placeholder name.
const VALUES_KEY = 'bapo-path-prompt-values';
const readValues = () => { try { return JSON.parse(localStorage.getItem(VALUES_KEY)) || {}; } catch (e) { return {}; } };
export function usePhValues() {
  const [values, setValues] = useState(readValues);
  useEffect(() => {
    const h = (e) => { if (e.key === VALUES_KEY) setValues(readValues()); };
    window.addEventListener('storage', h); return () => window.removeEventListener('storage', h);
  }, []);
  const save = (next) => { setValues(next); try { localStorage.setItem(VALUES_KEY, JSON.stringify(next)); } catch (e) { /* storage full or blocked */ } };
  return {
    values,
    set: (name, v) => { const next = { ...readValues(), [name]: v }; if (!v) delete next[name]; save(next); },
    clear: (names) => { const next = { ...readValues() }; (names || Object.keys(next)).forEach((n) => delete next[n]); save(next); },
  };
}

// ---------- small components ----------
export function PhaseChip({ phase, label }) {
  const ph = usePromptData().phaseById[phase] || { name: phase, color: '#475569', soft: '#F1F5F9' };
  return (
    <span className="tag phase-chip" style={{ background: ph.soft, color: ph.color }}>
      <span className="dot" style={{ background: ph.color }} aria-hidden="true" />{label || ph.name}
    </span>
  );
}

const RoleTags = ({ roles }) => roles.map((r) => <Tag key={r} tone={r === 'PO' ? 'po' : r === 'PM' ? 'accent' : 'primary'}>{r}</Tag>);
const catLine = (p) => `${p.cat} · ${p.sub}`;

// Translated title (mode 'title') or title + description + when to use ('full'). Prompt text stays English.
export function PromptTr({ p, mode = 'title' }) {
  const { s } = useStore();
  const rows = activeLangs(s).map((l) => [l, p.tr && p.tr[l.id]]).filter(([, t]) => t);
  if (!rows.length) return null;
  if (mode === 'title') {
    return <span className="tr-terms">{rows.map(([l, t]) => <span key={l.id} className="tr-term" lang={l.id}><b>{l.tag}</b> {t[0]}</span>)}</span>;
  }
  return (
    <div className="tr-box">
      {rows.map(([l, t]) => (
        <div key={l.id} className="tr-row" lang={l.id}>
          <span className="tr-tag">{l.tag}</span>
          <div className="col" style={{ gap: 2 }}>
            <span className="label">{t[0]}</span>
            <span className="small muted">{t[1]}</span>
            <span className="small faint">{t[2]}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export function FavButton({ id, withLabel = false }) {
  const { s, a } = useStore();
  const on = s.promptFavs.includes(id);
  const label = on ? 'Remove from favourites' : 'Add to favourites';
  if (withLabel) {
    return (
      <button type="button" className={`btn ${on ? 'btn-fav-on' : 'btn-secondary'}`} aria-pressed={on} onClick={() => a.togglePromptFav(id)}>
        <Icon name="Star" size={16} fill={on ? 'currentColor' : 'none'} />{on ? 'Saved' : 'Save'}
      </button>
    );
  }
  return (
    <button type="button" className={`icon-btn fav ${on ? 'on' : ''}`} aria-pressed={on} aria-label={label} title={label} onClick={() => a.togglePromptFav(id)}>
      <Icon name="Star" size={18} fill={on ? 'currentColor' : 'none'} />
    </button>
  );
}

// Copy button with a 2-second "Copied" state, announced to screen readers.
export function CopyButton({ text, onCopied, label = 'Copy', variant = 'soft', className = '' }) {
  const [state, setState] = useState('idle');
  const timer = useRef();
  useEffect(() => () => clearTimeout(timer.current), []);
  const go = async () => {
    const ok = await copyText(typeof text === 'function' ? text() : text);
    setState(ok ? 'copied' : 'failed');
    if (ok && onCopied) onCopied();
    clearTimeout(timer.current); timer.current = setTimeout(() => setState('idle'), 2000);
  };
  const cls = variant === 'primary' ? 'btn btn-primary' : 'btn btn-copy';
  return (
    <>
      <button type="button" className={`${cls} ${className}`} onClick={go}>
        <Icon name={state === 'copied' ? 'Check' : 'Copy'} size={16} />{state === 'copied' ? 'Copied' : state === 'failed' ? 'Copy failed' : label}
      </button>
      <span className="sr-only" aria-live="polite">{state === 'copied' ? 'Copied' : state === 'failed' ? 'Copy failed. Select the text and copy it by hand.' : ''}</span>
    </>
  );
}

// Card used in the library grid (Figma component PW/PromptCard).
export function PromptCard({ p }) {
  const copied = useCopied();
  const { values } = usePhValues();
  return (
    <article className="card prompt-card">
      <div className="row center gap8">
        <PhaseChip phase={p.phase} />
        {isNew(p) && <Tag tone="primary">New</Tag>}
        <div className="grow" />
        <FavButton id={p.id} />
      </div>
      <div className="col gap4">
        <h3 className="h3"><Link to={`/prompts/${p.id}`} className="stretched">{p.title}</Link></h3>
        <PromptTr p={p} />
      </div>
      <p className="small muted">{p.desc}</p>
      <div className="row center wrap gap6"><RoleTags roles={p.roles} /><span className="caption faint">{catLine(p)}</span></div>
      <div className="push" />
      <div className="row center card-foot">
        <span className="caption faint grow">{p.ph.length} placeholder{p.ph.length === 1 ? '' : 's'}</span>
        <CopyButton text={() => fill(p.body, values)} onCopied={() => copied(p.id)} />
      </div>
    </article>
  );
}

// ---------- L1 Library ----------
const searchScore = (p, q) => {
  const t = p.title.toLowerCase();
  if (t.includes(q)) return t.startsWith(q) ? 6 : 5;
  if (Object.values(p.tr || {}).some((x) => x[0].toLowerCase().includes(q))) return 4;
  if ((p.desc + ' ' + p.sub + ' ' + p.tags.join(' ')).toLowerCase().includes(q)) return 3;
  if ((p.when.join(' ') + ' ' + p.output).toLowerCase().includes(q)) return 2;
  if (p.body.toLowerCase().includes(q)) return 1;
  return 0;
};

export function PromptLibrary() {
  const D = usePromptData();
  const { prompts: PROMPTS, phases: PHASES, categories: CATEGORIES } = D;
  const [sp, setSp] = useSearchParams();
  const q = sp.get('q') || ''; const role = sp.get('role') || ''; const phase = sp.get('phase') || ''; const cat = sp.get('cat') || '';
  const setParam = (k, v) => { const n = new URLSearchParams(sp); if (v) n.set(k, v); else n.delete(k); n.delete('preview'); setSp(n, { replace: true }); };
  const ql = q.trim().toLowerCase();

  const base = useMemo(() => PROMPTS.filter((p) => (!role || p.roles.includes(role)) && (!cat || p.cat === cat)), [PROMPTS, role, cat]);
  const counts = useMemo(() => Object.fromEntries(PHASES.map((ph) => [ph.id, base.filter((p) => p.phase === ph.id).length])), [PHASES, base]);
  const list = useMemo(() => {
    let l = base.filter((p) => !phase || p.phase === phase);
    if (ql) l = l.map((p) => [p, searchScore(p, ql)]).filter(([, sc]) => sc > 0).sort((x, y) => y[1] - x[1]).map(([p]) => p);
    return l;
  }, [base, phase, ql]);
  const fresh = PROMPTS.filter((p) => isNew(p));
  const filtered = !!(ql || role || cat);

  return (
    <>
      <PageHead title="Prompt Workbench" sub={`${PROMPTS.length} ready-to-use AI prompts for BA, PO and PM work, organised along the delivery workflow from discovery to monitoring. Fill in your context, copy, and paste into any AI tool.`}>
        <div className="row center gap8 wrap">
          <Link to="/my-prompts" className="btn btn-secondary">My prompts</Link>
          <Link to="/workbench" className="btn btn-primary">Open the Workbench</Link>
        </div>
      </PageHead>

      <div className="row center wrap gap8 pw-filters">
        <label className="search pw-search">
          <Icon name="Search" size={18} color="#94A3B8" />
          <input type="search" value={q} onChange={(e) => setParam('q', e.target.value)} placeholder="Search prompts — e.g. user stories, UAT, stakeholders" aria-label="Search prompts" />
        </label>
        <div className="row center gap6 wrap" role="group" aria-label="Role">
          {['', ...ROLES].map((r) => <button key={r || 'all'} type="button" className={`chip ${role === r ? 'on' : ''}`} aria-pressed={role === r} onClick={() => setParam('role', r)}>{r || 'All roles'}</button>)}
        </div>
        <select className="input pw-select" value={cat} onChange={(e) => setParam('cat', e.target.value)} aria-label="Category">
          <option value="">All categories</option>
          {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.id} · {c.name}</option>)}
        </select>
      </div>

      <div className="row center wrap gap6" role="group" aria-label="Phase">
        <button type="button" className={`chip ${!phase ? 'on' : ''}`} aria-pressed={!phase} onClick={() => setParam('phase', '')}>All phases · {base.length}</button>
        {PHASES.map((ph) => (
          <button key={ph.id} type="button" className={`chip phase ${phase === ph.id ? 'on' : ''}`} aria-pressed={phase === ph.id} onClick={() => setParam('phase', phase === ph.id ? '' : ph.id)}
            style={phase === ph.id ? { background: ph.color, borderColor: ph.color, color: '#fff' } : { background: ph.id === 'every' ? undefined : ph.soft, color: ph.id === 'every' ? undefined : ph.color, borderColor: 'transparent' }}>
            {ph.id !== 'every' && <span className="dot" style={{ background: phase === ph.id ? '#fff' : ph.color }} aria-hidden="true" />}{ph.name} · {counts[ph.id]}
          </button>
        ))}
      </div>

      {ql ? (
        <Section title={`${list.length} result${list.length === 1 ? '' : 's'} for “${q.trim()}”`} sub="Title matches first.">
          {list.length ? <Grid items={list} /> : <Empty text="No prompts match. Try another word, or clear the filters." onClear={() => setSp({}, { replace: true })} />}
        </Section>
      ) : phase ? (
        <PhaseGroups D={D} phase={phase} list={list} />
      ) : (
        <>
          {!filtered && fresh.length > 0 && (
            <Section title="New this month" sub={`${fresh.length} prompt${fresh.length === 1 ? '' : 's'} published in the last 30 days`}><Grid items={fresh.slice(0, 3)} /></Section>
          )}
          {PHASES.map((ph) => {
            const items = list.filter((p) => p.phase === ph.id);
            if (!items.length) return null;
            return (
              <Section key={ph.id} title={ph.name} sub={`${items.length} prompt${items.length === 1 ? '' : 's'} · ${ph.sub}`}
                action={items.length > 6 && <button type="button" className="btn btn-ghost" onClick={() => setParam('phase', ph.id)}>Show all {items.length}</button>}>
                <Grid items={items.slice(0, 6)} />
              </Section>
            );
          })}
          {!list.length && <Empty text="No prompts match these filters." onClear={() => setSp({}, { replace: true })} />}
        </>
      )}
    </>
  );
}

// One phase, grouped by category, with counts.
function PhaseGroups({ D, phase, list }) {
  const ph = D.phaseById[phase] || { name: phase, sub: '' };
  const groups = D.categories.map((c) => [c, list.filter((p) => p.cat === c.id)]).filter(([, l]) => l.length);
  return (
    <>
      <div className="col gap4"><h2 className="h2">{ph.name} · {list.length} prompt{list.length === 1 ? '' : 's'}</h2><p className="small muted">{ph.sub}</p></div>
      {groups.map(([c, l]) => (
        <Section key={c.id} title={`${c.id} · ${c.name}`} sub={`${l.length} prompt${l.length === 1 ? '' : 's'}`} small><Grid items={l} /></Section>
      ))}
      {!groups.length && <Empty text="No prompts in this phase match the filters." />}
    </>
  );
}

const Section = ({ title, sub, action, small, children }) => (
  <section className="col gap8" style={{ gap: 14 }}>
    <div className="row end">
      <div className="col grow gap4">{small ? <h3 className="h3">{title}</h3> : <h2 className="h2">{title}</h2>}{sub && <p className="small faint">{sub}</p>}</div>
      {action}
    </div>
    {children}
  </section>
);
const Grid = ({ items }) => <div className="grid g3 pw-grid">{items.map((p) => <PromptCard key={p.id} p={p} />)}</div>;
const Empty = ({ text, onClear }) => (
  <div className="card p24 center-text"><p className="body muted">{text}</p>{onClear && <button type="button" className="btn btn-secondary" style={{ alignSelf: 'center' }} onClick={onClear}>Clear filters</button>}</div>
);

// ---------- fill-in form + live preview (L2, L5) ----------
export function PromptWorkspace({ p, onCopied, preview = false }) {
  const copied = useCopied();
  const { values, set, clear } = usePhValues();
  const [view, setView] = useState('filled');
  const names = p.ph.map((x) => x[0]);
  const filledCount = names.filter((n) => (values[n] || '').trim()).length;
  const text = view === 'filled' ? fill(p.body, values) : p.body;
  const words = text.split(/\s+/).filter(Boolean).length;
  const segs = parts(p.body, view === 'filled' ? values : {});

  return (
    <>
      <section className="card p24" aria-labelledby={`fill-${p.id}`}>
        <div className="row center wrap card-head">
          <div className="col grow gap4">
            <h2 className="h3" id={`fill-${p.id}`}>Fill in your context</h2>
            <span className="caption faint">{filledCount} of {names.length} placeholder{names.length === 1 ? '' : 's'} filled · values stay in this browser</span>
          </div>
          <button type="button" className="btn btn-ghost" onClick={() => p.ph.forEach(([n, , ex]) => set(n, ex))}><Icon name="Wand2" size={16} />Use example</button>
          <button type="button" className="btn btn-ghost" onClick={() => clear(names)} disabled={!filledCount}><Icon name="Eraser" size={16} />Clear values</button>
        </div>
        {p.ph.map(([name, hint, ex]) => {
          const v = values[name] || '';
          const id = `ph-${p.id}-${name.replace(/\W+/g, '-')}`;
          const long = ex.length > 70 || name === 'Document' || name === 'Transcript';
          const Field = long ? 'textarea' : 'input';
          return (
            <div key={name} className="col gap6">
              <label htmlFor={id} className="row center gap8 wrap"><span className="label">[{name}]</span><span className="caption faint">{hint}</span></label>
              <Field id={id} className={`input ${long ? 'textarea' : ''} ${v.trim() ? '' : 'empty'}`} rows={long ? 3 : undefined} value={v}
                placeholder={`e.g. ${ex}`} onChange={(e) => set(name, e.target.value)} />
            </div>
          );
        })}
      </section>

      <section className="card p24" aria-labelledby={`out-${p.id}`}>
        <div className="row center wrap card-head">
          <div className="col grow gap4">
            <h2 className="h3" id={`out-${p.id}`}>Your prompt</h2>
            <span className="caption faint">Live preview · English · {words} words</span>
          </div>
          <div className="seg" role="group" aria-label="Preview">
            <button type="button" className={view === 'filled' ? 'on' : ''} aria-pressed={view === 'filled'} onClick={() => setView('filled')}>Filled</button>
            <button type="button" className={view === 'template' ? 'on' : ''} aria-pressed={view === 'template'} onClick={() => setView('template')}>Template</button>
          </div>
          <CopyButton text={() => fill(p.body, values)} label="Copy prompt" variant="primary" onCopied={() => { if (!preview) copied(p.id); onCopied && onCopied(); }} />
        </div>
        <pre className="prompt-pre" aria-label="Prompt preview">
          {segs.map((sg, i) => (sg.name ? <mark key={i} className={sg.filled ? 'ph-val' : 'ph-empty'}>{sg.text}</mark> : <span key={i}>{sg.text}</span>))}
        </pre>
        <div className="row center wrap gap8 caption">
          <span className="legend"><i className="sw val" />Your values</span>
          <span className="legend c-accent"><i className="sw empty" />Empty placeholder — stays in [brackets]</span>
        </div>
      </section>
    </>
  );
}

// ---------- L2 Prompt detail ----------
const TIPS = [
  'Remove names, customer data and anything confidential before pasting.',
  'Add one more line of context if the first answer is too general.',
  'Check every number, rule and name the AI gives you against your sources.',
];

export function PromptDetail() {
  const { id } = useParams();
  const D = usePromptData();
  const p = D.byId[id];
  if (!p) {
    return <div className="card p28"><h1 className="h2">{D.source === 'bundled' ? 'Prompt not found' : 'This prompt is no longer available'}</h1><p className="body muted">It may have been unpublished or archived by the editors.</p><Link to="/prompts" className="btn btn-secondary" style={{ alignSelf: 'flex-start' }}>Back to the library</Link></div>;
  }
  return <PromptDetailView p={p} />;
}

// The learner detail page. preview=true is used by the admin Preview (no ratings, no usage tracking).
export function PromptDetailView({ p, preview = false }) {
  const D = usePromptData();
  const [copied, setCopied] = useState(false);
  const nextRef = useRef();
  const ph = D.phaseById[p.phase] || { name: p.phase };
  const cat = D.categoryById[p.cat] || { id: p.cat, name: '' };
  const total = (D.phaseCount[p.phase] || 0) + (D.byId[p.id] && D.byId[p.id].phase === p.phase ? 0 : 1); // a draft is not counted yet
  const stepLabel = p.phase === 'every' ? `Every phase · ${p.step} of ${total}` : `${ph.name} · step ${p.step} of ${total}`;
  const nextList = (p.next || []).map((n) => D.byId[n]).filter(Boolean).slice(0, 3);
  const inCols = D.collections.map((c) => [c, c.steps.indexOf(p.id)]).filter(([, i]) => i >= 0);
  const onCopied = () => { setCopied(true); if (window.matchMedia('(max-width: 900px)').matches) setTimeout(() => nextRef.current && nextRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150); };

  return (
    <>
      {!preview && <Crumbs items={[['Prompt Workbench', '/prompts'], [ph.name, `/prompts?phase=${p.phase}`], [p.title]]} />}
      <div className="detail-split">
        <div className="col gap24" style={{ gap: 20 }}>
          <section className="card p28">
            <div className="row center wrap gap8">
              <PhaseChip phase={p.phase} label={stepLabel} /><RoleTags roles={p.roles} /><span className="caption faint grow">{catLine(p)}</span>
              {!preview && <FavButton id={p.id} withLabel />}
            </div>
            <h1 className="h1">{p.title}</h1>
            <PromptTr p={p} mode="full" />
            <p className="body muted">{p.desc}</p>
            <span className="caption faint">{!preview && <RatingSummary id={p.id} />}{cat.id} · {cat.name} · {p.ph.length} placeholders</span>
          </section>
          <div className="grid g3 info3">
            <InfoCard title="When to use"><ul className="bullets">{p.when.map((w) => <li key={w}>{w}</li>)}</ul></InfoCard>
            <InfoCard title="Prepare first"><ul className="bullets">{p.prepare.split(/,\s*/).map((w) => <li key={w}>{w}</li>)}</ul></InfoCard>
            <InfoCard title="Expected output"><p className="small muted">{p.output}</p></InfoCard>
          </div>
          <PromptWorkspace p={p} onCopied={onCopied} preview={preview} />
        </div>

        <aside className="col gap24" style={{ gap: 20 }}>
          <section className={`card p24 ${copied ? 'next-flash' : ''}`} ref={nextRef} aria-labelledby="next-h">
            <h2 className="h3" id="next-h">Next step</h2>
            <p className="small muted">{copied ? 'Copied. When you have the answer, continue with:' : 'After this prompt, most people continue with:'}</p>
            {!nextList.length && <p className="small faint">No next step set for this prompt.</p>}
            {nextList.map((q, i) => {
              const n = q.id;
              return (
                <Link key={n} to={`/prompts/${n}`} className={`next-item ${i === 0 ? 'rec' : ''}`}>
                  <span className="row center gap8 wrap"><PhaseChip phase={q.phase} />{i === 0 && <span className="caption c-accent">Recommended</span>}</span>
                  <span className="label">{q.title}</span>
                </Link>
              );
            })}
          </section>
          {!preview && <RateCard p={p} />}
          <section className="card p24">
            <h2 className="h3">Tips</h2>
            <ul className="bullets">{TIPS.map((t) => <li key={t}>{t}</li>)}</ul>
          </section>
          {inCols.length > 0 && (
            <section className="card p24">
              <h2 className="h3">In collections</h2>
              {inCols.map(([c, i]) => <Link key={c.id} to={`/collections/${c.id}?step=${i + 1}`} className="small c-primary">{c.name} · step {i + 1} of {c.steps.length}</Link>)}
            </section>
          )}
        </aside>
      </div>
    </>
  );
}
const InfoCard = ({ title, children }) => <section className="card"><h2 className="label">{title}</h2>{children}</section>;

// ---------- L3 Workbench ----------
export function Workbench() {
  const { s } = useStore();
  const D = usePromptData();
  const copied = useCopied();
  const { values } = usePhValues();
  const [sp, setSp] = useSearchParams();
  const role = sp.get('role') || '';
  const used = new Set(s.promptUsed);
  const lastUsed = Object.fromEntries(s.promptRecent.map((r) => [r.id, r.at]));
  const steps = (ph) => inPhase(D, ph).filter((p) => !role || p.roles.includes(role));
  const WORK_PHASES = workPhases(D);
  const firstOpen = WORK_PHASES.find((ph) => steps(ph.id).some((p) => !used.has(p.id)));
  const phase = sp.get('phase') || (firstOpen ? firstOpen.id : 'discover');
  const ph = D.phaseById[phase] || WORK_PHASES[0];
  const list = steps(ph.id);
  const rec = list.find((p) => !used.has(p.id));
  const setParam = (k, v) => { const n = new URLSearchParams(sp); if (v) n.set(k, v); else n.delete(k); setSp(n, { replace: true }); };
  const playbook = () => list.map((p, i) => `### Step ${i + 1}: ${p.title}\n\n${fill(p.body, values)}`).join('\n\n---\n\n');

  return (
    <>
      <PageHead title="Workbench" sub="Follow the delivery workflow one step at a time. Each step is one prompt; ticks show the prompts you have already used.">
        <div className="seg" role="group" aria-label="Role">
          {['', ...ROLES].map((r) => <button key={r || 'all'} type="button" className={role === r ? 'on' : ''} aria-pressed={role === r} onClick={() => setParam('role', r)}>{r || 'All roles'}</button>)}
        </div>
      </PageHead>

      <div className="phase-tabs" role="tablist" aria-label="Workflow phases">
        {WORK_PHASES.map((x) => {
          const l = steps(x.id); const u = l.filter((p) => used.has(p.id)).length;
          return (
            <button key={x.id} type="button" role="tab" aria-selected={x.id === phase} className={`phase-tab ${x.id === phase ? 'on' : ''}`}
              style={x.id === phase ? { borderColor: x.color, background: x.soft } : undefined} onClick={() => setParam('phase', x.id)}>
              <PhaseChip phase={x.id} />
              <span className="label">{u} of {l.length} used</span>
              <Progress value={l.length ? (u / l.length) * 100 : 0} h={4} color={x.color} />
            </button>
          );
        })}
      </div>

      <div className="home-split">
        <section className="card p0" aria-label={`${ph.name} steps`}>
          <div className="row center wrap list-head">
            <div className="col grow gap4"><h2 className="h2">{ph.name} · {list.length} steps</h2><p className="small faint">{ph.sub}</p></div>
            {list.length > 0 && <CopyButton text={playbook} label="Copy all as a playbook" className="btn-ghost-copy" />}
          </div>
          {list.map((p, i) => {
            const done = used.has(p.id); const isRec = rec && rec.id === p.id;
            return (
              <div key={p.id} className={`list-row step-row ${isRec ? 'rec' : ''}`}>
                <span className={`step-no ${done ? 'done' : isRec ? 'rec' : ''}`} aria-label={done ? 'Used' : `Step ${i + 1}`}>{done ? <Icon name="Check" size={16} color="#fff" /> : i + 1}</span>
                <div className="col grow gap4" style={{ gap: 2 }}>
                  <Link to={`/prompts/${p.id}`} className="label">{p.title}</Link>
                  <span className="caption faint">{catLine(p)} · {p.roles.join(', ')}</span>
                </div>
                <span className={`caption hide-sm ${isRec ? 'c-accent' : 'faint'}`}>{done && lastUsed[p.id] ? `Used ${ago(lastUsed[p.id])}` : done ? 'Used' : isRec ? 'Recommended next' : ''}</span>
                <CopyButton text={() => fill(p.body, values)} onCopied={() => copied(p.id)} />
                <Link to={`/prompts/${p.id}`} className="icon-btn" aria-label={`Open ${p.title}`}><Icon name="ChevronRight" size={18} /></Link>
              </div>
            );
          })}
          {!list.length && <p className="body muted" style={{ padding: 24 }}>No {role} prompts in this phase.</p>}
        </section>

        <aside className="col" style={{ gap: 20 }}>
          {rec ? (
            <section className="card p24 rec-card">
              <span className="overline c-accent">Recommended next step</span>
              <h2 className="h3">Step {list.indexOf(rec) + 1} · {rec.title}</h2>
              <p className="small muted">{rec.desc}</p>
              <Link to={`/prompts/${rec.id}`} className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Open prompt</Link>
            </section>
          ) : (
            <section className="card p24 bg-success-soft"><h2 className="h3">Phase complete</h2><p className="small muted">You have used every {ph.name} prompt{role ? ` for ${role}` : ''}. Pick the next phase above.</p></section>
          )}
          <section className="card p24">
            <div className="row center"><h2 className="h3 grow">Collections</h2><Link to="/collections" className="small c-primary">See all</Link></div>
            {D.collections.slice(0, 3).map((c) => {
              const u = c.steps.filter((n) => used.has(n)).length;
              return (
                <Link key={c.id} to={`/collections/${c.id}`} className="col gap6">
                  <span className="row center"><span className="label grow">{c.name}</span><span className="caption faint">{u}/{c.steps.length}</span></span>
                  <Progress value={(u / c.steps.length) * 100} h={4} />
                </Link>
              );
            })}
          </section>
          <section className="card p24">
            <h2 className="h3">Useful in every phase</h2>
            <p className="small muted">Project and team management and AI productivity prompts: stand-ups, status reports, stakeholder emails, summaries.</p>
            <Link to="/prompts?phase=every" className="label c-primary">Browse {D.phaseCount.every || 0} prompts</Link>
          </section>
        </aside>
      </div>
    </>
  );
}

// ---------- L4 Collections ----------
export function Collections() {
  const { s } = useStore();
  const { collections: COLLECTIONS, byId: PROMPT_BY_ID } = usePromptData();
  const used = new Set(s.promptUsed);
  const started = COLLECTIONS.find((c) => { const u = c.steps.filter((n) => used.has(n)).length; return u > 0 && u < c.steps.length; });
  return (
    <>
      <PageHead title="Collections" sub="Ready-made workflows: a set of prompts in order for a common piece of work. Step through them and track your progress." />
      <div className="grid g3 pw-grid">
        {COLLECTIONS.map((c) => {
          const u = c.steps.filter((n) => used.has(n)).length; const next = c.steps.findIndex((n) => !used.has(n));
          const primary = started ? started.id === c.id : c === COLLECTIONS[0];
          return (
            <article key={c.id} className="card prompt-card">
              <div className="row center gap6"><Icon name="Layers" size={20} color="#4F46E5" /><span className="grow" /><RoleTags roles={c.roles} /></div>
              <h2 className="h3"><Link to={`/collections/${c.id}`} className="stretched">{c.name}</Link></h2>
              <p className="small muted">{c.desc}</p>
              <ol className="mini-steps">{c.steps.slice(0, 4).map((n) => <li key={n} className={used.has(n) ? 'done' : ''}>{PROMPT_BY_ID[n].title}</li>)}{c.steps.length > 4 && <li className="more">+{c.steps.length - 4} more</li>}</ol>
              <div className="push" />
              <div className="col gap6"><span className="row center caption"><span className="faint grow">{c.steps.length} steps</span><span className="muted">{u}/{c.steps.length} used</span></span><Progress value={(u / c.steps.length) * 100} h={6} /></div>
              <Link to={`/collections/${c.id}?step=${next < 0 ? 1 : next + 1}`} className={`btn ${primary ? 'btn-primary' : 'btn-secondary'} on-top`}>
                {u === 0 ? 'Start' : u === c.steps.length ? 'Review' : 'Continue'}<Icon name="ArrowRight" size={16} />
              </Link>
            </article>
          );
        })}
      </div>
    </>
  );
}

// ---------- L5 Collection run ----------
export function CollectionRun() {
  const { id } = useParams();
  const { s } = useStore();
  const { collectionById: COLLECTION_BY_ID, byId: PROMPT_BY_ID } = usePromptData();
  const [sp, setSp] = useSearchParams();
  const nav = useNavigate();
  const c = COLLECTION_BY_ID[id];
  if (!c) return <div className="card p28"><h1 className="h2">Collection not found</h1><Link to="/collections" className="btn btn-secondary" style={{ alignSelf: 'flex-start' }}>All collections</Link></div>;
  const used = new Set(s.promptUsed);
  const n = Math.min(c.steps.length, Math.max(1, parseInt(sp.get('step'), 10) || 1));
  const p = PROMPT_BY_ID[c.steps[n - 1]];
  const u = c.steps.filter((x) => used.has(x)).length;
  const go = (k) => { setSp({ step: String(k) }); window.scrollTo(0, 0); };

  return (
    <>
      <Crumbs items={[['Prompt Workbench', '/prompts'], ['Collections', '/collections'], [c.name]]} />
      <div className="row end stack-sm">
        <div className="col grow gap6"><h1 className="h1">{c.name}</h1><p className="body muted">{c.desc}</p></div>
        <div className="col gap6" style={{ width: 240 }}><span className="caption muted">{u} of {c.steps.length} steps used</span><Progress value={(u / c.steps.length) * 100} /></div>
      </div>
      <div className="run-split">
        <nav className="card p0 run-steps" aria-label="Steps">
          {c.steps.map((x, i) => (
            <button key={x} type="button" className={`run-step ${i + 1 === n ? 'on' : ''}`} aria-current={i + 1 === n ? 'step' : undefined} onClick={() => go(i + 1)}>
              <span className={`step-no ${used.has(x) ? 'done' : ''}`}>{used.has(x) ? <Icon name="Check" size={14} color="#fff" /> : i + 1}</span>
              <span className="small">{PROMPT_BY_ID[x].title}</span>
            </button>
          ))}
        </nav>
        <div className="col" style={{ gap: 20 }}>
          <section className="card p24">
            <div className="row center wrap gap8"><span className="overline faint">Step {n} of {c.steps.length}</span><PhaseChip phase={p.phase} /><span className="grow" /><FavButton id={p.id} /></div>
            <h2 className="h2"><Link to={`/prompts/${p.id}`}>{p.title}</Link></h2>
            <PromptTr p={p} />
            <p className="body muted">{p.desc}</p>
            <p className="small"><b>Expected output:</b> <span className="muted">{p.output}</span></p>
          </section>
          <PromptWorkspace key={p.id} p={p} />
          <div className="row center">
            <button type="button" className="btn btn-secondary" disabled={n === 1} onClick={() => go(n - 1)}><Icon name="ArrowLeft" size={16} />Previous</button>
            <span className="grow" />
            {n < c.steps.length
              ? <button type="button" className="btn btn-secondary" onClick={() => go(n + 1)}>Next step<Icon name="ArrowRight" size={16} /></button>
              : <button type="button" className="btn btn-secondary" onClick={() => nav('/collections')}>Finish<Icon name="Check" size={16} /></button>}
          </div>
        </div>
      </div>
    </>
  );
}

// ---------- L6 My prompts ----------
export function MyPrompts() {
  const { s, a, user } = useStore();
  const { byId: PROMPT_BY_ID } = usePromptData();
  const copied = useCopied();
  const { values, clear } = usePhValues();
  const [tab, setTab] = useState(s.promptFavs.length || !s.promptRecent.length ? 'fav' : 'recent');
  const stored = Object.keys(values).length;
  const rows = tab === 'fav'
    ? s.promptFavs.map((id) => [PROMPT_BY_ID[id] || { id, gone: true }, null])
    : s.promptRecent.map((r) => [PROMPT_BY_ID[r.id] || { id: r.id, gone: true }, r.at]);

  return (
    <>
      <PageHead title="My prompts" sub={user ? 'Your favourites and recently used prompts, synced to your Google account.' : 'Your favourites and recently used prompts, kept in this browser. Sign in to keep them across devices.'}>
        <Link to="/prompts" className="btn btn-secondary">Browse the library</Link>
      </PageHead>
      <div className="tabs" role="tablist">
        <button type="button" role="tab" aria-selected={tab === 'fav'} className={tab === 'fav' ? 'on' : ''} onClick={() => setTab('fav')}>Favourites · {s.promptFavs.length}</button>
        <button type="button" role="tab" aria-selected={tab === 'recent'} className={tab === 'recent' ? 'on' : ''} onClick={() => setTab('recent')}>Recently used · {s.promptRecent.length}</button>
      </div>
      <section className="card p0">
        {rows.map(([p, at]) => (p.gone ? (
          <div key={p.id} className="list-row step-row">
            <div className="col grow" style={{ gap: 2 }}><span className="label faint">No longer available</span><span className="caption faint">This prompt was unpublished or archived ({p.id}).</span></div>
            {tab === 'fav' && <button type="button" className="btn btn-secondary" onClick={() => a.togglePromptFav(p.id)}>Remove</button>}
          </div>
        ) : (
          <div key={p.id} className="list-row step-row">
            <PhaseChip phase={p.phase} />
            <div className="col grow" style={{ gap: 2 }}>
              <Link to={`/prompts/${p.id}`} className="label">{p.title}</Link>
              <span className="caption faint">{catLine(p)}{at ? ` · used ${ago(at)}` : ''}</span>
            </div>
            <FavButton id={p.id} />
            <CopyButton text={() => fill(p.body, values)} onCopied={() => copied(p.id)} />
          </div>
        )))}
        {!rows.length && (
          <div className="col center-text" style={{ padding: 32 }}>
            <Icon name={tab === 'fav' ? 'Star' : 'History'} size={28} color="#94A3B8" style={{ alignSelf: 'center' }} />
            <p className="body muted">{tab === 'fav' ? 'No favourites yet. Tap the star on any prompt to keep it here.' : 'Prompts you copy will show here, newest first (up to 20).'}</p>
          </div>
        )}
      </section>
      <section className="card p24">
        <div className="row center wrap">
          <div className="col grow gap4"><h2 className="h3">Remembered context</h2><p className="small muted">{stored ? `${stored} placeholder value${stored === 1 ? '' : 's'} saved in this browser only. They prefill matching placeholders in other prompts.` : 'No placeholder values saved. Values you type in a prompt are kept in this browser only.'}</p></div>
          <button type="button" className="btn btn-danger" disabled={!stored} onClick={() => clear()}><Icon name="Eraser" size={16} />Clear all values</button>
        </div>
      </section>
    </>
  );
}

// ---------- ratings and private feedback (REQ-014) ----------
function RatingSummary({ id }) {
  const [st, setSt] = useState(null);
  useEffect(() => { let on = true; getStats(id).then((x) => on && setSt(x)).catch(() => {}); const h = (e) => { if (e.detail === id) getStats(id).then((x) => on && setSt(x)).catch(() => {}); }; window.addEventListener('pw-rated', h); return () => { on = false; window.removeEventListener('pw-rated', h); }; }, [id]);
  if (!st || !st.ratingCount) return null;
  return <span className="c-accent">★ {(st.ratingSum / st.ratingCount).toFixed(1)} ({st.ratingCount} rating{st.ratingCount === 1 ? '' : 's'}) · </span>;
}

function RateCard({ p }) {
  const { me, user } = useStore();
  const [mine, setMine] = useState(0); const [hover, setHover] = useState(0);
  const [text, setText] = useState(''); const [msg, setMsg] = useState(''); const [err, setErr] = useState(''); const [busy, setBusy] = useState(false);
  useEffect(() => { setMine(0); setMsg(''); setErr(''); if (me) getMyRating(p.id, me.uid).then((r) => setMine(r ? r.stars : 0)).catch(() => {}); }, [p.id, me && me.uid]); // eslint-disable-line
  const rate = async (n) => {
    setErr(''); setBusy(true);
    try { await ratePrompt(p.id, me, n); setMine(n); setMsg(`Thanks — you rated it ${n} star${n === 1 ? '' : 's'}. You can change it any time.`); window.dispatchEvent(new CustomEvent('pw-rated', { detail: p.id })); } catch (e) { setErr(e.message || 'Could not save your rating. Try again.'); }
    setBusy(false);
  };
  const send = async () => {
    setErr(''); setBusy(true);
    try { await sendFeedback(p, me, text); setText(''); setMsg('Thanks — your suggestion went privately to the editors.'); } catch (e) { setErr(e.message || 'Could not send. Try again.'); }
    setBusy(false);
  };
  return (
    <section className="card p24" aria-labelledby={`rate-${p.id}`}>
      <h2 className="h3" id={`rate-${p.id}`}>Rate this prompt</h2>
      {!me ? (
        <>
          <p className="small muted">Sign in to rate prompts and send private suggestions to the editors.</p>
          {!user && <GoogleButton label="Sign in with Google" small />}
        </>
      ) : (
        <>
          <div className="stars" role="radiogroup" aria-label="Your rating" onMouseLeave={() => setHover(0)}>
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} type="button" role="radio" aria-checked={mine === n} aria-label={`${n} star${n === 1 ? '' : 's'}`} disabled={busy}
                className={(hover || mine) >= n ? 'on' : ''} onMouseEnter={() => setHover(n)} onClick={() => rate(n)}>
                <Icon name="Star" size={26} fill={(hover || mine) >= n ? 'currentColor' : 'none'} />
              </button>
            ))}
          </div>
          <label htmlFor={`fb-${p.id}`} className="sr-only">Suggest an improvement</label>
          <textarea id={`fb-${p.id}`} className="input textarea" rows={3} maxLength={2000} value={text} onChange={(e) => setText(e.target.value)} placeholder="Suggest an improvement (private to the editors)" />
          <button type="button" className="btn btn-secondary" style={{ alignSelf: 'flex-start' }} disabled={busy || !text.trim()} onClick={send}>Send feedback</button>
        </>
      )}
      <span className="caption c-success" aria-live="polite">{msg}</span>
      {err && <span className="caption c-danger" role="alert">{err}</span>}
    </section>
  );
}
