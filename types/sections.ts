export type SEODataType = {
  title: string;
  author?: string;
  description?: string;
  image?: string;
  url?: string;
  keywords: string[];
};

// https://www.typescriptlang.org/docs/handbook/2/objects.html#index-signatures

export type SocialLinksType = {
  [link: string]: string;
};

// * HERO SECTION

export type GreetingsType = {
  name: string;
  title: string;
  description?: string;
  resumeLink?: string;
};

// * SKILLS SECTION

type SoftwareSkillType = {
  skillName: string;
  fontAwesomeClassName: string;
};

type SkillType = {
  title: string;
  lottieAnimationFile: string;
  skills: React.ReactNode[] | string[];
  softwareSkills: SoftwareSkillType[];
};

export type SkillsSectionType = {
  title: string;
  subTitle: string;
  data: SkillType[];
};

// * PROFICIENCY SECTION

export type SkillBarsType = {
  Stack: string;
  progressPercentage: string;
};

// * EDUCATION SECTION

export type EducationType = {
  schoolName: string;
  subHeader: string;
  duration: string;
};

// * EXPERIENCE SECTION

export type ExperienceType = {
  role: string;
  company: string;
  client: string;
  companyLogo: string;
  date: string;
  desc: JSX.Element | string;
  descBullets?: string[];
};

// * PROJECT SECTION

export type ProjectType = {
  name: string;
  desc: string;
  github?: string;
  link?: string;
};

// * CERTIFICATIONS SECTION

export type CertificationsType = {
  certificate: string;
  issuedby: string;
  github?: string;
}

// * FEEDBACK SECTION

export type FeedbackType = {
  name: string;
  feedback: string;
};
