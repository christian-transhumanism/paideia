import React, { useEffect, useMemo, useState } from "react";

// PAIDEIA Chromecore Demo — FULL BUILDABLE VERSION
// Full UI restored: Home, About, Units, Modules, Lessons+Quiz, Dashboard (Member-only), Certificates (Member-only), Admin (mock).
// Progress saved in localStorage via useLocal.

// ==========================
// Utils
// ==========================
function classNames(...xs) { return xs.filter(Boolean).join(" "); }

function useLocal(key, initial) {
  const [val, setVal] = useState(() => {
    try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : initial; } catch { return initial; }
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} }, [key, val]);
  return [val, setVal];
}

// ==========================
// Visual primitives
// ==========================
function ChromeCard({ children, className = "", onClick }) {
  return (
    <div
      onClick={onClick}
      className={classNames(
        "relative rounded-2xl p-5 bg-gradient-to-br from-gray-800/60 to-gray-900/40 border border-white/20 shadow-2xl overflow-hidden",
        onClick && "cursor-pointer hover:border-blue-300/50",
        className
      )}
      role={onClick?"button":undefined}
      tabIndex={onClick?0:undefined}
    >
      <div className="absolute inset-0 opacity-40 [background:radial-gradient(circle_at_30%_20%,rgba(147,197,253,.25),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(59,130,246,.25),transparent_60%)]"/>
      <div className="absolute inset-0 [background:repeating-linear-gradient(0deg,rgba(255,255,255,.04),rgba(255,255,255,.04)_1px,transparent_1px,transparent_3px)] opacity-20 mix-blend-overlay"/>
      <div className="relative">{children}</div>
    </div>
  );
}

