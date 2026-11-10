export type Project = {
  name: string;
  category: string;
  description: string;
  contribution: string;
  stack: string;
  glyph: string;
  links: { github: string; demo: string };
};

export type LocationId = 'about' | 'projects' | 'tech' | 'experience' | 'achievements' | 'contact';
export type Location = { id: LocationId; title: string; subtitle: string; position: [number, number, number]; glyph: string };

export const portfolio = {
  name: 'Khanak Jain',
  callSign: 'KHANAK',
  description: 'CSE–AI student · Developer · Creative problem solver',
  hero: 'I build. I experiment. I learn. I ship.',
  introduction: 'Curious about how technology becomes useful, delightful, and a little unexpected. Currently learning by making things with good people.',
  about: [
    'I began college without a coding background. Then I found out that learning could be a thing you do with your hands.',
    'Since then, I’ve been building projects, joining hackathons, working with teams, and finding my way around software development. I’m drawn to the intersection of frontend craft, backend systems, AI, automation, and product thinking.',
    'I like turning half-formed ideas into things people can use. Along the way, I’ve helped organize experiences, support communities, and make teams work better. My favorite classroom is still a project with a deadline.',
  ],
  education: {
    degree: 'BTech · Computer Science & Engineering (AI)',
    school: 'Newton School of Technology, Rishihood University',
    years: '2025 — 2029',
  },
  traits: [
    { name: 'Curiosity', state: 'Always on' },
    { name: 'Experimentation', state: 'Always on' },
    { name: 'Creativity', state: 'In session' },
    { name: 'Consistency', state: 'In progress' },
  ],
  aboutAscii: ['  .-~~~~~~~~~-._', ' /               \\', '|   LEARN / MAKE  |', ' \\               /', '  \'-~~~~~~~~~~~-\''],
  labAscii: [' .--------------------.', ' | ideas compiling... |', ' \'--------------------\''],
  traitNote: 'good ideas rarely arrive fully assembled. keep going.',
  opportunityStatus: 'AVAILABLE FOR OPPORTUNITIES',
  systemState: ['SYSTEM: KHANAK.JAIN', 'STATUS: EXPLORING', 'CURRENT_MODE: BUILDING', 'VERSION: 2026.11'],
  projects: [
    { name: 'Collabryd', category: 'COLLABORATION / AI', description: 'An AI-assisted student collaboration platform exploring how skills, interests, and compatibility can help people find the right teammates.', contribution: 'Team product build · collaboration and team formation', stack: 'AI-assisted matching · student collaboration', glyph: '      .----------------.\n      |  COLLABRYD / 01 |\n      \'-----.-----.------\'\n        \\   |   /\n      ---\\  |  /---\n          \\ | /\n        [ SKILLS ]\n         /  |  \\\n    .---\'   |   \'---.\n   TEAM    +    IDEAS\n    \'--------------\'', links: { github: '', demo: '' } },
    { name: 'SmartRide Connect', category: 'MOBILITY / COMMUNITY', description: 'A collaborative mobility concept focused on bringing people together through a shared transportation experience.', contribution: 'Collaborative project · mobility experience', stack: 'Mobility · shared transportation', glyph: '  .------------------.\n  | SMART RIDE / 02  |\n  \'------------------\'\n      .-----------.\n   ___|  _______  |___\n  /   | |  ___  | |   \\\n |____|_|_|___|_|_|____|\n   O               O\n      o---o---o---o\n       CONNECTED', links: { github: '', demo: '' } },
    { name: 'Aqora Forms', category: 'PRODUCT / FORMS', description: 'A form-building platform exploring interactive form experiences, response collection, and AI-assisted generation.', contribution: 'Frontend development · product exploration', stack: 'Interactive forms · AI-assisted generation', glyph: ' .-------------------.\n | AQORA / FORM LAB  |\n \'---------.---------\'\n     .-----+-----.\n     | Name      |\n     | [_______] |\n     | Idea      |\n     | [_______] |\n     |   [ SEND ]|\n     \'-----+-----\'\n         responses', links: { github: '', demo: '' } },
    { name: 'SkillScope', category: 'CAREERS / INSIGHT', description: 'A job-market exploration and skill analysis project for making career pathways and the skills they call for easier to examine.', contribution: 'Project contributor · job-market exploration', stack: 'Job market · skill analysis', glyph: '  .-----------------.\n  | SKILLSCOPE / 04 |\n  \'--------.--------\'\n     .-----+-----.\n    /  .-----.    \\\n   |  /  /\\  \\    |\n   | |  /  \\  |   |\n   | |  \\__/  |   |\n    \\ \'-----\'  /\n     \'----+----\'\n       EXPLORE', links: { github: '', demo: '' } },
    { name: 'Asyncnode', category: 'FRONTEND / EXPERIMENT', description: 'A frontend development project and a place to practice translating ideas into clear, interactive interfaces.', contribution: 'Frontend development', stack: 'Frontend development', glyph: '    .----.      .----.\n   / .--. \\----/ .--. \\\n  | |    | |  | |    | |\n  | |    | |  | |    | |\n   \\ \'--\' /----\\ \'--\' /\n    \'----\'      \'----\'\n      async  →  node\n    .----.      .----.\n   / .--. \\----/ .--. \\\n  | |    | |  | |    | |\n   \'----\'      \'----\'', links: { github: '', demo: '' } },
  ] satisfies Project[],
  stack: [
    { category: 'Frontend', items: ['React', 'Next.js', 'TypeScript', 'HTML', 'CSS', 'Tailwind CSS'] },
    { category: 'Backend', items: ['Node.js', 'Express.js'] },
    { category: 'Database', items: ['MongoDB', 'PostgreSQL', 'Supabase'] },
    { category: 'Tools', items: ['Git', 'GitHub', 'Prisma'] },
    { category: 'Languages', items: ['JavaScript', 'TypeScript'] },
  ],
  exploring: ['Backend architecture', 'AI & automation', 'Full-stack development', 'Product development', 'Data structures & algorithms'],
  experience: [
    { timing: 'CURRENT', role: 'DevClub Associate', detail: 'Newton School of Technology · Supporting a growing student developer community.' },
    { timing: 'COMMUNITY', role: 'Neutron Competition Local Host', detail: 'Helping bring a competition experience to campus.' },
    { timing: 'EVENTS', role: 'Damru Fest Competition Crew', detail: 'On-the-ground event coordination and execution.' },
    { timing: 'CAMPUS', role: 'NST Marketing Team', detail: 'Contributing to communication, promotion, and community energy.' },
    { timing: 'EARLIER', role: 'OOPS–CP Club', detail: 'Exploring programming fundamentals and learning with peers.' },
  ],
  achievement: {
    place: '03RD',
    event: 'IIT Roorkee E-Summit HPCL Productathon',
    detail: 'Third place · Final product pitch to the HPCL Technology Team · Built alongside a collaborative team.',
  },
  contact: {
    email: 'khanakjain511@gmail.com',
    linkedin: 'https://www.linkedin.com/in/khanakjain0511/',
    github: 'khanakjain511',
  },
} as const;

