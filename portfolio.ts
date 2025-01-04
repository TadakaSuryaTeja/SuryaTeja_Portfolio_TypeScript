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
      title: 'Web Devlopment',
      lottieAnimationFile: '/lottie/skills/fullstack.json',
      skills: [
        emoji(
          '⚡ Building Response Web Application using Python, Django and Flask'
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
          imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/3c/Flask_logo.svg',
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
        // ? Check README To get icon details
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
    Stack: 'Python Development', //Insert stack or technology you have experience in
    progressPercentage: '90', //Insert relative proficiency in percentage
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
    subHeader: 'BTECH in Computer Scince and Engineering',
    duration: 'June 2016 - May 2019',
  },
  {
    schoolName: 'Govt Polytechnic',
    subHeader: 'Diploma in Computer Scince and Engineering',
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
    desc: 'Proposed architect-level solutions and designed end-to-end architecture for large-scale applications and data pipelines, ensuring scalability, reliability, and efficiency. Designed and implemented scalable automation frameworks, ETL workflows, and backend architectures, enabling seamless data migration from on-premises Teradata to AWS Redshift, while automating integration processes. Streamlined operations with custom tools, reducing manual QA efforts by 45%, cutting $100K in costs, and enhancing efficiency using AWS, Confluent Kafka, SonarQube, and Datadog. Developed a robust Django-based web application, integrating services such as authentication, payment gateways, third-party APIs, and cloud storage to deliver a secure and seamless user experience. ',
  },
  {
    role: 'Software Engineer',
    company: 'SS&C Technologies(Formerly DST)',
    companyLogo: '/img/icons/common/ss&c.png',
    date: 'May 2019 - May 2020',
    desc: 'Automated ETL processes, integrated AWS services, and improved monitoring with DataDog and SonarQube. Built web applications with Django and Flask, implemented DevOps tasks using Docker, Jenkins, and CI/CD pipelines, and automated testing with Pytest and Selenium. Applied NLP techniques for data extraction and tokenization, and streamlined data processing by 45%.',
  },
];

export const projects: ProjectType[] = [
  {
    name: 'Naukri scraped data',
    desc: 'Naukri scraped data refers to data extracted from the Naukri job portal using web scraping techniques, providing insights into job postings, salaries, and hiring trends, which can be used for market research and analysis.',
    github: 'https://github.com/TadakaSuryaTeja/Automation_selenium/blob/main/naukri_scrape.py',
    // link: 'http://tadakasuryateja.info',
  },
  {
    name: 'Automation of applying to Jobs on LinkedIn',
    desc: 'Automation of applying to jobs on LinkedIn involves using software tools or scripts to automate the job application process on LinkedIn, enabling users to apply to multiple job openings quickly and efficiently.',
    github: 'https://github.com/TadakaSuryaTeja/LinkedIn_Automation',
  },
  {
    name: 'Creating and Selling NFTs',
    desc: 'Creating and selling NFTs involves creating unique digital assets using blockchain technology and selling them on various marketplaces, providing creators with a new way to monetize their digital creations.',
    github: 'https://github.com/TadakaSuryaTeja/Automation_open_sea_ntf',
  },
  {
    name: 'Nifty 50 stock price data',
    desc: 'Nifty 50 stock price data provides historical and real-time information about the performance of the top 50 companies listed on the National Stock Exchange of India, enabling investors to track market trends and make informed investment decisions.',
    github: 'https://github.com/TadakaSuryaTeja/Automation_selenium/blob/main/indian_stock_price_vintage_free_api.py',
  },
  {
    name: 'Covid Live Web App',
    desc: 'A Covid Live Web App is an online platform that provides real-time information about the Covid-19 pandemic, including case numbers, deaths, and vaccinations, helping users stay informed and make data-driven decisions.',
    github: 'https://github.com/TadakaSuryaTeja/Covid-Live-Web-App',
  },
  {
    name: 'Pizza Delivery Web App',
    desc: 'A Pizza Delivery Web App is an online platform that enables customers to order pizzas, customize their toppings, track delivery status, and make payments, providing a convenient and user-friendly experience.',
    github: 'https://github.com/TadakaSuryaTeja/Pizza-Delivery-APP',
  },
  {
    name: 'Website UI designed using Figma',
    desc: 'Website UI designed using Figma is a collaborative interface design tool that enables designers to create and share designs in real-time, resulting in an efficient and seamless design process.',
    github: 'https://www.figma.com/proto/0u8SqV8yfTA2uUeXvEjXC4/Portfolio?node-id=72%3A1792&scaling=scale-down&page-id=0%3A1&starting-point-node-id=72%3A1792&show-proto-sidebar=1',
  },
  {
    name: 'Portfolio Website designed using Third-party tool (Strikingly)',
    desc: 'A portfolio website designed using the third-party tool Strikingly provides an easy-to-use platform for creating professional-looking websites without needing any coding knowledge.',
    github: 'https://tadakasuryateja.mystrikingly.com/',
  },
  {
    name: 'JPX stock market Predictive Analysis',
    desc: 'JPX stock market predictive analysis involves using statistical and machine learning techniques to forecast the future behavior of JPX stock market, such as stock prices, volume, and volatility.',
    github: 'https://www.kaggle.com/code/tadakasuryateja/jpx-stock-exchange-predicion-eda',
  },
  {
    name: 'Image Classification',
    desc: 'Image classification is the process of categorizing an image into one or more predefined classes based on its content, typically using machine learning algorithms.',
    github: 'https://github.com/TadakaSuryaTeja/Image-Classification-WebApp',
  },
];


export const certifications: CertificationsType[] = [
  {
    certificate: 'AWS Certified Solutions Architect-Associate',
    issuedby: 'AWS',
    github: 'https://www.credly.com/badges/a3337dc2-e390-42a4-b7ae-b8fb401f1386',
  },
  {
    certificate: 'AWS Cloud Certified Practitioner',
    issuedby: 'AWS',
    github: 'https://www.credly.com/badges/1eb48c8d-7a51-4006-a7f5-be69b65f62ff',
  },
  {
    certificate: 'Machine Learning And Deep Learning',
    issuedby: 'AppliedAI',
    github: 'https://www.appliedaicourse.com/certificate/d7dbb737c0',
  },
  {
    certificate: 'Information Security-IV',
    issuedby: 'NPTEL',
    github: 'https://github.com/TadakaSuryaTeja/Profile/blob/main/Information%20Security%20-%20IV.jpg',
  },
  {
    certificate: 'Mobile Application Development',
    issuedby: 'NPTEL',
    github: 'https://github.com/TadakaSuryaTeja/Profile/blob/main/Introduction%20to%20Modern%20Application%20Development.jpg',
  },
];

// option to hide or show the ContactUs component
export const showContactUs: boolean = false;

// See object prototype on /types/section.ts page
export const seoData: SEODataType = {
  title: 'Tadaka Surya Teja',
  description:
    'A passionate Python Developer.',
  author: 'Tadaka Surya Teja',
  url: 'http://tadakasuryateja.info',
  keywords: [
    'Surya Teja',
    'Portfolio',
    'Tadaka Portfolio ',
    'Tadaka Surya Teja Portfolio',
  ],
};
