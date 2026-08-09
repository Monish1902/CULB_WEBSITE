/* ==========================================================================
   Kreatorz Robotics Club - Centralized Data Store & Storage Manager
   ========================================================================== */

const STORAGE_KEY = 'kreatorz_website_data_v2';

const DEFAULT_DATA = {
  home: {
    heroTitle: "BUILDING THE FUTURE OF AUTONOMOUS SYSTEMS",
    heroSubtitle: "MVGR College of Engineering's premier robotics hub. Engineering battle bots, agricultural drones, and high-speed autonomous rovers.",
    primaryCtaText: "EXPLORE PROJECTS",
    secondaryCtaText: "GET IN TOUCH",
    stats: [
      { number: "15+", label: "ACTIVE PROJECTS" },
      { number: "40+", label: "CLUB MEMBERS" },
      { number: "12+", label: "NATIONAL AWARDS" },
      { number: "100%", label: "STUDENT BUILT" }
    ],
    missionTitle: "ENGINEERING WITHOUT BOUNDARIES",
    missionDescription: "At Kreatorz, we bridge theoretical engineering with physical hardware realities. From machining aircraft-grade titanium for combat spinners to programming deep neural networks for autonomous navigation, our student engineers build real-world systems that compete and win at national platforms."
  },

  about: {
    heroTitle: "ABOUT KREATORZ ROBOTICS",
    heroSubtitle: "Founded at MVGR College of Engineering, Kreatorz is a multidisciplinary hardware and AI innovation laboratory.",
    visionTitle: "OUR CORE MISSION & VISION",
    visionText: "To cultivate world-class robotics talent by providing open access to industrial tools, advanced sensors, and high-stakes competitive environments. We empower students to design, simulate, prototype, and deploy cutting-edge autonomous technology.",
    values: [
      { title: "HARDWARE REALISM", desc: "We build physical systems that operate under extreme real-world stresses." },
      { title: "CROSS-DISCIPLINARY COLLABORATION", desc: "Mechanical, Electronics, and Computer Science students work side-by-side." },
      { title: "NATIONAL EXCELLENCE", desc: "Competing against the top IITs, NITs, and premier institutions in India." }
    ],
    milestones: [
      { year: "2021", title: "CLUB FOUNDATION", desc: "Inaugurated at MVGR CE by Mechanical and ECE department faculty." },
      { year: "2022", title: "SMART INDIA HACKATHON WIN", desc: "Secured 1st Place nationally in agricultural drone automation." },
      { year: "2023", title: "COMBAT BOT ARENA DEBUT", desc: "Built our first 15kg Hardox vertical disc spinner for Robo Rumble." },
      { year: "2024", title: "EPIC BITS PILANI SWEEP", desc: "Claimed multiple podiums across FPV racing and Micromouse maze solving." },
      { year: "2025", title: "USV AQUA CATAMARAN LAUNCH", desc: "Deployed autonomous water-quality monitoring USV in regional reservoirs." }
    ]
  },

  projects: [
    {
      id: "drone",
      title: "AUTONOMOUS SPRAYING DRONE",
      category: "aerial",
      categoryLabel: "AERIAL ROBOTICS",
      summary: "A heavy-lift precision quadcopter engineered for agricultural mapping and automated fertilizer dispersal across rural farmlands.",
      image: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=800&q=80",
      specs: [
        { label: "MAX PAYLOAD", value: "5.5 KG" },
        { label: "FLIGHT TIME", value: "22 MINS" },
        { label: "BATTERY SPECS", value: "6S 22,000mAh" },
        { label: "COMMUNICATION", value: "900MHz RF Telemetry" }
      ],
      detailLink: "projects/drone.html",
      badgeColor: "#2D5BFF"
    },
    {
      id: "robo-rumble",
      title: "15KG ROBO RUMBLE BOT",
      category: "combat",
      categoryLabel: "COMBAT ROBOTICS",
      summary: "A brutal vertical disc spinner engineered to survive 40G floor impacts and deliver destructive kinetic energy to opposing armor plates.",
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80",
      specs: [
        { label: "WEIGHT CLASS", value: "14.8 KG" },
        { label: "TOP SPEED", value: "18 KM/H" },
        { label: "DRIVE MOTORS", value: "Dual Planetary Gear" },
        { label: "BATTERY", value: "4S 3300mAh LiPo" }
      ],
      detailLink: "projects/robo-rumble.html",
      badgeColor: "#FF2D5B"
    },
    {
      id: "maze-solver",
      title: "MICROMOUSE MAZE SOLVER",
      category: "autonomous",
      categoryLabel: "ALGORITHMS DIVISION",
      summary: "A lightweight, ultra-nimble autonomous robot designed to map 16x16 mazes on its exploration pass and sprint optimal trajectories at 3.2m/s.",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
      specs: [
        { label: "TOTAL WEIGHT", value: "115 GRAMS" },
        { label: "MAX SPEED", value: "3.2 M/S" },
        { label: "MICROCONTROLLER", value: "STM32F411" },
        { label: "ALGORITHM", value: "Flood-Fill v2" }
      ],
      detailLink: "projects/maze-solver.html",
      badgeColor: "#10B981"
    },
    {
      id: "fpv-drone",
      title: "FPV RACING QUADCOPTER",
      category: "aerial",
      categoryLabel: "AERIAL RACING",
      summary: "A custom 5-inch 6S carbon fiber racing drone capable of 0-100km/h acceleration in under 1.2 seconds, built for obstacle slalom gates.",
      image: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80",
      specs: [
        { label: "TOP SPEED", value: "140 KM/H" },
        { label: "ALL-UP WEIGHT", value: "580 GRAMS" },
        { label: "FIRMWARE", value: "Betaflight 4.4" },
        { label: "LATENCY", value: "<14ms Analog VTX" }
      ],
      detailLink: "projects/fpv-drone.html",
      badgeColor: "#2D5BFF"
    },
    {
      id: "robo-soccer",
      title: "OMNIDIRECTIONAL ROBO SOCCER BOT",
      category: "autonomous",
      categoryLabel: "AUTOMATION DIVISION",
      summary: "An omnidirectional, high-speed sports robot equipped with custom solenoid/pneumatic kicking pistons and active ball-dribbler rollers.",
      image: "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=800&q=80",
      specs: [
        { label: "WEIGHT", value: "4.2 KG" },
        { label: "DRIFT LATENCY", value: "<5 MS" },
        { label: "CONTROLLER", value: "Custom ESP32 PCB" },
        { label: "PNEUMATICS", value: "6.5 Bar Strike" }
      ],
      detailLink: "projects/robo-soccer.html",
      badgeColor: "#8B5CF6"
    },
    {
      id: "line-following",
      title: "HIGH-SPEED PID LINE-FOLLOWING BOT",
      category: "autonomous",
      categoryLabel: "SPEED TRACK DIVISION",
      summary: "A precision speedster leveraging differential motor feedback and 8-channel QTR sensors to trace complex tight-radius tracks.",
      image: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=800&q=80",
      specs: [
        { label: "MAX SPEED", value: "2.6 M/S" },
        { label: "MOTORS", value: "1000RPM N20 Gear" },
        { label: "MICROCONTROLLER", value: "Arduino / ATmega" },
        { label: "ARRAY", value: "8-Ch QTR Reflectance" }
      ],
      detailLink: "projects/line-following.html",
      badgeColor: "#EAB308"
    },
    {
      id: "aqua-boat",
      title: "AQUA BOAT CATAMARAN USV",
      category: "marine",
      categoryLabel: "MARINE ROBOTICS",
      summary: "An autonomous Unmanned Surface Vessel (USV) catamaran engineered for real-time water quality sampling, pH monitoring, and lake floor bathymetry.",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
      specs: [
        { label: "RANGE", value: "2.5 KM RF" },
        { label: "RUNTIME", value: "45 MINS" },
        { label: "THRUSTERS", value: "Dual Jet Water" },
        { label: "TELEMETRY", value: "pH / TDS Probes" }
      ],
      detailLink: "projects/aqua-boat.html",
      badgeColor: "#06B6D4"
    }
  ],

  team: [
    {
      id: "t1",
      name: "MANISH SALAPU",
      role: "CLUB PRESIDENT & TEAM LEAD",
      division: "Leadership / Mechanical",
      year: "4th Year ME",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
      bio: "Leads club operations, CAD design for combat bots, and national event sponsorships."
    },
    {
      id: "t2",
      name: "ANANYA VARMA",
      role: "EMBEDDED SYSTEMS LEAD",
      division: "Electronics & Firmware",
      year: "4th Year ECE",
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80",
      bio: "Specializes in STM32 microcontrollers, custom PCB layouts, and motor controller firmware."
    },
    {
      id: "t3",
      name: "KIRAN KUMAR",
      role: "AUTONOMOUS ALGORITHMS LEAD",
      division: "Software & ROS2",
      year: "3rd Year CSE",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
      bio: "Focuses on ROS2 navigation stack, SLAM mapping, and real-time Flood-Fill path algorithms."
    },
    {
      id: "t4",
      name: "PRIYA SHARMA",
      role: "COMBAT BOT MECHANICS LEAD",
      division: "Mechanical & CNC",
      year: "3rd Year ME",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80",
      bio: "Machinist experienced in FEA stress testing, Hardox welding, and high-impact kinetic drive systems."
    },
    {
      id: "t5",
      name: "SURAJ NAIDU",
      role: "AERIAL ROBOTICS PILOT",
      division: "Drones & Telemetry",
      year: "3rd Year EEE",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
      bio: "Certified FPV pilot and flight controller tuner for agricultural quadcopters and slalom racers."
    },
    {
      id: "t6",
      name: "DEEPIKA RAO",
      role: "OPERATIONS & EVENTS HEAD",
      division: "Management",
      year: "3rd Year CSE",
      image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80",
      bio: "Coordinates lab logistics, hackathon submissions, social dispatches, and new member onboarding."
    }
  ],

  achievements: [
    {
      id: "a1",
      title: "1ST PLACE - SMART INDIA HACKATHON",
      competition: "National SIH Hardware Edition",
      year: "2022",
      rank: "GOLD MEDAL",
      badgeColor: "#FFD700",
      description: "Awarded ₹1,000,000 cash prize for developing an AI-assisted autonomous crop spraying drone with RTK GPS precision."
    },
    {
      id: "a2",
      title: "RUNNERS UP - BITS PILANI ROBO RUMBLE",
      competition: "BITS AP Atmos 2024",
      year: "2024",
      rank: "2ND PLACE",
      badgeColor: "#C0C0C0",
      description: "15kg vertical spinner bot survived 4 elimination rounds, taking home the 2nd place trophy against 32 national collegiate teams."
    },
    {
      id: "a3",
      title: "BEST INNOVATION AWARD - e-YANTRA",
      competition: "IIT Bombay e-Yantra Robotics",
      year: "2023",
      rank: "SPECIAL MERIT",
      badgeColor: "#2D5BFF",
      description: "Recognized by IIT Bombay professors for novel sensor fusion in autonomous Micromouse maze solving algorithms."
    },
    {
      id: "a4",
      title: "FASTEST LAP CHAMPION - FPV DRONE LEAGUE",
      competition: "Vignan Robotics Fest",
      year: "2024",
      rank: "1ST PLACE",
      badgeColor: "#FF2D5B",
      description: "Clocked a record 18.2-second track completion on an indoor obstacle course with high-speed 6S quadcopter."
    }
  ],

  blogs: [
    {
      id: "b1",
      title: "HOW WE MACHINED HARDOX 450 FOR OUR COMBAT SPINNER",
      author: "Priya Sharma",
      date: "August 2, 2026",
      category: "mechanical",
      categoryLabel: "MECHANICAL",
      snippet: "Hardox 450 steel is notoriously difficult to cut and tap. Here is our step-by-step experience CNC milling our vertical weapon disc.",
      content: `
        <p>Hardox 450 is a high-hardness wear-resistant steel designed to withstand extreme impact forces. When building our 15kg Robo Rumble combat bot, standard mild steel or 6061 aluminum simply wouldn't cut it for the high-RPM vertical spinning disc.</p>
        <h3>1. Selection and Waterjet Cutting</h3>
        <p>We sourced 8mm Hardox 450 plates. Because plasma cutting generates localized heat that alters the metallurgical temper of the outer perimeter, we opted for abrasive waterjet machining. This kept the heat-affected zone (HAZ) at zero, preserving the material's yield strength of ~1200 MPa.</p>
        <h3>2. Tapping and Mounting Hubs</h3>
        <p>Tapping threads directly into Hardox 450 requires cobalt or carbide drills running at low RPMs with heavy cutting fluid. We designed a central 7075-T6 aluminum locking hub interface secured with high-grade 12.9 hardened steel bolts.</p>
        <p>The resulting weapon weighs 3.2 kg, spins at 9,500 RPM, and delivers over 2.4 Kilojoules of rotational kinetic energy upon impact!</p>
      `,
      image: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "b2",
      title: "DEMYSTIFYING FLOOD-FILL ALGORITHMS FOR MICROMOUSE",
      author: "Kiran Kumar",
      date: "July 20, 2026",
      category: "software",
      categoryLabel: "SOFTWARE & AI",
      snippet: "An inside look at how our Micromouse calculates the shortest path through a 16x16 maze matrix while sprinting at over 3 meters per second.",
      content: `
        <p>Micromouse competitions challenge small autonomous robots to solve an unknown 16x16 grid maze in the shortest time possible. The contest is split into two phases: Exploration Pass and Speed Run.</p>
        <h3>The Flood-Fill Math</h3>
        <p>Flood-Fill works by treating the center goal cells (4 cells in the middle) as distance 0. Surrounding cells increase in distance count incrementally. As the robot moves, IR proximity sensors detect walls and update the maze map array stored in STM32 SRAM.</p>
        <p>Our modified Flood-Fill continuously updates neighbor weights, factoring in turn penalties and straightaway acceleration potentials. On the speed run, the robot converts step-by-step cell moves into smooth diagonal Bezier curves!</p>
      `,
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "b3",
      title: "CUSTOM PCB DESIGN FOR ESP32 ROBO SOCCER BOTS",
      author: "Ananya Varma",
      date: "June 14, 2026",
      category: "electronics",
      categoryLabel: "ELECTRONICS",
      snippet: "Breadboards and jumper wires break under arena vibrations. Here is why designing a custom 2-layer PCB was a game changer for our sports bots.",
      content: `
        <p>In our early iterations of the Omnidirectional Robo Soccer Bot, wire disconnects were our worst enemy. During sharp omni-wheel turns or pneumatic kicking kicks, jumper wires loose contact, resetting the ESP32 microcontroller.</p>
        <h3>Designing in EasyEDA / KiCAD</h3>
        <p>We designed a dedicated 2-layer PCB incorporating integrated MOSFET gates for high-current pneumatic solenoid actuation, onboard optocoupler isolation, and direct headers for motor drivers.</p>
        <p>The custom PCB reduced wiring harness weight by 60% and completely eliminated unexpected system brownouts during match play.</p>
      `,
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80"
    }
  ],

  contact: {
    email: "kreatorz@mvgrce.edu.in",
    phone: "+91 98765 43210",
    hours: "Monday – Friday: 4:00 PM – 8:00 PM",
    address: "Department of Mechanical Engineering, Block B - Lab 104, MVGR College of Engineering, Vizianagaram, AP 535005."
  },

  siteInfo: {
    siteName: "Kreatorz",
    siteTagline: "ROBOTICS CLUB • MVGR CE",
    siteIcon: "K",
    siteDescription: "Official website of Kreatorz, the elite robotics and automation club at MVGR College of Engineering."
  },

  siteImages: {
    heroBg: "/src/assets/images/kreatorz_hero_robotics_1786125384469.jpg",
    heroSlides: [
      "/src/assets/images/kreatorz_hero_robotics_1786125384469.jpg",
      "/src/assets/images/kreatorz_lab_team_1786125402703.jpg",
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=1200&q=80"
    ],
    labImg: "/src/assets/images/kreatorz_lab_team_1786125402703.jpg",
    aboutOriginImg: "/src/assets/images/kreatorz_hero_robotics_1786125384469.jpg",
    clubLogo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80"
  },

  messages: []
};

