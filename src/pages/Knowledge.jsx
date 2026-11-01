import { useState, useMemo } from 'react';
import { Link, useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Icon, Tag, IconBox, Progress, Crumbs, PageHead, LevelTag } from '../components/ui.jsx';
import { useStore } from '../store.jsx';
import { CATEGORIES, CAT_BY_ID, TERMS, TERM_BY_ID, termsIn } from '../data/terms.js';
import { DOMAINS, DOMAIN_BY_ID } from '../data/domains.js';
import { SKILLS } from '../data/skills.js';
import { Translations } from '../components/Translations.jsx';
import { SourceNote } from './Frameworks.jsx';

const speak = (text) => { try { const u = new SpeechSynthesisUtterance(text); u.lang = 'en-US'; u.rate = 0.9; speechSynthesis.cancel(); speechSynthesis.speak(u); } catch (e) { /* not supported */ } };

export function SaveBtn({ id, size = 20 }) {
  const { s, a } = useStore(); const on = s.saved.includes(id);
  return <button className="icon-btn" style={{ background: 'transparent' }} aria-label={on ? 'Remove from saved' : 'Save term'} onClick={(e) => { e.preventDefault(); e.stopPropagation(); a.toggleSave(id); }}><Icon name="Bookmark" size={size} color={on ? '#4F46E5' : '#CBD5E1'} fill={on ? '#4F46E5' : 'none'} /></button>;
}

function CatCard({ c }) {
  const { s } = useStore();
  const all = termsIn(c.id); const got = all.filter((t) => s.learned.includes(t.id)).length; const pct = all.length ? Math.round((got / all.length) * 100) : 0;
  return (
    <Link to={`/glossary/${c.id}`} className="card p24 hover" style={{ gap: 14 }}>
      <div className="row center"><IconBox name={c.icon} tone={c.color} size={48} /><div className="grow" /><Tag tone={c.color === 'advanced' ? 'advanced' : c.color}>{all.length} terms</Tag></div>
      <div className="h2">{c.name}</div><p className="small muted grow">{c.desc}</p>
      <div className="row wrap gap6">{all.slice(0, 4).map((t) => <Tag key={t.id} tone="ink">{t.term}</Tag>)}</div>
      <Progress value={pct} h={6} color={`var(--${c.color})`} />
      <div className="row center"><span className="caption faint grow">{pct}% learned</span><span className="label c-primary row center gap6">Open <Icon name="ArrowRight" size={16} /></span></div>
    </Link>
  );
}

