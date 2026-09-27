import { Opportunity, StudentProfile, MatchAnalysis } from '../types';

const SKILL_PREPARATION_SUGGESTIONS: Record<string, string> = {
  'Machine Learning': 'Complete an introductory Machine Learning course (e.g., Andrew Ng\'s ML Specialization or Kaggle Learn).',
  'Artificial Intelligence': 'Build a hands-on project with modern LLM APIs and explore vector embeddings.',
  'React': 'Practice building component-driven UI with state hooks and Tailwind CSS.',
  'Node.js': 'Build a simple REST API with Express.js and practice handling database queries.',
  'Python': 'Review Python data structures, list comprehensions, and standard scripting libraries.',
  'SQL': 'Practice multi-table JOINs, aggregation queries, and subqueries on LeetCode Database.',
  'Cloud Computing': 'Deploy a containerized application to AWS EC2 or Google Cloud Run to grasp cloud fundamentals.',
  'UI/UX': 'Complete a Figma design exercise focusing on typography hierarchy and design systems.',
  'Java': 'Review Object-Oriented Programming (OOP) concepts, Collections, and Streams API.',
  'C++': 'Practice data structures and algorithmic time complexity on competitive programming platforms.',
  'Data Analytics': 'Learn data cleaning with Pandas and exploratory visualization with Matplotlib.',
  'Business Analytics': 'Study unit economics, KPI metrics, and structured case interview frameworks.',
  'Communication': 'Prepare a concise 2-minute pitch of your best project and write clear README documentation.',
  'Web Development': 'Build a responsive responsive web project linking modern HTML/CSS with JavaScript.'
};

export function calculateMatchScore(
  opportunity: Opportunity,
  profile: StudentProfile | null
): MatchAnalysis {
  // If no profile, provide a baseline score
  if (!profile) {
    return {
      score: 70,
      skillScore: 25,
      interestScore: 20,
      categoryScore: 15,
      locationScore: 10,
      matchedSkills: [],
      missingSkills: opportunity.skills,
      matchedInterests: [],
      matchedCategory: false,
      matchedLocation: false,
      reasons: ['Complete your student profile to unlock personalized 100-point matching!'],
      suggestedPreparation: opportunity.skills.length > 0 
        ? SKILL_PREPARATION_SUGGESTIONS[opportunity.skills[0]] 
        : undefined
    };
  }

  const reasons: string[] = [];

  // 1. Skill Match (Max: 40 points)
  let skillScore = 0;
  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  if (opportunity.skills.length === 0) {
    skillScore = 35; // Default generous score if no specific hard skills required
  } else {
    for (const reqSkill of opportunity.skills) {
      const isMatched = profile.skills.some(
        s => s.toLowerCase() === reqSkill.toLowerCase() ||
             reqSkill.toLowerCase().includes(s.toLowerCase()) ||
             s.toLowerCase().includes(reqSkill.toLowerCase())
      );
      if (isMatched) {
        matchedSkills.push(reqSkill);
      } else {
        missingSkills.push(reqSkill);
      }
    }
    const skillRatio = matchedSkills.length / opportunity.skills.length;
    skillScore = Math.round(skillRatio * 40);

    if (matchedSkills.length > 0) {
      const topSkills = matchedSkills.slice(0, 2).join(' & ');
      reasons.push(`${topSkills} matches your declared skills`);
    }
  }

  // 2. Interest Match (Max: 30 points)
  let interestScore = 0;
  const matchedInterests: string[] = [];
  const oppKeywords = [
    opportunity.title.toLowerCase(),
    opportunity.description.toLowerCase(),
    ...opportunity.tags.map(t => t.toLowerCase()),
    opportunity.category.toLowerCase()
  ];

  for (const interest of profile.interests) {
    const interestLower = interest.toLowerCase();
    const hits = oppKeywords.some(kw => kw.includes(interestLower) || interestLower.includes(kw));
    if (hits) {
      matchedInterests.push(interest);
    }
  }

  if (profile.interests.length > 0) {
    const interestRatio = Math.min(1, matchedInterests.length / Math.min(3, profile.interests.length));
    interestScore = Math.round(interestRatio * 30);
    if (matchedInterests.length > 0) {
      reasons.push(`${matchedInterests[0]} aligns with your career interests`);
    }
  } else {
    interestScore = 15;
  }

  // 3. Category Match (Max: 20 points)
  let categoryScore = 0;
  const isCategoryMatched = profile.preferredCategories.includes(opportunity.category);
  if (isCategoryMatched) {
    categoryScore = 20;
    reasons.push(`${opportunity.category} is in your preferred opportunity types`);
  } else if (profile.preferredCategories.length === 0) {
    categoryScore = 15;
  } else {
    categoryScore = 5;
  }

  // 4. Location / Mode Match (Max: 10 points)
  let locationScore = 0;
  let isLocationMatched = false;

  const userPrefersRemote = profile.preferredLocations.includes('Remote') || profile.preferredLocations.includes('Anywhere');
  const userPrefersIndia = profile.preferredLocations.includes('India') || profile.preferredLocations.includes('Anywhere');

  if (opportunity.mode === 'Remote' && (userPrefersRemote || profile.preferredLocations.length === 0)) {
    locationScore = 10;
    isLocationMatched = true;
    reasons.push('Remote mode fits your location preference');
  } else if (profile.preferredLocations.includes(opportunity.location)) {
    locationScore = 10;
    isLocationMatched = true;
    reasons.push(`${opportunity.location} matches your preferred location`);
  } else if (userPrefersIndia && ['Pune', 'Mumbai', 'Bengaluru', 'Hyderabad', 'India'].includes(opportunity.location)) {
    locationScore = 8;
    isLocationMatched = true;
    reasons.push('Location in India matches your preferred region');
  } else if (profile.preferredLocations.length === 0) {
    locationScore = 7;
  } else {
    locationScore = 3;
  }

  const rawScore = skillScore + interestScore + categoryScore + locationScore;
  // Bound score between 25 and 99 for realistic percentage
  const finalScore = Math.min(98, Math.max(25, rawScore));

  // Determine suggested preparation for top missing skill
  let suggestedPreparation: string | undefined;
  if (missingSkills.length > 0) {
    const firstMissing = missingSkills[0];
    suggestedPreparation = SKILL_PREPARATION_SUGGESTIONS[firstMissing] || 
      `Complete a beginner-friendly tutorial or build a mini project using ${firstMissing}.`;
  }

  return {
    score: finalScore,
    skillScore,
    interestScore,
    categoryScore,
    locationScore,
    matchedSkills,
    missingSkills,
    matchedInterests,
    matchedCategory: isCategoryMatched,
    matchedLocation: isLocationMatched,
    reasons,
    suggestedPreparation
  };
}
