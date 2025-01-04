import emoji from 'react-easy-emoji';
import {
  EducationType,
  ExperienceType,
  ProjectType,
  SkillsSectionType,
  SkillBarsType,
  SEODataType,
  SocialLinksType,
  GreetingsType,
  CertificationsType,
} from './types/sections';

export const greetings: GreetingsType = {
  name: 'Tadaka Surya Teja',
  title: "Hi all, I'm Tadaka Surya Teja",
  description:
    "I am an Associate Solutions Architect and Tech Lead based in Dallas, United States, with a strong passion for technology and problem-solving. As a self-taught programmer, I am continually exploring new technologies and innovative solutions to build impactful projects. I thrive on tackling challenges and am always eager to expand my knowledge and expertise.",
  resumeLink:
    'https://github.com/TadakaSuryaTeja/TadakaSuryaTeja/blob/main/Surya%20teja%20resume%20as%20on%2017%20april%202023.pdf',
};

export const openSource = {
  githubUserName: 'TadakaSuryaTeja',
};

export const contact = {};

export const socialLinks: SocialLinksType = {
  url: 'http://tadakasuryateja.info/',
  linkedin: 'https://www.linkedin.com/in/surya-teja-tadaka-36ba8814a/',
  github: 'https://github.com/TadakaSuryaTeja',
  medium: 'https://medium.com/@suryateja233',
  kaggle: "https://www.kaggle.com/tadakasuryateja",
  linktr: "https://linktr.ee/suryatejatadaka"
};

export const skillsSection: SkillsSectionType = {
  title: 'What I do',
  subTitle: 'ENERGETIC CODER EAGER TO PUSH BOUNDARIES IN MODERN TECHNOLOGY',
  data: [
    {
      title: 'Web Development', // Fixed typo
      lottieAnimationFile: '/lottie/skills/fullstack.json',
      skills: [
        emoji(
          '⚡ Building Responsive Web Applications using Python, Django, and Flask'
        ),
        emoji('⚡ Building Automation testing Frameworks'),
        emoji('⚡ Building Machine Learning Models to solve real world problems'),
      ],
      softwareSkills: [
        {
          skillName: 'Python',
          fontAwesomeClassName: 'logos:python',
        },
        {
          skillName: 'Django',
          fontAwesomeClassName: 'vscode-icons:file-type-django',
        },
        {
            skillName: 'Flask',
            fontAwesomeClassName: 'logos:flask', // Fixed icon name for Flask
        },
        {
          skillName: 'HTML-5',
          fontAwesomeClassName: 'vscode-icons:file-type-html',
        },
        {
          skillName: 'CSS-3',
          fontAwesomeClassName: 'vscode-icons:file-type-css',
        },
        {
          skillName: 'JavaScript',
          fontAwesomeClassName: 'logos:javascript',
        },
      ],
    },
    {
      title: 'Cloud Infra-Architecture',
      lottieAnimationFile: '/lottie/skills/cloudinfra.json',
      skills: [
        emoji('⚡ Experience of working on multiple cloud platforms'),
        emoji(
          '⚡ Hosting and maintaining websites on virtual machine instances along with integration of databases'
        ),
        emoji(
          '⚡ Building CI/CD pipelines for automated testing & deployment using Github Actions'
        ),
      ],
      softwareSkills: [
        {
          skillName: 'AWS',
          fontAwesomeClassName: 'logos:aws',
        },
        {
          skillName: 'Heroku',
          fontAwesomeClassName: 'logos:heroku-icon',
        },
        {
          skillName: 'PostgreSQL',
          fontAwesomeClassName: 'logos:postgresql',
        },
        {
          skillName: 'Github',
          fontAwesomeClassName: 'akar-icons:github-fill',
        },
        {
          skillName: 'Docker',
          fontAwesomeClassName: 'logos:docker-icon',
        },
        {
          skillName: 'Github Actions',
          fontAwesomeClassName: 'logos:github-actions',
        },
        {
          skillName: 'Nginx',
          fontAwesomeClassName: 'logos:nginx',
        },
        {
          skillName: 'Sentry',
          fontAwesomeClassName: 'logos:sentry-icon',
        },
      ],
    },
  ],
};

export const SkillBars: SkillBarsType[] = [
  {
    Stack: 'Python Development',
    progressPercentage: '90',
  },
  {
    Stack: 'AWS',
    progressPercentage: '80',
  },
  {
    Stack: 'Data Engineering',
    progressPercentage: '80',
  },
  {
    Stack: 'DevOps',
    progressPercentage: '80',
  },
  {
    Stack: 'Web Scraping',
    progressPercentage: '80',
  },
  {
    Stack: 'Automation',
    progressPercentage: '80',
  },
  {
    Stack: 'Machine Learning',
    progressPercentage: '70',
  },
];

