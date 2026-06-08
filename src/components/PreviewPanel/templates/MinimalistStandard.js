export default function MinimalistStandard(data) {
  const {
    fullName = 'Kamal Perera',
    email = 'kamal@gmail.com',
    phone = '+94 77 123 4567',
    nicNumber = '199512345678',
    address = '123, Galle Road, Colombo 03',
    linkedinUrl = 'linkedin.com/in/kamal',
    githubUrl = 'github.com/kamal',
    websiteUrl = '',
    summary = 'A highly motivated and detail-oriented individual looking to contribute to professional growth.',
    profilePhoto = '',
    education = [],
    experience = [],
    skills = [],
    references = [],
    themeColor = '#1e3a8a'
  } = data;

  const experienceHtml = experience.map(exp => `
    <div style="margin-bottom: 12px;">
      <div style="display: flex; justify-content: space-between; font-weight: 600; color: #0f172a;">
        <span>${exp.role} — ${exp.company}</span>
        <span style="color: #64748b; font-size: 10px;">${exp.duration}</span>
      </div>
      <p style="color: #475569; margin: 2px 0 0 0; text-align: justify;">${exp.description}</p>
    </div>
  `).join('');

  const educationHtml = education.map(edu => {
    const isExam = edu.type === 'ol' || edu.type === 'al';
    
    let resultsHtml = '';
    if (isExam && edu.results && edu.results.length > 0) {
      const resultsGrid = edu.results.map(res => `
        <div style="display: flex; justify-content: space-between; padding-right: 8px; font-size: 10px; border-right: 1px solid #cbd5e1; box-sizing: border-box;">
          <span style="color: #64748b; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; margin-right: 4px;">${res.subject}</span>
          <span style="font-weight: 700; color: #0f172a;">${res.grade}</span>
        </div>
      `).join('');
      
      resultsHtml = `
        <div style="margin-top: 6px; display: grid; grid-template-cols: repeat(4, 1fr); gap: 8px; background-color: #f8fafc; padding: 8px; border-radius: 4px; border: 1px solid #f1f5f9;">
          ${resultsGrid}
        </div>
      `;
    }

    return `
      <div style="margin-bottom: 12px;">
        <div style="display: flex; justify-content: space-between; font-weight: 600; color: #0f172a;">
          <span>
            ${edu.type === 'ol' ? 'G.C.E. Ordinary Level (O/L)' : edu.type === 'al' ? 'G.C.E. Advanced Level (A/L)' : edu.degree || edu.type}
          </span>
          <span style="color: #64748b; font-size: 10px;">${edu.year}</span>
        </div>
        <div style="color: #475569;">
          ${edu.school || edu.institution}
          ${edu.indexNumber ? `<span style="margin-left: 12px; font-size: 10px; font-family: monospace; color: #94a3b8;">Index: ${edu.indexNumber}</span>` : ''}
          ${edu.stream ? `<span style="margin-left: 12px; font-size: 10px; font-weight: 600; color: #64748b;">Stream: ${edu.stream}</span>` : ''}
        </div>
        ${resultsHtml}
        ${!isExam && edu.grade ? `<p style="color: #64748b; font-size: 10px; margin: 2px 0 0 0;">Result/GPA: <span style="font-weight: 600;">${edu.grade}</span></p>` : ''}
      </div>
    `;
  }).join('');

  const skillsHtml = skills.map(skill => `
    <span style="display: inline-block; padding: 2px 8px; background-color: #f1f5f9; color: #1e293b; border-radius: 4px; border: 1px solid #e2e8f0; font-weight: 500; font-size: 10px; margin-right: 6px; margin-bottom: 6px;">
      ${skill}
    </span>
  `).join('');

  const referencesHtml = references.map(ref => `
    <div style="font-size: 10px; color: #475569;">
      <div style="font-weight: 700; color: #1e293b; font-size: 11px;">${ref.name}</div>
      <div>${ref.designation}</div>
      <div>${ref.company}</div>
      ${ref.phone ? `<div><strong>Phone:</strong> ${ref.phone}</div>` : ''}
      ${ref.email ? `<div><strong>Email:</strong> ${ref.email}</div>` : ''}
    </div>
  `).join('');

  return `
    <div style="color: #1e293b; font-size: 12px; line-height: 1.6; font-family: system-ui, -apple-system, sans-serif; width: 100%; box-sizing: border-box; padding: 48px; display: flex; flex-direction: column;">
      
      <!-- Header -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid ${themeColor}; padding-bottom: 16px; margin-bottom: 20px;">
        <div>
          <h1 style="font-size: 24px; font-weight: 700; letter-spacing: -0.5px; color: #0f172a; margin: 0;">${fullName}</h1>
          <div style="margin-top: 4px; display: flex; flex-wrap: wrap; gap: 16px; color: #475569;">
            ${nicNumber ? `<span><strong>NIC:</strong> ${nicNumber}</span>` : ''}
            <span><strong>Email:</strong> ${email}</span>
            <span><strong>Phone:</strong> ${phone}</span>
            ${address ? `<span><strong>Address:</strong> ${address}</span>` : ''}
          </div>
          <div style="margin-top: 4px; display: flex; gap: 16px; color: #64748b;">
            ${linkedinUrl ? `<span style="text-decoration: underline;">${linkedinUrl}</span>` : ''}
            ${githubUrl ? `<span style="text-decoration: underline;">${githubUrl}</span>` : ''}
            ${websiteUrl ? `<span style="text-decoration: underline;">${websiteUrl}</span>` : ''}
          </div>
        </div>
        ${profilePhoto ? `
          <img 
            src="${profilePhoto}" 
            alt="${fullName}" 
            style="width: 64px; height: 64px; border-radius: 8px; object-fit: cover; border: 2px solid ${themeColor}; box-shadow: 0 1px 2px rgba(0,0,0,0.05);"
          />
        ` : ''}
      </div>

      <!-- Summary -->
      ${summary ? `
        <div style="margin-bottom: 20px;">
          <p style="color: #334155; font-style: italic; text-align: justify; margin: 0;">${summary}</p>
        </div>
      ` : ''}

      <!-- Experience -->
      ${experience.length > 0 ? `
        <div style="margin-bottom: 20px;">
          <h2 style="font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 8px 0; border-bottom: 1px solid ${themeColor}30; padding-bottom: 4px; color: ${themeColor};">
            Work Experience
          </h2>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            ${experienceHtml}
          </div>
        </div>
      ` : ''}

      <!-- Education -->
      ${education.length > 0 ? `
        <div style="margin-bottom: 20px;">
          <h2 style="font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 8px 0; border-bottom: 1px solid ${themeColor}30; padding-bottom: 4px; color: ${themeColor};">
            Education & Qualifications
          </h2>
          <div style="display: flex; flex-direction: column; gap: 16px;">
            ${educationHtml}
          </div>
        </div>
      ` : ''}

      <!-- Skills -->
      ${skills.length > 0 ? `
        <div style="margin-bottom: 20px;">
          <h2 style="font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 8px 0; border-bottom: 1px solid ${themeColor}30; padding-bottom: 4px; color: ${themeColor};">
            Skills
          </h2>
          <div style="display: flex; flex-wrap: wrap; gap: 2px;">
            ${skillsHtml}
          </div>
        </div>
      ` : ''}

      <!-- References -->
      ${references.length > 0 ? `
        <div style="margin-top: auto;">
          <h2 style="font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 8px 0; border-bottom: 1px solid ${themeColor}30; padding-bottom: 4px; color: ${themeColor};">
            References
          </h2>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            ${referencesHtml}
          </div>
        </div>
      ` : ''}
    </div>
  `;
}