function ChromeButton({ children, onClick, size = "md", disabled=false }) {
  const sz = size === "sm" ? "px-3 py-1 text-sm" : size === "lg" ? "px-5 py-3 text-base" : "px-4 py-2 text-sm";
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={classNames(
        "rounded-xl bg-gradient-to-br from-blue-500/40 via-silver-300/20 to-blue-800/30 border border-white/30 shadow-lg text-white relative overflow-hidden group",
        sz,
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <span className="relative z-10">{children}</span>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
    </button>
  );
}

function Pill({ children }) {
  return <span className="px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wide bg-white/10 border border-white/20">{children}</span>;
}

// ==========================
// Data
// ==========================
const ROLES = ["Visitor", "Member", "Admin"];

const UNITS = [
  { id: "u1", title: "Unit 1 – General Theology", outcomes: ["Trinity basics","Seven Councils overview","Christology","Pneumatology","Ecclesiology"] },
  { id: "u2", title: "Unit 2 – Church History", outcomes: ["Hellenic/Jewish influences","Constantine & Schism","Reformations","Modern & Global Christianity"] },
  { id: "u3", title: "Unit 3 – Ethics", outcomes: ["Virtue/Deontological/Consequentialist","Christian moral traditions","Applied ethics","Political & social ethics"] },
  { id: "u4", title: "Unit 4 – Science & Faith", outcomes: ["Creation & cosmology","Evolution & humanity","Technology & eschatology"] },
];

const MODULES = [
  // Unit 1
  { id: "m1", unitId: "u1", title: "The Trinity: A Primer", summary: "Classic Trinitarian language, anchors, and guardrails.", lessons: [
    { id: "l1", title: "Biblical foundations", duration: "8 min", gated: false, outcomes: ["Trinity basics"], body: `\n### Key Ideas\n- OT and NT trajectory toward Father, Son, Spirit.\n- Caution: do not read later creeds back into all texts.\n\n### Embedded video (mock)\n[ Video placeholder ]\n`, quiz: { questions: [ { q: "One *ousia* in three ...?", choices: ["gods","persons","energies"], answer: 1, explain: "One *ousia*, three *hypostases*." } ] } },
  ]},
  { id: "m1b", unitId: "u1", title: "Christology", summary: "From early debates to modern views.", lessons: [
    { id: "l1b1", title: "Early Christological Debates", duration: "10 min", gated: false, outcomes: ["Christology"], body: `Arianism, Nestorianism, Monophysitism — contours and stakes.`, quiz: { questions: [ { q: "Chalcedon taught ...?", choices: ["two natures, one person","one nature, one person"], answer: 0, explain: "Hypostatic union." } ] } },
  ]},
  { id: "m1c", unitId: "u1", title: "Pneumatology", summary: "Doctrine of the Holy Spirit.", lessons: [
    { id: "l1c1", title: "Spirit in Scripture", duration: "7 min", gated: false, outcomes: ["Pneumatology"], body: `Holy Spirit in OT & NT.`, quiz: { questions: [ { q: "The Spirit hovered over ...?", choices: ["the waters","the mountains"], answer: 0, explain: "Genesis 1:2." } ] } },
  ]},
  { id: "m1d", unitId: "u1", title: "Ecclesiology", summary: "The nature of the Church.", lessons: [
    { id: "l1d1", title: "Marks of the Church", duration: "9 min", gated: false, outcomes: ["Ecclesiology"], body: `One, holy, catholic, apostolic — classic markers.`, quiz: { questions: [ { q: "Not a traditional mark?", choices: ["unity","apostolic","prosperity"], answer: 2, explain: "Prosperity is not a mark." } ] } },
  ]},

  // Unit 2
  { id: "m2", unitId: "u2", title: "Contours of Early Church History", summary: "From apostolic era to the Great Schism.", lessons: [
    { id: "l2a1", title: "Hellenic & Jewish influences", duration: "9 min", gated: false, outcomes: ["Hellenic/Jewish influences"], body: `Jewish monotheism; Hellenic *paideia* and philosophy.`, quiz: { questions: [ { q: "Judaism contributed ...?", choices: ["language","monotheism"], answer: 1, explain: "Judaism → monotheism." } ] } },
  ]},
  { id: "m2b", unitId: "u2", title: "Constantine to the Great Schism", summary: "Imperial Christianity & East–West divide.", lessons: [
    { id: "l2b1", title: "Imperial Christianity", duration: "8 min", gated: false, outcomes: ["Constantine & Schism"], body: `Constantine’s impact on the church.`, quiz: { questions: [ { q: "Edict of Milan year?", choices: ["313","1054"], answer: 0, explain: "313 legalized Christianity." } ] } },
  ]},
  { id: "m2c", unitId: "u2", title: "The Reformations", summary: "Luther to Trent.", lessons: [
    { id: "l2c1", title: "Luther and Calvin", duration: "8 min", gated: false, outcomes: ["Reformations"], body: `Core ideas and differences.`, quiz: { questions: [ { q: "95 Theses year?", choices: ["1517","1648"], answer: 0, explain: "1517." } ] } },
  ]},
  { id: "m2d", unitId: "u2", title: "Modern Christianity", summary: "Evangelicalism to global contexts.", lessons: [
    { id: "l2d1", title: "Global Christianity", duration: "9 min", gated: false, outcomes: ["Modern & Global Christianity"], body: `Southward shift and plural centers.`, quiz: { questions: [ { q: "Fastest growth region?", choices: ["Europe","Africa"], answer: 1, explain: "Africa and the Global South." } ] } },
  ]},

  // Unit 3
  { id: "m3", unitId: "u3", title: "Trinity of Ethics: A Quick Tour", summary: "Virtue, duty, outcomes.", lessons: [
    { id: "l3a1", title: "Three lenses", duration: "7 min", gated: false, outcomes: ["Virtue/Deontological/Consequentialist"], body: `Virtue vs Duty vs Consequence.`, quiz: { questions: [ { q: "Deontology emphasizes ...?", choices: ["virtue","duty"], answer: 1, explain: "Duty/obligation." } ] } },
  ]},
  { id: "m3b", unitId: "u3", title: "Christian Moral Traditions", summary: "Augustine to Protestant ethics.", lessons: [
    { id: "l3b1", title: "Natural Law & Protestant Ethics", duration: "10 min", gated: false, outcomes: ["Christian moral traditions"], body: `Aquinas and Reformers.`, quiz: { questions: [ { q: "Natural law key figure?", choices: ["Aquinas","Calvin"], answer: 0, explain: "Thomas Aquinas." } ] } },
  ]},
  { id: "m3c", unitId: "u3", title: "Contemporary Ethical Issues", summary: "Bioethics, sexuality, tech.", lessons: [
    { id: "l3c1", title: "Bioethics", duration: "9 min", gated: false, outcomes: ["Applied ethics"], body: `IVF, gene editing, end-of-life.`, quiz: { questions: [ { q: "CRISPR used for ...?", choices: ["genetic editing","social media"], answer: 0, explain: "Gene editing." } ] } },
  ]},
  { id: "m3d", unitId: "u3", title: "Political & Social Ethics", summary: "Justice, liberation, war & peace.", lessons: [
    { id: "l3d1", title: "Just War Theory", duration: "8 min", gated: false, outcomes: ["Political & social ethics"], body: `Core criteria and debates.`, quiz: { questions: [ { q: "One just war criterion?", choices: ["legitimate authority","unlimited violence"], answer: 0, explain: "Legitimate authority." } ] } },
  ]},

  // Unit 4
  { id: "m4", unitId: "u4", title: "Science & Faith: Key Intersections", summary: "Dialogue history, evolution, ecology, tech ethics.", lessons: [
    { id: "l4a1", title: "Dialogue milestones", duration: "8 min", gated: false, outcomes: ["Creation & cosmology"], body: `Milestones in dialogue.`, quiz: { questions: [ { q: "Best stance?", choices: ["conflict","critical-charitable"], answer: 1, explain: "Critical, charitable engagement." } ] } },
  ]},
  { id: "m4b", unitId: "u4", title: "Creation & Cosmology", summary: "Genesis to Anthropic Principle.", lessons: [
    { id: "l4b1", title: "Genesis & Ancient Cosmologies", duration: "10 min", gated: false, outcomes: ["Creation & cosmology"], body: `Ancient vs modern cosmologies.`, quiz: { questions: [ { q: "Lemaître’s Big Bang proposal year?", choices: ["1927","2000"], answer: 0, explain: "1927." } ] } },
  ]},
  { id: "m4c", unitId: "u4", title: "Evolution & Humanity", summary: "Darwin and theological responses.", lessons: [
    { id: "l4c1", title: "Darwin & Responses", duration: "9 min", gated: false, outcomes: ["Evolution & humanity"], body: `Darwinism and theology.`, quiz: { questions: [ { q: "Origin of Species year?", choices: ["1859","1959"], answer: 0, explain: "1859." } ] } },
  ]},
  { id: "m4d", unitId: "u4", title: "Technology & Eschatology", summary: "AI, transhumanism, ecology, resurrection.", lessons: [
    { id: "l4d1", title: "AI & Transhumanism", duration: "10 min", gated: false, outcomes: ["Technology & eschatology"], body: `AI and Christian hope.`, quiz: { questions: [ { q: "Transhumanism aims at ...?", choices: ["human enhancement","animal rights"], answer: 0, explain: "Enhancement." } ] } },
  ]},
];

// ==========================
// Router + Shell
// ==========================
function RoleSwitcher({ role, setRole }) {
  return (
    <div className="bg-white/10 border border-white/20 rounded-full p-1">
      {ROLES.map((r) => (
        <button key={r} onClick={() => setRole(r)} className={classNames("px-3 py-1 text-sm rounded-full", role===r?"bg-blue-500/30 border border-blue-300/40":"hover:bg-white/10")}>{r}</button>
      ))}
    </div>
  );
}

function Shell({ role, setRole, route, setRoute, children }) {
  return (
    <div className="min-h-screen bg-black text-gray-100 relative">
      <div className="fixed inset-0 -z-10 [background:radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.25),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(147,197,253,0.25),transparent_40%)]" />
      <div className="fixed inset-0 -z-10 [background:linear-gradient(135deg,rgba(255,255,255,.04)_0%,transparent_50%,rgba(255,255,255,.04)_100%)] opacity-30" />

      <header className="sticky top-0 z-30 backdrop-blur-xl bg-white/5 border-b border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-200 to-blue-500 border border-white/30 shadow-inner animate-pulse"/>
            <button className="text-2xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-blue-400" onClick={() => setRoute({ name: "home" })}>PAIDEIA</button>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <ChromeButton onClick={() => setRoute({ name: "home" })}>News</ChromeButton>
            <ChromeButton onClick={() => setRoute({ name: "about" })}>About</ChromeButton>
            <ChromeButton onClick={() => setRoute({ name: "modules" })}>Modules</ChromeButton>
            {role === 'Member' && <ChromeButton onClick={() => setRoute({ name: "dashboard" })}>Dashboard</ChromeButton>}
            {role === 'Member' && <ChromeButton onClick={() => setRoute({ name: "certs" })}>Certificates</ChromeButton>}
            {role === 'Admin' && <ChromeButton onClick={() => setRoute({ name: "admin" })}>Admin</ChromeButton>}
          </div>
          <div className="ml-4 flex items-center gap-2">
            <Pill>Role</Pill>
            <RoleSwitcher role={role} setRole={setRole} />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 space-y-6">{children}</main>
      <footer className="mt-8 py-8 text-center text-xs text-gray-400/80"><p>Mock UI • No real auth • Progress stored locally</p></footer>
    </div>
  );
}

// ==========================
// Pages — Site
// ==========================
function Home({ setRoute }) {
  return (
    <div className="space-y-6">
      <ChromeCard>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-200 via-white to-blue-400 bg-clip-text text-transparent">Learn. Discern. Build.</h1>
        <p className="mt-2 text-gray-300">A modular curriculum across Theology, History, Ethics, and Science–Faith. Short lessons. Embedded media. Quick quizzes.</p>
        <div className="mt-4 flex gap-3">
          <ChromeButton onClick={() => setRoute({ name: "modules" })}>Explore Modules</ChromeButton>
          <ChromeButton onClick={() => setRoute({ name: "about" })}>About</ChromeButton>
        </div>
      </ChromeCard>
      <div className="grid md:grid-cols-3 gap-4">
        <ChromeCard onClick={() => setRoute({ name: 'unit', id: 'u4' })}>
          <h3 className="text-sm font-semibold mb-1 text-blue-100">Upcoming Seminar</h3>
          <p className="text-sm text-gray-300">Intro to Science & Faith • Oct 12, 7pm CT (mock)</p>
        </ChromeCard>
        <ChromeCard onClick={() => setRoute({ name: 'module', id: 'm1' })}>
          <h3 className="text-sm font-semibold mb-1 text-blue-100">New Module</h3>
          <p className="text-sm text-gray-300">Trinity: A Primer now live</p>
        </ChromeCard>
        <ChromeCard onClick={() => setRoute({ name: 'about' })}>
          <h3 className="text-sm font-semibold mb-1 text-blue-100">Site Update</h3>
          <p className="text-sm text-gray-300">Certificates prototype coming</p>
        </ChromeCard>
      </div>
    </div>
  );
}

function About({ setRoute }) {
  return (
    <div className="space-y-6">
      <ChromeCard>
        <h2 className="text-xl font-semibold">Mission</h2>
        <p className="mt-2 text-gray-300">Equip learners with historically grounded Christian formation while engaging science and technology with critical charity.</p>
      </ChromeCard>
      <ChromeCard>
        <h3 className="font-semibold">Values</h3>
        <ul className="mt-2 text-gray-300 text-sm space-y-1">
          <li>Unity, simplicity, and freedom in practice</li>
          <li>Critical rationalism and open inquiry</li>
          <li>Priesthood of all believers in learning</li>
          <li>Ethical responsibility in emerging tech</li>
        </ul>
      </ChromeCard>
      <ChromeCard>
        <h3 className="font-semibold">Curriculum Units</h3>
        <div className="mt-3 grid md:grid-cols-2 gap-3">
          {UNITS.map((u)=> (
            <ChromeCard key={u.id} className="p-4" onClick={() => setRoute({ name: 'unit', id: u.id })}>
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">{u.title}</h4>
                <Pill>Open</Pill>
              </div>
              <ul className="mt-2 text-sm text-gray-300 list-disc list-inside">
                {u.outcomes.map((o,i)=>(<li key={i}>{o}</li>))}
              </ul>
            </ChromeCard>
          ))}
        </div>
      </ChromeCard>
    </div>
  );
}

function ModuleTabs({ active, setRoute }) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => setRoute?.({ name: "modules" })}
        className={classNames(
          "px-4 py-2 rounded-xl text-sm transition-colors border",
          active === "all"
            ? "bg-blue-500/30 border-blue-300/40 text-white"
            : "bg-white/10 border-white/20 hover:bg-white/20 text-gray-200"
        )}
      >
        All
      </button>
      {UNITS.map((u, idx) => (
        <button
          key={u.id}
          type="button"
          onClick={() => setRoute?.({ name: "unit", id: u.id })}
          className={classNames(
            "px-4 py-2 rounded-xl text-sm transition-colors border",
            active === u.id
              ? "bg-blue-500/30 border-blue-300/40 text-white"
              : "bg-white/10 border-white/20 hover:bg-white/20 text-gray-200"
          )}
        >
          {`Unit ${idx + 1}`}
        </button>
      ))}
    </div>
  );
}