let _memoryStore = null;

// Global Store Helper Object
window.KreatorzStore = {
  getStore: function() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        if (_memoryStore) return _memoryStore;
        this.saveStore(DEFAULT_DATA);
        return DEFAULT_DATA;
      }
      _memoryStore = JSON.parse(data);
      return _memoryStore;
    } catch (e) {
      console.error("Error reading localStorage, returning default or memory store", e);
      return _memoryStore || DEFAULT_DATA;
    }
  },

  saveStore: function(data) {
    _memoryStore = data;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      window.dispatchEvent(new CustomEvent('kreatorzDataUpdated'));
    } catch (e) {
      console.error("Error saving to localStorage", e);
      if (e.name === 'QuotaExceededError' || e.code === 22) {
        alert("⚠️ Local Storage limit reached! The change has been applied for this session. For permanent storage of large images, consider compressing or providing an image URL.");
      }
      window.dispatchEvent(new CustomEvent('kreatorzDataUpdated'));
    }
  },

  resetDefaults: function() {
    this.saveStore(DEFAULT_DATA);
    return DEFAULT_DATA;
  },

  // Site Info / Branding Getters & Setters
  getSiteInfo: function() {
    return this.getStore().siteInfo || DEFAULT_DATA.siteInfo;
  },
  updateSiteInfo: function(newInfo) {
    const store = this.getStore();
    store.siteInfo = { ...(store.siteInfo || DEFAULT_DATA.siteInfo), ...newInfo };
    this.saveStore(store);
  },

  // Home Getters & Setters
  getHome: function() {
    return this.getStore().home || DEFAULT_DATA.home;
  },
  updateHome: function(newHome) {
    const store = this.getStore();
    store.home = { ...store.home, ...newHome };
    this.saveStore(store);
  },

  // About Getters & Setters
  getAbout: function() {
    return this.getStore().about || DEFAULT_DATA.about;
  },
  updateAbout: function(newAbout) {
    const store = this.getStore();
    store.about = { ...store.about, ...newAbout };
    this.saveStore(store);
  },

  // Contact Getters & Setters
  getContact: function() {
    return this.getStore().contact || DEFAULT_DATA.contact;
  },
  updateContact: function(newContact) {
    const store = this.getStore();
    store.contact = { ...store.contact, ...newContact };
    this.saveStore(store);
  },

  // Site Images Getters & Setters
  getSiteImages: function() {
    return this.getStore().siteImages || DEFAULT_DATA.siteImages;
  },
  getHeroSlides: function() {
    const store = this.getStore();
    if (store.siteImages && Array.isArray(store.siteImages.heroSlides) && store.siteImages.heroSlides.length > 0) {
      return [...store.siteImages.heroSlides];
    }
    return [...DEFAULT_DATA.siteImages.heroSlides];
  },
  updateHeroSlides: function(slides) {
    const store = this.getStore();
    if (!store.siteImages) store.siteImages = {};
    store.siteImages.heroSlides = [...slides];
    if (slides.length > 0) {
      store.siteImages.heroBg = slides[0];
    }
    this.saveStore(store);
  },
  updateSiteImages: function(newImages) {
    const store = this.getStore();
    store.siteImages = { ...store.siteImages, ...newImages };
    this.saveStore(store);
  },

  // Projects CRUD
  getProjects: function() {
    const store = this.getStore();
    if (!store.projects) {
      store.projects = [...DEFAULT_DATA.projects];
      this.saveStore(store);
    }
    return store.projects;
  },
  addProject: function(item) {
    const store = this.getStore();
    if (!store.projects) store.projects = [...DEFAULT_DATA.projects];
    if (!item.id) item.id = 'proj-' + Date.now();
    store.projects.push(item);
    this.saveStore(store);
    return item;
  },
  updateProject: function(id, updatedItem) {
    const store = this.getStore();
    if (!store.projects) store.projects = [...DEFAULT_DATA.projects];
    const idx = store.projects.findIndex(p => String(p.id) === String(id));
    if (idx !== -1) {
      store.projects[idx] = { ...store.projects[idx], ...updatedItem };
      this.saveStore(store);
    }
  },
  deleteProject: function(id) {
    const store = this.getStore();
    if (!store.projects) store.projects = [...DEFAULT_DATA.projects];
    store.projects = store.projects.filter(p => String(p.id) !== String(id));
    this.saveStore(store);
  },

  // Team CRUD
  getTeam: function() {
    const store = this.getStore();
    if (!store.team) {
      store.team = [...DEFAULT_DATA.team];
      this.saveStore(store);
    }
    return store.team;
  },
  addTeamMember: function(item) {
    const store = this.getStore();
    if (!store.team) store.team = [...DEFAULT_DATA.team];
    if (!item.id) item.id = 'team-' + Date.now();
    store.team.push(item);
    this.saveStore(store);
    return item;
  },
  updateTeamMember: function(id, updatedItem) {
    const store = this.getStore();
    if (!store.team) store.team = [...DEFAULT_DATA.team];
    const idx = store.team.findIndex(t => String(t.id) === String(id));
    if (idx !== -1) {
      store.team[idx] = { ...store.team[idx], ...updatedItem };
      this.saveStore(store);
    }
  },
  deleteTeamMember: function(id) {
    const store = this.getStore();
    if (!store.team) store.team = [...DEFAULT_DATA.team];
    store.team = store.team.filter(t => String(t.id) !== String(id));
    this.saveStore(store);
  },

  // Achievements CRUD
  getAchievements: function() {
    const store = this.getStore();
    if (!store.achievements) {
      store.achievements = [...DEFAULT_DATA.achievements];
      this.saveStore(store);
    }
    return store.achievements;
  },
  addAchievement: function(item) {
    const store = this.getStore();
    if (!store.achievements) store.achievements = [...DEFAULT_DATA.achievements];
    if (!item.id) item.id = 'ach-' + Date.now();
    store.achievements.push(item);
    this.saveStore(store);
    return item;
  },
  updateAchievement: function(id, updatedItem) {
    const store = this.getStore();
    if (!store.achievements) store.achievements = [...DEFAULT_DATA.achievements];
    const idx = store.achievements.findIndex(a => String(a.id) === String(id));
    if (idx !== -1) {
      store.achievements[idx] = { ...store.achievements[idx], ...updatedItem };
      this.saveStore(store);
    }
  },
  deleteAchievement: function(id) {
    const store = this.getStore();
    if (!store.achievements) store.achievements = [...DEFAULT_DATA.achievements];
    store.achievements = store.achievements.filter(a => String(a.id) !== String(id));
    this.saveStore(store);
  },

  // Blogs CRUD
  getBlogs: function() {
    const store = this.getStore();
    if (!store.blogs) {
      store.blogs = [...DEFAULT_DATA.blogs];
      this.saveStore(store);
    }
    return store.blogs;
  },
  addBlog: function(item) {
    const store = this.getStore();
    if (!store.blogs) store.blogs = [...DEFAULT_DATA.blogs];
    if (!item.id) item.id = 'blog-' + Date.now();
    store.blogs.push(item);
    this.saveStore(store);
    return item;
  },
  updateBlog: function(id, updatedItem) {
    const store = this.getStore();
    if (!store.blogs) store.blogs = [...DEFAULT_DATA.blogs];
    const idx = store.blogs.findIndex(b => String(b.id) === String(id));
    if (idx !== -1) {
      store.blogs[idx] = { ...store.blogs[idx], ...updatedItem };
      this.saveStore(store);
    }
  },
  deleteBlog: function(id) {
    const store = this.getStore();
    if (!store.blogs) store.blogs = [...DEFAULT_DATA.blogs];
    store.blogs = store.blogs.filter(b => String(b.id) !== String(id));
    this.saveStore(store);
  },

  // Messages Log
  getMessages: function() {
    return this.getStore().messages || [];
  },
  addMessage: function(msg) {
    const store = this.getStore();
    if (!store.messages) store.messages = [];
    msg.id = 'msg-' + Date.now();
    msg.date = new Date().toLocaleString();
    store.messages.unshift(msg);
    this.saveStore(store);
  },
  deleteMessage: function(id) {
    const store = this.getStore();
    if (!store.messages) store.messages = [];
    store.messages = store.messages.filter(m => String(m.id) !== String(id));
    this.saveStore(store);
  }
};

// Initialize store immediately if empty
window.KreatorzStore.getStore();
