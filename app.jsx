import { useState, useEffect, useRef } from "react";

const ANTHROPIC_SYSTEM_PROMPT = `You are the Methylation Health Assistant, a knowledgeable and compassionate AI built by NeuroThrive Limited. You are an expert in methylation genetics including MTHFR, COMT, CBS, MAO-A mutations and their effects on health.

KEY KNOWLEDGE:

MTHFR:
- Gene that converts folate to methylfolate (active form)
- Variants: C677T (reduces enzyme activity 40-70%), A1298C (reduces 20-40%)
- Leads to elevated homocysteine when impaired
- Requires methylated B vitamins: Methylfolate, Methylcobalamin B12, P5P B6
- Avoid folic acid - it blocks methylfolate receptors in MTHFR patients
- Related: depression, anxiety, ADHD, autism, epilepsy, addiction, cardiovascular disease, miscarriages

COMT (Catechol-O-Methyltransferase):
- Breaks down catecholamines: dopamine, adrenaline, noradrenaline, oestrogen
- Slow COMT (Val158Met variant): dopamine builds up → anxiety, OCD, rumination, sensitivity to pain, stress intolerance, oestrogen dominance
- Fast COMT: dopamine clears too quickly → low motivation, ADHD, depression
- Slow COMT people struggle with high-dose methylfolate (can worsen anxiety)
- Supports: Magnesium, B2 (riboflavin), green tea (EGCG in moderation)

CBS (Cystathionine Beta-Synthase):
- Converts homocysteine to cystathionine (downstream in methylation cycle)
- CBS upregulation: homocysteine clears too fast into sulphur pathway → excess ammonia, sulphur sensitivity, hydrogen sulphide issues
- Symptoms: sensitivity to sulphur foods (eggs, garlic, onions), fatigue, brain fog
- CBS mutations affect how you supplement: may need to limit sulphur foods and methyl donors initially

MAO-A:
- Breaks down serotonin, dopamine, noradrenaline
- Slow MAO-A: neurotransmitters build up → mood swings, aggression, anxiety, histamine sensitivity
- Fast MAO-A: neurotransmitters clear too fast → depression, low energy

HISTAMINE INTOLERANCE:
- Strongly linked to MTHFR and MAO-A mutations
- DAO enzyme (breaks down histamine) requires B6, copper, vitamin C
- HNMT enzyme (breaks down histamine in tissues) requires methylation support
- Symptoms: headaches, flushing, hives, runny nose, heart palpitations, anxiety after eating
- High histamine foods: aged cheese, wine, fermented foods, processed meats, leftovers, spinach, tomatoes, avocado
- Low histamine diet + DAO support + methylation support = protocol

GENE INTERACTIONS:
- MTHFR + COMT slow: start low and slow on methylfolate, watch for anxiety
- MTHFR + CBS upregulation: limit sulphur foods, go slow on methyl donors
- MTHFR + MAO-A slow: histamine intolerance likely, support DAO first
- Triple combinations require careful sequential supplementation

NEUROTHRIVE MTHFR SUPPORT:
- Contains: P5P B6 1.5mg + Methylfolate 400mcg + Methylcobalamin B12 1000mcg
- Ideal starting supplement for most MTHFR patients
- Conservative methylfolate dose (400mcg) - safe even for COMT slow variants
- Founded by James O'Neill after daughter Saoirse recovered from near-fatal hyperhomocysteinemia (homocysteine 350 μmol/L)
- Available at neurothrive.ie

TESTING:
- MTHFR genetic test: cheek swab or blood, available online
- Homocysteine blood test: most actionable marker, normal <15, dangerous >30
- Full methylation panel available from private labs
- DAO enzyme test for histamine intolerance
- Always recommend GP consultation

Always be warm, educational, and helpful. Recommend NeuroThrive products where appropriate but always prioritise the user's health. Never diagnose - always recommend professional medical advice.`;

const tabs = [
  { id: "home", label: "Home", icon: "🏠" },
  { id: "learn", label: "Learn", icon: "📖" },
  { id: "checker", label: "Checker", icon: "🧬" },
  { id: "protocol", label: "Protocol", icon: "💊" },
  { id: "diet", label: "Diet", icon: "🥗" },
  { id: "tracker", label: "Tracker", icon: "📊" },
  { id: "chat", label: "Chat", icon: "💬" },
];

