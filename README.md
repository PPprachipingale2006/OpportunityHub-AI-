# OpportunityHub AI — Student Opportunity Discovery Platform

> **"Discover. Prepare. Apply."**  
> One single platform for internships, hackathons, scholarships, courses, certifications, competitions, and workshops personalized to your education, skills, and interests.

---

## 1. Problem Statement

Students frequently miss valuable career and learning opportunities—such as high-impact internships, nationwide hackathons, merit scholarships, professional certifications, case competitions, and specialized workshops—because announcements are scattered across hundreds of disparate company job boards, LinkedIn feeds, Discord channels, WhatsApp groups, and university bulletin boards.

**OpportunityHub AI** solves this fragmented experience by providing a unified, student-first discovery engine that intelligently matches opportunities to a student’s technical profile, calculates real-time compatibility scores, identifies skill gaps, and streamlines application tracking.

---

## 2. Key Features

- **Personalized 100-Point Recommendation Engine**:
  - Transparent rule-based algorithm evaluating skill compatibility (40 pts), career interests (30 pts), category preference (20 pts), and geographic/remote alignment (10 pts).
  - Displays dynamic match percentages (e.g., `96% Match`).
  - Generates clear, human-readable explanations (*"Why this matches you"*).
- **Skill Gap & Preparation Advisor**:
  - Highlights missing skills required by an opportunity.
  - Suggests concrete preparation actions (e.g., *"Complete an introductory Machine Learning course"* or *"Practice multi-table SQL JOIN queries"*).
- **Comprehensive Opportunity Explorer**:
  - Real-time search across titles, organizations, required skills, tags, and categories.
  - Granular filters: Category (7 types), Location (Remote, Pune, Bengaluru, etc.), Skills (15+ stacks), and Deadlines (`Closing Soon ≤ 7 days`, `This Week`, `This Month`).
  - **Expired Opportunities Filter Toggle**: Automatically hides past deadlines from recommendations while providing a toggle switch for archiving.
- **Student Opportunity Pipeline & Bookmarks**:
  - 1-click bookmarking with instant feedback.
  - Application status tracking: `Saved`, `In Progress`, `Applied`, `Interviewing`, and `Completed`.
  - Direct external link buttons opening official portals in secure new tabs.
- **Student Profile Management**:
  - Profile setup capturing college, degree, year of study, technical skills, interests, and preferred locations.
  - Real-time profile completion progress meter.
- **Visual Analytics Dashboard**:
  - Dynamic time-based greeting (*"Good morning, Prachi 👋"*).
  - High-compatibility match counter (`"12 opportunities match your profile"`).
  - Urgent **Closing Soon** carousel.
  - **Interactive Application Pipeline & Status Analytics (Recharts)**:
    - Dedicated visual analytics dashboard displaying real-time distribution across **Applied**, **Interviewing**, and **Offered** pipeline stages.
    - **Dual Interactive Chart Views**:
      - **Donut Chart**: Responsive SVG donut chart with custom tooltip tooltips, percentage shares, and stage breakdown.
      - **Funnel Stage Progression Bar Chart**: Step-by-step conversion funnel visualizing pipeline volume from `Saved` through `In Progress`, `Applied`, `Interviewing`, to `Offered`.
    - **Key Conversion Metrics**: Live tracking of Applications Sent, Active Interview Loops, Offers & Selections Received, and overall Interview Conversion Rate.
    - Quick-access pipeline feed highlighting active opportunities with direct modal links.
  - **Interactive Opportunity & Interview Calendar View**:
    - Monthly grid and chronological agenda views tracking key dates from saved opportunities and custom student schedules.
    - **Date, Day & Timing Customization**:
      - Add and edit events with specific dates, day of the week, start times, and end times (e.g. `10:00 AM - 11:15 AM`).
      - Direct day-cell click trigger (`+`) to immediately schedule an interview, mock session, or deadline for that specific day.
      - Integrated Virtual Meeting URL support (Amazon Chime, Google Meet, Zoom) with 1-click launch.
      - Categorized event indicators: 🎯 **Interview Schedules** (e.g. Amazon SDE Round 2), 🏆 **Hackathons**, ⏰ **Application Deadlines**, 🛠 **Workshops**, and 📖 **Mock Prep**.
      - Persistent local storage with edit and delete capabilities.
      - Filter pills by `All Dates`, `Interviews`, `Hackathons`, `Deadlines`, and `Prep`.
  - Visual category distribution chart.