function ModulesPage({ onOpenModule, progress, setRoute }) {
  return (
    <div className="space-y-4">
      <ModuleTabs active="all" setRoute={setRoute} />

      {MODULES.map((m)=> (
        <ChromeCard key={m.id}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg">{m.title}</h3>
                <Pill>Unit {m.unitId.toUpperCase()}</Pill>
              </div>
              <p className="text-sm text-gray-300 mt-1">{m.summary}</p>
            </div>
            <ChromeButton onClick={() => onOpenModule(m.id)}>View</ChromeButton>
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-300">
            {m.lessons.map((l)=> (
              <span key={l.id} className="px-2 py-1 rounded-md bg-white/10 border border-white/20">
                {l.title} {progress[l.id]?.done?"✓":""}
              </span>
            ))}
          </div>
        </ChromeCard>
      ))}
    </div>
  );
}

function UnitView({ unitId, setRoute, progress }) {
  const unit = UNITS.find(u => u.id === unitId);
  const mods = MODULES.filter(m => m.unitId === unitId);
  if (!unit) return <p>Unit not found.</p>;
  return (
    <div className="space-y-4">
      <ModuleTabs active={unitId} setRoute={setRoute} />

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{unit.title}</h2>
        <ChromeButton onClick={()=> setRoute({ name:'about' })}>Back to About</ChromeButton>
      </div>
      <ChromeCard>
        <h4 className="font-semibold">Learning outcomes</h4>
        <ul className="mt-2 text-sm text-gray-300 list-disc list-inside">
          {unit.outcomes.map((o,i)=>(<li key={i}>{o}</li>))}
        </ul>
      </ChromeCard>
      {mods.map(m => (
        <ChromeCard key={m.id}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg">{m.title}</h3>
                <Pill>Module</Pill>
              </div>
              <p className="text-sm text-gray-300 mt-1">{m.summary}</p>
            </div>
            <ChromeButton onClick={() => setRoute({ name:'module', id: m.id })}>Open Module</ChromeButton>
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-300">
            {m.lessons.map((l)=> (
              <span key={l.id} className="px-2 py-1 rounded-md bg-white/10 border border-white/20">
                {l.title} {progress[l.id]?.done?"✓":""}
              </span>
            ))}
          </div>
        </ChromeCard>
      ))}
    </div>
  );
}

