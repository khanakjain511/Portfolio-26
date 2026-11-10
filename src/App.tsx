import { Component, lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { asciiSignal, locations, portfolio, type LocationId } from './data';

const World = lazy(() => import('./World'));
const tourOrder: LocationId[] = ['about', 'projects', 'tech', 'experience', 'achievements', 'contact'];

type State = { failed: boolean };
class WorldBoundary extends Component<{ children: ReactNode; onError: () => void }, State> {
  state: State = { failed: false };
  static getDerivedStateFromError(): State { return { failed: true }; }
  componentDidCatch(_error: Error, _info: ErrorInfo) { this.props.onError(); }
  render() { return this.state.failed ? null : this.props.children; }
}

function useMobileMode() {
  const [mobile, setMobile] = useState(() => typeof window !== 'undefined' && window.matchMedia('(max-width: 760px)').matches);
  useEffect(() => {
    const query = window.matchMedia('(max-width: 760px)');
    const update = () => setMobile(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  return mobile;
}

function ProjectArchive() {
  return (
    <div className="project-archive">
      {portfolio.projects.map((project, index) => (
        <article className="project-card" key={project.name}>
          <div className="project-card-figure">
            <span>FIG 0{index + 1} / PROJECT STUDY</span>
            <pre aria-hidden="true">{project.glyph}</pre>
            <small>KHANAK JAIN / ARCHIVE 2026</small>
          </div>
          <div className="project-card-copy">
            <div className="project-card-overline"><span>{project.category}</span><span>0{index + 1} — 05</span></div>
            <h3>{project.name}</h3>
            <p>{project.description}</p>
            <div className="project-contribution"><span>MY PART IN IT</span>{project.contribution}</div>
            <div className="project-card-foot">
              <span>{project.stack}</span>
              <div className="project-links">
                {project.links.github ? <a href={project.links.github} target="_blank" rel="noreferrer">GITHUB ↗</a> : <span title="No verified repository URL is published">GITHUB —</span>}
                {project.links.demo ? <a href={project.links.demo} target="_blank" rel="noreferrer">LIVE ↗</a> : <span title="No verified live URL is published">LIVE —</span>}
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

function LocationContent({ id }: { id: LocationId }) {
  if (id === 'about') return (
    <>
      <h3 className="about-heading">Curiosity before <em>code.</em></h3>
      <p className="panel-lead">{portfolio.introduction}</p>
      {portfolio.about.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      <div className="content-block education-block">
        <span className="content-label">NOW STUDYING</span>
        <strong>{portfolio.education.degree}</strong>
        <span>{portfolio.education.school}</span>
        <span>{portfolio.education.years}</span>
      </div>
      <div className="traits-grid">{portfolio.traits.map((trait) => <div key={trait.name}><span>{trait.name}</span><small>{trait.state}</small></div>)}</div>
      <pre className="ascii-panel" aria-label="ASCII illustration of a sun and signal">{portfolio.aboutAscii.join('\n')}</pre>
      <p className="about-note">~ {portfolio.traitNote} ~</p>
    </>
  );

  if (id === 'projects') return (
    <>
      <p className="panel-lead">Small teams, big questions, and the satisfying moment when a sketch turns into a working thing.</p>
      <ProjectArchive />
      <p className="archive-foot">MORE EXPERIMENTS ARE TAKING SHAPE <span>✳</span></p>
    </>
  );

  if (id === 'tech') return (
    <>
      <p className="panel-lead">Tools are a means, not the point. Fluent in figuring it out.</p>
      <div className="tech-archive">{portfolio.stack.map((group, index) => (
        <div className="tech-row" key={group.category}>
          <span>[0{index + 1}] {group.category.toUpperCase()}</span>
          <div>{group.items.map((item) => <span className="tech-chip" key={item}>{item}</span>)}</div>
        </div>
      ))}</div>
      <div className="content-block"><span className="content-label">OPEN TABS / CURRENTLY EXPLORING</span><div className="exploring-list">{portfolio.exploring.map((item) => <span key={item}>{item}</span>)}</div><pre className="lab-ascii">{portfolio.labAscii.join('\n')}</pre></div>
    </>
  );

  if (id === 'experience') return (
    <>
      <p className="panel-lead">Technical communities, live events, and the people who make ambitious ideas feel possible. I’ve enjoyed showing up wherever a team needs thoughtful execution.</p>
      <div className="experience-list">{portfolio.experience.map((item) => (
        <article className="experience-item" key={item.role}>
          <span className="content-label">{item.timing}</span>
          <div><h3>{item.role}</h3><p>{item.detail}</p></div>
          <span className="experience-mark">↗</span>
        </article>
      ))}</div>
    </>
  );

  if (id === 'achievements') return (
    <>
      <p className="panel-lead">A moment to remember / 2026</p>
      <article className="achievement-card">
        <div className="achievement-place"><strong>{portfolio.achievement.place.slice(0, 2)}</strong><span>{portfolio.achievement.place.slice(2)}</span></div>
        <div><span className="content-label">IIT ROORKEE E-SUMMIT</span><h3>{portfolio.achievement.event}</h3><p>{portfolio.achievement.detail}</p></div>
        <span className="achievement-star">✳</span>
      </article>
      <p className="archive-foot">BUILT ALONGSIDE A COLLABORATIVE TEAM <span>✳</span></p>
    </>
  );

  return (
    <>
      <p className="panel-lead">Something on your mind? Let’s build something worth remembering.</p>
      <div className="contact-terminal">
        <div className="terminal-top"><span><i></i><i></i><i></i> KHANAK@UNIVERSE:~</span><span>LIVE CHANNEL</span></div>
        <pre>$ initiate_connection{'\n'}&gt; Opening communication channel...{'\n'}&gt; Connection established.{'\n'}&gt; Awaiting your message<span className="caret">_</span></pre>
      </div>
      <div className="contact-options">
        {portfolio.contact.email ? <a href={'mailto:' + portfolio.contact.email}>EMAIL ↗<small>{portfolio.contact.email}</small></a> : <span>EMAIL <small>Not published</small></span>}
        {portfolio.contact.linkedin ? <a href={portfolio.contact.linkedin} target="_blank" rel="noreferrer">LINKEDIN ↗</a> : <span>LINKEDIN <small>Not published</small></span>}
        {portfolio.contact.github ? <a href={portfolio.contact.github} target="_blank" rel="noreferrer">GITHUB ↗</a> : <span>GITHUB <small>Not published</small></span>}
      </div>
    </>
  );
}

function AccessibleArchive({ onNavigate }: { onNavigate: (id: LocationId) => void }) {
  return (
    <details className="accessible-archive">
      <summary>OPEN THE TEXT ARCHIVE</summary>
      <div className="archive-inner">
        <p className="archive-intro">A conventional, screen-reader-friendly index of Khanak’s portfolio. You can also use the location buttons above to open the same material.</p>
        {locations.map((location) => (
          <section key={location.id} className="archive-section">
            <div className="archive-heading"><h2>{location.title}</h2><button onClick={() => onNavigate(location.id)}>FOCUS IN WORLD ↗</button></div>
            <LocationContent id={location.id} />
          </section>
        ))}
        <p className="archive-footer">DESIGNED &amp; BUILT BY KHANAK JAIN · © 2026 — ALL RIGHTS RESERVED · STATUS: STILL BUILDING</p>
      </div>
    </details>
  );
}

export default function App() {
  const reducedMotion = Boolean(useReducedMotion());
  const mobile = useMobileMode();
  const [active, setActive] = useState<LocationId | null>(null);
  const [entered, setEntered] = useState(false);
  const [worldReady, setWorldReady] = useState(false);
  const [worldFailed, setWorldFailed] = useState(false);
  const [tourIndex, setTourIndex] = useState<number | null>(null);
  const [stageVisible, setStageVisible] = useState(true);
  const stageRef = useRef<HTMLDivElement>(null);
  const activeLocation = useMemo(() => locations.find((location) => location.id === active), [active]);
  const markWorldReady = useCallback(() => setWorldReady(true), []);
  const markWorldFailed = useCallback(() => setWorldFailed(true), []);

  const navigate = useCallback((id: LocationId) => {
    setEntered(true);
    setTourIndex(null);
    setActive(id);
  }, []);
  const returnToMap = useCallback(() => {
    setActive(null);
    setTourIndex(null);
  }, []);
  const beginTour = () => {
    setEntered(true);
    setTourIndex(0);
    setActive(tourOrder[0]);
  };
  const moveTour = (step: number) => {
    const next = (tourIndex ?? 0) + step;
    if (next < 0 || next >= tourOrder.length) {
      setTourIndex(null);
      returnToMap();
      return;
    }
    setTourIndex(next);
    setActive(tourOrder[next]);
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') returnToMap();
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        if (event.target instanceof HTMLElement && ['INPUT', 'TEXTAREA', 'BUTTON'].includes(event.target.tagName)) return;
        const current = Math.max(0, tourOrder.indexOf(active ?? 'about'));
        const offset = event.key === 'ArrowRight' ? 1 : -1;
        navigate(tourOrder[(current + offset + tourOrder.length) % tourOrder.length]);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, navigate, returnToMap]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const observer = new IntersectionObserver(([entry]) => setStageVisible(entry.isIntersecting), { threshold: 0.01 });
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (worldReady || worldFailed) return;
    const timer = window.setTimeout(() => setWorldFailed(true), 12000);
    return () => window.clearTimeout(timer);
  }, [worldFailed, worldReady]);

  return (
    <main className={'experience-shell' + (mobile ? ' is-mobile' : '')} aria-label="KHANAK.OS digital universe">
      <div className="world-stage" ref={stageRef}>
      <div className="world-backdrop" aria-hidden="true" />
      <div className="world-holder">
        <WorldBoundary onError={markWorldFailed}>
          <Suspense fallback={<div className="scene-loading"><span className="loader-mark">KJ</span><span>BUILDING THE WORLD</span></div>}>
            <World active={active} mobile={mobile} reducedMotion={reducedMotion} visible={stageVisible} onSelect={navigate} onReady={markWorldReady} />
          </Suspense>
        </WorldBoundary>
      </div>
      <div className="world-vignette" aria-hidden="true" />
      <header className="world-topbar">
        <button className="wordmark" onClick={returnToMap} aria-label="Return to world map"><strong>KJ</strong><span>KHANAK.OS<br/>DIGITAL UNIVERSE</span></button>
        <div className="world-status"><i></i><span>{portfolio.opportunityStatus}</span><b>·</b><span>BASED IN INDIA</span></div>
        <div className="top-actions">
          <button className="guided-button" onClick={beginTour}>GUIDED TOUR <span>↗</span></button>
          <button className="reset-button" onClick={returnToMap} aria-label="Reset camera and return to world map">RESET VIEW <span>⌖</span></button>
        </div>
      </header>

      <nav className="location-nav" aria-label="Universe locations">
        <span className="nav-kicker">JUMP TO LOCATION</span>
        {locations.map((location, index) => (
          <button key={location.id} className={active === location.id ? 'active' : ''} onClick={() => navigate(location.id)} aria-current={active === location.id ? 'location' : undefined}>
            <span>0{index + 1}</span>{location.title}
          </button>
        ))}
      </nav>

      <div className="world-instructions" aria-live="polite">
        <span><i className="mouse-icon"></i> DRAG TO ORBIT</span><span>SCROLL TO ZOOM</span><span>SELECT AN ISLAND</span>
      </div>

      <AnimatePresence>
        {!entered && (
          <motion.section className="entry-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: reducedMotion ? 0 : 0.7 }} aria-labelledby="entry-title">
            <div className="entry-ascii" aria-hidden="true"><pre>{asciiSignal.join('\n')}</pre></div>
            <div className="entry-card">
              <span className="eyebrow">PERSONAL ARCHIVE / NO. 001</span>
              <h1 id="entry-title">A digital<br/><em>universe.</em></h1>
              <p>{portfolio.description}</p>
              <p className="entry-mantra">{portfolio.hero}</p>
              <p className="entry-intro">{portfolio.introduction}</p>
              <button className="enter-button" onClick={() => setEntered(true)}><span>ENTER KHANAK.OS</span><b>↗</b></button>
              <div className="entry-foot"><span>MOVE THROUGH THE SIGNALS</span><span>28° 36′ N · 77° 13′ E</span></div>
              <button className="tour-text-button" onClick={beginTour}>OR START A GUIDED TOUR</button>
            </div>
            <span className="entry-index">WORLD 01 <i>·</i> KHANAK JAIN</span>
          </motion.section>
        )}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {entered && !activeLocation && (
          <motion.section key="map-prompt" className="map-prompt" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: reducedMotion ? 0 : 0.35 }}>
            <span className="eyebrow">WORLD MAP / 06 LOCATIONS</span>
            <h1>Find your<br/><em>way in.</em></h1>
            <p>Choose an island to open its archive. Drag to orbit the world and scroll to move closer.</p>
            <div className="map-hint"><span>01—06</span><span>CLICK A PLATFORM OR USE THE MENU</span></div>
          </motion.section>
        )}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {activeLocation && (
          <motion.aside key={activeLocation.id} className="location-panel" initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: reducedMotion ? 0 : 0.36, ease: [0.22, 1, 0.36, 1] }} aria-labelledby={'location-title-' + activeLocation.id} aria-live="polite">
            <div className="panel-head">
              <div><span className="eyebrow">{activeLocation.glyph} / SPATIAL ARCHIVE</span><span className="panel-live"><i></i> CONNECTED</span></div>
              <button className="panel-close" onClick={returnToMap} aria-label="Close location and return to map">×</button>
            </div>
            <h2 id={'location-title-' + activeLocation.id}>{activeLocation.title === 'PROJECT LAB' ? <>Things made<br/><em>to matter.</em></> : activeLocation.title}</h2>
            <p className="panel-subtitle">{activeLocation.subtitle}</p>
            <div className="panel-rule"><span></span><small>KHANAK / 2026</small></div>
            <div className="panel-content"><LocationContent id={activeLocation.id} /></div>
            {tourIndex !== null && (
              <div className="tour-controls"><span>GUIDED TOUR / {String(tourIndex + 1).padStart(2, '0')} OF 06</span><button onClick={() => moveTour(1)}>{tourIndex === 5 ? 'FINISH TOUR' : 'NEXT LOCATION ↗'}</button></div>
            )}
          </motion.aside>
        )}
      </AnimatePresence>

      <div className="world-coordinate" aria-hidden="true">{portfolio.systemState.map((line) => <span key={line}>{line}</span>)}<span>{activeLocation ? activeLocation.glyph : 'ORIGIN / 00'}</span></div>

      {!worldReady && !worldFailed && <div className="loading-status" role="status"><span className="loader-dot"></span> {worldReady ? 'WORLD ONLINE' : 'INITIALIZING WORLD'}</div>}
      {worldFailed && <div className="world-warning" role="status">3D is unavailable on this device. Use the location menu to read the same archive.</div>}
      <footer className="world-footer"><span>DESIGNED &amp; BUILT BY KHANAK JAIN</span><span>© 2026 / ALL RIGHTS RESERVED</span><span>STATUS: STILL BUILDING <i></i></span></footer>
      </div>
      <AccessibleArchive onNavigate={navigate} />
      <footer className="site-footer"><span>KHANAK.OS / A DIGITAL UNIVERSE</span><span>© 2026 — ALL RIGHTS RESERVED</span><button onClick={returnToMap}>BACK TO WORLD ↑</button></footer>
    </main>
  );
}
