import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Icon, Tag, IconBox, Crumbs, PageHead, Progress } from '../components/ui.jsx';
import { useStore } from '../store.jsx';
import { CAT_BY_ID, TERM_BY_ID, termsIn } from '../data/terms.js';
import { FRAMEWORKS } from '../data/frameworks.js';
import { REFERENCES, REF_BY_ID, CATEGORY_REFS, cite } from '../data/references.js';

// Small "Source" line shown under glossaries and terms.
export function SourceNote({ cat, compact }) {
  const ids = (CAT_BY_ID[cat] && CAT_BY_ID[cat].refs) || CATEGORY_REFS[cat] || [];
  const refs = ids.map((id) => REF_BY_ID[id]).filter(Boolean);
  if (!refs.length) return null;
  return (
    <div className={compact ? 'card' : 'card p24'} style={{ gap: 8 }}>
      <div className="row center gap8"><Icon name="Library" size={16} color="#475569" /><span className="label grow">Sources</span><Link to="/references" className="caption c-primary">All references</Link></div>
      {refs.map((r) => (
        <span key={r.id} className="caption muted">
          {r.url ? <a href={r.url} target="_blank" rel="noreferrer" className="c-primary">{r.title}</a> : <i>{r.title}</i>} — {r.author}, {r.year}.
        </span>
      ))}
      <span className="caption faint">Definitions are short study notes written in our own words, not quotations.</span>
    </div>
  );
}

const TermLink = ({ id, children }) => (id && TERM_BY_ID[id]
  ? <Link to={`/term/${id}`} className="c-primary row center gap4" style={{ display: 'inline-flex' }}>{children}<Icon name="ChevronRight" size={14} /></Link>
  : <span>{children}</span>);

export function Frameworks() {
  const { s } = useStore();
  return (
    <>
      <PageHead title="BABOK & PMBOK" sub="The two bodies of knowledge behind business analysis and project management. Start with the overview, then learn each glossary." />
      <div className="grid g2">
        {Object.values(FRAMEWORKS).map((f) => {
          const terms = termsIn(f.glossary); const got = terms.filter((t) => s.learned.includes(t.id)).length;
          const facts = f.id === 'babok' ? ['6 knowledge areas', '30 tasks', '50 techniques', '5 perspectives'] : ['12 principles', '8 performance domains', '3 approaches', 'Tailoring'];
          return (
            <div key={f.id} className="card p24" style={{ gap: 14 }}>
              <div className="row center"><IconBox name={f.icon} tone={f.color} size={48} /><div className="grow" /><Tag tone="ink">{f.owner}</Tag></div>
              <h2 className="h2">{f.name}</h2><p className="small muted grow">{f.intro}</p>
              <div className="row wrap gap6">{facts.map((x) => <Tag key={x} tone={f.color}>{x}</Tag>)}</div>
              <Progress value={terms.length ? (got / terms.length) * 100 : 0} h={6} color={`var(--${f.color})`} />
              <span className="caption faint">{got} of {terms.length} glossary terms learned</span>
              <div className="row gap8 wrap"><Link to={`/framework/${f.id}`} className="btn btn-primary">Open overview</Link><Link to={`/glossary/${f.glossary}`} className="btn btn-secondary">Glossary ({terms.length})</Link></div>
            </div>
          );
        })}
      </div>
      <div className="card row center stack-sm p24"><IconBox name="Lightbulb" tone="accent" /><div className="col grow gap4"><span className="label">How BA, PO and PM work together</span><span className="small muted">BABOK explains how to understand needs and shape solutions; PMBOK explains how to deliver them as a project. A PO lives in both: owning value (BABOK) inside an adaptive delivery approach (PMBOK).</span></div></div>
    </>
  );
}

const Tabs = ({ tabs, tab, setTab }) => (
  <div className="tabs" role="tablist">
    {tabs.map(([k, l]) => <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{l}</button>)}
  </div>
);