function ModuleView({ moduleId, setRoute, role, progress }) {
  const mod = MODULES.find((m)=> m.id===moduleId);
  if (!mod) return <p>Module not found.</p>;
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{mod.title}</h2>
        <div className="flex gap-2">
          <ChromeButton onClick={()=> setRoute({ name:"unit", id: mod.unitId })}>Back to Unit</ChromeButton>
          <ChromeButton onClick={()=> setRoute({ name:"modules" })}>All Modules</ChromeButton>
        </div>
      </div>
      <p className="text-gray-300">{mod.summary}</p>
      {mod.lessons.map((l)=> (
        <ChromeCard key={l.id}>
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{l.title}</h3>
                <Pill>{l.duration}</Pill>
                {l.gated && <Pill>Member</Pill>}
                {progress[l.id]?.done && <Pill>Completed</Pill>}
              </div>
              <p className="text-sm text-gray-300 mt-1">Outcomes: {l.outcomes.join(", ")}</p>
            </div>
            <ChromeButton onClick={()=> setRoute({ name:"lesson", id: l.id, moduleId: moduleId })}>Open lesson</ChromeButton>
          </div>
          {l.gated && role === "Visitor" && (
            <p className="mt-2 text-xs text-blue-200">This lesson is for Members. Use the role switcher to preview Member access.</p>
          )}
        </ChromeCard>
      ))}
    </div>
  );
}