export function General() {
  const groups = [
    ['Workplace basics', 'Everyday language of an IT company.', ['it', 'team', 'corp']],
    ['Software engineering & testing', 'From the courses “Nhập môn Công nghệ Phần mềm” and “Lý thuyết Kiểm thử Phần mềm” (ISTQB Foundation).', ['se', 'qa']],
  ];
  const popular = ['team-definition-of-done', 'it-scope-creep', 'qa-boundary-value-analysis', 'babok-baccm', 'se-use-case', 'pmbok-raci-matrix'].map((id) => TERM_BY_ID[id]).filter(Boolean);
  return (
    <>
      <PageHead title="General Knowledge" sub="The words you hear every day in an IT company — explained in plain English with real workplace examples." />
      {groups.map(([title, sub, ids]) => (
        <section key={title} className="col" style={{ gap: 14 }}>
          <div className="col gap4"><h2 className="h2">{title}</h2><span className="small muted">{sub}</span></div>
          <div className="grid g3">{ids.map((id) => CAT_BY_ID[id]).filter(Boolean).map((c) => <CatCard key={c.id} c={c} />)}</div>
        </section>
      ))}
      <section className="col" style={{ gap: 14 }}>
        <div className="row end stack-sm"><div className="col grow gap4"><h2 className="h2">Bodies of knowledge</h2><span className="small muted">The two standards every BA, PO and PM should know — summarised, with their own glossaries.</span></div><Link to="/frameworks" className="btn btn-secondary">BABOK & PMBOK overview</Link></div>
        <div className="grid g2">{['babok', 'pmbok'].map((id) => CAT_BY_ID[id]).map((c) => <CatCard key={c.id} c={c} />)}</div>
      </section>
      <div className="row stretch stack-sm gap24">
        <div className="card p24 grow"><h3 className="h3">Browse A – Z</h3>
          <div className="row wrap gap6">{'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((ch) => { const has = TERMS.some((t) => t.term[0].toUpperCase() === ch); return (
            <Link key={ch} to={has ? `/glossary/all?letter=${ch}` : '#'} className="mark" style={{ background: has ? 'var(--bg)' : 'transparent', color: has ? 'var(--ink-2)' : 'var(--border)', fontWeight: 600, pointerEvents: has ? 'auto' : 'none' }}>{ch}</Link>); })}</div>
        </div>
        <div className="card p24" style={{ width: 460, maxWidth: '100%', gap: 4 }}>
          <div className="row center gap8" style={{ paddingBottom: 8 }}><Icon name="TrendingUp" size={18} color="#4F46E5" /><h3 className="h3">Popular this week</h3></div>
          {popular.map((t) => <Link key={t.id} to={`/term/${t.id}`} className="row center gap8" style={{ padding: '10px 0' }}><span className="label grow">{t.term}</span><span className="caption faint">{CAT_BY_ID[t.cat].short}</span><Icon name="ChevronRight" size={16} color="#94A3B8" /></Link>)}
        </div>
      </div>
      <div className="row center soft bg-accent-soft" style={{ gap: 14, padding: 20, borderRadius: 16 }}><Icon name="Languages" size={22} color="#D97706" /><span className="body grow">Want translations under each term? Choose Vietnamese, Korean or French in your profile.</span><Link to="/profile#languages" className="label c-accent">Choose languages</Link></div>
      <Link to="/references" className="row center small muted gap8"><Icon name="Library" size={16} />Where this content comes from: see References</Link>
    </>
  );
}

export function Glossary() {
  const { cat } = useParams();
  const [params] = useSearchParams();
  const { s } = useStore();
  const nav = useNavigate();
  const c = CAT_BY_ID[cat];
  const base = cat === 'all' ? TERMS : termsIn(cat);
  const subs = ['All', ...new Set(base.map((t) => t.sub))];
  const [sub, setSub] = useState('All'); const [q, setQ] = useState(''); const [lv, setLv] = useState(0);
  const letter = params.get('letter');
  const list = base.filter((t) => (sub === 'All' || t.sub === sub) && (!lv || t.level === lv) && (!letter || t.term[0].toUpperCase() === letter) && (t.term + ' ' + t.full + ' ' + t.def).toLowerCase().includes(q.toLowerCase()));
  const title = cat === 'all' ? (letter ? `Terms starting with “${letter}”` : 'All terms') : c?.name;
  const parent = c?.type === 'domain' ? ['Domain Knowledge', '/domains'] : c?.type === 'framework' ? ['BABOK & PMBOK', '/frameworks'] : ['General Knowledge', '/general'];
  return (
    <>
      <Crumbs items={[parent, [title]]} />
      <PageHead title={title} sub={`${base.length} terms · ${base.filter((t) => s.learned.includes(t.id)).length} learned · ${base.filter((t) => s.saved.includes(t.id)).length} saved`}>
        <button className="btn btn-primary" onClick={() => nav(`/quiz?mode=mixed&terms=${list.map((t) => t.id).join(',')}&n=${Math.min(10, list.length)}`)} disabled={list.length < 4}>Practise these terms</button>
      </PageHead>
      <div className="row center wrap gap10">
        <div className="search" style={{ width: 320, background: '#fff', border: '1px solid var(--border)' }}><Icon name="Search" size={18} color="#94A3B8" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search in this glossary" /></div>
        {subs.map((x) => <button key={x} className={`chip ${sub === x ? 'on' : ''}`} onClick={() => setSub(x)}>{x}</button>)}
        <select className="chip" value={lv} onChange={(e) => setLv(Number(e.target.value))} aria-label="Level"><option value={0}>All levels</option><option value={1}>Beginner</option><option value={2}>Intermediate</option><option value={3}>Advanced</option></select>
      </div>
      <div className="card p0">
        {list.length === 0 && <p className="body muted" style={{ padding: 24 }}>No terms match. Try another filter.</p>}
        {list.map((t) => (
          <Link key={t.id} to={`/term/${t.id}`} className="list-row stack-sm">
            <div className="col gap4" style={{ width: 260, gap: 2 }}><span className="h3">{t.term}</span>{t.full && <span className="caption faint">{t.full}</span>}<Translations id={t.id} mode="term" /></div>
            <p className="body muted grow">{t.def}</p>
            <div className="row center gap6 hide-sm">{s.learned.includes(t.id) && <Tag tone="success">Learned</Tag>}<Tag tone="ink">{t.sub}</Tag><LevelTag level={t.level} /></div>
            <SaveBtn id={t.id} />
          </Link>
        ))}
      </div>
      {cat !== 'all' && <SourceNote cat={cat} />}
    </>
  );
}

