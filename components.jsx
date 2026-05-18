// Reusable presentational components.

function CadenceRing({ ratio, initials, status }) {
  const r = 17;
  const c = 2 * Math.PI * r;
  const pct = Math.min(ratio, 1.15);
  const offset = c * (1 - Math.min(pct, 1));
  const cls = status === "over" ? "over" : status === "due" ? "due" : "ok";
  return (
    <div className="ring" aria-hidden>
      <svg viewBox="0 0 40 40">
        <circle className="track" cx="20" cy="20" r={r} />
        <circle className={`arc ${cls}`} cx="20" cy="20" r={r}
                strokeDasharray={`${c - offset} ${c}`} />
      </svg>
      <div className="ring-initials">{initials}</div>
    </div>
  );
}

function ThemeToggle({ theme, setTheme }) {
  return (
    <div className="theme-toggle" role="tablist" aria-label="Theme">
      <div className="theme-toggle-thumb"
           style={{ transform: `translateX(${theme === "dark" ? "100%" : "0%"})` }} />
      <button className={theme === "light" ? "active" : ""} onClick={() => setTheme("light")}
              role="tab" aria-selected={theme === "light"}>
        <Ic.Sun className="icon-sm" /> Light
      </button>
      <button className={theme === "dark" ? "active" : ""} onClick={() => setTheme("dark")}
              role="tab" aria-selected={theme === "dark"}>
        <Ic.Moon className="icon-sm" /> Dark
      </button>
    </div>
  );
}

function NavItem({ icon, label, active, count, onClick }) {
  return (
    <button className={`nav-item ${active ? "active" : ""}`} onClick={onClick}
            aria-current={active ? "page" : undefined}>
      {icon}
      <span>{label}</span>
      {count !== undefined && <span className="count">{count}</span>}
    </button>
  );
}