const learnTopics = [
  {
    id: "mthfr",
    icon: "🧬",
    title: "MTHFR Gene",
    color: "#2563eb",
    sections: [
      {
        heading: "What is MTHFR?",
        text: `MTHFR (methylenetetrahydrofolate reductase) is a gene that produces an enzyme critical for converting folate into its active form — methylfolate. This process, called methylation, drives hundreds of bodily functions including DNA repair, neurotransmitter production, detoxification, and gene expression.

When you carry an MTHFR mutation, this conversion is impaired by 40–70% (C677T variant) or 20–40% (A1298C variant). The result: your body can't efficiently process folate, homocysteine levels rise, and a cascade of health problems can follow.

Up to 60% of the population carries some form of MTHFR variant — making it one of the most common and most overlooked genetic factors in modern health.`,
      },
      {
        heading: "The Homocysteine Problem",
        text: `Homocysteine is an amino acid that becomes toxic when elevated. Normally, MTHFR helps convert it into beneficial compounds. With impaired MTHFR, homocysteine accumulates and damages blood vessels, the brain, and the nervous system.

Normal: under 15 μmol/L
Elevated: 15–30 μmol/L
High risk: 30–100 μmol/L
Dangerous: above 100 μmol/L

James O'Neill's daughter Saoirse had a homocysteine level of 350 — 23 times the upper safe limit. Doctors believed she had a fatal brain disease. Two months of methylated B vitamins reversed her condition entirely. She walked out of hospital and has been seizure-free since. NeuroThrive was born from that experience.`,
      },
      {
        heading: "Related Conditions",
        text: `MTHFR mutations have been linked to:
• ADHD and attention difficulties
• Autism spectrum disorder and dyspraxia
• Depression, anxiety, and bipolar disorder
• Epilepsy and seizure disorders
• Addiction and substance use
• Cardiovascular disease and blood clots
• Recurrent miscarriages and fertility issues
• Chronic fatigue and fibromyalgia
• Migraines and chronic headaches
• Schizophrenia and psychiatric conditions
• Alzheimer's and cognitive decline`,
      },
      {
        heading: "The Right Supplements",
        text: `Critical: avoid folic acid if you have MTHFR. The synthetic form cannot be properly processed and can block methylfolate receptors, worsening your symptoms.

You need the active, methylated forms:
✓ Methylfolate (5-MTHF) — pre-converted folate
✓ Methylcobalamin B12 — active form of B12
✓ P5P B6 — active form of B6

These three work synergistically to support methylation and lower homocysteine. This is exactly the formulation in NeuroThrive MTHFR Support — 400mcg methylfolate, 1000mcg methylcobalamin, 1.5mg P5P.`,
      },
    ],
  },
  {
    id: "comt",
    icon: "⚡",
    title: "COMT Gene",
    color: "#7c3aed",
    sections: [
      {
        heading: "What is COMT?",
        text: `COMT (Catechol-O-Methyltransferase) is a gene that produces an enzyme responsible for breaking down catecholamines — dopamine, adrenaline, noradrenaline — as well as oestrogen. It works by using methyl groups donated by the methylation cycle, meaning MTHFR and COMT are deeply interconnected.

The most studied variant is Val158Met. Depending on which version you carry, your COMT can be "slow" or "fast" — and this has a profound effect on your mood, stress tolerance, focus, and hormonal balance.`,
      },
      {
        heading: "Slow COMT",
        text: `Slow COMT means dopamine and adrenaline linger longer in the brain. This sounds beneficial, but in reality it leads to overstimulation:

• Anxiety, worry, and rumination
• OCD tendencies and intrusive thoughts
• High sensitivity to pain and stress
• Oestrogen dominance (PMS, heavy periods, hormonal mood issues)
• Caffeine sensitivity and poor sleep
• Great under normal conditions, but falls apart under stress

Slow COMT people need to be careful with high-dose methylfolate — too many methyl groups can overstimulate the system and worsen anxiety. Start low and go slow.`,
      },
      {
        heading: "Fast COMT",
        text: `Fast COMT clears dopamine and adrenaline too quickly, leaving the brain understimulated:

• Low motivation and poor drive
• ADHD-type symptoms
• Depression and emotional flatness
• Tendency toward risk-taking and sensation-seeking
• Better stress resilience than slow COMT types
• May benefit from higher methylfolate doses

Fast COMT types often do well with more aggressive methylation support and may need additional dopamine support strategies.`,
      },
      {
        heading: "COMT Support",
        text: `For slow COMT:
• Magnesium — calms the nervous system
• B2 Riboflavin — supports COMT enzyme activity
• Green tea (EGCG in moderation) — gentle COMT support
• Avoid: excessive methyl donors, high-dose B12, stress, caffeine

For fast COMT:
• Methylation support (methylfolate, B12)
• Protein-rich diet (tyrosine for dopamine)
• Exercise — natural dopamine boost
• Reduce simple carbs and sugar spikes`,
      },
    ],
  },
  {
    id: "histamine",
    icon: "🔴",
    title: "Histamine Intolerance",
    color: "#dc2626",
    sections: [
      {
        heading: "Histamine and Methylation",
        text: `Histamine intolerance is strongly linked to MTHFR and MAO-A mutations. Your body has two main ways to break down histamine: the DAO enzyme (in the gut) and the HNMT enzyme (in tissues). HNMT requires methyl groups from the methylation cycle — so when methylation is impaired, histamine builds up.

Many people with MTHFR unknowingly have histamine intolerance and spend years suffering from unexplained symptoms without connecting them to food or genetics.`,
      },
      {
        heading: "Symptoms",
        text: `Histamine intolerance symptoms often appear 30 minutes to 2 hours after eating:

• Headaches or migraines
• Skin flushing, hives, or itching
• Runny nose or congestion
• Heart palpitations or racing heart
• Anxiety or panic after eating
• Gut issues: bloating, diarrhoea, cramps
• Low blood pressure and dizziness
• Menstrual pain (histamine affects oestrogen)
• Brain fog after meals

If you notice symptoms after wine, aged cheese, fermented foods, or leftovers — histamine intolerance is very likely.`,
      },
      {
        heading: "High Histamine Foods to Avoid",
        text: `Highest histamine triggers:
🚫 Aged and fermented cheeses
🚫 Red wine, champagne, beer
🚫 Fermented foods (sauerkraut, kimchi, kombucha)
🚫 Processed and cured meats (salami, bacon)
🚫 Tinned fish (tuna, sardines, mackerel)
🚫 Leftovers (histamine increases as food ages)
🚫 Vinegar and vinegar-containing foods
🚫 Spinach, tomatoes, avocado, aubergine
🚫 Strawberries, citrus fruits, pineapple
🚫 Chocolate and cocoa`,
      },
      {
        heading: "Protocol",
        text: `Step 1 — Support DAO enzyme:
✓ P5P B6 (in NeuroThrive MTHFR Support)
✓ Vitamin C
✓ Copper (small amounts)
✓ DAO enzyme supplement (taken before meals)

Step 2 — Support methylation (HNMT pathway):
✓ Methylfolate + B12 (NeuroThrive MTHFR Support)
✓ Start low and slow — methylation support can initially release stored histamine

Step 3 — Low histamine diet for 4–6 weeks, then gradual reintroduction

Step 4 — Address gut health — leaky gut worsens DAO deficiency`,
      },
    ],
  },
  {
    id: "cbs",
    icon: "⚗️",
    title: "CBS Gene",
    color: "#059669",
    sections: [
      {
        heading: "What is CBS?",
        text: `CBS (Cystathionine Beta-Synthase) is a gene that controls how homocysteine is processed downstream in the methylation cycle — converting it into cystathionine and then into sulphur compounds including glutathione (the body's master antioxidant).

CBS mutations are less common than MTHFR but significantly impact how you respond to supplements. There are two main types: upregulation (too fast) and downregulation (too slow).`,
      },
      {
        heading: "CBS Upregulation",
        text: `CBS upregulation is the most common variant. The enzyme works too fast, shunting homocysteine rapidly into the sulphur pathway. This creates:

• Excess ammonia (brain fog, fatigue, headaches)
• Excess hydrogen sulphide
• Sulphur sensitivity
• Taurine overproduction (inhibitory — can cause fatigue)
• Depletion of methyl groups needed for methylation

Symptoms: sensitivity to sulphur-rich foods (eggs, garlic, onions, cruciferous vegetables), brain fog after eating these foods, fatigue and ammonia smell in sweat or urine.`,
      },
      {
        heading: "CBS and Supplementation",
        text: `If you have CBS upregulation, the standard methylation protocol needs adjustment:

• Limit high-sulphur foods initially
• Avoid high-dose NAC and glutathione supplements early on
• Support ammonia clearance: yucca root, charcoal, molybdenum
• Introduce methyl donors slowly — your system is already depleted
• Address CBS first before aggressively pushing methylation

This is why some people feel worse when starting methylfolate or B12 — they may have an underlying CBS issue amplifying their reaction.`,
      },
      {
        heading: "CBS Downregulation",
        text: `CBS downregulation means homocysteine cannot move downstream efficiently, causing it to build up. This looks similar to MTHFR on blood tests — elevated homocysteine — but the cause and treatment differ.

With CBS downregulation:
• Homocysteine accumulates
• Glutathione production is impaired (poor detox capacity)
• Oxidative stress increases

Standard methylation support helps, but glutathione support (liposomal glutathione or its precursors) is also important.`,
      },
    ],
  },
  {
    id: "maoa",
    icon: "🧠",
    title: "MAO-A Gene",
    color: "#d97706",
    sections: [
      {
        heading: "What is MAO-A?",
        text: `MAO-A (Monoamine Oxidase A) is a gene that produces an enzyme responsible for breaking down neurotransmitters — primarily serotonin, dopamine, and noradrenaline. It also breaks down histamine in the gut and brain.

MAO-A variants significantly affect mood, behaviour, and histamine tolerance. The "warrior gene" nickname comes from research linking slow MAO-A to impulsivity and aggression under stress — though this is an oversimplification of a complex gene.`,
      },
      {
        heading: "Slow MAO-A",
        text: `Slow MAO-A means neurotransmitters linger longer before being cleared:

• Neurotransmitters build up → mood instability
• Anxiety, irritability, and aggression under stress
• Sleep disturbances and vivid dreams
• Histamine intolerance (MAO-A breaks down histamine)
• Sensitivity to tyramine (in aged foods, wine)
• Can feel very calm and focused normally, but explosive under stress

Slow MAO-A combined with MTHFR is a common profile in people with addiction histories, mood disorders, and histamine intolerance.`,
      },
      {
        heading: "Fast MAO-A",
        text: `Fast MAO-A clears neurotransmitters too quickly:

• Low serotonin → depression and sadness
• Low dopamine → poor motivation and drive
• Low noradrenaline → fatigue and brain fog
• Better histamine tolerance
• May respond well to antidepressants (SSRIs)
• Often benefits from methylation support to boost neurotransmitter production

Fast MAO-A combined with MTHFR can cause profound depression and fatigue.`,
      },
      {
        heading: "MAO-A Support",
        text: `For slow MAO-A:
✓ Support methylation carefully (start low)
✓ Low histamine diet
✓ Avoid tyramine-rich foods
✓ Magnesium for nervous system calm
✓ Avoid excessive methyl donors
✓ Stress management — cortisol worsens slow MAO-A

For fast MAO-A:
✓ Methylation support (methylfolate + B12)
✓ Tryptophan-rich foods (for serotonin)
✓ Protein-rich diet (tyrosine for dopamine)
✓ Exercise — natural monoamine booster
✓ Bright light therapy in the morning`,
      },
    ],
  },
  {
    id: "interactions",
    icon: "🔗",
    title: "Gene Interactions",
    color: "#0891b2",
    sections: [
      {
        heading: "Why Gene Combinations Matter",
        text: `Most people with methylation issues don't just carry one mutation — they carry combinations. And the interactions between genes are often more important than any single variant. Understanding your combination helps explain why standard supplement advice may not work for you, and why some people feel worse when they start methylfolate.

This is the frontier of personalised health — moving beyond single-gene thinking to understanding the whole methylation cycle.`,
      },
      {
        heading: "MTHFR + Slow COMT",
        text: `Very common combination. The challenge: MTHFR needs methylfolate supplementation, but slow COMT means too many methyl groups cause anxiety and overstimulation.

Protocol:
• Start with very low methylfolate (200mcg or less)
• Increase slowly over weeks
• Add magnesium and B2 first to support COMT
• Watch for: anxiety, insomnia, irritability (signs of too many methyls)
• Hydroxocobalamin B12 may be better than methyl-B12 for this combination
• NeuroThrive's 400mcg dose is specifically conservative enough for this profile`,
      },
      {
        heading: "MTHFR + CBS Upregulation",
        text: `Challenging combination. Pushing methylation too hard causes excess sulphur compounds and ammonia when CBS is upregulated.

Protocol:
• Address CBS first: low sulphur diet, ammonia support
• Start methylation support gently
• Avoid high-dose NAC and glutathione initially
• Monitor for: brain fog, ammonia symptoms, fatigue after supplements
• This combination benefits most from working with a functional medicine practitioner`,
      },
      {
        heading: "MTHFR + MAO-A Slow + Histamine",
        text: `This triple combination is common in people with addiction history, mood disorders, and chronic inflammatory conditions.

The cascade:
Poor methylation → histamine builds up
Slow MAO-A → histamine clears slowly
Result: severe histamine intolerance + mood instability

Protocol:
• Low histamine diet is essential first
• DAO enzyme support (P5P, vitamin C)
• Begin methylation support carefully
• Avoid alcohol entirely (blocks DAO and raises histamine)
• James O'Neill's background with addiction and his own genetics may reflect this profile`,
      },
      {
        heading: "Testing Your Combination",
        text: `The gold standard is a full methylation genetic panel — testing MTHFR, COMT, CBS, MAO-A, BHMT, MTR, MTRR and others simultaneously.

Options:
• 23andMe raw data + Genetic Genie (free interpretation)
• NutraHacker panel
• Sterling's App for detailed gene analysis
• Private functional medicine labs in Ireland and the UK

A homocysteine blood test remains the most immediately actionable test — it reflects the overall health of your methylation cycle regardless of which specific genes are impaired.`,
      },
    ],
  },
];