export function FrameworkDetail() {
  const { id } = useParams();
  const f = FRAMEWORKS[id];
  const nav = useNavigate();
  const [tab, setTab] = useState('overview');
  if (!f) return <p>Framework not found.</p>;
  const terms = termsIn(f.glossary);
  const tabs = id === 'babok'
    ? [['overview', 'Overview'], ['areas', 'Knowledge areas'], ['techniques', 'Techniques'], ['competencies', 'Competencies & perspectives']]
    : [['overview', 'Overview'], ['principles', 'Principles'], ['domains', 'Performance domains'], ['tools', 'Tools & methods']];
  return (
    <>
      <Crumbs items={[['BABOK & PMBOK', '/frameworks'], [f.name]]} />
      <div className="panel-primary row center stack-sm" style={{ flexDirection: 'row', gap: 20 }}>
        <div className="badge-ic" style={{ width: 64, height: 64, background: '#fff', borderRadius: 16 }}><Icon name={f.icon} size={32} color="#4F46E5" /></div>
        <div className="col grow gap6"><h1 className="h1">{f.name}</h1><p className="body">{f.intro}</p></div>
        <div className="col" style={{ gap: 8, minWidth: 200 }}>
          <button className="btn btn-secondary" onClick={() => nav(`/quiz?mode=mixed&cats=${f.glossary}&n=10`)}>Test yourself · 10 questions</button>
          <Link to={`/glossary/${f.glossary}`} className="btn" style={{ color: '#fff', background: 'rgba(255,255,255,.14)' }}>Glossary ({terms.length})</Link>
        </div>
      </div>
      <Tabs tabs={tabs} tab={tab} setTab={setTab} />

      {id === 'babok' && tab === 'overview' && <>
        <div className="card p24"><div className="row center"><h2 className="h2 grow">{f.core.title}</h2><TermLink id={f.core.term}>Term</TermLink></div>
          <div className="grid g3">{f.core.items.map(([n, d, t]) => <div key={n} className="soft bg-po-soft col" style={{ gap: 4 }}><TermLink id={t}><span className="label">{n}</span></TermLink><span className="small muted">{d}</span></div>)}</div>
        </div>
        <div className="card p24"><h2 className="h2">Requirement types</h2>
          <div className="grid g4 text">{f.requirementTypes.map(([n, d, t], i) => <div key={n} className="col" style={{ gap: 6 }}><span className="h2 c-po">{i + 1}</span><TermLink id={t}><span className="label">{n}</span></TermLink><span className="small muted">{d}</span></div>)}</div>
        </div>
      </>}
      {id === 'babok' && tab === 'areas' && <div className="grid g2">
        {f.areas.map((k) => (
          <div key={k.n} className="card p24" style={{ gap: 10 }}>
            <div className="row center gap8"><Tag tone="po">Chapter {k.n}</Tag><div className="grow" /><TermLink id={k.term}>Term</TermLink></div>
            <h3 className="h3">{k.name}</h3><p className="small muted">{k.sum}</p>
            <ol className="tasks">{k.tasks.map((t, i) => <li key={t}><span className="caption faint">{k.n}.{i + 1}</span> {t}</li>)}</ol>
          </div>
        ))}
      </div>}
      {id === 'babok' && tab === 'techniques' && <div className="card p24">
        <p className="small muted">The 50 general techniques in BABOK chapter 10. Highlighted ones have a glossary entry.</p>
        <div className="grid g3" style={{ gap: 8 }}>{f.techniques.map(([n, t], i) => (
          <div key={n} className={`row center soft ${t ? 'bg-po-soft' : 'bg-bg'}`} style={{ gap: 10, padding: '10px 12px' }}><span className="caption faint" style={{ width: 40 }}>10.{i + 1}</span><span className="small grow">{t ? <TermLink id={t}>{n}</TermLink> : n}</span></div>))}</div>
      </div>}
      {id === 'babok' && tab === 'competencies' && <div className="grid g2">
        <div className="card p24"><div className="row center"><h2 className="h2 grow">Underlying competencies</h2><TermLink id={f.competencies.term}>Term</TermLink></div>
          {f.competencies.items.map(([n, d], i) => <div key={n} className="col" style={{ gap: 2, paddingBottom: 6 }}><span className="label">9.{i + 1} {n}</span><span className="small muted">{d}</span></div>)}</div>
        <div className="card p24"><div className="row center"><h2 className="h2 grow">Perspectives</h2><TermLink id={f.perspectives.term}>Term</TermLink></div>
          {f.perspectives.items.map(([n, d], i) => <div key={n} className="col" style={{ gap: 2, paddingBottom: 6 }}><span className="label">11.{i + 1} {n}</span><span className="small muted">{d}</span></div>)}</div>
      </div>}

      {id === 'pmbok' && tab === 'overview' && <>
        <div className="card p24"><div className="row center"><h2 className="h2 grow">{f.system.title}</h2><TermLink id={f.system.term}>Term</TermLink></div><p className="body muted">{f.system.text}</p></div>
        <div className="card p24"><h2 className="h2">Development approaches</h2>
          <div className="grid g3">{f.approaches.map(([n, d, t]) => <div key={n} className="soft bg-accent-soft col" style={{ gap: 4 }}><TermLink id={t}><span className="label">{n}</span></TermLink><span className="small muted">{d}</span></div>)}</div>
        </div>
      </>}
      {id === 'pmbok' && tab === 'principles' && <div className="card p24">
        <div className="row center"><p className="small muted grow">Twelve principles from The Standard for Project Management. They guide behaviour rather than prescribe steps.</p><TermLink id={f.principlesTerm}>Term</TermLink></div>
        <div className="grid g3">{f.principles.map(([n, d, t], i) => <div key={n} className="card" style={{ gap: 4 }}><span className="h2 c-accent">{String(i + 1).padStart(2, '0')}</span><TermLink id={t}><span className="label">{n}</span></TermLink><span className="small muted">{d}</span></div>)}</div>
      </div>}
      {id === 'pmbok' && tab === 'domains' && <div className="card p24">
        <div className="row center"><p className="small muted grow">Eight groups of related activities that together deliver project outcomes. They overlap and run at the same time.</p><TermLink id={f.domainsTerm}>Term</TermLink></div>
        <div className="grid g4 text">{f.domains.map(([n, d, t], i) => <div key={n} className="card" style={{ gap: 4 }}><span className="caption faint">Domain {i + 1}</span><TermLink id={t}><span className="label">{n}</span></TermLink><span className="small muted">{d}</span></div>)}</div>
      </div>}
      {id === 'pmbok' && tab === 'tools' && <div className="card p24">
        <p className="small muted">Common models, methods and artefacts. Each one links to its glossary entry.</p>
        <div className="row wrap gap8">{f.tools.map(([n, t]) => <Link key={n} to={`/term/${t}`}><Tag tone="accent">{n}</Tag></Link>)}</div>
      </div>}
      <SourceNote cat={f.glossary} />
    </>
  );
}

