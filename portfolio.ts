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
    'https://github.com/TadakaSuryaTeja/TadakaSuryaTeja/blob/main/SuryaTejaTadaka-sdet.pdf',
};

export const openSource = {
  githubUserName: 'TadakaSuryaTeja',
};

export const contact = {};

export const socialLinks: SocialLinksType = {
  url: 'https://surya-teja-tadaka.vercel.app/',
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
      title: 'Web Development and Automation Testing',
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
            fontAwesomeClassName: 'fa-brands:python',
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
    Stack: 'Automation Testing',
    progressPercentage: '80',
  },
  {
    Stack: 'AWS',
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
    Stack: 'Data Engineering',
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
    subHeader: 'BTECH in Computer science and Engineering',
    duration: 'June 2016 - May 2019',
  },
  {
    schoolName: 'Govt Polytechnic',
    subHeader: 'Diploma in Computer science and Engineering',
    duration: 'June 2013 - June 2016',
  },
  {
    schoolName: 'Kakatiya High School',
    subHeader: 'SSC',
    duration: 'June 2012 - June 2013',
  },
];

export const experience: ExperienceType[] = [
  {
    role: 'Associate Architect/ Tech Lead',
    company: 'Southwest Airlines',
    client: 'Southwest Airlines',
    companyLogo: '/img/icons/common/Southwest-Airlines.png',
    date: 'May 2023 - Present',
    desc: 'Architect-level solutions for large-scale applications and data pipelines.',
    descBullets: [
    'Architected, developed, and maintained automation frameworks in Python using Django, Flask, Pytest, and Selenium for testing user-facing elements and server-side logic.',
    'Wrote efficient, reusable, and testable Python code for web automation, utilizing frameworks like PyCharm, UnitTest, Selenium, and Pytest.',
    'Automated AWS cloud stack and EC2 instance creation using Python, and managed containerized applications with Docker for cross-platform deployment.',
    'Validated Open API using Pytest methods and Postman for comprehensive API testing and integration.',
    'Developed reusable Python scripts for desktop automation utilizing auto GUI features and managing driver downloads and updates.',
    'Implemented and managed CI/CD pipelines using tools such as Jenkins, GitHub, and Jira, enabling seamless code delivery and integration.',
    'Collaborated cross-functionally with developers, quality analysts, and requirement analysts to develop Python scripts and test cases aligned with Agile methodologies.',
    'Led the enhancement of test automation frameworks, ensuring the development of high-quality, reusable, and maintainable test scripts for complex application functionalities.',
    'Provided technical assistance in business user meetings and developed Python-based tools for process improvements and productivity optimization.',
    'Proficient in working with internet technologies, ensuring seamless integration and validation during automation testing and system validation for large-scale distributed systems.',
    'Optimized cross-platform testing using Appium and other tools to ensure compatibility across mobile and desktop environments.',
    'Led a team in identifying requirements, enhancing frameworks, and writing optimized code snippets for automation, ensuring effective project delivery and performance.'
    ],
  },
  {
    role: 'Sr Software Engineer/ Tech Lead',
    company: 'Smile Direct Club',
    client: 'Smile Direct Club',
    companyLogo: '/img/icons/common/smiledirectclub_logo.jpeg',
    date: 'Oct 2020 - present',
    desc: 'Architect-level solutions for large-scale applications and data pipelines.',
    descBullets: [
'Developed Python automation solutions within established frameworks and cloud environments.',
'Managed Docker containerization for seamless deployment across multiple OS platforms.',
'Implemented Selenium test automation using Java and Python, ensuring functional accuracy, and maintaining test code.',
'Optimized mobile and desktop test outputs with Appium for improved functionality.',
'Strong proficiency in unit testing, debugging, and ensuring high-quality code.',
'In-depth knowledge of front-end technologies (JavaScript, HTML5, CSS3).',
'Demonstrated excellent problem-solving, critical thinking, and attention to detail in software development and testing.',
'Reduced manual testing by 70% and increased release frequency by 50% with automated testing frameworks and efficient CI/CD practices.',
'Achieved 95% test coverage, ensuring product reliability.',
'Reduced cloud infrastructure costs by $100K through optimized automation and reporting processes.',
'Cut defect resolution time by 40% and reduced test script execution time by 30% for faster cycles.'
    ],
  },
  {
    role: 'Software Engineer',
    company: 'SS&C Technologies (Formerly DST)',
    client: 'Amisys',
    companyLogo: '/img/icons/common/ss&c.png',
    date: 'May 2019 - May 2020',
    desc: 'Worked with web applications, automation, and cloud integration.',
    descBullets: [
      'Optimized code, achieving a 40% reduction in load times, significantly enhancing user experience.',
      'Collaborated with cross-functional teams, driving product innovation, and improving team synergy.',
      'Integrated API, expanding functionality and increasing user reach by 35%.',
      'Analyzed user feedback, driving feature improvements that enhanced product satisfaction.',
      'Utilized web element locators (ID, Name, XPath, CSS Selector) in Selenium WebDriver for effective web application testing.',
      'Demonstrated proficiency in Gherkin language to create feature files for Cucumber test automation.',
      'Logged defects in Jira, ensuring detailed defect tracking with clear defect types and resolution steps.',
      'Designed and developed Page Object Model (POM) based automation testing framework using Java, Maven, Selenium WebDriver, TestNG, and Cucumber (Gherkin).',
      'Created Page Classes and utilized Page Factory to automate testing for web applications.',
       'Developed and executed Test Cases, Test Scenarios, and Test Plans, ensuring comprehensive test coverage and quality assurance.',
       'Generated detailed Defect Reports for enhancements, collaborating closely with the development team to ensure issue resolution'
    ],
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
