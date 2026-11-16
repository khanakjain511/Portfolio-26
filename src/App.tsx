import { Component, lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ErrorInfo, FormEvent, ReactNode } from 'react';
import { flushSync } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { asciiSignal, locations, portfolio, type LocationId } from './data';
import { AnimatedButton } from './components/ui/animated-button';
import { LiquidToggle } from './components/ui/liquid-toggle';

const World = lazy(() => import('./World'));
const tourOrder: LocationId[] = ['about', 'projects', 'tech', 'experience', 'content', 'achievements', 'contact'];
type Theme = 'light' | 'dark';
type DocumentWithViewTransition = Document & {
  startViewTransition?: (update: () => void) => { finished: Promise<void> };
};

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

function ProjectArchive({ compact = false }: { compact?: boolean }) {
  return (
      <div className={'project-archive' + (compact ? ' compact-project-archive' : '')}>
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
            {!compact && <div className="project-contribution"><span>MY PART IN IT</span>{project.contribution}</div>}
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

function LocationContent({ id, compact = false }: { id: LocationId; compact?: boolean }) {
  if (id === 'about') return (
    <>
      <h3 className="about-heading">Curiosity before <em>code.</em></h3>
      <p className="panel-lead">{portfolio.introduction}</p>
      {!compact && portfolio.about.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
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
      <p className="panel-lead">Five builds · collaborative, product, and frontend.</p>
      <ProjectArchive compact={compact} />
      {!compact && <p className="archive-foot">MORE EXPERIMENTS ARE TAKING SHAPE <span>✳</span></p>}
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
      <p className="panel-lead">Community, events, and teams.</p>
      <div className="experience-list">{portfolio.experience.map((item) => (
        <article className="experience-item" key={item.role}>
          <span className="content-label">{item.timing}</span>
          <div><h3>{item.role}</h3>{!compact && <p>{item.detail}</p>}</div>
          <span className="experience-mark">↗</span>
        </article>
      ))}</div>
    </>
  );

  if (id === 'achievements') return (
    <>
      <p className="panel-lead">Third place · HPCL Productathon.</p>
      <article className="achievement-card">
        <div className="achievement-place"><strong>{portfolio.achievement.place.slice(0, 2)}</strong><span>{portfolio.achievement.place.slice(2)}</span></div>
        <div><span className="content-label">IIT ROORKEE E-SUMMIT</span><h3>{portfolio.achievement.event}</h3>{!compact && <p>{portfolio.achievement.detail}</p>}</div>
        <span className="achievement-star">✳</span>
      </article>
      {!compact && <p className="archive-foot">BUILT ALONGSIDE A COLLABORATIVE TEAM <span>✳</span></p>}
    </>
  );

  if (id === 'content') return <ContentStories />;

  return (
    <>
      <p className="panel-lead">Choose a channel.</p>
      <div className="contact-terminal">
        <div className="terminal-top"><span><i></i><i></i><i></i> KHANAK@UNIVERSE:~</span><span>LIVE CHANNEL</span></div>
        <pre>$ channel --status{'\n'}&gt; READY · AWAITING MESSAGE<span className="caret">_</span></pre>
      </div>
      <div className="contact-options">
        {portfolio.contact.email ? <a href={'mailto:' + portfolio.contact.email}>EMAIL ↗<small>{portfolio.contact.email}</small></a> : <span>EMAIL <small>Not published</small></span>}
        {portfolio.contact.linkedin ? <a href={portfolio.contact.linkedin} target="_blank" rel="noreferrer">LINKEDIN ↗</a> : <span>LINKEDIN <small>Not published</small></span>}
        {portfolio.contact.github ? <a href={`https://github.com/${portfolio.contact.github}`} target="_blank" rel="noreferrer">GITHUB ↗</a> : <span>GITHUB <small>Not published</small></span>}
        {portfolio.contact.instagram ? <a href={`https://www.instagram.com/${portfolio.contact.instagram}/`} target="_blank" rel="noreferrer">INSTAGRAM ↗</a> : <span>INSTAGRAM <small>Not published</small></span>}
      </div>
    </>
  );
}

const contentCampaigns = [
  { title: 'Speaker Announcements', code: 'PEOPLE', detail: 'Speaker-focused announcements.', art: 'A VOICE\nWORTH\nHEARING' },
  { title: 'Meet the Club', code: 'SERIES', detail: 'Selected DevClub campaign.', art: 'PEOPLE ×\nCOMMUNITY' },
  { title: 'Community & Event Coverage', code: 'FIELD NOTES', detail: 'Selected community and event coverage.', art: 'IN THE\nROOM /\nIN THE FEED' },
];
const hacktoberfestPosts = {
  promo: 'https://www.instagram.com/p/De1e4nQiZE5/',
  reel: 'https://www.instagram.com/reel/De4B6Tkh8FB/',
  speaker: 'https://www.instagram.com/p/De_uglCiRpd/',
  recap: 'https://www.linkedin.com/feed/update/urn:li:activity:7524327891564847104',
  devclubUi: 'https://www.linkedin.com/feed/update/urn:li:activity:7518899117520150528',
  techTake: 'https://www.linkedin.com/feed/update/urn:li:activity:7521435988766769152',
};
const orientationStories = ['Arrival Day', 'From Their Journey to Yours', 'Lost at Sea', 'Myth vs Reality', 'Club Onboarding', 'Four Years, Countless Choices'];

function ContentStories() {
  return <div className="content-world">
    <section className="content-intro-card"><span className="content-label">CONTENT. STORIES. TECHNOLOGY.</span><h3>Words meet <em>worlds.</em></h3><p>Computer Science student at Newton School of Technology, interested in content, marketing and technology-driven storytelling.</p><p>Currently Marketing &amp; Content Lead at DevClub. I also contribute to NST institutional marketing videos through scripting, filming, direction and presenting.</p></section>
    <section className="content-world-block"><div className="content-world-heading"><span className="content-label">DEVCLUB / MARKETING &amp; CONTENT LEAD</span><small>LINKEDIN · INSTAGRAM</small></div><h3 className="content-section-title">Building a Tech Community Through Content</h3><p>I manage content and marketing communication across DevClub's LinkedIn and Instagram platforms.</p><details className="responsibility-details"><summary>WHAT I HANDLE <span>+</span></summary><ul><li>Content strategy and monthly content planning.</li><li>Social media communication and creative direction.</li><li>Event promotion and campaign execution.</li><li>Pre-event, live-event and post-event coverage.</li><li>Messaging, announcements and community engagement.</li></ul></details>
      <article className="hacktoberfest-feature"><div className="feature-kicker"><span>FEATURED CASE STUDY / 01</span><span>INSTAGRAM · LINKEDIN</span></div><h3>Hacktoberfest <em>2026</em></h3><p className="feature-role">End-to-end Marketing &amp; Content Management</p><p className="feature-summary">Overall marketing and content communication for DevClub's Hacktoberfest 2026.</p><div className="hacktoberfest-metrics"><a href={hacktoberfestPosts.recap} target="_blank" rel="noreferrer"><strong>600+</strong><span>STUDENTS</span><small>EVENT HIGHLIGHT ↗</small></a><a href={hacktoberfestPosts.recap} target="_blank" rel="noreferrer"><strong>250+</strong><span>TEAMS</span><small>EVENT HIGHLIGHT ↗</small></a></div>
        <div className="campaign-timeline"><div className="campaign-phase"><h4><i>01</i> PRE-EVENT <span>INSTAGRAM</span></h4><div className="evidence-grid"><a className="evidence-card" href={hacktoberfestPosts.promo} target="_blank" rel="noreferrer"><span className="evidence-preview"><small>INSTAGRAM / POST</small><b>PREVIEW UNAVAILABLE HERE</b><i>OPEN ORIGINAL POST ↗</i></span><strong>Promotional post</strong></a><a className="evidence-card" href={hacktoberfestPosts.reel} target="_blank" rel="noreferrer"><span className="evidence-preview"><small>INSTAGRAM / REEL</small><b>PREVIEW UNAVAILABLE HERE</b><i>OPEN ORIGINAL REEL ↗</i></span><strong>Promotional reel</strong></a><a className="evidence-card" href={hacktoberfestPosts.speaker} target="_blank" rel="noreferrer"><span className="evidence-preview"><small>INSTAGRAM / POST</small><b>PREVIEW UNAVAILABLE HERE</b><i>OPEN ORIGINAL POST ↗</i></span><strong>Speaker reveal</strong></a></div></div>
          <div className="campaign-phase"><h4><i>02</i> DURING EVENT <span>CONTENT PLANNING</span></h4><div className="phase-note">Event communication · live coverage · community engagement</div></div>
          <div className="campaign-phase"><h4><i>03</i> POST-EVENT <span>LINKEDIN</span></h4><a className="evidence-card recap-evidence" href={hacktoberfestPosts.recap} target="_blank" rel="noreferrer"><span className="evidence-preview"><small>LINKEDIN / EVENT RECAP</small><b>PREVIEW UNAVAILABLE HERE</b><i>OPEN ORIGINAL POST ↗</i></span><strong>Hacktoberfest recap</strong></a></div></div>
        <details className="responsibility-details feature-responsibilities"><summary>MY RESPONSIBILITIES <span>+</span></summary><ul><li>Overall marketing and content planning.</li><li>Promotional strategy and campaign execution.</li><li>Social media announcements and speaker communication.</li><li>Pre-event, during-event and post-event content planning.</li><li>Community engagement and event communication.</li></ul></details></article>
      <div className="evidence-secondary"><article className="editorial-evidence-card ui-evidence"><div className="feature-kicker"><span>PRODUCT COMMUNICATION</span><span>LINKEDIN</span></div><h4>DevClub UI</h4><p>Open-source component library</p><p className="evidence-subtitle">Product storytelling &amp; launch communication</p><div className="product-milestones"><span><b>3,000+</b> downloads</span><span><b>65+</b> components</span><span><b>5,400+</b> unique visitors</span></div><a className="evidence-open-link" href={hacktoberfestPosts.devclubUi} target="_blank" rel="noreferrer">OPEN LINKEDIN POST ↗</a><small className="metric-note">Product milestones · from the linked post</small></article>
        <article className="editorial-evidence-card tech-take-evidence"><div className="feature-kicker"><span>TECHNICAL CONTENT</span><span>LINKEDIN</span></div><h4>Tech Take</h4><p>MinIO MinLZ &amp; mz search</p><div className="tech-take-tags"><span>TECHNICAL STORYTELLING</span><span>SIMPLIFYING COMPLEX CONCEPTS</span><span>DEVELOPER EDUCATION</span></div><a className="evidence-open-link" href={hacktoberfestPosts.techTake} target="_blank" rel="noreferrer">OPEN LINKEDIN POST ↗</a></article></div>
      <div className="campaign-grid secondary-campaign-grid">{contentCampaigns.map((campaign, index) => <details className="campaign-card" key={campaign.title}><summary><span className="campaign-art">{campaign.art}<i>SELECTED / 0{index + 1}</i></span><span className="campaign-card-title"><small>{campaign.code}</small><strong>{campaign.title}</strong><b>+</b></span></summary><div className="campaign-detail"><p>{campaign.detail}</p></div></details>)}</div></section>
    <section className="content-world-block orientation-block"><div className="content-world-heading"><span className="content-label">NST ORIENTATION 2026</span><small>IN POST-PRODUCTION</small></div><p>Scriptwriter · Filming · Direction · On-camera Presenter</p><details className="storyboard-details"><summary>OPEN THE STORYBOARD <span>↗</span></summary><div className="storyboard-notes">Presenter-led scripts and dialogues; introductions, transitions and daily outros; vox-pop questions; camera directions and B-roll planning; filming, directing and presenting.</div></details><div className="story-timeline">{orientationStories.map((story, index) => <details className="story-card" key={story}><summary><i>0{index + 1}</i><span>{story}</span><b>+</b></summary><div><small>ORIENTATION 2026 / STORY BEAT {String(index + 1).padStart(2, '0')}</small><p>Script, visual planning and on-camera storytelling.</p>{index === 0 && <blockquote>“Rules that'll keep you on track, and stories that'll keep you inspired.”</blockquote>}{index === 1 && <blockquote>“Because starting tomorrow, Orientation 2026 actually begins.”</blockquote>}</div></details>)}</div></section>
    <section className="content-world-block"><span className="content-label">MY APPROACH TO CONTENT</span><div className="approach-line">{['Understand', 'Find the Story', 'Plan', 'Create', 'Distribute'].map((step, index) => <span key={step}><i>0{index + 1}</i>{step}{index < 4 && <b>→</b>}</span>)}</div></section>
    <section className="content-world-block tech-story-block"><span className="content-label">TECHNOLOGY × STORYTELLING</span><p>Exploring AI-generated video, creator workflows, product storytelling and AI-powered content production.</p><div className="tech-story-tags"><span>AI VIDEO</span><span>CREATOR WORKFLOWS</span><span>PRODUCT STORIES</span></div></section>
    <section className="content-contact-card"><span className="content-label">LET'S BUILD SOMETHING</span><h3>KHANAK JAIN</h3><p>Content · Marketing · Storytelling · Technology</p><div><a href={'mailto:' + portfolio.contact.email}>EMAIL ↗</a><a href={portfolio.contact.linkedin} target="_blank" rel="noreferrer">LINKEDIN ↗</a></div></section>
  </div>;
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
  const [theme, setTheme] = useState<Theme>(() => document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');
  const [active, setActive] = useState<LocationId | null>(null);
  const [entered, setEntered] = useState(false);
  const [viewMode, setViewMode] = useState<'explore' | 'terminal'>('explore');
  const [terminalCommand, setTerminalCommand] = useState('');
  const [terminalOutput, setTerminalOutput] = useState('READY / TRY HELP');
  const [worldReady, setWorldReady] = useState(false);
  const [worldFailed, setWorldFailed] = useState(false);
  const [tourIndex, setTourIndex] = useState<number | null>(null);
  const [stageVisible, setStageVisible] = useState(true);
  const stageRef = useRef<HTMLDivElement>(null);
  const themeTransitionTimer = useRef<number | undefined>(undefined);
  const explicitTheme = useRef(false);
  const activeLocation = useMemo(() => locations.find((location) => location.id === active), [active]);
  const markWorldReady = useCallback(() => setWorldReady(true), []);
  const markWorldFailed = useCallback(() => setWorldFailed(true), []);
  const applyTheme = useCallback((next: Theme, persist = true) => {
    const update = () => {
      const root = document.documentElement;
      root.dataset.theme = next;
      root.classList.toggle('dark', next === 'dark');
      root.style.colorScheme = next;
      root.style.backgroundColor = next === 'light' ? '#F4F0E7' : '#11120F';
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', next === 'dark' ? '#11120F' : '#F4F0E7');
      root.classList.add('theme-changing');
      window.clearTimeout(themeTransitionTimer.current);
      themeTransitionTimer.current = window.setTimeout(() => root.classList.remove('theme-changing'), 480);
      setTheme(next);
    };
    const transitionDocument = document as DocumentWithViewTransition;
    if (!reducedMotion && transitionDocument.startViewTransition) {
      transitionDocument.startViewTransition(() => flushSync(update));
    } else {
      update();
    }
    if (persist) {
      explicitTheme.current = true;
      try { localStorage.setItem('khanak-theme', next); } catch { /* Keep the active theme for this session. */ }
    }
    setTheme(next);
  }, [reducedMotion]);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-color-scheme: light)');
    const syncSystemTheme = () => {
      if (explicitTheme.current) return;
      try { if (localStorage.getItem('khanak-theme')) return; } catch { /* Follow the current system preference. */ }
      applyTheme(preference.matches ? 'light' : 'dark', false);
    };
    preference.addEventListener('change', syncSystemTheme);
    const onStorage = (event: StorageEvent) => {
      if (event.key === 'khanak-theme' && (event.newValue === 'light' || event.newValue === 'dark')) {
        explicitTheme.current = true;
        applyTheme(event.newValue, false);
      } else if (event.key === 'khanak-theme' && event.newValue === null) {
        explicitTheme.current = false;
        applyTheme(preference.matches ? 'light' : 'dark', false);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => {
      preference.removeEventListener('change', syncSystemTheme);
      window.removeEventListener('storage', onStorage);
      window.clearTimeout(themeTransitionTimer.current);
    };
  }, [applyTheme]);

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

  const runTerminalCommand = (rawCommand: string) => {
    const command = rawCommand.trim().toLowerCase().replace(/\s+/g, ' ');
    const routes: Record<string, LocationId> = {
      about: 'about',
      projects: 'projects',
      'project lab': 'projects',
      tech: 'tech',
      archive: 'tech',
      experience: 'experience',
      content: 'content',
      stories: 'content',
      achievements: 'achievements',
      contact: 'contact',
    };

    if (command === 'help') {
      setTerminalOutput('ABOUT · PROJECTS · TECH · EXPERIENCE · ACHIEVEMENTS · CONTACT · MAP');
    } else if (command === 'map' || command === 'home') {
      returnToMap();
      setTerminalOutput('WORLD MAP / READY');
    } else if (routes[command]) {
      const location = routes[command];
      navigate(location);
      setTerminalOutput(`FOCUS / ${locations.find((item) => item.id === location)?.title}`);
    } else if (command) {
      setTerminalOutput(`UNKNOWN COMMAND / ${command.toUpperCase()} · TRY HELP`);
    }
    setTerminalCommand('');
  };

  const submitTerminalCommand = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    runTerminalCommand(terminalCommand);
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
    <main className={'experience-shell' + (mobile ? ' is-mobile' : '') + (viewMode === 'terminal' ? ' terminal-mode' : '')} aria-label="KHANAK.OS digital universe">
      <div className="world-stage" ref={stageRef}>
      <div className="world-backdrop" aria-hidden="true" />
      <div className="world-holder">
        <WorldBoundary onError={markWorldFailed}>
          <Suspense fallback={<div className="scene-loading"><span className="loader-mark">KJ</span><span>BUILDING THE WORLD</span></div>}>
            <World active={active} mobile={mobile} reducedMotion={reducedMotion} visible={stageVisible} theme={theme} onSelect={navigate} onReady={markWorldReady} />
          </Suspense>
        </WorldBoundary>
      </div>
      <div className="world-vignette" aria-hidden="true" />
      <header className="world-topbar">
        <button className="wordmark" onClick={returnToMap} aria-label="Return to world map"><strong>KJ</strong><span>KHANAK.OS<br/>DIGITAL UNIVERSE</span></button>
        <div className="world-status"><i></i><span>{portfolio.opportunityStatus}</span><b>·</b><span>BASED IN INDIA</span></div>
        <div className="top-actions">
          <div className="theme-control" aria-label="Color theme">
            <svg className={'theme-icon sun-icon' + (theme === 'light' ? ' is-active' : '')} viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3.7"/><path d="M12 2v2.1M12 19.9V22M4.93 4.93l1.49 1.49m11.16 11.16 1.49 1.49M2 12h2.1m15.8 0H22M4.93 19.07l1.49-1.49M17.58 6.42l1.49-1.49"/></svg>
            <LiquidToggle checked={theme === 'light'} onChange={(checked) => applyTheme(checked ? 'light' : 'dark')} label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`} size="md" color="emerald" className="theme-toggle" />
            <svg className={'theme-icon moon-icon' + (theme === 'dark' ? ' is-active' : '')} viewBox="0 0 24 24" aria-hidden="true"><path d="M20.1 15.2A8.3 8.3 0 0 1 8.8 3.9 8.5 8.5 0 1 0 20.1 15.2Z"/></svg>
          </div>
          <div className="mode-control"><span>{viewMode === 'terminal' ? 'TERMINAL' : 'EXPLORE'}</span><LiquidToggle checked={viewMode === 'terminal'} onChange={(checked) => { setViewMode(checked ? 'terminal' : 'explore'); if (checked) setEntered(true); }} label={`Switch to ${viewMode === 'terminal' ? 'explore' : 'terminal'} view`} size="md" color="emerald" className="world-mode-toggle" /></div>
          <button className="guided-button" onClick={beginTour}>GUIDED TOUR <span>↗</span></button>
          <button className="reset-button" onClick={returnToMap} aria-label="Reset camera and return to world map">RESET VIEW <span>⌖</span></button>
        </div>
      </header>

      {viewMode === 'explore' && <nav className="location-nav" aria-label="Universe locations">
        <span className="nav-kicker">JUMP TO LOCATION</span>
        {locations.map((location, index) => (
          <button key={location.id} className={active === location.id ? 'active' : ''} onClick={() => navigate(location.id)} aria-current={active === location.id ? 'location' : undefined}>
            <span>0{index + 1}</span>{location.title}
          </button>
        ))}
      </nav>}

      {viewMode === 'explore' && <div className="world-instructions" aria-live="polite">
        <span><i className="mouse-icon"></i> DRAG TO ORBIT</span><span>SCROLL TO ZOOM</span><span>SELECT AN ISLAND</span>
      </div>}

      <AnimatePresence>
        {!entered && viewMode === 'explore' && (
          <motion.section className="entry-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: reducedMotion ? 0 : 0.7 }} aria-labelledby="entry-title">
            <div className="entry-ascii" aria-hidden="true"><pre>{asciiSignal.join('\n')}</pre></div>
            <div className="entry-card">
              <span className="eyebrow">PERSONAL ARCHIVE / NO. 001</span>
              <h1 id="entry-title">A digital<br/><em>universe.</em></h1>
              <p>{portfolio.description}</p>
              <p className="entry-mantra">{portfolio.hero}</p>
              <AnimatedButton className="enter-button" variant="outline" showArrow onClick={() => setEntered(true)}>ENTER KHANAK.OS</AnimatedButton>
              <div className="entry-foot"><span>MOVE THROUGH THE SIGNALS</span><span>28° 36′ N · 77° 13′ E</span></div>
              <button className="tour-text-button" onClick={beginTour}>OR START A GUIDED TOUR</button>
            </div>
            <span className="entry-index">WORLD 01 <i>·</i> KHANAK JAIN</span>
          </motion.section>
        )}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {entered && !activeLocation && viewMode === 'explore' && (
          <motion.section key="map-prompt" className="map-prompt" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: reducedMotion ? 0 : 0.35 }}>
            <span className="eyebrow">WORLD MAP / 07 LOCATIONS</span>
          <h1>Find your<br/><em>way in.</em></h1>
            <p>Choose an island. Orbit to explore.</p>
            <div className="map-hint"><span>01—07</span><span>CLICK A PLATFORM OR USE THE MENU</span></div>
          </motion.section>
        )}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {viewMode === 'terminal' && (
          <motion.section key="terminal-console" className="terminal-console" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: reducedMotion ? 0 : 0.24 }} aria-label="Terminal navigation">
            <div className="terminal-console-head"><span>KHANAK.OS / COMMAND LINE</span><span>LIVE</span></div>
            <p aria-live="polite">{terminalOutput}</p>
            <form onSubmit={submitTerminalCommand}><label htmlFor="world-command">&gt;</label><input id="world-command" aria-label="Terminal command" value={terminalCommand} onChange={(event) => setTerminalCommand(event.target.value)} placeholder="type help or a location" autoComplete="off" spellCheck={false} /><button type="submit" aria-label="Run command">↵</button></form>
            <div className="terminal-shortcuts">{tourOrder.map((id) => <button key={id} onClick={() => runTerminalCommand(id === 'projects' ? 'projects' : id === 'tech' ? 'tech' : id)}>{locations.find((location) => location.id === id)?.title}</button>)}<button onClick={() => runTerminalCommand('map')}>MAP</button></div>
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
            <h2 id={'location-title-' + activeLocation.id}>{activeLocation.title}</h2>
            <p className="panel-subtitle">{activeLocation.subtitle}</p>
            <div className="panel-rule"><span></span><small>KHANAK / 2026</small></div>
            <div className="panel-content"><LocationContent id={activeLocation.id} compact /></div>
            {tourIndex !== null && (
              <div className="tour-controls"><span>GUIDED TOUR / {String(tourIndex + 1).padStart(2, '0')} OF 07</span><button onClick={() => moveTour(1)}>{tourIndex === tourOrder.length - 1 ? 'FINISH TOUR' : 'NEXT LOCATION ↗'}</button></div>
            )}
          </motion.aside>
        )}
      </AnimatePresence>

      {!worldReady && !worldFailed && <div className="loading-status" role="status"><span className="loader-dot"></span> {worldReady ? 'WORLD ONLINE' : 'INITIALIZING WORLD'}</div>}
      {worldFailed && <div className="world-warning" role="status">3D is unavailable on this device. Use the location menu to read the same archive.</div>}
      <footer className="world-footer"><span>DESIGNED &amp; BUILT BY KHANAK JAIN</span><span>© 2026 / ALL RIGHTS RESERVED</span><span>STATUS: STILL BUILDING <i></i></span></footer>
      </div>
      <AccessibleArchive onNavigate={navigate} />
      <footer className="site-footer"><span>KHANAK.OS / A DIGITAL UNIVERSE</span><span>© 2026 — ALL RIGHTS RESERVED</span><button onClick={returnToMap}>BACK TO WORLD ↑</button></footer>
    </main>
  );
}
