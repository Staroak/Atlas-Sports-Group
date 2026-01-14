// Atlas Sports Group - Site Constants and Program Data

export const SITE_NAME = "Atlas Sports Group";
export const SITE_TAGLINE = "Building Healthy Habits Through Sport";

// Navigation Links
export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Programs", href: "/programs" },
  { label: "Updates", href: "/updates" },
  { label: "About", href: "/about" },
];

// Program dropdown for footer or other uses
export const PROGRAM_LINKS = [
  { label: "Skyhawks Flag Football", href: "/programs/skyhawks-flag-football" },
  { label: "Home Run Jays Baseball", href: "/programs/home-run-jays" },
  { label: "All Girls Field Hockey", href: "/programs/all-girls-field-hockey" },
  { label: "All Sports Camps", href: "/programs/all-sports-camps" },
];

// Program Data
export interface Program {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  logo: string;
  youthAges: string;
  adultAges?: string;
  features: string[];
  benefits: string[];
  whatYoullLearn: string[];
  schedule: string;
  whatToBring: string[];
}

export const PROGRAMS: Program[] = [
  {
    id: "skyhawks",
    name: "Skyhawks Flag Football",
    slug: "skyhawks-flag-football",
    tagline: "Fast-paced, non-contact fun for all ages",
    description:
      "Our Skyhawks Flag Football program offers age-appropriate training and games in a non-contact format. Players develop skills, learn strategy, and build teamwork in a fun, inclusive environment.",
    logo: "/logos/Skyhawks Football.png",
    youthAges: "Ages 5-18",
    adultAges: "Adult Co-Ed",
    features: ["Non-contact flag format", "Age-grouped teams", "Skill progression", "Game play"],
    benefits: [
      "Build speed and agility",
      "Learn strategic thinking",
      "Develop teamwork skills",
      "Safe, inclusive environment",
      "Certified coaches",
    ],
    whatYoullLearn: [
      "Proper throwing and catching techniques",
      "Route running and defensive positioning",
      "Game rules and flag football strategy",
      "Teamwork and sportsmanship",
    ],
    schedule: "Weekly sessions, Spring (Apr-Jun), Summer (Jul-Aug), Fall (Sept-Dec)",
    whatToBring: ["Athletic clothing", "Running shoes", "Water bottle", "Mouthguard (optional)"],
  },
  {
    id: "home-run-jays",
    name: "Home Run Jays Baseball & Slow Pitch",
    slug: "home-run-jays",
    tagline: "From fundamentals to game day confidence",
    description:
      "Home Run Jays teaches baseball fundamentals through engaging drills and game play. Our program builds confidence at the plate, in the field, and on the bases for players of all skill levels.",
    logo: "/logos/Jays home Run.png",
    youthAges: "Ages 4-18",
    adultAges: "Adult Co-Ed Slow Pitch",
    features: ["Fundamentals training", "Game play", "Confidence-building", "Recreational focus"],
    benefits: [
      "Master hitting and fielding basics",
      "Build hand-eye coordination",
      "Learn base running strategy",
      "Supportive, fun atmosphere",
      "Quality coaching",
    ],
    whatYoullLearn: [
      "Hitting mechanics and batting stance",
      "Fielding ground balls and fly balls",
      "Throwing accuracy and arm strength",
      "Base running and game awareness",
    ],
    schedule: "Weekly sessions, Spring (Apr-Jun), Summer (Jul-Aug), Fall (Sept-Dec)",
    whatToBring: ["Athletic clothing", "Baseball glove", "Cleats or running shoes", "Water bottle"],
  },
  {
    id: "all-girls-field-hockey",
    name: "All Girls Field Hockey",
    slug: "all-girls-field-hockey",
    tagline: "Empowering girls through sport",
    description:
      "Our All Girls Field Hockey program provides a supportive, girl-focused environment to learn stick skills, teamwork, and fitness. From grassroots introduction to skill development, we create a space for girls to thrive.",
    logo: "/logos/All Girls Field Hockey.png",
    youthAges: "Ages 4-18",
    adultAges: "Adult Recreational League",
    features: [
      "Girls-only environment",
      "Grassroots introduction",
      "Skill development",
      "Fitness focus",
    ],
    benefits: [
      "Build confidence and leadership",
      "Develop stick handling skills",
      "Improve fitness and coordination",
      "Supportive community",
      "Expert coaching",
    ],
    whatYoullLearn: [
      "Stick handling and ball control",
      "Passing and receiving techniques",
      "Defensive and offensive positioning",
      "Game rules and teamwork strategies",
    ],
    schedule: "Weekly sessions, Spring (Apr-Jun), Fall (Sept-Dec)",
    whatToBring: ["Athletic clothing", "Field hockey stick (can be provided)", "Shin guards", "Mouthguard", "Water bottle"],
  },
  {
    id: "all-sports-camps",
    name: "All Sports Spring & Summer Camps",
    slug: "all-sports-camps",
    tagline: "Multi-sport fun, every single week",
    description:
      "Our All Sports Camps offer weekly multi-sport experiences perfect for school breaks and summer vacation. Kids try different sports, build athletic skills, and make new friends in a dynamic, engaging environment.",
    logo: "/logos/Tri City Spring summer camp.png",
    youthAges: "Ages 5-12",
    features: [
      "Weekly registration",
      "Multi-sport rotation",
      "Spring break and summer options",
      "No long-term commitment",
    ],
    benefits: [
      "Explore multiple sports",
      "Build overall athleticism",
      "Make new friends",
      "Flexible scheduling",
      "Fun, energetic environment",
    ],
    whatYoullLearn: [
      "Fundamentals of flag football, baseball, field hockey, and more",
      "General athletic skills (running, throwing, catching)",
      "Teamwork and cooperation",
      "Sportsmanship and fair play",
    ],
    schedule: "Spring Break: Two weeks in March | Summer: 8 weeks (Jul-Aug), weekly registration",
    whatToBring: ["Athletic clothing", "Running shoes", "Water bottle", "Sunscreen", "Snacks"],
  },
];