export function TermDetail() {
  const { id } = useParams();
  const { s, a } = useStore();
  const t = TERM_BY_ID[id];
  if (!t) return <p>Term not found.</p>;
  const c = CAT_BY_ID[t.cat];
  const siblings = termsIn(t.cat);
  const idx = siblings.findIndex((x) => x.id === id);
  const prev = siblings[idx - 1]; const next = siblings[idx + 1];
  const related = siblings.filter((x) => x.sub === t.sub && x.id !== id).slice(0, 6);
  const usedIn = SKILLS.filter((k) => k.terms.includes(id));
  const learned = s.learned.includes(id); const inCards = !!s.cards[id];
  return (
    <>
      <Crumbs items={[c.type === 'domain' ? ['Domain Knowledge', '/domains'] : c.type === 'framework' ? ['BABOK & PMBOK', '/frameworks'] : ['General Knowledge', '/general'], [c.name, `/glossary/${c.id}`], [t.term]]} />
      <div className="row stack-sm gap24">
        <div className="col grow" style={{ gap: 16 }}>
          <div className="card p28">
            <div className="row gap8 wrap"><Tag tone="ink">{t.sub}</Tag><LevelTag level={t.level} />{learned && <Tag tone="success">Learned</Tag>}</div>
            <div className="row center wrap" style={{ gap: 14 }}>
              <h1 className="display">{t.term}</h1>
              <button className="pill bg-bg" style={{ border: 0 }} onClick={() => speak(t.term)}><Icon name="Volume2" size={16} color="#4F46E5" /><span className="small muted">Listen</span></button>
              <div className="grow" /><SaveBtn id={id} size={24} />
            </div>
            {t.full && <p className="h3 muted">{t.full}</p>}
            <p className="h3">{t.def}</p>
          </div>
          <div className="card p24 bg-primary-soft" style={{ borderColor: 'var(--primary-soft)' }}><span className="overline faint">At work</span><p className="body">“{t.example}”</p>
            <button className="row center gap6 label c-primary" style={{ border: 0, background: 'none', padding: 0 }} onClick={() => speak(t.example)}><Icon name="Volume2" size={16} />Hear the sentence</button></div>
          <Translations id={id} mode="full" className="card p24" />
          <div className="row gap10 wrap">
            {!learned ? <button className="btn btn-primary" onClick={() => a.learnTerm(id)}>I know this term · +5 XP</button> : <span className="btn btn-secondary c-success"><Icon name="Check" size={16} />Learned</span>}
            <button className="btn btn-secondary" disabled={inCards} onClick={() => a.addCards([id])}>{inCards ? 'In your flashcards' : 'Add to flashcards'}</button>
          </div>
        </div>
        <div className="col" style={{ width: 360, maxWidth: '100%', gap: 16 }}>
          {related.length > 0 && <div className="card"><span className="label">Related terms</span><div className="row wrap gap6">{related.map((r) => <Link key={r.id} to={`/term/${r.id}`}><Tag tone="po">{r.term}</Tag></Link>)}</div></div>}
          {usedIn.length > 0 && <div className="card" style={{ gap: 4 }}><span className="label">Used in skills</span>{usedIn.map((k) => (
            <Link key={k.id} to={`/skill/${k.id}`} className="row center gap10" style={{ padding: '10px 0' }}><IconBox name="Route" size={32} iconSize={16} /><div className="col grow" style={{ gap: 0 }}><span className="small">{k.title}</span><span className="caption faint">{k.track} · {['Beginner', 'Intermediate', 'Advanced', 'Expert'][k.level - 1]}</span></div><Icon name="ChevronRight" size={16} color="#94A3B8" /></Link>))}</div>}
          <div className="row gap8">
            {prev && <Link to={`/term/${prev.id}`} className="btn btn-secondary grow">← {prev.term}</Link>}
            {next && <Link to={`/term/${next.id}`} className="btn btn-secondary grow">{next.term} →</Link>}
          </div>
          <SourceNote cat={t.cat} compact />
        </div>
      </div>
    </>
  );
}