function Sidebar({ view, setView, theme, setTheme, counts, onAdd }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark" aria-hidden />
        <div className="brand-name">Circle</div>
      </div>

      <nav className="nav" aria-label="Main navigation">
        <NavItem icon={<Ic.Home className="icon" />} label="Today" active={view === "dashboard"} onClick={() => setView("dashboard")} count={counts.attention} />
        <NavItem icon={<Ic.People className="icon" />} label="People" active={view === "contacts"} onClick={() => setView("contacts")} count={counts.total} />
        <NavItem icon={<Ic.Gift className="icon" />} label="Gift vault" active={view === "gifts"} onClick={() => setView("gifts")} count={counts.gifts} />

        <div className="nav-section-title">Cadence</div>
        <NavItem icon={<span style={{width:14,height:14,borderRadius:"50%",background:"var(--accent)",display:"inline-block",flexShrink:0}} />} label="Weekly" onClick={() => setView("contacts")} count={counts.weekly} />
        <NavItem icon={<span style={{width:14,height:14,borderRadius:"50%",background:"var(--ok)",display:"inline-block",flexShrink:0}} />} label="Monthly" onClick={() => setView("contacts")} count={counts.monthly} />
        <NavItem icon={<span style={{width:14,height:14,borderRadius:"50%",background:"var(--muted-2)",display:"inline-block",flexShrink:0}} />} label="Quarterly" onClick={() => setView("contacts")} count={counts.quarterly} />
      </nav>

      <button className="btn btn-primary" onClick={onAdd} style={{justifyContent:"center"}}>
        <Ic.Plus className="icon" /> Add person
      </button>

      <div className="sidebar-footer">
        <ThemeToggle theme={theme} setTheme={setTheme} />
        <div className="user-chip">
          <div className="avatar">EM</div>
          <div style={{display:"flex",flexDirection:"column"}}>
            <div style={{fontSize:13,fontWeight:500}}>Eli Marsh</div>
            <div style={{fontSize:11,color:"var(--muted)"}}>{counts.total} people in your circle</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function MobileNav({ view, setView, counts }) {
  return (
    <nav className="mobile-nav" aria-label="Main navigation">
      <button className={view === "dashboard" ? "active" : ""}
              onClick={() => setView("dashboard")}
              aria-current={view === "dashboard" ? "page" : undefined}>
        <Ic.Home className="icon" />
        <span className="label">Today</span>
        {counts.attention > 0 && <span className="mobile-badge" aria-label={`${counts.attention} need attention`}>{counts.attention}</span>}
      </button>
      <button className={view === "contacts" ? "active" : ""}
              onClick={() => setView("contacts")}
              aria-current={view === "contacts" ? "page" : undefined}>
        <Ic.People className="icon" />
        <span className="label">People</span>
      </button>
      <button className={view === "gifts" ? "active" : ""}
              onClick={() => setView("gifts")}
              aria-current={view === "gifts" ? "page" : undefined}>
        <Ic.Gift className="icon" />
        <span className="label">Gifts</span>
      </button>
    </nav>
  );
}

function AttentionRow({ contact, onOpen }) {
  const st = statusOf(contact);
  const cad = CADENCES[contact.cadence];
  const overdueBy = contact.lastSeen - cad.days;
  const nudge =
    st.key === "over" ? `${daysWord(overdueBy)} overdue` :
    st.key === "due"  ? "Due this week" :
    "Recent";
  return (
    <button className={`attention-row ${st.key === "over" ? "warn" : st.key} lift`} onClick={onOpen}>
      <CadenceRing ratio={st.ratio} initials={initialsOf(contact.name)} status={st.key} />
      <div>
        <div className="name">{contact.name}</div>
        <div className="meta">
          <span>{contact.relation}</span>
          <span className="dot" aria-hidden />
          <span>{cad.label.toLowerCase()} cadence</span>
        </div>
      </div>
      <div className="since" aria-label={`Last contact ${daysWord(contact.lastSeen)} ago`}>
        {daysWord(contact.lastSeen)}
        <small>since last touch</small>
      </div>
      <div className="nudge">{nudge}</div>
    </button>
  );
}

function StripCard({ contact, dayLabel, onOpen }) {
  return (
    <button className="strip-card lift" onClick={onOpen}>
      <div className="strip-day">{dayLabel}</div>
      <div style={{display:"flex",gap:10,alignItems:"center"}}>
        <div className="avatar">{initialsOf(contact.name)}</div>
        <div className="strip-name">{contact.name}</div>
      </div>
      <div className="strip-foot">
        <span>{contact.relation}</span>
        <span>{CADENCES[contact.cadence].label.toLowerCase()}</span>
      </div>
    </button>
  );
}

function GiftSnap({ contact, gift, onOpen }) {
  return (
    <button className="gift-card lift" onClick={onOpen} style={{textAlign:"left"}}>
      <div className="for">
        <div className="avatar" style={{width:20,height:20,fontSize:9}}>{initialsOf(contact.name)}</div>
        for {contact.name.split(" ")[0]}
      </div>
      <div className="idea">{gift.text}</div>
      <div className="quote">"{gift.cite}"</div>
    </button>
  );
}

function ContactRow({ contact, onOpen }) {
  const st = statusOf(contact);
  const cad = CADENCES[contact.cadence];
  const overdueBy = contact.lastSeen - cad.days;
  const statusText =
    st.key === "over" ? `${daysWord(overdueBy)} overdue` :
    st.key === "due"  ? "Due soon" :
    `${daysWord(contact.lastSeen)} ago`;
  const statusCls = st.key === "over" ? "warn" : st.key === "due" ? "due" : "";
  return (
    <button className="contact-row lift" onClick={onOpen}>
      <CadenceRing ratio={st.ratio} initials={initialsOf(contact.name)} status={st.key} />
      <div>
        <div className="name">{contact.name}</div>
        <div className="relation">{contact.relation}</div>
      </div>
      <div className="right">
        <div className="cadence-tag">{cad.label}</div>
        <div className={`status ${statusCls}`}>{statusText}</div>
      </div>
    </button>
  );
}

function CadencePicker({ value, onChange }) {
  return (
    <div className="cadence-grid" role="radiogroup" aria-label="Keep-in-touch cadence">
      {Object.entries(CADENCES).filter(([k]) => k !== "yearly").map(([k, c]) => (
        <button key={k} type="button"
                className={`cadence-opt ${value === k ? "on" : ""}`}
                onClick={() => onChange(k)}
                role="radio"
                aria-checked={value === k}>
          <span className="label">{c.label}</span>
          <span className="hint">{c.hint}</span>
        </button>
      ))}
    </div>
  );
}

function AddContactModal({ open, onClose, onCreate }) {
  const [name, setName] = React.useState("");
  const [relation, setRelation] = React.useState("");
  const [cadence, setCadence] = React.useState("monthly");
  React.useEffect(() => {
    if (open) { setName(""); setRelation(""); setCadence("monthly"); }
  }, [open]);

  // Close on Escape
  React.useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  return (
    <div className={`modal-scrim ${open ? "open" : ""}`} onClick={onClose}
         role="dialog" aria-modal="true" aria-label="Add someone to your circle">
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Add someone to your circle</h2>
        <p className="lead">A person you want to stay close to, and how often you'd like to check in.</p>

        <div className="field">
          <label htmlFor="modal-name">Name</label>
          <input id="modal-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Their full name" autoFocus />
        </div>
        <div className="field">
          <label htmlFor="modal-relation">Relationship</label>
          <input id="modal-relation" value={relation} onChange={(e) => setRelation(e.target.value)} placeholder="Sister, college friend, mentor…" />
        </div>
        <div className="field">
          <label>Keep-in-touch cadence</label>
          <CadencePicker value={cadence} onChange={setCadence} />
        </div>

        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-accent"
                  disabled={!name.trim()}
                  onClick={() => { onCreate({ name: name.trim(), relation: relation.trim() || "Friend", cadence }); onClose(); }}>
            Add to circle
          </button>
        </div>
      </div>
    </div>
  );
}

function ContactDrawer({ contact, open, onClose, onLog, onToggleGift, onAddGift }) {
  const [draft, setDraft] = React.useState("");
  const [cite, setCite] = React.useState("");

  // Close on Escape
  React.useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!contact) {
    return <div className={`drawer ${open ? "open" : ""}`} aria-hidden="true" />;
  }
  const st = statusOf(contact);
  const cad = CADENCES[contact.cadence];
  const overdueBy = contact.lastSeen - cad.days;
  const sinceLabel =
    st.key === "over" ? `${daysWord(overdueBy)} overdue` :
    st.key === "due"  ? "Due soon" :
    "On track";
  return (
    <div className={`drawer ${open ? "open" : ""}`} role="dialog" aria-modal="true"
         aria-label={`${contact.name} details`}>
      <div className="drawer-head">
        <div className="top">
          <span style={{fontSize:11,letterSpacing:"0.1em",textTransform:"uppercase",color:"var(--muted)"}}>Person</span>
          <button className="btn btn-ghost" onClick={onClose} aria-label="Close drawer">
            <Ic.Close className="icon" />
          </button>
        </div>
        <div className="title-row">
          <div className="avatar lg">{initialsOf(contact.name)}</div>
          <div>
            <h2 className="drawer-name">{contact.name}</h2>
            <div className="drawer-relation">{contact.relation}{contact.notes ? ` — ${contact.notes}` : ""}</div>
          </div>
        </div>

        <div className="drawer-status" role="status">
          <div className="col">
            <span className="k">Last touch</span>
            <span className="v">{daysWord(contact.lastSeen)}</span>
          </div>
          <div className="col">
            <span className="k">Cadence</span>
            <span className="v">{cad.label}</span>
          </div>
          <div className="col">
            <span className="k">Status</span>
            <span className={`v ${st.key === "over" ? "warn" : st.key === "due" ? "due" : ""}`}>{sinceLabel}</span>
          </div>
        </div>

        <div className="drawer-actions">
          <button className="btn btn-accent" onClick={() => onLog(contact.id)}>
            <Ic.Check className="icon" /> I reached out
          </button>
          <button className="btn"><Ic.Phone className="icon" /> Call</button>
          <button className="btn"><Ic.Message className="icon" /> Message</button>
        </div>
      </div>

      <div className="drawer-body">
        <section>
          <h3 className="block-title">Recent touchpoints <small>{contact.timeline.length} logged</small></h3>
          <div className="timeline">
            {contact.timeline.map((t, i) => (
              <div key={i} className={`tl-item ${i === 0 ? "recent" : ""}`}>
                <div>
                  <div className="tl-kind">{t.kind}</div>
                  {t.note && <div className="tl-note">{t.note}</div>}
                </div>
                <div className="tl-when">{t.when}</div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="block-title">
            Gift vault
            <small>{contact.gifts.filter(g => !g.done).length} open · {contact.gifts.filter(g => g.done).length} given</small>
          </h3>
          <div className="vault">
            {contact.gifts.map((g) => (
              <div key={g.id} className={`vault-item ${g.done ? "done" : ""}`}>
                <button className={`vault-check ${g.done ? "on" : ""}`}
                        onClick={() => onToggleGift(contact.id, g.id)}
                        role="checkbox" aria-checked={g.done}
                        aria-label={g.done ? `Unmark "${g.text}" as given` : `Mark "${g.text}" as given`}>
                  <div className="vault-check-inner">
                    {g.done && <Ic.Check className="icon-sm" />}
                  </div>
                </button>
                <div className="vault-text">
                  <div className="vault-idea">{g.text}</div>
                  {g.cite && <div className="vault-cite">{g.cite}</div>}
                </div>
                {g.tag && <span className="vault-tag">{g.tag}</span>}
              </div>
            ))}

            <div className="vault-add">
              <Ic.Plus className="icon" style={{color:"var(--muted)",flexShrink:0}} />
              <input value={draft}
                     onChange={(e) => setDraft(e.target.value)}
                     placeholder="A new idea they've mentioned…"
                     aria-label="New gift idea"
                     onKeyDown={(e) => {
                       if (e.key === "Enter" && draft.trim()) {
                         onAddGift(contact.id, { text: draft.trim(), cite: cite.trim(), done: false, tag: "" });
                         setDraft(""); setCite("");
                       }
                     }} />
              <input className="cite-input"
                     value={cite}
                     onChange={(e) => setCite(e.target.value)}
                     placeholder="where you heard it (optional)"
                     aria-label="Where you heard this gift idea" />
            </div>
          </div>
        </section>

        <section>
          <h3 className="block-title">Notes</h3>
          <div style={{background:"var(--surface)",border:"1px solid var(--line)",borderRadius:"var(--radius)",padding:"14px 16px",fontSize:13.5,lineHeight:1.55,color:"var(--ink-2)"}}>
            {contact.notes || <span style={{color:"var(--muted)"}}>Add a few details you want to remember…</span>}
          </div>
        </section>
      </div>
    </div>
  );
}

Object.assign(window, {
  CadenceRing, ThemeToggle, NavItem, Sidebar, MobileNav,
  AttentionRow, StripCard, GiftSnap, ContactRow,
  CadencePicker, AddContactModal, ContactDrawer,
});