// Values
export interface Value {
  title: string;
  description: string;
  icon: string; // Will use emojis or simple text for MVP
}

export const VALUES: Value[] = [
  {
    title: "Fun First",
    description: "Sport should be joyful, exciting, and age-appropriate for everyone",
    icon: "🎉",
  },
  {
    title: "Inclusive & Welcoming",
    description: "All skill levels welcome with clear behavior standards",
    icon: "🤝",
  },
  {
    title: "Safety & Quality",
    description: "Certified coaches following best practices and safety standards",
    icon: "🛡️",
  },
  {
    title: "Reliable Operations",
    description: "Organized schedules and consistent communication you can count on",
    icon: "✓",
  },
  {
    title: "Community Impact",
    description: "Building healthy habits and social connections beyond the field",
    icon: "❤️",
  },
];

// Policies
export const POLICIES = [
  {
    title: "Refund & Credit Policy",
    content: `
### Cancellation Deadlines
- **Full Refund**: Cancellations made 14+ days before program start date
- **50% Refund**: Cancellations made 7-13 days before program start date
- **No Refund**: Cancellations made less than 7 days before program start date

### Credits
- Program credits may be issued in lieu of refunds for cancellations within 7 days of start date
- Credits are valid for one calendar year from issue date
- Credits are non-transferable

### Weather Cancellations
- If Atlas Sports Group cancels a session due to weather, makeup sessions will be scheduled or prorated refunds issued

### Medical Exceptions
- Medical withdrawals with doctor's note will be evaluated on a case-by-case basis
    `,
  },
  {
    title: "Code of Conduct",
    content: `
### Player Expectations
- Treat coaches, teammates, and opponents with respect
- Follow instructions from coaches and program staff
- Arrive on time and ready to participate
- Use appropriate language and behavior
- Demonstrate good sportsmanship at all times

### Parent & Spectator Behavior
- Support all players positively and encourage fair play
- Respect coaches' decisions and program policies
- Do not approach referees or officials during play
- Model positive behavior for young athletes
- Keep sidelines clear and supervise younger siblings

### Consequences for Violations
- First violation: Verbal warning
- Second violation: Written warning and parent meeting
- Third violation: Suspension from program
- Serious violations may result in immediate removal without refund
    `,
  },
  {
    title: "Safety Standards",
    content: `
### Coach Certifications
- All coaches complete background checks
- Coaches trained in age-appropriate instruction
- First aid and emergency response training required
- Ongoing professional development

### Emergency Procedures
- Emergency action plans for each facility
- First aid kits available at all sessions
- Emergency contact information collected during registration
- Staff trained in incident response protocols

### Equipment Safety
- Regular equipment inspection and maintenance
- Age-appropriate equipment provided
- Players required to wear proper footwear
- Protective gear (mouthguards, shin guards) recommended for specific sports

### Facility Standards
- Programs held at inspected, approved facilities
- Weather monitoring and lightning safety protocols
- Clear communication of cancellations or changes
    `,
  },
  {
    title: "Insurance & Liability",
    content: `
### Insurance Coverage
- Atlas Sports Group maintains general liability insurance
- Coverage includes program operations and facilities
- Does not cover individual participant medical expenses

### Participant Responsibilities
- Participants responsible for their own medical insurance
- Parents/guardians must disclose relevant medical conditions during registration
- Assumption of risk acknowledged during registration process

### Waivers
- Liability waiver must be signed during registration
- Waivers cover participation in all Atlas Sports Group programs
- Medical release allows staff to seek emergency treatment if needed

### Claims & Incidents
- All incidents must be reported to program staff immediately
- Incident reports filed for all injuries or safety concerns
- Contact info@atlassportsgroup.com for claims or questions
    `,
  },
];

// Registration Status
export const REGISTRATION_STATUS = {
  isOpen: false,
  openDate: "Late January 2026",
  message: "Registration will open late January 2026. Check back soon!",
};

// Contact Information (for future use)
export const CONTACT_INFO = {
  email: "info@atlassportsgroup.com",
  phone: "",
  address: "",
};