export function References() {
  const groups = [...new Set(REFERENCES.map((r) => r.group))];
  return (
    <>
      <PageHead title="References" sub="The sources behind BAPO Path's glossaries, frameworks and lessons. Our content summarises them in plain English for study — read the originals for the full detail." />
      {groups.map((g) => (
        <section key={g} className="col" style={{ gap: 12 }}>
          <h2 className="h3">{g}</h2>
          <div className="card p0">
            {REFERENCES.filter((r) => r.group === g).map((r) => (
              <div key={r.id} className="list-row stack-sm" style={{ alignItems: 'flex-start' }}>
                <IconBox name="Library" tone="ink" size={36} iconSize={18} />
                <div className="col grow" style={{ gap: 4 }}>
                  <span className="label">{r.title}</span>
                  <span className="small muted">{cite(r)}</span>
                  <span className="caption faint">Used for: {r.used}</span>
                </div>
                {r.url && <a href={r.url} target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ padding: '8px 14px' }}>Visit <Icon name="ExternalLink" size={14} /></a>}
              </div>
            ))}
          </div>
        </section>
      ))}
      <p className="caption faint">BABOK® is a registered trademark of the International Institute of Business Analysis. PMBOK® is a registered mark of the Project Management Institute, Inc. ISTQB® is a registered trademark of the International Software Testing Qualifications Board. BAPO Path is not affiliated with these organisations.</p>
    </>
  );
}
