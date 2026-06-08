export default function GovernmentSriLanka(data) {
  const {
    fullName = 'Kamal Perera',
    email = 'kamal@gmail.com',
    phone = '+94 77 123 4567',
    nicNumber = '199512345678',
    address = '123, Galle Road, Colombo 03',
    summary = '',
    profilePhoto = '',
    education = [],
    experience = [],
    skills = [],
    references = [],
    themeColor = '#0f172a',
    civilStatus = 'Single',
    dob = '1995-05-12',
    nationality = 'Sri Lankan',
    gender = 'Male'
  } = data;

  const renderRow = (label, value) => {
    if (!value) return '';
    return `
      <tr style="border-bottom: 1px solid #cbd5e1;">
        <td style="padding: 8px 12px; font-weight: 600; color: #334155; width: 33.33%; bg-color: #f8fafc; border-right: 1px solid #cbd5e1;">${label}</td>
        <td style="padding: 8px 12px; color: #1e293b;">${value}</td>
      </tr>
    `;
  };

  const personalDetailsRows = [
    renderRow('Full Name', fullName),
    renderRow('Permanent Address', address),
    renderRow('Contact Number', phone),
    renderRow('Email Address', email),
    renderRow('National Identity Card (NIC) No.', nicNumber),
    renderRow('Date of Birth', dob),
    renderRow('Gender', gender),
    renderRow('Civil Status', civilStatus),
    renderRow('Nationality', nationality)
  ].join('');

  const educationHtml = education.map(edu => {
    const isExam = edu.type === 'ol' || edu.type === 'al';
    
    if (!isExam) {
      return `
        <div style="border: 1px solid #cbd5e1; border-radius: 4px; padding: 12px; background-color: #f8fafc; margin-bottom: 12px;">
          <div style="display: flex; justify-content: space-between; font-weight: 700; color: #0f172a;">
            <span>${edu.degree || edu.type}</span>
            <span>${edu.year}</span>
          </div>
          <div>${edu.institution || edu.school}</div>
          ${edu.grade ? `<div style="color: #475569; margin-top: 4px;">Class/GPA: <span style="font-weight: 600;">${edu.grade}</span></div>` : ''}
        </div>
      `;
    }

    let resultsRows = '';
    if (edu.results && edu.results.length > 0) {
      resultsRows = edu.results.map(res => `
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 4px 8px; text-align: left; border-right: 1px solid #e2e8f0;">${res.subject}</td>
          <td style="padding: 4px 8px; font-weight: 700; color: #0f172a;">${res.grade}</td>
        </tr>
      `).join('');
    }

    return `
      <div style="border: 1px solid #cbd5e1; padding: 12px; background-color: white; margin-bottom: 16px;">
        <div style="font-weight: 700; color: #0f172a; text-transform: uppercase; margin-bottom: 4px;">
          ${edu.type === 'ol' ? 'G.C.E. Ordinary Level Examination' : 'G.C.E. Advanced Level Examination'} — ${edu.year}
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; color: #334155; margin-bottom: 8px; font-size: 10px;">
          <div>School: <span style="font-weight: 600;">${edu.school}</span></div>
          <div>Index Number: <span style="font-weight: 600; font-family: monospace;">${edu.indexNumber || 'N/A'}</span></div>
          ${edu.stream ? `<div style="grid-column: span 2;">Stream: <span style="font-weight: 600;">${edu.stream}</span></div>` : ''}
        </div>

        ${edu.results && edu.results.length > 0 ? `
          <table style="width: 100%; border: 1px solid #e2e8f0; border-collapse: collapse; text-align: center; font-size: 10px;">
            <thead>
              <tr style="background-color: #f1f5f9; color: #475569; font-weight: 600; border-bottom: 1px solid #e2e8f0;">
                <th style="padding: 4px 8px; text-align: left; width: 66.66%; border-right: 1px solid #e2e8f0;">Subject</th>
                <th style="padding: 4px 8px;">Grade</th>
              </tr>
            </thead>
            <tbody>
              ${resultsRows}
            </tbody>
          </table>
        ` : ''}
      </div>
    `;
  }).join('');

  const experienceRows = experience.map(exp => `
    <tr style="border-bottom: 1px solid #cbd5e1;">
      <td style="padding: 8px 12px; border-right: 1px solid #cbd5e1; font-weight: 500; color: #475569;">${exp.duration}</td>
      <td style="padding: 8px 12px; border-right: 1px solid #cbd5e1; font-weight: 700; color: #1e293b;">
        ${exp.company} <br />
        <span style="font-size: 10px; color: #64748b; font-weight: 400;">${exp.role}</span>
      </td>
      <td style="padding: 8px 12px; color: #475569; font-size: 10px; text-align: justify;">${exp.description}</td>
    </tr>
  `).join('');

  const referencesHtml = references.map(ref => `
    <div style="border: 1px solid #f1f5f9; padding: 12px; background-color: #f8fafc; border-radius: 4px;">
      <div style="font-weight: 700; color: #1e293b; font-size: 12px;">${ref.name}</div>
      <div style="color: #475569;">${ref.designation}</div>
      <div style="color: #475569;">${ref.company}</div>
      ${ref.phone ? `<div style="color: #64748b; margin-top: 4px;">Phone: ${ref.phone}</div>` : ''}
      ${ref.email ? `<div style="color: #64748b;">Email: ${ref.email}</div>` : ''}
    </div>
  `).join('');

  return `
    <div style="color: #0f172a; font-size: 11px; line-height: 1.6; font-family: system-ui, -apple-system, sans-serif; width: 100%; box-sizing: border-box; padding: 50px; display: flex; flex-direction: column; background-color: white;">
      
      <!-- Title -->
      <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #0f172a; padding-bottom: 12px;">
        <h1 style="font-size: 20px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; margin: 0;">CURRICULUM VITAE</h1>
      </div>

      <!-- Profile Photo if present -->
      ${profilePhoto ? `
        <div style="display: flex; justify-content: flex-end; margin-bottom: 16px;">
          <img 
            src="${profilePhoto}" 
            alt="Profile" 
            style="width: 96px; height: 112px; object-fit: cover; border: 1px solid #94a3b8; padding: 2px; box-shadow: 0 1px 2px rgba(0,0,0,0.05);"
          />
        </div>
      ` : ''}

      <!-- 1. Personal Details -->
      <div style="margin-bottom: 24px;">
        <h2 style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 8px 0; border-left: 4px solid #0f172a; padding-left: 8px;">
          01. PERSONAL DETAILS
        </h2>
        <table style="width: 100%; border: 1px solid #cbd5e1; text-align: left; border-collapse: collapse;">
          <tbody>
            ${personalDetailsRows}
          </tbody>
        </table>
      </div>

      <!-- 2. Educational Qualifications -->
      ${education.length > 0 ? `
        <div style="margin-bottom: 24px;">
          <h2 style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 8px 0; border-left: 4px solid #0f172a; padding-left: 8px;">
            02. EDUCATIONAL QUALIFICATIONS
          </h2>
          <div>
            ${educationHtml}
          </div>
        </div>
      ` : ''}

      <!-- 3. Work Experience -->
      ${experience.length > 0 ? `
        <div style="margin-bottom: 24px;">
          <h2 style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 8px 0; border-left: 4px solid #0f172a; padding-left: 8px;">
            03. WORK EXPERIENCE
          </h2>
          <table style="width: 100%; border: 1px solid #cbd5e1; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f8fafc; color: #475569; font-weight: 600; border-bottom: 1px solid #cbd5e1; text-align: left;">
                <th style="padding: 8px 12px; border-right: 1px solid #cbd5e1; width: 20%;">Duration</th>
                <th style="padding: 8px 12px; border-right: 1px solid #cbd5e1; width: 35%;">Company & Role</th>
                <th style="padding: 8px 12px;">Description</th>
              </tr>
            </thead>
            <tbody>
              ${experienceRows}
            </tbody>
          </table>
        </div>
      ` : ''}

      <!-- 4. Skills -->
      ${skills.length > 0 ? `
        <div style="margin-bottom: 24px;">
          <h2 style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 8px 0; border-left: 4px solid #0f172a; padding-left: 8px;">
            04. SKILLS & COMPETENCIES
          </h2>
          <p style="color: #1e293b; margin: 0; padding-left: 4px;">${skills.join(', ')}</p>
        </div>
      ` : ''}

      <!-- 5. References -->
      ${references.length > 0 ? `
        <div style="margin-bottom: 30px;">
          <h2 style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 8px 0; border-left: 4px solid #0f172a; padding-left: 8px;">
            05. NON-RELATED REFEREES
          </h2>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
            ${referencesHtml}
          </div>
        </div>
      ` : ''}

      <!-- Declaration & Signature -->
      <div style="margin-top: auto; padding-top: 24px; border-top: 1px solid #cbd5e1;">
        <p style="color: #334155; font-style: italic; font-size: 10px; margin: 0 0 32px 0; text-align: justify;">
          I hereby declare that all the details furnished by me in this application are true, complete and correct to the best of my knowledge and belief.
        </p>
        <div style="display: flex; justify-content: space-between; align-items: flex-end;">
          <div style="display: flex; flex-direction: column; gap: 16px;">
            <div>........................................................ <br /><span style="color: #64748b; font-size: 9px;">Date</span></div>
            <div>........................................................ <br /><span style="color: #64748b; font-size: 9px;">Place</span></div>
          </div>
          <div style="text-align: center;">
            <div style="margin-bottom: 32px;">........................................................</div>
            <span style="font-weight: 750; color: #1e293b;">Signature of the Applicant</span>
          </div>
        </div>
      </div>
    </div>
  `;
}
