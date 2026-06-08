import MinimalistStandard from './MinimalistStandard';
import GovernmentSriLanka from './GovernmentSriLanka';
import ModernIT from './ModernIT';

export const TEMPLATES = [
  {
    id: '1',
    name: 'Minimalist Standard',
    category: 'General / Entry Level',
    description: 'Clean, simple, and professional. Great for almost any job.',
    htmlGenerator: MinimalistStandard,
    defaultColor: '#1e3a8a'
  },
  {
    id: '2',
    name: 'Official Government Format',
    category: 'Government / Civil',
    description: 'Strict official layout matching Sri Lankan state sector expectations, featuring details like civil status and applicant signature blocks.',
    htmlGenerator: GovernmentSriLanka,
    defaultColor: '#0f172a'
  },
  {
    id: '3',
    name: 'Modern IT / Engineering',
    category: 'IT & Tech',
    description: 'Sleek two-column layout with a prominent sidebar for skills, contact info, and custom technology tag badges.',
    htmlGenerator: ModernIT,
    defaultColor: '#4f46e5'
  },
  {
    id: '4',
    name: 'Executive Navy',
    category: 'Banking & Corporate',
    description: 'Corporate style using serif fonts and elegant navy blue styling designed for corporate and financial roles.',
    htmlGenerator: (data) => MinimalistStandard({ ...data, themeColor: '#1e3a8a' }),
    defaultColor: '#1e3a8a'
  },
  {
    id: '5',
    name: 'Slate Minimalist',
    category: 'General',
    description: 'A dark slate variation of our minimal layout.',
    htmlGenerator: (data) => MinimalistStandard({ ...data, themeColor: '#334155' }),
    defaultColor: '#334155'
  },
  {
    id: '6',
    name: 'Teal Modern',
    category: 'IT & Tech',
    description: 'A dynamic, teal colored sidebar template optimized for engineers and developers.',
    htmlGenerator: (data) => ModernIT({ ...data, themeColor: '#0d9488' }),
    defaultColor: '#0d9488'
  },
  {
    id: '7',
    name: 'School Leaver Special',
    category: 'School Leavers',
    description: 'Optimized for highlighting G.C.E. O/L and A/L result tables with extracurricular details prominently displayed.',
    htmlGenerator: MinimalistStandard,
    defaultColor: '#2563eb'
  },
  {
    id: '8',
    name: 'Gold Elegant',
    category: 'Banking & Corporate',
    description: 'A premium layout featuring gold highlights suitable for hotel management and executive positions.',
    htmlGenerator: (data) => MinimalistStandard({ ...data, themeColor: '#b45309' }),
    defaultColor: '#b45309'
  },
  {
    id: '9',
    name: 'Academic Serif',
    category: 'Engineering & Academic',
    description: 'Traditional layout for lecturers, researchers, and university applications.',
    htmlGenerator: (data) => MinimalistStandard({ ...data, themeColor: '#111827' }),
    defaultColor: '#111827'
  },
  {
    id: '10',
    name: 'Emerald Executive',
    category: 'Management',
    description: 'Clean executive header layout featuring emerald borders and elements.',
    htmlGenerator: (data) => MinimalistStandard({ ...data, themeColor: '#059669' }),
    defaultColor: '#059669'
  }
];

export function getTemplateHtml(id, data) {
  const template = TEMPLATES.find(t => t.id === id) || TEMPLATES[0];
  return template.htmlGenerator(data);
}