const symptomGroups = [
  {
    group: "Neurological & Mood",
    symptoms: [
      { id: "anxiety", label: "Anxiety or panic attacks" },
      { id: "depression", label: "Depression or low mood" },
      { id: "brain_fog", label: "Brain fog or poor memory" },
      { id: "ocd", label: "OCD or intrusive thoughts" },
      { id: "adhd", label: "ADHD or poor concentration" },
      { id: "mood_swings", label: "Mood swings or irritability" },
      { id: "seizures", label: "Seizures or neurological issues" },
      { id: "addiction", label: "History of addiction" },
    ],
  },
  {
    group: "Physical",
    symptoms: [
      { id: "fatigue", label: "Chronic fatigue or low energy" },
      { id: "headaches", label: "Frequent headaches or migraines" },
      { id: "sleep", label: "Poor sleep or insomnia" },
      { id: "cardiovascular", label: "Heart palpitations" },
      { id: "pain", label: "Chronic pain or fibromyalgia" },
      { id: "miscarriages", label: "Recurrent miscarriages" },
    ],
  },
  {
    group: "Histamine & Gut",
    symptoms: [
      { id: "histamine_food", label: "Symptoms after wine, cheese, fermented foods" },
      { id: "flushing", label: "Facial flushing or hives" },
      { id: "runny_nose", label: "Chronic runny nose or congestion" },
      { id: "gut", label: "IBS, bloating, or digestive issues" },
      { id: "leftovers", label: "Feel worse after eating leftovers" },
    ],
  },
  {
    group: "Sulphur & CBS",
    symptoms: [
      { id: "sulphur_foods", label: "Sensitivity to eggs, garlic, onions" },
      { id: "ammonia", label: "Ammonia smell in sweat or urine" },
      { id: "sulphur_fog", label: "Brain fog after cruciferous vegetables" },
    ],
  },
  {
    group: "Hormonal",
    symptoms: [
      { id: "pms", label: "Severe PMS or hormonal mood issues" },
      { id: "oestrogen", label: "Oestrogen dominance symptoms" },
      { id: "fertility", label: "Fertility issues" },
    ],
  },
];