export const educationInfo: EducationType[] = [
  {
    schoolName: 'Machine Learning',
    subHeader: 'AppliedAI',
    duration: 'May 2020 - May 2021',
  },
  {
    schoolName: 'Vardhaman College of Engineering',
    subHeader: 'BTECH in Computer Science and Engineering', // Fixed typo in "Computer Scince"
    duration: 'June 2016 - May 2019',
  },
  {
    schoolName: 'Govt Polytechnic',
    subHeader: 'Diploma in Computer Science and Engineering', // Fixed typo in "Computer Scince"
    duration: 'June 2013 - June 2016',
  },
  {
    schoolName: 'Kakatiya High School',
    subHeader: 'SSC Class',
    duration: 'June 2012 - June 2013',
  },
];

export const experience: ExperienceType[] = [
  {
    role: 'Sr Software Engineer/ Tech Lead',
    company: 'Qentelli Solutions Pvt Ltd',
    companyLogo: '/img/icons/common/qentelli.png',
    date: 'Oct 2020 - present',
    desc: (
      <ul>
        <li>Proposed architect-level solutions and designed end-to-end architecture for large-scale applications and data pipelines, ensuring scalability, reliability, and efficiency.</li>
        <li>Designed and implemented scalable automation frameworks, ETL workflows, and backend architectures, enabling seamless data migration from on-premises Teradata to AWS Redshift.</li>
        <li>Automated integration processes to streamline operations and reduce manual intervention.</li>
        <li>Reduced manual QA efforts by 45% and cut $100K in costs by developing custom tools and enhancing operational efficiency.</li>
        <li>Enhanced efficiency using AWS, Confluent Kafka, SonarQube, and Datadog for data streaming, code quality, and monitoring.</li>
        <li>Developed a robust Django-based web application, integrating services such as authentication, payment gateways, third-party APIs, and cloud storage to deliver a secure and seamless user experience.</li>
      </ul>
    ),
  },
  {
    role: 'Software Engineer',
    company: 'SS&C Technologies(Formerly DST)',
    companyLogo: '/img/icons/common/ss&c.png',
    date: 'May 2019 - May 2020',
    desc: (
      <ul>
        <li>Automated ETL processes, integrated AWS services, and improved monitoring with DataDog and SonarQube.</li>
        <li>Built web applications with Django and Flask, implementing DevOps tasks using Docker, Jenkins, and CI/CD pipelines.</li>
        <li>Automated testing with Pytest and Selenium, reducing manual testing efforts and improving code quality.</li>
        <li>Applied NLP techniques for data extraction and tokenization, streamlining data processing by 45%.</li>
      </ul>
    ),
  },
];

export const projects: ProjectType[] = [
  {
    name: 'Naukri scraped data',
    desc: 'Naukri scraped data refers to data extracted from the Naukri.com job portal. The project aims to extract job listing details for various positions using web scraping techniques and technologies such as Python, BeautifulSoup, and Selenium.',
    github: 'https://github.com/TadakaSuryaTeja/scraping',
    link: 'https://github.com/TadakaSuryaTeja/scraping',
  },
  {
    name: 'Flask Web Scraping',
    desc: 'This project allows you to scrape and visualize data from websites using Flask, Python, and BeautifulSoup. It provides a lightweight web application for dynamic content extraction.',
    github: 'https://github.com/TadakaSuryaTeja/flaskwebscraping',
    link: 'https://github.com/TadakaSuryaTeja/flaskwebscraping',
  },
  {
    name: 'Django Portfolio',
    desc: 'This is a personal portfolio website built using Django, showcasing my technical skills, projects, and experience in a clean, professional manner.',
    github: 'https://github.com/TadakaSuryaTeja/DjangoPortfolio',
    link: 'https://github.com/TadakaSuryaTeja/DjangoPortfolio',
  },
];

export const certifications: CertificationsType[] = [
  {
    name: 'Machine Learning',
    issuer: 'Applied AI Course',
    date: 'May 2020',
    link: 'https://www.appliedai.in/',
  },
  {
    name: 'AWS Certified Solutions Architect - Associate',
    issuer: 'Amazon Web Services',
    date: 'May 2021',
    link: 'https://aws.amazon.com/certification/certified-solutions-architect-associate/',
  },
];