export function Domains() {
  const { s } = useStore();
  return (
    <>
      <PageHead title="Domain Knowledge" sub="A BA or PO must speak the language of the business. Each domain explains how the industry works, its key processes, and its glossary." />
      <div className="grid g4 text">
        {DOMAINS.map((d) => { const all = termsIn(d.id); const got = all.filter((t) => s.learned.includes(t.id)).length; return (
          <Link key={d.id} to={`/domain/${d.id}`} className="card hover">
            <div className="row center"><IconBox name={d.icon} tone={d.color} size={44} /><div className="grow" />{s.domains.includes(d.id) && <Tag>Your domain</Tag>}</div>
            <div className="h3">{d.name}</div><p className="small muted">{d.desc}</p>
            <span className="caption faint">{all.length} terms · {d.processes.length} processes</span>
            <Progress value={(got / all.length) * 100} h={6} />
          </Link>); })}
      </div>
      <div className="card row center stack-sm p24"><div className="col grow gap4"><span className="h3">Missing your industry?</span><span className="small muted">Suggest a domain or contribute terms — community contributions are planned for v3.</span></div><a className="btn btn-secondary" href="https://github.com/huynhthu1704/bapo-path/issues" target="_blank" rel="noreferrer">Suggest a domain</a></div>
    </>
  );
}

