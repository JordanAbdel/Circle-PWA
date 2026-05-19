// Main app for Circle
const { useState, useMemo, useEffect } = React;

function greetingFor(date) {
  const h = date.getHours();
  if (h < 5)  return "Burning the midnight oil";
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  if (h < 21) return "Good evening";
  return "Good night";
}

function formatDate(d) {
  return d.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
}

function Dashboard({ contacts, openContact, onAdd }) {
  const sorted = useMemo(
    () => contacts.slice().sort((a, b) => statusOf(b).ratio - statusOf(a).ratio),
    [contacts]
  );
  const attention = sorted.filter(c => statusOf(c).key !== "ok");
  const upcoming  = sorted.filter(c => statusOf(c).key === "due" || statusOf(c).key === "over").slice(0, 4);
  const recentGifts = useMemo(() => {
    const rows = [];
    contacts.forEach(c => c.gifts.filter(g => !g.done).slice(0, 1).forEach(g => rows.push({ c, g })));
    return rows.slice(0, 3);
  }, [contacts]);

  const today = new Date();
  const overdueCount = contacts.filter(c => statusOf(c).key === "over").length;
  const dueCount     = contacts.filter(c => statusOf(c).key === "due").length;
  const onTrack      = contacts.length - overdueCount - dueCount;
  const giftCount    = contacts.reduce((s, c) => s + c.gifts.filter(g => !g.done).length, 0);

  const week = [3, 1, 2, 0, 4, 2, 1];
  const weekMax = Math.max(...week);

  return (
    <main className="main">
      <div className="page-header">
        <div>
          <h1 className="greeting">{greetingFor(today)},<br/><em>Eli</em></h1>
          <div className="subgreeting">{formatDate(today)} · {overdueCount > 0 ? `${overdueCount} ${overdueCount === 1 ? "person needs" : "people need"} a nudge` : "You're all caught up"}</div>
        </div>
        <button className="btn btn-primary" onClick={onAdd}>
          <Ic.Plus className="icon" /> Log a touchpoint
        </button>
      </div>

      <div className="stat-row">
        <div className="stat-card accent">
          <div>
            <div className="stat-label">Needs your attention</div>
            <div className="stat-value">{overdueCount + dueCount}<span className="unit">of {contacts.length}</span></div>
          </div>
          <div className="stat-foot">
            {overdueCount} overdue, {dueCount} due this week. Tap below to reach out.
          </div>
        </div>
        <div className="stat-card">
          <div>
            <div className="stat-label">On track</div>
            <div className="stat-value">{onTrack}</div>
          </div>
          <div className="stat-foot">Within their cadence — no action needed.</div>
        </div>
        <div className="stat-card">
          <div>
            <div className="stat-label">This week</div>
            <div className="weekstrip" aria-label="Touchpoints this week">
              {week.map((v, i) => (
                <div key={i} className="bar"><div className="fill" style={{height: `${(v / weekMax) * 100}%`}} /></div>
              ))}
            </div>
            <div className="weekstrip-labels" aria-hidden>
              {["M","T","W","T","F","S","S"].map((d,i)=><span key={i}>{d}</span>)}
            </div>
          </div>
          <div className="stat-foot">{week.reduce((a,b)=>a+b,0)} touchpoints logged</div>
        </div>
      </div>

      <section className="section">
        <div className="section-head">
          <h2 className="section-title">Who needs you most</h2>
          <span className="section-meta">Sorted by urgency · {attention.length} people</span>
        </div>
        <div className="attention-list">
          {attention.length === 0 && (
            <div className="empty-soft">Beautifully empty. Your circle is in great shape today.</div>
          )}
          {attention.slice(0, 5).map(c => (
            <AttentionRow key={c.id} contact={c} onOpen={() => openContact(c.id)} />
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2 className="section-title">Coming up</h2>
          <span className="section-meta">Next four nudges</span>
        </div>
        <div className="strip">
          {upcoming.map((c) => {
            const cad = CADENCES[c.cadence];
            const overdueBy = c.lastSeen - cad.days;
            const label = overdueBy > 0 ? `${daysWord(overdueBy)} late` : "this week";
            return (
              <StripCard key={c.id} contact={c} dayLabel={label} onOpen={() => openContact(c.id)} />
            );
          })}
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2 className="section-title">Recent gift ideas</h2>
          <span className="section-meta">{giftCount} ideas across your circle</span>
        </div>
        <div className="gift-snap">
          {recentGifts.map(({ c, g }) => (
            <GiftSnap key={g.id} contact={c} gift={g} onOpen={() => openContact(c.id)} />
          ))}
        </div>
      </section>
    </main>
  );
}

function ContactsPage({ contacts, openContact, onAdd }) {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");

  const list = useMemo(() => {
    return contacts
      .filter(c => {
        if (q && !(`${c.name} ${c.relation}`.toLowerCase().includes(q.toLowerCase()))) return false;
        const st = statusOf(c).key;
        if (filter === "over"      && st !== "over") return false;
        if (filter === "due"       && st !== "due")  return false;
        if (filter === "ok"        && st !== "ok")   return false;
        if (filter === "weekly"    && c.cadence !== "weekly")    return false;
        if (filter === "monthly"   && c.cadence !== "monthly")   return false;
        if (filter === "quarterly" && c.cadence !== "quarterly") return false;
        return true;
      })
      .sort((a, b) => statusOf(b).ratio - statusOf(a).ratio);
  }, [contacts, q, filter]);

  return (
    <main className="main">
      <div className="page-header">
        <div>
          <h1 className="greeting">People</h1>
          <div className="subgreeting">{contacts.length} in your circle · sorted by who's most overdue</div>
        </div>
        <button className="btn btn-primary" onClick={onAdd}>
          <Ic.Plus className="icon" /> Add person
        </button>
      </div>

      <div className="toolbar">
        <div className="search">
          <Ic.Search className="icon" style={{color:"var(--muted)"}} />
          <input value={q} onChange={e => setQ(e.target.value)}
                 placeholder="Search by name or relationship…"
                 aria-label="Search contacts" />
        </div>
        <div className="chips" role="group" aria-label="Filter contacts">
          {[
            ["all",       "Everyone"],
            ["over",      "Overdue"],
            ["due",       "Due soon"],
            ["weekly",    "Weekly"],
            ["monthly",   "Monthly"],
            ["quarterly", "Quarterly"],
          ].map(([k, label]) => (
            <button key={k} className={`chip ${filter === k ? "on" : ""}`}
                    onClick={() => setFilter(k)}
                    aria-pressed={filter === k}>{label}</button>
          ))}
        </div>
      </div>

      <div className="contact-grid" role="list">
        {list.map(c => (
          <ContactRow key={c.id} contact={c} onOpen={() => openContact(c.id)} />
        ))}
      </div>
      {list.length === 0 && (
        <div className="empty-soft" style={{textAlign:"center",padding:"40px 0"}}>No one matches that — try a different filter.</div>
      )}
    </main>
  );
}

function GiftsPage({ contacts, openContact }) {
  const allGifts = useMemo(() => {
    const rows = [];
    contacts.forEach(c => c.gifts.forEach(g => rows.push({ c, g })));
    return rows;
  }, [contacts]);
  const open  = allGifts.filter(r => !r.g.done);
  const given = allGifts.filter(r => r.g.done);

  return (
    <main className="main">
      <div className="page-header">
        <div>
          <h1 className="greeting">Gift vault</h1>
          <div className="subgreeting">Things people have mentioned wanting — captured before they're forgotten</div>
        </div>
      </div>

      <section className="section" style={{marginTop:0}}>
        <div className="section-head">
          <h2 className="section-title">Open ideas</h2>
          <span className="section-meta">{open.length} across {new Set(open.map(r => r.c.id)).size} people</span>
        </div>
        <div className="gift-snap">
          {open.map(({ c, g }) => (
            <GiftSnap key={g.id} contact={c} gift={g} onOpen={() => openContact(c.id)} />
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2 className="section-title">Already given</h2>
          <span className="section-meta">{given.length} delivered</span>
        </div>
        <div className="gift-snap">
          {given.map(({ c, g }) => (
            <div key={g.id} className="gift-card" style={{opacity:0.65}}>
              <div className="for">
                <div className="avatar" style={{width:20,height:20,fontSize:9}}>{initialsOf(c.name)}</div>
                given to {c.name.split(" ")[0]}
              </div>
              <div className="idea" style={{textDecoration:"line-through",textDecorationColor:"var(--line-2)"}}>{g.text}</div>
              <div className="quote">"{g.cite}"</div>
            </div>
          ))}
          {given.length === 0 && <div className="empty-soft">Mark gifts as given from a person's page to see them here.</div>}
        </div>
      </section>
    </main>
  );
}

function App() {
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem("circle-theme") || "light"; }
    catch { return "light"; }
  });
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem("circle-theme", theme); } catch {}
  }, [theme]);

  const [contacts, setContacts] = useState(INITIAL_CONTACTS);
  const [view, setView]         = useState("dashboard");
  const [openId, setOpenId]     = useState(null);
  const [addOpen, setAddOpen]   = useState(false);

  const counts = useMemo(() => ({
    total:     contacts.length,
    attention: contacts.filter(c => statusOf(c).key !== "ok").length,
    gifts:     contacts.reduce((s, c) => s + c.gifts.filter(g => !g.done).length, 0),
    weekly:    contacts.filter(c => c.cadence === "weekly").length,
    monthly:   contacts.filter(c => c.cadence === "monthly").length,
    quarterly: contacts.filter(c => c.cadence === "quarterly").length,
  }), [contacts]);

  const openContact  = (id) => setOpenId(id);
  const closeDrawer  = ()   => setOpenId(null);

  const logTouchpoint = (id) => {
    setContacts(cs => cs.map(c =>
      c.id === id
        ? { ...c, lastSeen: 0, timeline: [{ kind: "Reached out", when: "just now", note: "Logged via Circle" }, ...c.timeline] }
        : c
    ));
  };

  const toggleGift = (cid, gid) => {
    setContacts(cs => cs.map(c =>
      c.id === cid
        ? { ...c, gifts: c.gifts.map(g => g.id === gid ? { ...g, done: !g.done } : g) }
        : c
    ));
  };

  const addGift = (cid, gift) => {
    setContacts(cs => cs.map(c =>
      c.id === cid
        ? { ...c, gifts: [...c.gifts, { ...gift, id: "g" + Math.random().toString(36).slice(2, 8) }] }
        : c
    ));
  };

  const addContact = ({ name, relation, cadence }) => {
    const id = "c" + Math.random().toString(36).slice(2, 8);
    setContacts(cs => [...cs, {
      id, name, relation, cadence, lastSeen: 0, notes: "",
      timeline: [{ kind: "Added to circle", when: "just now", note: "" }],
      gifts: [],
    }]);
  };

  const openContactObj = contacts.find(c => c.id === openId);

  return (
    <div className="app">
      <Sidebar view={view} setView={setView} theme={theme} setTheme={setTheme} counts={counts} onAdd={() => setAddOpen(true)} />

      {view === "dashboard" && <Dashboard contacts={contacts} openContact={openContact} onAdd={() => setAddOpen(true)} />}
      {view === "contacts"  && <ContactsPage contacts={contacts} openContact={openContact} onAdd={() => setAddOpen(true)} />}
      {view === "gifts"     && <GiftsPage contacts={contacts} openContact={openContact} />}

      {/* Mobile floating add button — only on people/dashboard views */}
      {(view === "dashboard" || view === "contacts") && (
        <button className="mobile-fab" onClick={() => setAddOpen(true)} aria-label="Add person">
          <Ic.Plus className="icon" />
        </button>
      )}

      <MobileNav view={view} setView={setView} counts={counts} theme={theme} setTheme={setTheme} />

      <div className={`scrim ${openId ? "open" : ""}`} onClick={closeDrawer} aria-hidden="true" />
      <ContactDrawer
        contact={openContactObj}
        open={!!openId}
        onClose={closeDrawer}
        onLog={logTouchpoint}
        onToggleGift={toggleGift}
        onAddGift={addGift}
      />

      <AddContactModal open={addOpen} onClose={() => setAddOpen(false)} onCreate={addContact} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