function findLessonById(id) {
  for (const m of MODULES) {
    const lesson = m.lessons.find((l)=> l.id===id);
    if (lesson) return { lesson, moduleId: m.id };
  }
  return null;
}

function markdownToHtml(md) {
  return md
    .replace(/^### (.*)$/gm, '<h3 class="text-lg font-semibold">$1</h3>')
    .replace(/^## (.*)$/gm, '<h2 class="text-xl font-semibold">$1</h2>')
    .replace(/^# (.*)$/gm, '<h1 class="text-2xl font-bold">$1</h1>')
    .replace(/^- (.*)$/gm, '<li>$1</li>')
    .replace(/\n\n- /g, '<ul class="list-disc list-inside text-gray-200"><li>')
    .replace(/\n- /g, '<li>')
    .replace(/\n/g, '<br/>')
    .replace(/<li>(.*?)<br\/>/g, '<li>$1')
    .replace(/<li>(.*?)<li>/g, '<li>$1</li><li>')
    .replace(/<li>(.*)$/g, '<li>$1</li>')
    .replace(/<ul class=\"list-disc list-inside text-gray-200\"><li>/g, '<ul class="list-disc list-inside text-gray-200"><li>');
}

function LessonView({ id, setRoute, role, progress, setProgress }) {
  const found = findLessonById(id);
  if (!found) return <p>Lesson not found.</p>;
  const { lesson, moduleId } = found;
  const canView = !lesson.gated || role !== "Visitor";

  const [answers, setAnswers] = useState(() => lesson.quiz.questions.map(() => -1));
  const [submitted, setSubmitted] = useState(false);
  const correctCount = useMemo(() => answers.filter((a,i)=> a===lesson.quiz.questions[i].answer).length, [answers, lesson.quiz.questions]);

  const onSubmit = () => {
    setSubmitted(true);
    const newProg = { ...progress, [lesson.id]: { done: true, score: correctCount/lesson.quiz.questions.length } };
    setProgress(newProg);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{lesson.title}</h2>
        <div className="flex gap-2">
          <ChromeButton onClick={()=> setRoute({ name:"module", id: moduleId })}>Back to Module</ChromeButton>
          <ChromeButton onClick={()=> setRoute({ name:"unit", id: MODULES.find(m=>m.id===moduleId).unitId })}>Back to Unit</ChromeButton>
        </div>
      </div>

      {!canView ? (
        <ChromeCard>
          <p className="text-blue-100">This is a member lesson. Switch role to <b>Member</b> or <b>Admin</b> to preview.</p>
        </ChromeCard>
      ) : (
        <>
          <ChromeCard>
            <article className="prose prose-invert max-w-none prose-headings:mt-0 prose-p:leading-relaxed">
              <div dangerouslySetInnerHTML={{ __html: markdownToHtml(lesson.body) }} />
            </article>
          </ChromeCard>

          <ChromeCard>
            <h3 className="font-semibold mb-2">Quick quiz</h3>
            <ol className="grid gap-4 list-decimal pl-5">
              {lesson.quiz.questions.map((qq, qi) => (
                <li key={qi} className="grid gap-2">
                  <p className="text-sm text-gray-200">{qq.q}</p>
                  <div className="grid gap-1">
                    {qq.choices.map((c, ci) => (
                      <label key={ci} className="flex items-center gap-2 text-sm">
                        <input type="radio" name={`q${qi}`} className="accent-blue-400" checked={answers[qi]===ci} onChange={()=> setAnswers((xs)=> xs.map((v,idx)=> idx===qi?ci:v))} disabled={submitted} />
                        <span>{c}</span>
                      </label>
                    ))}
                  </div>
                  {submitted && (
                    <p className={classNames("text-xs mt-1", answers[qi]===qq.answer?"text-green-300":"text-red-300")}>{answers[qi]===qq.answer?"Correct":"Incorrect"} — {qq.explain}</p>
                  )}
                </li>
              ))}
            </ol>
            <div className="mt-4 flex items-center gap-3">
              {!submitted ? (
                <ChromeButton onClick={onSubmit}>Submit</ChromeButton>
              ) : (
                <div className="text-sm text-gray-200">Score: {correctCount}/{lesson.quiz.questions.length}</div>
              )}
            </div>
          </ChromeCard>
        </>
      )}
    </div>
  );
}

// ==========================
// Dashboard & Certificates
// ==========================
function summarizeProgress(progress) {
  const allLessons = MODULES.flatMap(m=>m.lessons.map(l=>l.id));
  const completed = allLessons.filter(id => progress[id]?.done).length;
  const total = allLessons.length;
  const modulesComplete = MODULES.filter(m => m.lessons.every(l => progress[l.id]?.done));
  const byUnit = UNITS.map(u => {
    const unitLessons = MODULES.filter(m=>m.unitId===u.id).flatMap(m=>m.lessons);
    const done = unitLessons.filter(l=> progress[l.id]?.done).length;
    return { unitId: u.id, done, total: unitLessons.length };
  });
  return { completed, total, modulesComplete, byUnit };
}

function ProgressBar({ value, max }) {
  const pct = max>0 ? Math.round((value/max)*100) : 0;
  return (
    <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden border border-white/20">
      <div className="h-full bg-blue-400/60" style={{ width: pct+"%" }} />
    </div>
  );
}

function Dashboard({ progress, setRoute }) {
  const [name, setName] = useLocal("paideia_name", "Student Name");
  const stats = useMemo(()=> summarizeProgress(progress), [progress]);
  const completedLessons = Object.entries(progress).filter(([,v])=> v?.done).map(([k])=>k);

  return (
    <div className="space-y-6">
      <ChromeCard>
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">Welcome, {name}</h2>
            <p className="text-sm text-gray-300">Your learning snapshot</p>
          </div>
          <div className="flex items-center gap-2">
            <input className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-sm" value={name} onChange={(e)=> setName(e.target.value)} />
            <Pill>Edit name</Pill>
          </div>
        </div>
      </ChromeCard>

      <div className="grid md:grid-cols-3 gap-4">
        <ChromeCard>
          <h3 className="font-semibold">Overall Progress</h3>
          <div className="mt-2 text-sm text-gray-300">{stats.completed} / {stats.total} lessons</div>
          <div className="mt-2"><ProgressBar value={stats.completed} max={stats.total} /></div>
        </ChromeCard>
        <ChromeCard onClick={()=> setRoute({ name: 'certs' })}>
          <h3 className="font-semibold">Certificates Ready</h3>
          <p className="text-sm text-gray-300 mt-1">{stats.modulesComplete.length} modules completed</p>
          <p className="text-xs text-blue-200 mt-1">Open Certificates page</p>
        </ChromeCard>
        <ChromeCard>
          <h3 className="font-semibold">Completed Lessons</h3>
          <p className="text-sm text-gray-300 mt-1">{completedLessons.length}</p>
        </ChromeCard>
      </div>

      <ChromeCard>
        <h3 className="font-semibold">By Unit</h3>
        <div className="mt-3 grid md:grid-cols-2 gap-3">
          {stats.byUnit.map((u)=> (
            <div key={u.unitId} className="space-y-1">
              <div className="flex items-center justify-between text-sm"><span>{UNITS.find(x=>x.id===u.unitId).title}</span><span>{u.done}/{u.total}</span></div>
              <ProgressBar value={u.done} max={u.total} />
            </div>
          ))}
        </div>
      </ChromeCard>

      <ChromeCard>
        <h3 className="font-semibold">Next Actions</h3>
        <div className="mt-3 flex gap-3 flex-wrap">
          {MODULES.map(m=> (
            <ChromeButton key={m.id} size="sm" onClick={()=> setRoute({ name: 'module', id: m.id })}>{m.title}</ChromeButton>
          ))}
        </div>
      </ChromeCard>
    </div>
  );
}

function CertificateCard({ student, module, date }) {
  const unit = UNITS.find(u=>u.id===module.unitId);
  return (
    <div className="relative rounded-2xl p-6 bg-gradient-to-br from-slate-800/70 to-slate-900/70 border border-white/30 shadow-2xl">
      <div className="text-center">
        <div className="text-xs tracking-widest text-blue-200">PAIDEIA INSTITUTE</div>
        <div className="mt-1 text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-200 via-white to-blue-400">Certificate of Completion</div>
        <div className="mt-4 text-sm">This certifies that</div>
        <div className="mt-1 text-xl font-semibold">{student}</div>
        <div className="mt-3 text-sm">has successfully completed</div>
        <div className="mt-1 text-lg">{module.title}</div>
        <div className="text-xs text-gray-300">{unit?.title}</div>
        <div className="mt-4 text-xs text-gray-400">Date: {date}</div>
      </div>
    </div>
  );
}

function Certificates({ progress }) {
  const [name] = useLocal("paideia_name", "Student Name");
  const completedModules = MODULES.filter(m => m.lessons.every(l => progress[l.id]?.done));
  const today = new Date().toLocaleDateString();

  const onPrint = () => window.print();

  return (
    <div className="space-y-6">
      <ChromeCard>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Certificates</h2>
          <ChromeButton onClick={onPrint}>Print</ChromeButton>
        </div>
        <p className="text-sm text-gray-300 mt-1">Certificates are generated for completed modules.</p>
      </ChromeCard>

      {completedModules.length === 0 ? (
        <ChromeCard><p className="text-sm text-gray-300">No certificates yet. Complete all lessons in a module to unlock.</p></ChromeCard>
      ) : (
        <div className="grid md:grid-cols-2 gap-4 print:grid-cols-1">
          {completedModules.map(m => (
            <CertificateCard key={m.id} student={name} module={m} date={today} />
          ))}
        </div>
      )}
    </div>
  );
}

// ==========================
// Admin (Mocked)
// ==========================
function AdminEditor() {
  const [unitId, setUnitId] = useState(UNITS[0].id);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonBody, setLessonBody] = useState("");
  const [gated, setGated] = useState(false);

  const previewModule = {
    id: "preview",
    unitId,
    title: title || "Untitled Module",
    summary: summary || "No summary yet.",
    lessons: [
      {
        id: "preview-lesson",
        title: lessonTitle || "Untitled Lesson",
        duration: "10 min",
        gated,
        outcomes: ["Preview"],
        body: lessonBody || "Add lesson content...",
        quiz: { questions: [ { q: "Preview question?", choices: ["A","B"], answer: 0, explain: "Example." } ] }
      }
    ]
  };

  function handleMockSave() {
    alert("Mock save only. This UI previews content but does not persist.");
  }

  return (
    <div className="space-y-6">
      <ChromeCard>
        <h2 className="text-xl font-semibold">Admin Editor (Mock)</h2>
        <p className="text-sm text-gray-300">Create or edit modules and lessons. Changes are not saved.</p>
      </ChromeCard>

      <ChromeCard>
        <h3 className="font-semibold">Module</h3>
        <div className="mt-3 grid md:grid-cols-2 gap-3">
          <label className="grid gap-1 text-sm">
            <span>Unit</span>
            <select className="bg-white/10 border border-white/20 rounded-lg px-3 py-2" value={unitId} onChange={e=> setUnitId(e.target.value)}>
              {UNITS.map(u=> <option key={u.id} value={u.id}>{u.title}</option>)}
            </select>
          </label>
          <label className="grid gap-1 text-sm">
            <span>Module title</span>
            <input className="bg-white/10 border border-white/20 rounded-lg px-3 py-2" value={title} onChange={e=> setTitle(e.target.value)} />
          </label>
          <label className="grid gap-1 text-sm md:col-span-2">
            <span>Summary</span>
            <textarea rows={3} className="bg-white/10 border border-white/20 rounded-lg px-3 py-2" value={summary} onChange={e=> setSummary(e.target.value)} />
          </label>
        </div>
      </ChromeCard>

      <ChromeCard>
        <h3 className="font-semibold">First Lesson</h3>
        <div className="mt-3 grid md:grid-cols-2 gap-3">
          <label className="grid gap-1 text-sm">
            <span>Lesson title</span>
            <input className="bg-white/10 border border-white/20 rounded-lg px-3 py-2" value={lessonTitle} onChange={e=> setLessonTitle(e.target.value)} />
          </label>
          <label className="grid gap-1 text-sm">
            <span>Gated</span>
            <select className="bg-white/10 border border-white/20 rounded-lg px-3 py-2" value={gated?"yes":"no"} onChange={e=> setGated(e.target.value==="yes")}> 
              <option value="no">No</option>
              <option value="yes">Yes (Members)</option>
            </select>
          </label>
          <label className="grid gap-1 text-sm md:col-span-2">
            <span>Lesson body (markdown-ish)</span>
            <textarea rows={5} className="bg-white/10 border border-white/20 rounded-lg px-3 py-2" value={lessonBody} onChange={e=> setLessonBody(e.target.value)} />
          </label>
        </div>
        <div className="mt-3 flex gap-3">
          <ChromeButton onClick={handleMockSave}>Mock Save</ChromeButton>
          <ChromeButton onClick={()=> alert('Mock: Import from Google Doc')}>Import from Doc</ChromeButton>
        </div>
      </ChromeCard>

      <ChromeCard>
        <h3 className="font-semibold mb-2">Live Preview</h3>
        <div className="space-y-3">
          <div className="text-sm text-gray-300">{UNITS.find(u=>u.id===unitId)?.title}</div>
          <div className="text-lg font-semibold">{previewModule.title}</div>
          <div className="text-sm text-gray-300">{previewModule.summary}</div>
          <div className="pt-2">
            <article className="prose prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: markdownToHtml(previewModule.lessons[0].body) }} />
            </article>
          </div>
        </div>
      </ChromeCard>
    </div>
  );
}

// ==========================
// Self-tests (console-only)
// ==========================
function runSelfTests() {
  try {
    const log = (...xs) => console.log("[PAIDEIA tests]", ...xs);
    const err = (...xs) => console.warn("[PAIDEIA tests]", ...xs);

    // Data integrity
    log("units:", UNITS.length, "modules:", MODULES.length);
    if (UNITS.length !== 4) err("Expected 4 units");
    const unitIds = new Set(UNITS.map(u=>u.id));
    for (const m of MODULES) {
      if (!unitIds.has(m.unitId)) err("Module has unknown unitId:", m.id, m.unitId);
      if (!Array.isArray(m.lessons) || m.lessons.length === 0) err("Module has no lessons:", m.id);
    }

    // Lesson lookup
    const sample = findLessonById('l1');
    if (!sample) err("findLessonById('l1') returned null");

    // Markdown rendering sanity
    const html = markdownToHtml("### Head\n- item");
    if (!html.includes('<h3') || !html.includes('<li>')) err("markdownToHtml missing expected tags");

    // Route smoke
    const routes = ["home","about","modules","module","unit","lesson","dashboard","certs","admin"];
    if (routes.length !== 9) err("routes baseline changed");
  } catch (e) {
    console.warn("[PAIDEIA tests] unexpected error", e);
  }
}

// ==========================
// App
// ==========================
export default function App() {
  const [role, setRole] = useLocal("paideia_role", "Visitor");
  const [route, setRoute] = useState({ name: "home" });
  const [progress, setProgress] = useLocal("paideia_progress", {});

  useEffect(()=> { const hash = window.location.hash.replace('#',''); if (hash==='modules') setRoute({ name:'modules' }); if (hash==='about') setRoute({ name:'about' }); }, []);
  useEffect(()=> { runSelfTests(); }, []);

  return (
    <Shell role={role} setRole={setRole} route={route} setRoute={setRoute}>
      {route.name === "home" && <Home setRoute={setRoute} />}
      {route.name === "about" && <About setRoute={setRoute} />}
      {route.name === "modules" && <ModulesPage onOpenModule={(id)=> setRoute({ name:"module", id })} progress={progress} setRoute={setRoute} />}
      {route.name === "unit" && <UnitView unitId={route.id} setRoute={setRoute} progress={progress} />}
      {route.name === "module" && <ModuleView moduleId={route.id} setRoute={setRoute} role={role} progress={progress} />}
      {route.name === "lesson" && <LessonView id={route.id} setRoute={setRoute} role={role} progress={progress} setProgress={setProgress} />}
      {route.name === "dashboard" && (role==="Member" ? <Dashboard progress={progress} setRoute={setRoute} /> : <ChromeCard><p className="text-sm text-blue-200">Members only. Switch role to Member to view Dashboard.</p></ChromeCard>)}
      {route.name === "certs" && (role==="Member" ? <Certificates progress={progress} /> : <ChromeCard><p className="text-sm text-blue-200">Members only. Switch role to Member to view Certificates.</p></ChromeCard>)}
      {route.name === "admin" && (role!=="Admin" ? <ChromeCard><p className="text-sm text-blue-200">Admins only. Use the role switcher to preview.</p></ChromeCard> : <AdminEditor />)}
    </Shell>
  );
}