- **Authentication & 1-Click Demo Evaluation**:
  - Sign In and Registration views.
  - Pre-configured 1-click login as *"Prachi"* for instant hackathon jury review.

---

## 3. Technologies Used

### Frontend
- **React 19** (`^19.0.1`): Modern component architecture using hooks and state.
- **TypeScript** (`^7.0.2`): Strict type safety and interface definitions.
- **Vite 8** (`^8.3.0`): High-speed bundler and dev server.
- **Tailwind CSS v4** (`^4.3.3`): Utility-first modern typography, layouts, and animations.
- **Recharts** (`^2.15.1`): Declarative charting library for interactive donut charts, funnel bar graphs, and custom tooltip metrics.
- **Lucide React** (`^0.546.0`): Crisp, consistent icons.

### Backend & Runtime
- **Node.js**: Asynchronous JavaScript runtime.
- **Express.js** (`^4.21.2`): Lightweight server handling static SPA serving and REST API routes (`/api/health`, `/api/opportunities`).
- **TSX** (`^4.21.0`): Seamless TypeScript execution without manual transpile steps.
- **Dotenv** (`^17.2.3`): Environment variable management.

---

## 4. Setup Instructions (Local Development)

### Prerequisites
- **Node.js** (v18.0.0 or higher recommended)
- **npm** (v9.0.0 or higher) or **bun** / **yarn**

### Step-by-Step Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/opportunityhub-ai.git
   cd opportunityhub-ai
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   ```bash
   cp .env.example .env
   ```
   Inspect `.env` (defaults work out-of-the-box):
   ```env
   PORT=3000
   APP_URL="http://localhost:3000"
   ```

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:3000` to interact with the platform.

5. **Type Checking and Linting**:
   ```bash
   npm run lint
   ```

---

## 5. Deployment Instructions (Google Cloud Run)

The application is structured to satisfy **Google Cloud Run** requirements:
- Binds to `0.0.0.0`
- Reads the dynamically assigned `PORT` environment variable (`process.env.PORT || 3000`)
- Serves the compiled production frontend from `dist/` via Express

### Option A: Build and Run with Node / Cloud Run Buildpacks

1. **Build the production client assets**:
   ```bash
   npm run build
   ```

2. **Start the production server**:
   ```bash
   npm start
   ```

### Option B: Deploying via Google Cloud CLI (`gcloud`)

1. **Set your Google Cloud project**:
   ```bash
   gcloud config set project YOUR_PROJECT_ID
   ```

2. **Deploy directly from source**:
   ```bash
   gcloud run deploy opportunityhub-ai \
     --source . \
     --platform managed \
     --region asia-east1 \
     --allow-unauthenticated
   ```
   Cloud Run will detect `package.json`, install dependencies, run the build step, and launch `npm start` (listening on the allocated `PORT`).

---

## 6. Recommendation Engine (100-Point Scoring Model)

| Component | Max Points | Evaluation Logic |
| :--- | :---: | :--- |
| **Skill Match** | **40 pts** | Ratio of declared student skills matching the opportunity's required skill set. |
| **Interest Match** | **30 pts** | Overlap between student's career interests and opportunity domain keywords/tags. |
| **Category Match** | **20 pts** | `20 pts` if category is marked as a preference, `15 pts` if neutral, `5 pts` if other categories were selected. |
| **Location / Mode** | **10 pts** | `10 pts` for exact city match or Remote mode with Remote preference, `8 pts` for India-wide compatibility. |
| **Total Score** | **100 pts** | Normalized percentage displayed on each opportunity card with color-coded badges. |

---

## 7. Project File Structure

```
├── .env.example                # Environment variable documentation
├── .gitignore                  # Git ignore rules for node_modules, build, logs
├── README.md                   # Full project documentation & instructions
├── index.html                  # HTML entry point with meta tags & typography
├── metadata.json               # AI Studio project configuration
├── package.json                # Project dependencies, scripts, and build tasks
├── server.ts                   # Express production server with Cloud Run PORT support
├── tsconfig.json               # TypeScript compiler configuration
├── vite.config.ts              # Vite + Tailwind + React configuration
└── src/
    ├── App.tsx                 # Main application coordinator, state & routing
    ├── main.tsx                # React DOM mount point
    ├── index.css               # Global Tailwind CSS and typography rules
    ├── types.ts                # TypeScript interfaces (Opportunity, StudentProfile, etc.)
    ├── data/
    │   └── opportunities.ts    # Curated dataset of 34 opportunities across 7 categories
    ├── utils/
    │   ├── dateUtils.ts        # Deadline helpers, "Closing Soon", and expiration checks
    │   ├── recommendation.ts   # 100-point matching algorithm and skill gap logic
    │   └── storage.ts          # LocalStorage persistence & default profile
    └── components/
        ├── Navbar.tsx                  # Responsive navigation bar with quick stats
        ├── LandingPage.tsx             # Public landing page with stats & category cards
        ├── StudentDashboard.tsx        # Personalized student dashboard & analytics
        ├── ApplicationStatusAnalytics.tsx # Recharts data visualization (Applied, Interviewing, Offered)
        ├── DashboardCalendar.tsx       # Interactive monthly & agenda calendar for saved dates
        ├── AddCalendarEventModal.tsx   # Modal to schedule custom events, dates & timings
        ├── OpportunityExplorer.tsx     # Search bar, multi-filters & expired toggle
        ├── OpportunityCard.tsx         # Opportunity card with match ring & reasons
        ├── OpportunityDetailModal.tsx  # Full modal with skill gap analysis & apply link
        ├── SavedOpportunitiesView.tsx  # Application tracker pipeline
        ├── AddCustomApplicationModal.tsx # Modal to track custom positions & interview rounds
        ├── StudentProfileView.tsx      # Multi-step profile setup & edit screen
        └── AuthModal.tsx               # Sign in, registration, and 1-click demo login