export const locations: Location[] = [
  { id: 'about', title: 'ABOUT', subtitle: 'The person behind the signal', position: [-6.2, 0, -2.5], glyph: '01 / ORIGIN' },
  { id: 'projects', title: 'PROJECT LAB', subtitle: 'Things made to matter', position: [-3.2, 0.1, -7.2], glyph: '02 / BUILDS' },
  { id: 'tech', title: 'TECH ARCHIVE', subtitle: 'Tools are a means', position: [2.5, 0.05, -7.1], glyph: '03 / INVENTORY' },
  { id: 'experience', title: 'EXPERIENCE', subtitle: 'People make the work', position: [6.1, 0, -2.3], glyph: '04 / COMMUNITY' },
  { id: 'achievements', title: 'ACHIEVEMENTS', subtitle: 'A moment to remember', position: [5.1, 0, 4.2], glyph: '05 / MILESTONES' },
  { id: 'contact', title: 'CONTACT', subtitle: 'An open channel', position: [-4.8, 0, 4.3], glyph: '06 / SIGNAL' },
];

export const asciiSignal = [
  '             .       *       .',
  '         .      .  .     .',
  '       .      .     .   *',
  '          .   .---.     .',
  '     *       / .-. \\\\',
  '          . | (   ) |  .',
  '       .    |  \'-\'  |',
  '            /\'-----\'\\\\      .',
  '     .     /  /| |\\\\  \\\\',
  '          /__/ | | \\\\__\\\\',
  '      ~~~~~~~~ | | ~~~~~~~~~',
  '   ~~~  ~~~~   | |   ~~~  ~~~~',
  '  .            |_|       .',
  '       .         *',
];