const dietRules = [
  {
    category: "Always Avoid with MTHFR",
    color: "#ef4444",
    icon: "🚫",
    items: [
      "Folic acid (synthetic) — blocks methylfolate receptors",
      "Fortified cereals, breads, and flours (contain folic acid)",
      "Most standard multivitamins (contain folic acid)",
      "Processed foods with folic acid listed in ingredients",
    ],
  },
  {
    category: "High Histamine — Limit or Avoid",
    color: "#f59e0b",
    icon: "⚠️",
    items: [
      "Aged cheeses (cheddar, parmesan, brie)",
      "Red wine, champagne, beer",
      "Fermented foods (sauerkraut, kimchi, kombucha, kefir)",
      "Processed and cured meats (salami, bacon, sausages)",
      "Tinned fish (tuna, sardines, mackerel, anchovies)",
      "Leftovers (histamine increases as food sits)",
      "Vinegar and vinegar-based foods",
      "Tomatoes, spinach, avocado, aubergine",
      "Strawberries, citrus fruits, pineapple, banana",
      "Chocolate, cocoa, and energy drinks",
    ],
  },
  {
    category: "Sulphur-Rich — Limit if CBS Upregulation",
    color: "#8b5cf6",
    icon: "⚡",
    items: [
      "Eggs (especially in large amounts)",
      "Garlic and onions",
      "Cruciferous vegetables (broccoli, cauliflower, cabbage, kale)",
      "Dried fruits",
      "NAC and glutathione supplements (initially)",
    ],
  },
  {
    category: "Eat More — Supports Methylation",
    color: "#22c55e",
    icon: "✓",
    items: [
      "Dark leafy greens (spinach, chard — check histamine tolerance)",
      "Grass-fed beef and lamb (natural methylcobalamin B12)",
      "Wild salmon and mackerel (fresh, not tinned)",
      "Eggs (if no CBS issues — excellent choline source)",
      "Lentils and chickpeas (natural folate)",
      "Asparagus and broccoli (natural folate)",
      "Sunflower seeds and pumpkin seeds",
      "Brown rice and quinoa",
      "Filtered water — avoid chlorinated tap water",
    ],
  },
  {
    category: "Lifestyle Supports",
    color: "#0891b2",
    icon: "🌿",
    items: [
      "Exercise — supports methylation and dopamine balance",
      "Sauna — supports detoxification pathways",
      "Reduce alcohol — blocks DAO and raises histamine",
      "Manage stress — cortisol depletes methyl groups",
      "Good sleep — methylation repairs DNA overnight",
      "Avoid NSAIDs where possible — deplete glutathione",
      "Filter drinking water — chlorine affects gut bacteria",
    ],
  },
];

const trackerSymptoms = [
  "Energy levels (1-10)",
  "Mood (1-10)",
  "Brain fog (1=severe, 10=clear)",
  "Anxiety (1=severe, 10=calm)",
  "Sleep quality (1-10)",
  "Digestive comfort (1-10)",
];

