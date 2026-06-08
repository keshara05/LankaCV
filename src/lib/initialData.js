export const INITIAL_CV_DATA = {
  templateId: '1',
  themeColor: '#1e3a8a',
  language: 'en',
  fullName: 'Kamal Perera',
  email: 'kamal.perera@gmail.com',
  phone: '+94 77 123 4567',
  nicNumber: '199512345678',
  address: '123, Galle Road, Colombo 03, Sri Lanka',
  linkedinUrl: 'linkedin.com/in/kamal-perera',
  githubUrl: 'github.com/kamal-perera',
  websiteUrl: 'kamal.dev',
  dob: '1998-05-12',
  gender: 'Male',
  civilStatus: 'Single',
  nationality: 'Sri Lankan',
  summary: 'A passionate and detail-oriented Software Engineer with 2+ years of experience building modern, responsive, and high-performing web applications. Proven track record of collaborating in agile environments, writing clean code, and optimizing user experiences.',
  profilePhoto: '',
  education: [
    {
      id: 'edu-1',
      type: 'higher',
      degree: 'B.Sc. (Hons) in Computer Science & Engineering',
      institution: 'University of Moratuwa, Sri Lanka',
      year: '2019 - 2023',
      grade: 'First Class Honours (GPA: 3.82 / 4.0)'
    },
    {
      id: 'edu-2',
      type: 'al',
      school: 'Ananda College, Colombo 10',
      year: '2018',
      indexNumber: '1245678',
      stream: 'Physical Science (Combined Maths)',
      results: [
        { subject: 'Combined Mathematics', grade: 'A' },
        { subject: 'Physics', grade: 'A' },
        { subject: 'Chemistry', grade: 'A' },
        { subject: 'General English', grade: 'A' },
        { subject: 'Common General Test', grade: 'A' }
      ]
    },
    {
      id: 'edu-3',
      type: 'ol',
      school: 'Ananda College, Colombo 10',
      year: '2015',
      indexNumber: '81245678',
      results: [
        { subject: 'Mathematics', grade: 'A' },
        { subject: 'Science', grade: 'A' },
        { subject: 'English', grade: 'A' },
        { subject: 'Sinhala', grade: 'A' },
        { subject: 'History', grade: 'A' },
        { subject: 'Buddhism', grade: 'A' },
        { subject: 'Commerce', grade: 'A' },
        { subject: 'ICT', grade: 'A' },
        { subject: 'Health & Physical Edu.', grade: 'A' }
      ]
    }
  ],
  experience: [
    {
      id: 'exp-1',
      company: 'Sysco LABS Sri Lanka',
      role: 'Associate Software Engineer',
      duration: 'Jan 2024 - Present',
      description: 'Worked in the core e-commerce team building high-traffic ordering portals. Engineered reusable React components, improved Web Vitals LCP by 25%, and integrated backend APIs.'
    },
    {
      id: 'exp-2',
      company: 'CodeGen International',
      role: 'Software Engineer Intern',
      duration: 'Jun 2022 - Dec 2022',
      description: 'Developed internal administration dashboards using JavaScript and Node.js. Maintained unit test coverage of 90% and optimized database query routines.'
    }
  ],
  skills: [
    'React', 'Next.js', 'Node.js', 'JavaScript', 'TypeScript', 'Tailwind CSS', 
    'Git', 'REST APIs', 'SQL (PostgreSQL)', 'Docker', 'Agile Methodologies'
  ],
  references: [
    {
      id: 'ref-1',
      name: 'Dr. Sanjeewa Wimalasiri',
      designation: 'Senior Lecturer, Dept of Computer Science',
      company: 'University of Moratuwa',
      phone: '+94 11 265 0301',
      email: 'sanjeewa@uom.lk'
    },
    {
      id: 'ref-2',
      name: 'Mr. Ruwan Bandara',
      designation: 'Director of Engineering',
      company: 'Sysco LABS Sri Lanka',
      phone: '+94 77 987 6543',
      email: 'ruwan.b@syscolabs.com'
    }
  ]
};