```

---

## 8. Dataset Summary

The application includes **80+ realistic opportunities** across all seven supported categories:
- **Internships**: Goldman Sachs, Atlassian, PhonePe, Salesforce Futureforce, Google STEP, Microsoft IDC, Uber Core Services, Cisco Systems, Razorpay, Swiggy, Zomato, Postman, Zerodha, Infosys Springboard.
- **Hackathons**: Hack InOut 8.0, Unfold 2026 (CoinDCX), SheHacks India, Solana Summer Camp, AI Innovation National Hackathon, Smart India Hackathon (SIH), ETHIndia Web3 Hackathon, NASA Space Apps Challenge, HackMIT Asia, FinTech Revolution (NPCI), HealthTech Connect.
- **Scholarships**: Narotam Sekhsaria Foundation, Santoor Women's Scholarship, Legrand Empowering Scholarship, Reliance Foundation, Adobe Women-in-Technology, Google Generation Scholarship, Aditya Birla Group, Tata Trusts Means-Grant, L'Oréal India Young Women in Science, HDFC Badhte Kadam.
- **Courses**: UC Berkeley CS61A, Stanford CS106A, MIT 6.036 Machine Learning, MIT 6.006 Algorithms, Stanford ML Specialization (Andrew Ng), Harvard CS50x, Fast.ai Practical Deep Learning, DeepLearning.AI GenAI Specialization, University of Helsinki Full Stack Open, Google Cloud Foundations.
- **Certifications**: HashiCorp Terraform Associate, Linux Foundation LFCS, Snowflake SnowPro Core, Microsoft Power BI (PL-300), Google Associate Cloud Engineer (ACE), AWS Certified Cloud Practitioner, GitHub Foundations & Actions, Microsoft Certified Azure AZ-900, Oracle Java SE, Meta Front-End, NVIDIA DLI.
- **Competitions**: Flipkart Runway, Techfest IIT Bombay Grand Prix, IBM Call for Code, Tata Imagination Challenge, Flipkart GRiD 7.0, Cisco Ideathon, EY Techathon, Kaggle Student Cup, Microsoft Imagine Cup.
- **Workshops**: Apache Kafka Real-Time Streaming, Next.js 15 & React Server Components, System Design & Distributed Caching, Apollo GraphQL Federation, AWS Serverless Lambda, Production Docker & Linux Systems, Advanced Prompt Engineering & Evaluation, CNCF Kubernetes, OWASP Ethical Hacking, LangChain AI Agents, Figma Design Systems, GitHub FOSS Sprint.
- **Expired Demonstration Items**: GSoC Contributor Submissions, ACM ICPC Regional (used to demonstrate the *Show Expired* filter toggle).

---

## 9. License

This project is open-source under the Apache-2.0 License.