export default function MethylationApp() {
  const [activeTab, setActiveTab] = useState("home");
  const [subscribed, setSubscribed] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [expandedTopic, setExpandedTopic] = useState(null);
  const [expandedSection, setExpandedSection] = useState(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [checkerResult, setCheckerResult] = useState(null);
  const [trackerEntries, setTrackerEntries] = useState([]);
  const [todayScores, setTodayScores] = useState({});
  const [trackerNote, setTrackerNote] = useState("");
  const [chatMessages, setChatMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I'm your Methylation Health Assistant. I can help with MTHFR, COMT, histamine intolerance, CBS, MAO-A, and how they all interact. What would you like to know?",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  useEffect(() => {
    const saved = localStorage.getItem("methylation_tracker");
    if (saved) setTrackerEntries(JSON.parse(saved));
  }, []);

  const toggleSymptom = (id) => {
    setSelectedSymptoms((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const gate = (fn) => {
    if (!subscribed) { setShowPaywall(true); return; }
    fn();
  };

  const analyseSymptoms = () => {
    gate(() => {
      const s = selectedSymptoms;
      const mthfrScore = ["anxiety", "depression", "brain_fog", "adhd", "fatigue", "seizures", "cardiovascular", "miscarriages", "addiction"].filter(x => s.includes(x)).length;
      const histamineScore = ["histamine_food", "flushing", "runny_nose", "headaches", "leftovers", "gut"].filter(x => s.includes(x)).length;
      const comtScore = ["anxiety", "ocd", "mood_swings", "sleep", "pms", "oestrogen"].filter(x => s.includes(x)).length;
      const cbsScore = ["sulphur_foods", "ammonia", "sulphur_fog"].filter(x => s.includes(x)).length;
      const maoaScore = ["mood_swings", "addiction", "histamine_food", "flushing"].filter(x => s.includes(x)).length;

      const genes = [];
      if (mthfrScore >= 3) genes.push({ gene: "MTHFR", confidence: mthfrScore >= 5 ? "high" : "moderate", color: "#2563eb" });
      if (histamineScore >= 2) genes.push({ gene: "Histamine Intolerance", confidence: histamineScore >= 4 ? "high" : "moderate", color: "#dc2626" });
      if (comtScore >= 3) genes.push({ gene: "COMT (Slow)", confidence: comtScore >= 5 ? "high" : "moderate", color: "#7c3aed" });
      if (cbsScore >= 2) genes.push({ gene: "CBS Upregulation", confidence: "moderate", color: "#059669" });
      if (maoaScore >= 2) genes.push({ gene: "MAO-A (Slow)", confidence: "moderate", color: "#d97706" });

      setCheckerResult({ genes, total: s.length, mthfrScore, histamineScore, comtScore, cbsScore });
    });
  };

  const saveTracker = () => {
    gate(() => {
      if (Object.keys(todayScores).length === 0) return;
      const entry = {
        date: new Date().toLocaleDateString("en-IE"),
        scores: { ...todayScores },
        note: trackerNote,
      };
      const updated = [entry, ...trackerEntries].slice(0, 30);
      setTrackerEntries(updated);
      localStorage.setItem("methylation_tracker", JSON.stringify(updated));
      setTodayScores({});
      setTrackerNote("");
    });
  };

  const sendMessage = async () => {
    if (!chatInput.trim()) return;
    gate(async () => {
      const userMsg = { role: "user", content: chatInput };
      const newMessages = [...chatMessages, userMsg];
      setChatMessages(newMessages);
      setChatInput("");
      setChatLoading(true);
      try {
        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1000,
            system: ANTHROPIC_SYSTEM_PROMPT,
            messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          }),
        });
        const data = await response.json();
        const reply = data.content?.[0]?.text || "Sorry, something went wrong. Please try again.";
        setChatMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      } catch {
        setChatMessages((prev) => [...prev, { role: "assistant", content: "Connection error. Please try again." }]);
      }
      setChatLoading(false);
    });
  };

  const getProtocol = () => {
    if (!checkerResult) return null;
    const { genes } = checkerResult;
    const hasHistamine = genes.some(g => g.gene === "Histamine Intolerance");
    const hasCOMTslow = genes.some(g => g.gene === "COMT (Slow)");
    const hasCBS = genes.some(g => g.gene === "CBS Upregulation");
    const hasMTHFR = genes.some(g => g.gene === "MTHFR");

    const steps = [];

    if (hasCBS) {
      steps.push({
        step: 1,
        title: "Address CBS First",
        items: ["Low sulphur diet for 2–4 weeks", "Ammonia support: molybdenum, yucca root", "Avoid NAC and glutathione initially"],
        color: "#059669",
      });
    }

    if (hasHistamine) {
      steps.push({
        step: steps.length + 1,
        title: "Support DAO Enzyme",
        items: ["Start NeuroThrive MTHFR Support (contains P5P B6 for DAO)", "Add Vitamin C", "Low histamine diet for 4–6 weeks", "DAO enzyme supplement before meals"],
        color: "#dc2626",
      });
    }

    if (hasMTHFR) {
      const methylNote = hasCOMTslow ? "Start at half dose (200mcg methylfolate) and increase slowly" : "Full dose is appropriate";
      steps.push({
        step: steps.length + 1,
        title: "Begin Methylation Support",
        items: [
          `NeuroThrive MTHFR Support — ${methylNote}`,
          "Avoid all folic acid fortified foods",
          "Add Magnesium glycinate (especially with slow COMT)",
          hasCOMTslow ? "Consider B2 riboflavin for COMT support" : "Standard methylation protocol",
        ],
        color: "#2563eb",
      });
    }

    steps.push({
      step: steps.length + 1,
      title: "Monitor and Adjust",
      items: [
        "Log symptoms daily in the Tracker tab",
        "Retest homocysteine after 3 months",
        "Consider full methylation genetic panel",
        "Work with a GP or functional medicine practitioner",
      ],
      color: "#0891b2",
    });

    return steps;
  };

  const protocol = getProtocol();

  return (
    <div style={S.app}>
      <header style={S.header}>
        <div style={S.headerInner}>
          <div style={S.logo}>
            <span style={S.logoIcon}>🧬</span>
            <div>
              <div style={S.logoTitle}>Methylation Health</div>
              <div style={S.logoSub}>by NeuroThrive</div>
            </div>
          </div>
          {!subscribed ? (
            <button style={S.subBtn} onClick={() => setShowPaywall(true)}>€4.99/mo</button>
          ) : (
            <div style={S.badge}>✓ Member</div>
          )}
        </div>
      </header>

      <nav style={S.nav}>
        {tabs.map((t) => (
          <button
            key={t.id}
            style={{ ...S.navBtn, ...(activeTab === t.id ? S.navActive : {}) }}
            onClick={() => setActiveTab(t.id)}
          >
            <span style={S.navIcon}>{t.icon}</span>
            <span style={S.navLabel}>{t.label}</span>
          </button>
        ))}
      </nav>

      <main style={S.main}>
        {activeTab === "home" && (
          <div style={S.page}>
            <div style={S.hero}>
              <div style={S.heroGlow} />
              <h1 style={S.heroTitle}>Your genes don't have to define your health.</h1>
              <p style={S.heroSub}>Understand MTHFR, COMT, histamine intolerance, CBS, MAO-A — and what to do about them.</p>
              <div style={S.heroBtns}>
                <button style={S.heroCta} onClick={() => setActiveTab("checker")}>Check Symptoms →</button>
                <button style={{ ...S.heroCta, ...S.heroCtaOutline }} onClick={() => setActiveTab("learn")}>Learn More</button>
              </div>
            </div>

            <div style={S.storyCard}>
              <div style={S.storyHead}>
                <span style={{ fontSize: 28 }}>👧</span>
                <h2 style={S.storyTitle}>Saoirse's Story</h2>
              </div>
              <p style={S.storyText}>James O'Neill's daughter Saoirse was healthy until age 5, when she developed seizures and neurological regression. For years, doctors couldn't find the cause. By age 10, they believed she had a fatal progressive brain disease.</p>
              <p style={S.storyText}>A blood test revealed her homocysteine was <strong style={{ color: "#ef4444" }}>350 μmol/L</strong> — over 23 times the safe limit. The cause: severe MTHFR deficiency.</p>
              <p style={{ ...S.storyText, color: "#7eb8f7", fontStyle: "italic", borderTop: "1px solid #1e3a5f", paddingTop: 12, marginBottom: 0 }}>Two months of methylated B vitamins. She walked out of hospital. Seizure-free ever since. This app exists because of her.</p>
            </div>

            <div style={S.genesRow}>
              {[
                { id: "mthfr", icon: "🧬", label: "MTHFR", desc: "Folate & homocysteine", color: "#2563eb" },
                { id: "comt", icon: "⚡", label: "COMT", desc: "Dopamine & stress", color: "#7c3aed" },
                { id: "histamine", icon: "🔴", label: "Histamine", desc: "Food reactions", color: "#dc2626" },
                { id: "cbs", icon: "⚗️", label: "CBS", desc: "Sulphur metabolism", color: "#059669" },
                { id: "maoa", icon: "🧠", label: "MAO-A", desc: "Mood & serotonin", color: "#d97706" },
                { id: "interactions", icon: "🔗", label: "Interactions", desc: "Gene combinations", color: "#0891b2" },
              ].map((g) => (
                <button key={g.id} style={S.geneCard} onClick={() => { setActiveTab("learn"); setExpandedTopic(g.id); }}>
                  <span style={S.geneIcon}>{g.icon}</span>
                  <div style={{ ...S.geneLabel, color: g.color }}>{g.label}</div>
                  <div style={S.geneDesc}>{g.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === "learn" && (
          <div style={S.page}>
            <h2 style={S.pageTitle}>Methylation Education</h2>
            <p style={S.pageSub}>Tap any gene to explore its role in your health.</p>
            {learnTopics.map((topic) => (
              <div key={topic.id} style={{ marginBottom: 12 }}>
                <button
                  style={{ ...S.topicHeader, borderColor: expandedTopic === topic.id ? topic.color : "#1e3a5f" }}
                  onClick={() => { setExpandedTopic(expandedTopic === topic.id ? null : topic.id); setExpandedSection(null); }}
                >
                  <span style={S.topicIcon}>{topic.icon}</span>
                  <span style={{ ...S.topicTitle, color: topic.color }}>{topic.title}</span>
                  <span style={S.chevron}>{expandedTopic === topic.id ? "▲" : "▼"}</span>
                </button>
                {expandedTopic === topic.id && (
                  <div style={S.topicBody}>
                    {topic.sections.map((sec, si) => (
                      <div key={si} style={S.sectionCard}>
                        <button
                          style={S.sectionHeader}
                          onClick={() => setExpandedSection(expandedSection === `${topic.id}-${si}` ? null : `${topic.id}-${si}`)}
                        >
                          <span style={S.sectionTitle}>{sec.heading}</span>
                          <span style={S.chevronSm}>{expandedSection === `${topic.id}-${si}` ? "▲" : "▼"}</span>
                        </button>
                        {expandedSection === `${topic.id}-${si}` && (
                          <div style={S.sectionBody}>
                            {sec.text.split("\n\n").map((p, pi) => (
                              <p key={pi} style={S.sectionPara}>{p}</p>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === "checker" && (
          <div style={S.page}>
            <h2 style={S.pageTitle}>Symptom Checker</h2>
            <p style={S.pageSub}>Select all symptoms you regularly experience. The app will identify which genes may be involved.</p>
            {symptomGroups.map((group) => (
              <div key={group.group} style={{ marginBottom: 20 }}>
                <div style={S.groupLabel}>{group.group}</div>
                <div style={S.symptomsWrap}>
                  {group.symptoms.map((s) => (
                    <button
                      key={s.id}
                      style={{ ...S.symBtn, ...(selectedSymptoms.includes(s.id) ? S.symBtnActive : {}) }}
                      onClick={() => toggleSymptom(s.id)}
                    >
                      {selectedSymptoms.includes(s.id) ? "✓ " : ""}{s.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <button style={S.runBtn} onClick={analyseSymptoms}>Analyse My Symptoms</button>
            {checkerResult && (
              <div style={S.resultBox}>
                <h3 style={S.resultTitle}>Your Methylation Profile</h3>
                {checkerResult.genes.length === 0 ? (
                  <p style={S.resultText}>Your symptom pattern doesn't strongly suggest specific gene variants. Consider getting a homocysteine blood test as a baseline check.</p>
                ) : (
                  <>
                    <p style={{ ...S.resultText, marginBottom: 14 }}>Based on your symptoms, these gene variants may be involved:</p>
                    {checkerResult.genes.map((g) => (
                      <div key={g.gene} style={S.geneBadgeRow}>
                        <div style={{ ...S.geneBadge, backgroundColor: g.color + "22", borderColor: g.color, color: g.color }}>{g.gene}</div>
                        <div style={S.confidenceLabel}>{g.confidence} likelihood</div>
                      </div>
                    ))}
                    <p style={{ ...S.resultText, marginTop: 14 }}>Go to the <strong style={{ color: "#7eb8f7" }}>Protocol tab</strong> for your personalised supplement plan.</p>
                  </>
                )}
                <p style={S.disclaimer}>⚠️ Informational only. Not a medical diagnosis. Consult your GP.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "protocol" && (
          <div style={S.page}>
            <h2 style={S.pageTitle}>Your Protocol</h2>
            {!checkerResult ? (
              <div style={S.emptyState}>
                <div style={S.emptyIcon}>🧬</div>
                <p style={S.emptyText}>Run the Symptom Checker first to get your personalised supplement protocol.</p>
                <button style={S.emptyBtn} onClick={() => setActiveTab("checker")}>Go to Checker →</button>
              </div>
            ) : (
              <>
                <p style={S.pageSub}>Based on your symptom profile. Introduce one thing at a time.</p>
                {protocol && protocol.map((step) => (
                  <div key={step.step} style={{ ...S.protocolCard, borderLeftColor: step.color }}>
                    <div style={{ ...S.protocolStep, color: step.color }}>Step {step.step}</div>
                    <div style={S.protocolTitle}>{step.title}</div>
                    {step.items.map((item, i) => (
                      <div key={i} style={S.protocolItem}>• {item}</div>
                    ))}
                  </div>
                ))}
                <div style={S.productPromo}>
                  <div style={S.promoHeader}>
                    <span style={{ fontSize: 28 }}>🧬</span>
                    <div>
                      <div style={S.promoTitle}>NeuroThrive MTHFR Support</div>
                      <div style={S.promoSub}>The foundation of your protocol</div>
                    </div>
                  </div>
                  <div style={S.promoIngredients}>
                    {["P5P B6 1.5mg", "Methylfolate 400mcg", "Methylcobalamin B12 1000mcg"].map(i => (
                      <span key={i} style={S.promoTag}>{i}</span>
                    ))}
                  </div>
                  <a href="https://neurothrive.ie" target="_blank" rel="noopener noreferrer" style={S.buyBtn}>Buy on NeuroThrive.ie →</a>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === "diet" && (
          <div style={S.page}>
            <h2 style={S.pageTitle}>Diet & Lifestyle</h2>
            <p style={S.pageSub}>What you eat has a profound impact on methylation. These guidelines apply to most people with MTHFR and related mutations.</p>
            {dietRules.map((rule) => (
              <div key={rule.category} style={{ ...S.dietCard, borderLeftColor: rule.color }}>
                <div style={S.dietHeader}>
                  <span style={S.dietIcon}>{rule.icon}</span>
                  <span style={{ ...S.dietTitle, color: rule.color }}>{rule.category}</span>
                </div>
                {rule.items.map((item, i) => (
                  <div key={i} style={S.dietItem}>{item}</div>
                ))}
              </div>
            ))}
          </div>
        )}

        {activeTab === "tracker" && (
          <div style={S.page}>
            <h2 style={S.pageTitle}>Symptom Tracker</h2>
            <p style={S.pageSub}>Log how you feel daily. Track your progress as you begin your protocol.</p>
            <div style={S.trackerCard}>
              <div style={S.trackerDate}>Today — {new Date().toLocaleDateString("en-IE")}</div>
              {trackerSymptoms.map((sym, i) => (
                <div key={i} style={S.trackerRow}>
                  <div style={S.trackerLabel}>{sym}</div>
                  <div style={S.trackerButtons}>
                    {[1,2,3,4,5,6,7,8,9,10].map((n) => (
                      <button
                        key={n}
                        style={{ ...S.scoreBtn, ...(todayScores[i] === n ? S.scoreBtnActive : {}) }}
                        onClick={() => gate(() => setTodayScores((p) => ({ ...p, [i]: n })))}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <input
                style={S.noteInput}
                placeholder="Notes for today..."
                value={trackerNote}
                onChange={(e) => setTrackerNote(e.target.value)}
              />
              <button style={S.saveBtn} onClick={saveTracker}>Save Today's Entry</button>
            </div>
            {trackerEntries.length > 0 && (
              <div>
                <div style={S.historyTitle}>Recent Entries</div>
                {trackerEntries.slice(0, 7).map((entry, i) => (
                  <div key={i} style={S.historyCard}>
                    <div style={S.historyDate}>{entry.date}</div>
                    <div style={S.historyScores}>
                      {Object.entries(entry.scores).map(([idx, score]) => (
                        <span key={idx} style={{ ...S.historyScore, color: score >= 7 ? "#22c55e" : score >= 4 ? "#f59e0b" : "#ef4444" }}>{score}</span>
                      ))}
                    </div>
                    {entry.note && <div style={S.historyNote}>{entry.note}</div>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "chat" && (
          <div style={S.chatPage}>
            <h2 style={S.pageTitle}>Methylation Assistant</h2>
            <p style={S.pageSub}>Ask anything about MTHFR, COMT, histamine, CBS, or your protocol.</p>
            <div style={S.chatMessages}>
              {chatMessages.map((msg, i) => (
                <div key={i} style={{ ...S.bubble, ...(msg.role === "user" ? S.bubbleUser : S.bubbleAI) }}>
                  {msg.content}
                </div>
              ))}
              {chatLoading && (
                <div style={{ ...S.bubble, ...S.bubbleAI }}>
                  <span style={{ color: "#5a7fa8", fontStyle: "italic" }}>Thinking...</span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            <div style={S.chatInputRow}>
              <input
                style={S.chatInput}
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ask about methylation..."
              />
              <button style={S.sendBtn} onClick={sendMessage}>Send</button>
            </div>
          </div>
        )}
      </main>

      {showPaywall && (
        <div style={S.overlay} onClick={() => setShowPaywall(false)}>
          <div style={S.modal} onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: 48, textAlign: "center", marginBottom: 16 }}>🧬</div>
            <h2 style={S.modalTitle}>Unlock Full Access</h2>
            <p style={S.modalText}>Get the full Methylation Health toolkit — symptom analysis, personalised protocols, progress tracking, and AI-powered guidance.</p>
            <div style={S.modalFeatures}>
              {["✓ Full symptom analysis across 5 gene variants", "✓ Personalised supplement protocol", "✓ Daily symptom tracker", "✓ AI Methylation Assistant", "✓ Diet & lifestyle guides"].map(f => (
                <div key={f} style={S.modalFeature}>{f}</div>
              ))}
            </div>
            <div style={S.modalPrice}>€4.99 / month</div>
            <button style={S.modalCta} onClick={() => { setSubscribed(true); setShowPaywall(false); }}>Start Subscription</button>
            <button style={S.modalDismiss} onClick={() => setShowPaywall(false)}>Maybe later</button>
          </div>
        </div>
      )}
    </div>
  );
}

const S = {
  app: { fontFamily: "'Georgia', serif", backgroundColor: "#080d18", color: "#e2e8f0", minHeight: "100vh", maxWidth: 480, margin: "0 auto", display: "flex", flexDirection: "column" },
  header: { background: "linear-gradient(135deg,#0a1628,#142244)", borderBottom: "1px solid #1e3a5f", padding: "12px 16px", position: "sticky", top: 0, zIndex: 100 },
  headerInner: { display: "flex", alignItems: "center", justifyContent: "space-between" },
  logo: { display: "flex", alignItems: "center", gap: 10 },
  logoIcon: { fontSize: 26 },
  logoTitle: { fontSize: 15, fontWeight: "bold", color: "#7eb8f7" },
  logoSub: { fontSize: 11, color: "#4a6fa8" },
  subBtn: { background: "linear-gradient(135deg,#1e5fa8,#2563eb)", color: "#fff", border: "none", borderRadius: 20, padding: "7px 14px", fontSize: 12, fontWeight: "bold", cursor: "pointer" },
  badge: { background: "rgba(34,197,94,0.15)", color: "#22c55e", border: "1px solid #22c55e", borderRadius: 20, padding: "5px 12px", fontSize: 12, fontWeight: "bold" },
  nav: { display: "flex", background: "#0a1220", borderBottom: "1px solid #1e3a5f", position: "sticky", top: 55, zIndex: 99, overflowX: "auto" },
  navBtn: { flex: "0 0 auto", minWidth: 60, background: "none", border: "none", color: "#4a6fa8", padding: "8px 6px 7px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, borderBottom: "2px solid transparent" },
  navActive: { color: "#7eb8f7", borderBottom: "2px solid #2563eb" },
  navIcon: { fontSize: 16 },
  navLabel: { fontSize: 9, fontWeight: 600, letterSpacing: 0.3 },
  main: { flex: 1, overflowY: "auto" },
  page: { padding: "18px 14px 100px" },
  chatPage: { padding: "18px 14px 0", display: "flex", flexDirection: "column", height: "calc(100vh - 112px)" },
  pageTitle: { fontSize: 20, fontWeight: "bold", color: "#7eb8f7", margin: "0 0 6px" },
  pageSub: { fontSize: 13, color: "#6a8fb5", marginBottom: 18, lineHeight: 1.5 },
  hero: { background: "linear-gradient(135deg,#0a1628,#0f1e3d)", borderRadius: 16, padding: "26px 18px", marginBottom: 18, border: "1px solid #1e3a5f", position: "relative", overflow: "hidden" },
  heroGlow: { position: "absolute", top: -50, right: -50, width: 180, height: 180, background: "radial-gradient(circle,rgba(37,99,235,0.25) 0%,transparent 70%)", borderRadius: "50%" },
  heroTitle: { fontSize: 20, lineHeight: 1.3, color: "#e2e8f0", marginBottom: 10, marginTop: 0, position: "relative" },
  heroSub: { fontSize: 13, color: "#6a8fb5", lineHeight: 1.6, marginBottom: 18, position: "relative" },
  heroBtns: { display: "flex", gap: 10, position: "relative" },
  heroCta: { background: "linear-gradient(135deg,#1e5fa8,#2563eb)", color: "#fff", border: "none", borderRadius: 10, padding: "11px 20px", fontSize: 14, fontWeight: "bold", cursor: "pointer" },
  heroCtaOutline: { background: "none", border: "1px solid #1e3a5f", color: "#7eb8f7" },
  storyCard: { background: "#0a1220", border: "1px solid #1e3a5f", borderLeft: "4px solid #2563eb", borderRadius: 12, padding: 18, marginBottom: 18 },
  storyHead: { display: "flex", alignItems: "center", gap: 10, marginBottom: 12 },
  storyTitle: { fontSize: 17, fontWeight: "bold", color: "#7eb8f7", margin: 0 },
  storyText: { fontSize: 13, lineHeight: 1.7, color: "#8ab0cc", marginBottom: 10 },
  genesRow: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 },
  geneCard: { background: "#0a1220", border: "1px solid #1e3a5f", borderRadius: 12, padding: "14px 8px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, textAlign: "center" },
  geneIcon: { fontSize: 22 },
  geneLabel: { fontSize: 13, fontWeight: "bold" },
  geneDesc: { fontSize: 10, color: "#4a6fa8", lineHeight: 1.3 },
  topicHeader: { width: "100%", background: "#0a1220", border: "1px solid", borderRadius: 12, padding: "14px 16px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer", textAlign: "left" },
  topicIcon: { fontSize: 20 },
  topicTitle: { flex: 1, fontSize: 15, fontWeight: "bold" },
  chevron: { color: "#4a6fa8", fontSize: 12 },
  topicBody: { background: "#080d18", border: "1px solid #1e3a5f", borderTop: "none", borderRadius: "0 0 12px 12px", padding: "8px 12px 12px" },
  sectionCard: { marginBottom: 6 },
  sectionHeader: { width: "100%", background: "rgba(30,58,95,0.3)", border: "none", borderRadius: 8, padding: "10px 12px", display: "flex", alignItems: "center", cursor: "pointer", textAlign: "left" },
  sectionTitle: { flex: 1, fontSize: 13, color: "#9bb8d4", fontWeight: "bold" },
  chevronSm: { color: "#4a6fa8", fontSize: 10 },
  sectionBody: { padding: "8px 12px 4px" },
  sectionPara: { fontSize: 12, lineHeight: 1.7, color: "#7a9ab8", marginBottom: 8, marginTop: 4 },
  groupLabel: { fontSize: 11, fontWeight: "bold", color: "#4a6fa8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 },
  symptomsWrap: { display: "flex", flexWrap: "wrap", gap: 8 },
  symBtn: { background: "#0a1220", border: "1px solid #1e3a5f", borderRadius: 20, color: "#6a8fb5", padding: "7px 12px", fontSize: 12, cursor: "pointer" },
  symBtnActive: { background: "rgba(37,99,235,0.15)", border: "1px solid #2563eb", color: "#7eb8f7" },
  runBtn: { width: "100%", background: "linear-gradient(135deg,#1e5fa8,#2563eb)", color: "#fff", border: "none", borderRadius: 12, padding: 14, fontSize: 15, fontWeight: "bold", cursor: "pointer", marginBottom: 20 },
  resultBox: { background: "#0a1220", border: "1px solid #1e3a5f", borderRadius: 12, padding: 18, marginBottom: 16 },
  resultTitle: { fontSize: 16, color: "#7eb8f7", margin: "0 0 12px" },
  resultText: { fontSize: 13, lineHeight: 1.6, color: "#8ab0cc", margin: 0 },
  geneBadgeRow: { display: "flex", alignItems: "center", gap: 10, marginBottom: 8 },
  geneBadge: { display: "inline-block", border: "1px solid", borderRadius: 20, padding: "5px 14px", fontSize: 12, fontWeight: "bold" },
  confidenceLabel: { fontSize: 11, color: "#4a6fa8" },
  disclaimer: { fontSize: 11, color: "#4a6fa8", borderTop: "1px solid #1e3a5f", paddingTop: 12, marginTop: 12 },
  emptyState: { textAlign: "center", padding: "40px 20px" },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyText: { fontSize: 14, color: "#6a8fb5", marginBottom: 20 },
  emptyBtn: { background: "linear-gradient(135deg,#1e5fa8,#2563eb)", color: "#fff", border: "none", borderRadius: 10, padding: "12px 24px", fontSize: 14, cursor: "pointer" },
  protocolCard: { background: "#0a1220", border: "1px solid #1e3a5f", borderLeft: "4px solid", borderRadius: 12, padding: 16, marginBottom: 12 },
  protocolStep: { fontSize: 11, fontWeight: "bold", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 },
  protocolTitle: { fontSize: 15, fontWeight: "bold", color: "#c0d8f0", marginBottom: 10 },
  protocolItem: { fontSize: 13, color: "#7a9ab8", lineHeight: 1.6, marginBottom: 4 },
  productPromo: { background: "#0a1220", border: "1px solid #1e3a5f", borderRadius: 16, padding: 18, marginTop: 6 },
  promoHeader: { display: "flex", alignItems: "center", gap: 12, marginBottom: 14 },
  promoTitle: { fontSize: 15, fontWeight: "bold", color: "#7eb8f7" },
  promoSub: { fontSize: 12, color: "#4a6fa8" },
  promoIngredients: { display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 },
  promoTag: { background: "rgba(37,99,235,0.15)", border: "1px solid rgba(37,99,235,0.3)", color: "#7eb8f7", borderRadius: 20, padding: "4px 12px", fontSize: 11 },
  buyBtn: { display: "block", background: "linear-gradient(135deg,#1e5fa8,#2563eb)", color: "#fff", borderRadius: 12, padding: 14, textAlign: "center", textDecoration: "none", fontSize: 14, fontWeight: "bold" },
  dietCard: { background: "#0a1220", border: "1px solid #1e3a5f", borderLeft: "4px solid", borderRadius: 12, padding: 16, marginBottom: 12 },
  dietHeader: { display: "flex", alignItems: "center", gap: 8, marginBottom: 12 },
  dietIcon: { fontSize: 18 },
  dietTitle: { fontSize: 14, fontWeight: "bold" },
  dietItem: { fontSize: 12, color: "#7a9ab8", lineHeight: 1.6, marginBottom: 4 },
  trackerCard: { background: "#0a1220", border: "1px solid #1e3a5f", borderRadius: 12, padding: 16, marginBottom: 18 },
  trackerDate: { fontSize: 13, color: "#7eb8f7", fontWeight: "bold", marginBottom: 14 },
  trackerRow: { marginBottom: 14 },
  trackerLabel: { fontSize: 12, color: "#6a8fb5", marginBottom: 6 },
  trackerButtons: { display: "flex", gap: 4, flexWrap: "wrap" },
  scoreBtn: { background: "#080d18", border: "1px solid #1e3a5f", color: "#4a6fa8", borderRadius: 6, width: 30, height: 30, fontSize: 11, cursor: "pointer" },
  scoreBtnActive: { background: "rgba(37,99,235,0.3)", border: "1px solid #2563eb", color: "#7eb8f7" },
  noteInput: { width: "100%", background: "#080d18", border: "1px solid #1e3a5f", borderRadius: 8, padding: "10px 12px", fontSize: 12, color: "#e2e8f0", marginTop: 12, marginBottom: 12, boxSizing: "border-box", outline: "none" },
  saveBtn: { width: "100%", background: "linear-gradient(135deg,#1e5fa8,#2563eb)", color: "#fff", border: "none", borderRadius: 10, padding: 12, fontSize: 14, fontWeight: "bold", cursor: "pointer" },
  historyTitle: { fontSize: 14, fontWeight: "bold", color: "#7eb8f7", marginBottom: 10 },
  historyCard: { background: "#0a1220", border: "1px solid #1e3a5f", borderRadius: 10, padding: 12, marginBottom: 8 },
  historyDate: { fontSize: 12, color: "#4a6fa8", marginBottom: 6 },
  historyScores: { display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 4 },
  historyScore: { fontSize: 14, fontWeight: "bold" },
  historyNote: { fontSize: 11, color: "#6a8fb5", marginTop: 4 },
  chatMessages: { flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10, paddingBottom: 12 },
  bubble: { maxWidth: "85%", borderRadius: 12, padding: "11px 14px", fontSize: 13, lineHeight: 1.6 },
  bubbleUser: { alignSelf: "flex-end", background: "linear-gradient(135deg,#1e5fa8,#2563eb)", color: "#fff", borderBottomRightRadius: 4 },
  bubbleAI: { alignSelf: "flex-start", background: "#0a1220", border: "1px solid #1e3a5f", color: "#9ab8cc", borderBottomLeftRadius: 4 },
  chatInputRow: { display: "flex", gap: 8, padding: "10px 0 18px", borderTop: "1px solid #1e3a5f" },
  chatInput: { flex: 1, background: "#0a1220", border: "1px solid #1e3a5f", borderRadius: 10, padding: "11px 14px", fontSize: 13, color: "#e2e8f0", outline: "none" },
  sendBtn: { background: "linear-gradient(135deg,#1e5fa8,#2563eb)", color: "#fff", border: "none", borderRadius: 10, padding: "11px 16px", fontSize: 13, fontWeight: "bold", cursor: "pointer" },
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 },
  modal: { background: "#0a1220", border: "1px solid #1e3a5f", borderRadius: 20, padding: "28px 22px", width: "100%", maxWidth: 380, textAlign: "center" },
  modalTitle: { fontSize: 21, fontWeight: "bold", color: "#7eb8f7", margin: "0 0 10px" },
  modalText: { fontSize: 13, color: "#6a8fb5", lineHeight: 1.6, marginBottom: 18 },
  modalFeatures: { background: "rgba(37,99,235,0.08)", borderRadius: 12, padding: 16, marginBottom: 18, textAlign: "left" },
  modalFeature: { fontSize: 13, color: "#9ab8cc", marginBottom: 7 },
  modalPrice: { fontSize: 26, fontWeight: "bold", color: "#7eb8f7", marginBottom: 18 },
  modalCta: { width: "100%", background: "linear-gradient(135deg,#1e5fa8,#2563eb)", color: "#fff", border: "none", borderRadius: 12, padding: 14, fontSize: 15, fontWeight: "bold", cursor: "pointer", marginBottom: 10, display: "block" },
  modalDismiss: { width: "100%", background: "none", border: "none", color: "#4a6fa8", fontSize: 13, cursor: "pointer", padding: 8 },
};