export function DomainDetail() {
  const { id } = useParams();
  const { s } = useStore();
  const nav = useNavigate();
  const d = DOMAIN_BY_ID[id];
  const [tab, setTab] = useState('overview');
  if (!d) return <p>Domain not found.</p>;
  const terms = termsIn(id); const got = terms.filter((t) => s.learned.includes(t.id)).length;
  return (
    <>
      <Crumbs items={[['Domain Knowledge', '/domains'], [d.name]]} />
      <div className="panel-primary row center stack-sm" style={{ flexDirection: 'row', gap: 20 }}>
        <div className="badge-ic" style={{ width: 64, height: 64, background: '#fff', borderRadius: 16 }}><Icon name={d.icon} size={32} color="#4F46E5" /></div>
        <div className="col grow gap6"><h1 className="h1">{d.name}</h1><p className="body">{d.overview}</p></div>
        <div className="col" style={{ width: 220, gap: 8 }}><span className="label">{Math.round((got / terms.length) * 100)}% learned</span><Progress value={(got / terms.length) * 100} h={6} color="#fff" track="rgba(255,255,255,.25)" /><button className="btn btn-secondary" onClick={() => nav(`/quiz?mode=mixed&cats=${id}&n=${Math.min(10, terms.length)}`)}>Practise {d.name.split(' ')[0]} terms</button></div>
      </div>
      <div className="row" style={{ gap: 28, borderBottom: '1px solid var(--border)' }}>
        {[['overview', 'Overview'], ['processes', 'Key processes'], ['glossary', `Glossary (${terms.length})`]].map(([k, l]) => (
          <button key={k} className="label" style={{ border: 0, background: 'none', padding: '0 0 12px', color: tab === k ? 'var(--primary)' : 'var(--ink-3)', borderBottom: tab === k ? '2px solid var(--primary)' : '2px solid transparent' }} onClick={() => setTab(k)}>{l}</button>
        ))}
      </div>
      {tab === 'overview' && <div className="grid g3">
        {[['Main products', d.products], ['Key stakeholders', d.stakeholders], ['Rules to know', d.rules]].map(([t, items]) => <div key={t} className="card p24" style={{ gap: 8 }}><h3 className="h3">{t}</h3>{items.map((x) => <span key={x} className="small muted">• {x}</span>)}</div>)}
      </div>}
      {(tab === 'overview' || tab === 'processes') && <>
        {tab === 'overview' && <h2 className="h2">Key processes</h2>}
        <div className="grid g4">{d.processes.map(([n, steps], i) => <div key={n} className="card"><span className="h2 c-primary">{String(i + 1).padStart(2, '0')}</span><span className="label">{n}</span><span className="caption muted">{steps}</span></div>)}</div>
      </>}
      {(tab === 'overview' || tab === 'glossary') && <>
        {tab === 'overview' && <div className="row center"><h2 className="h2 grow">Glossary preview</h2><button className="label c-primary row center gap6" style={{ border: 0, background: 'none' }} onClick={() => setTab('glossary')}>See all {terms.length} <Icon name="ArrowRight" size={16} /></button></div>}
        <div className="card p0">{(tab === 'overview' ? terms.slice(0, 6) : terms).map((t) => (
          <Link key={t.id} to={`/term/${t.id}`} className="list-row"><span className="label" style={{ width: 180 }}>{t.term}</span><span className="small muted grow">{t.def}</span><Tag tone="ink" className="hide-sm">{t.sub}</Tag><SaveBtn id={t.id} size={18} /></Link>))}</div>
      </>}
    </>
  );
}

export function Saved() {
  const { s } = useStore();
  const nav = useNavigate();
  const [f, setF] = useState('all');
  const items = s.saved.map((id) => TERM_BY_ID[id]).filter(Boolean);
  const cats = [...new Set(items.map((t) => t.cat))];
  const list = items.filter((t) => f === 'all' || t.cat === f);
  return (
    <>
      <PageHead title="Saved terms" sub={`${items.length} term${items.length === 1 ? '' : 's'} you bookmarked. Practise them as flashcards any time.`}>
        <button className="btn btn-primary" disabled={!items.length} onClick={() => nav('/flashcards?saved=1')}>Practise saved terms</button>
      </PageHead>
      {items.length === 0 ? <div className="card p28" style={{ alignItems: 'center', textAlign: 'center' }}><Icon name="Bookmark" size={32} color="#94A3B8" /><span className="h3">No saved terms yet</span><span className="body muted">Tap the bookmark on any term in the glossary to save it here.</span><Link to="/general" className="btn btn-primary">Browse the glossary</Link></div> : <>
        <div className="row wrap gap10"><button className={`chip ${f === 'all' ? 'on' : ''}`} onClick={() => setF('all')}>All ({items.length})</button>{cats.map((c) => <button key={c} className={`chip ${f === c ? 'on' : ''}`} onClick={() => setF(c)}>{CAT_BY_ID[c].short} ({items.filter((t) => t.cat === c).length})</button>)}</div>
        <div className="grid g3">{list.map((t) => (
          <Link key={t.id} to={`/term/${t.id}`} className="card hover"><div className="row center"><Tag tone="ink">{CAT_BY_ID[t.cat].short}</Tag><div className="grow" /><SaveBtn id={t.id} size={18} /></div><span className="h3">{t.term}</span><Translations id={t.id} mode="term" /><span className="small muted">{t.def}</span><span>{s.learned.includes(t.id) ? <Tag tone="success">Learned</Tag> : s.cards[t.id] ? <Tag>Learning</Tag> : <Tag tone="accent">New</Tag>}</span></Link>))}</div>
      </>}
    </>
  );
}
