// Demo data for Circle
const CADENCES = {
  weekly:    { label: "Weekly",    days: 7,   hint: "every 7 days" },
  biweekly:  { label: "Biweekly",  days: 14,  hint: "every 2 weeks" },
  monthly:   { label: "Monthly",   days: 30,  hint: "every 4 weeks" },
  quarterly: { label: "Quarterly", days: 90,  hint: "every 3 months" },
  yearly:    { label: "Yearly",    days: 365, hint: "once a year" },
};

const INITIAL_CONTACTS = [
  {
    id: "c1",
    name: "Mira Patel",
    relation: "Sister",
    cadence: "weekly",
    lastSeen: 12,
    notes: "Lives in Portland. Working on her thesis on coastal redwoods.",
    timeline: [
      { kind: "Call", when: "12 days ago", note: "Talked about her thesis defense — May 28." },
      { kind: "Text", when: "3 weeks ago", note: "Sent her the photo from Mom's birthday." },
      { kind: "Saw in person", when: "Apr 4", note: "Easter weekend at the cabin." },
      { kind: "Call", when: "Mar 19", note: "" },
    ],
    gifts: [
      { id: "g1", text: "Field Guide to Pacific Northwest Lichens", cite: "Mentioned on our walk in March", done: false, tag: "Book" },
      { id: "g2", text: "Le Labo Santal 33 travel size", cite: "Said hers ran out", done: false, tag: "Under $50" },
      { id: "g3", text: "Mechanical pencil set (Rotring 600)", cite: "Borrowed mine and didn't give it back", done: true, tag: "Tools" },
    ],
  },
  {
    id: "c2",
    name: "Theo Sandberg",
    relation: "College friend",
    cadence: "monthly",
    lastSeen: 47,
    notes: "Stockholm. Two kids: Liv (6), Otto (3). Designs furniture now.",
    timeline: [
      { kind: "Voice note", when: "47 days ago", note: "Caught up on the new studio in Söder." },
      { kind: "Email", when: "Mar 02", note: "Sent him the apartment listing in Brooklyn." },
      { kind: "Call", when: "Feb 11", note: "Otto's birthday." },
    ],
    gifts: [
      { id: "g4", text: "Hand-built ceramic espresso cup", cite: "Has been collecting them — wants one from each city", done: false, tag: "Travel-inspired" },
      { id: "g5", text: "First edition Tove Jansson 'Moominland Midwinter'", cite: "Read it to Liv recently — his copy is falling apart", done: false, tag: "Book" },
    ],
  },
  {
    id: "c3",
    name: "Yuki Tanaka",
    relation: "Mentor",
    cadence: "quarterly",
    lastSeen: 38,
    notes: "Retired professor of urban planning. Tea over Zoom every quarter.",
    timeline: [
      { kind: "Video call", when: "38 days ago", note: "Quarterly tea. Discussed the new book on Edo waterways." },
      { kind: "Letter", when: "Jan 22", note: "Hand-written thank you for the holidays." },
    ],
    gifts: [
      { id: "g6", text: "Postcard from any bookshop I visit", cite: "Standing request — she collects them", done: false, tag: "Standing" },
    ],
  },
  {
    id: "c4",
    name: "Daniela Rojas",
    relation: "Cousin",
    cadence: "monthly",
    lastSeen: 41,
    notes: "Mexico City. Architect. Pregnant — due in October.",
    timeline: [
      { kind: "Text", when: "41 days ago", note: "Shared baby room renders." },
      { kind: "Call", when: "Mar 14", note: "Long catch-up after her trip." },
    ],
    gifts: [
      { id: "g7", text: "Soft muslin swaddle set in natural tones", cite: "Building the nursery — said she's avoiding pastels", done: false, tag: "Baby" },
      { id: "g8", text: "Aesop hand cream", cite: "Mentioned hers is almost out", done: false, tag: "Under $50" },
    ],
  },
  {
    id: "c5",
    name: "James Okafor",
    relation: "Old roommate",
    cadence: "quarterly",
    lastSeen: 102,
    notes: "Lagos / London. Works in fintech. Marathon runner.",
    timeline: [
      { kind: "Text", when: "102 days ago", note: "Sent congrats on the half marathon PR." },
      { kind: "Call", when: "Dec 18", note: "Year-end recap call." },
    ],
    gifts: [
      { id: "g9", text: "Pair of On Cloudboom running shoes", cite: "Mentioned upgrading after Berlin", done: false, tag: "Sport" },
    ],
  },
  {
    id: "c6",
    name: "Amelia Brooke",
    relation: "Partner's mom",
    cadence: "monthly",
    lastSeen: 22,
    notes: "Bath, UK. Gardener. Loves bird-watching at the canal.",
    timeline: [
      { kind: "Saw in person", when: "22 days ago", note: "Sunday roast." },
      { kind: "Text", when: "Apr 03", note: "Sent her the goldfinch photo." },
    ],
    gifts: [
      { id: "g10", text: "RHS membership renewal", cite: "Hers lapses in July", done: false, tag: "Renewal" },
      { id: "g11", text: "Heirloom tomato seed collection", cite: "Wants to try something beyond Brandywines", done: false, tag: "Garden" },
    ],
  },
  {
    id: "c7",
    name: "Ravi Kapoor",
    relation: "Work friend",
    cadence: "biweekly",
    lastSeen: 19,
    notes: "Used to sit next to me at the old company. Coffee every other Friday.",
    timeline: [
      { kind: "Coffee", when: "19 days ago", note: "He's interviewing again." },
      { kind: "Text", when: "Apr 22", note: "" },
    ],
    gifts: [
      { id: "g12", text: "Notebook from Postalco", cite: "Liked mine — asked the brand", done: false, tag: "Stationery" },
    ],
  },
  {
    id: "c8",
    name: "Hannah Weiss",
    relation: "Climbing partner",
    cadence: "weekly",
    lastSeen: 5,
    notes: "Climbing every Thursday at the gym.",
    timeline: [
      { kind: "Climbed together", when: "5 days ago", note: "Sent the V5 in the cave." },
    ],
    gifts: [
      { id: "g13", text: "Climbing skin salve (Joshua Tree)", cite: "Hers ran out at the crag", done: false, tag: "Sport" },
    ],
  },
  {
    id: "c9",
    name: "Marcus Hale",
    relation: "Uncle",
    cadence: "quarterly",
    lastSeen: 71,
    notes: "Vermont. Beekeeper. Hard of hearing — phone calls only when it's quiet.",
    timeline: [
      { kind: "Call", when: "71 days ago", note: "Talked about the bee losses over winter." },
    ],
    gifts: [
      { id: "g14", text: "Vintage Massey-Ferguson workshop manual", cite: "Restoring the 135 again", done: false, tag: "Hobby" },
    ],
  },
  {
    id: "c10",
    name: "Nadia Saleh",
    relation: "Friend",
    cadence: "monthly",
    lastSeen: 33,
    notes: "Berlin. Composer. Two cats.",
    timeline: [
      { kind: "Voice note", when: "33 days ago", note: "Sent her a track I was working on." },
    ],
    gifts: [
      { id: "g15", text: "Field recording microphone (Zoom H5)", cite: "Hers got stolen on tour", done: false, tag: "Music" },
    ],
  },
];

function statusOf(contact) {
  const cad = CADENCES[contact.cadence].days;
  const ratio = contact.lastSeen / cad;
  if (ratio < 0.85) return { key: "ok",   label: "On track",  ratio };
  if (ratio < 1.0)  return { key: "due",  label: "Due soon",  ratio };
  return { key: "over", label: "Overdue", ratio };
}

function initialsOf(name) {
  return name.split(" ").map(p => p[0]).slice(0, 2).join("").toUpperCase();
}

function daysWord(n) { return n === 1 ? "1 day" : `${n} days`; }

Object.assign(window, { CADENCES, INITIAL_CONTACTS, statusOf, initialsOf, daysWord });
