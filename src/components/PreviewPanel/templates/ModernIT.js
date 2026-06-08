export default function ModernIT(data) {
  const {
    fullName = 'Kamal Perera',
    email = 'kamal@gmail.com',
    phone = '+94 77 123 4567',
    nicNumber = '199512345678',
    address = '123, Galle Road, Colombo 03',
    linkedinUrl = 'linkedin.com/in/kamal',
    githubUrl = 'github.com/kamal',
    websiteUrl = '',
    summary = 'A highly motivated and detail-oriented Software Engineer with experience in developing responsive web applications.',
    profilePhoto = '',
    education = [],
    experience = [],
    skills = [],
    references = [],
    themeColor = '#4f46e5'
  } = data;

  const skillsHtml = skills.map(skill => `
    <span style="display: inline-block; padding: 2px 8px; background-color: rgba(255,255,255,0.1); color: white; border: 1px solid rgba(255,255,255,0.15); border-radius: 4px; font-weight: 500; font-size: 9px; margin-right: 6px; margin-bottom: 6px;">
      ${skill}
    </span>
  `).join('');

  const experienceHtml = experience.map(exp => `
    <div style="margin-bottom: 16px;">
      <div style="display: flex; justify-content: space-between; align-items: baseline; font-weight: 700; color: #1e293b;">
        <span style="font-size: 11px;">${exp.role}</span>
        <span style="font-size: 9px; font-weight: 500; color: #64748b;">${exp.duration}</span>
      </div>
      <div style="font-size: 10px; font-weight: 600; color: #64748b; margin-bottom: 4px;">${exp.company}</div>
      <p style="color: #475569; text-align: justify; margin: 0; font-size: 10px;">${exp.description}</p>
    </div>
  `).join('');

  const educationHtml = education.map(edu => {
    const isExam = edu.type === 'ol' || edu.type === 'al';
    
    let resultsHtml = '';
    if (isExam && edu.results && edu.results.length > 0) {
      const resultsGrid = edu.results.map(res => `
        <div style="display: flex; justify-content: space-between; padding-right: 6px; font-size: 9px; border-right: 1px solid #e2e8f0; box-sizing: border-box;">
          <span style="color: #64748b; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; margin-right: 4px;">${res.subject}</span>
          <span style="font-weight: 700; color: #0f172a;">${res.grade}</span>
        </div>
      `).join('');
      
      resultsHtml = `
        <div style="margin-top: 4px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; background-color: #f8fafc; padding: 6px; border-radius: 4px; border: 1px solid #f1f5f9;">
          ${resultsGrid}
        </div>
      `;
    }

    return `
      <div style="margin-bottom: 16px; font-size: 10px;">
        <div style="display: flex; justify-content: space-between; align-items: baseline; font-weight: 700; color: #1e293b;">
          <span style="font-size: 11px;">
            ${edu.type === 'ol' ? 'G.C.E. Ordinary Level (O/L)' : edu.type === 'al' ? 'G.C.E. Advanced Level (A/L)' : edu.degree || edu.type}
          </span>
          <span style="font-size: 9px; font-weight: 500; color: #64748b;">${edu.year}</span>
        </div>
        <div style="font-weight: 600; color: #475569; font-size: 10px; margin-bottom: 2px;">
          ${edu.school || edu.institution}
          ${edu.indexNumber ? `<span style="margin-left: 8px; font-family: monospace; font-weight: 400; color: #94a3b8;">Index: ${edu.indexNumber}</span>` : ''}
          ${edu.stream ? `<span style="margin-left: 8px; font-weight: 400; color: #64748b;">(${edu.stream} Stream)</span>` : ''}
        </div>
        ${resultsHtml}
        ${!isExam && edu.grade ? `<p style="color: #64748b; font-size: 10px; margin: 2px 0 0 0;">GPA/Result: <span style="font-weight: 600; color: #1e293b;">${edu.grade}</span></p>` : ''}
      </div>
    `;
  }).join('');

  const referencesHtml = references.map(ref => `
    <div style="font-size: 9px; color: #475569;">
      <div style="font-weight: 700; color: #1e293b; font-size: 10px;">${ref.name}</div>
      <div>${ref.designation}</div>
      <div style="font-weight: 600;">${ref.company}</div>
      ${ref.phone ? `<div>Phone: ${ref.phone}</div>` : ''}
      ${ref.email ? `<div style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">Email: ${ref.email}</div>` : ''}
    </div>
  `).join('');

  return `
    <div style="width: 100%; height: 100%; display: flex; color: #334155; font-size: 11px; line-height: 1.6; font-family: system-ui, -apple-system, sans-serif; background-color: white; box-sizing: border-box;">
      
      <!-- Sidebar - Left Panel -->
      <div style="width: 33.33%; background-color: ${themeColor}; color: white; padding: 24px; display: flex; flex-direction: column; box-sizing: border-box;">
        
        <!-- Profile Image -->
        ${profilePhoto ? `
          <img 
            src="${profilePhoto}" 
            alt="${fullName}" 
            style="width: 96px; height: 96px; border-radius: 50%; margin: 0 auto 24px auto; object-fit: cover; border: 4px solid rgba(255,255,255,0.2); box-shadow: 0 4px 6px rgba(0,0,0,0.1);"
          />
        ` : `
          <div style="width: 96px; height: 96px; border-radius: 50%; margin: 0 auto 24px auto; background-color: rgba(255,255,255,0.1); border: 4px solid rgba(255,255,255,0.2); display: flex; items-center: center; justify-content: center; align-items: center; box-sizing: border-box;">
            <span style="font-size: 28px; font-weight: 800; opacity: 0.6; letter-spacing: 1px;">
              ${fullName.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
        `}

        <!-- Contact Info -->
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <div>
            <h3 style="font-weight: 700; border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 4px; margin: 0 0 8px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: rgba(255,255,255,0.9);">Contact</h3>
            <ul style="list-style-type: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 6px; color: rgba(255,255,255,0.8); font-size: 10px;">
              <li style="word-break: break-all;"><strong>Phone:</strong> ${phone}</li>
              <li style="word-break: break-all;"><strong>Email:</strong> ${email}</li>
              ${nicNumber ? `<li><strong>NIC:</strong> ${nicNumber}</li>` : ''}
              ${address ? `<li style="font-size: 9px;">${address}</li>` : ''}
            </ul>
          </div>

          <!-- Social Links -->
          ${(linkedinUrl || githubUrl || websiteUrl) ? `
            <div>
              <h3 style="font-weight: 700; border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 4px; margin: 0 0 8px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: rgba(255,255,255,0.9);">Links</h3>
              <ul style="list-style-type: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 6px; color: rgba(255,255,255,0.8); font-size: 10px;">
                ${linkedinUrl ? `<li style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;"><strong>LinkedIn:</strong> <span style="font-size: 9px; text-decoration: underline;">${linkedinUrl}</span></li>` : ''}
                ${githubUrl ? `<li style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;"><strong>GitHub:</strong> <span style="font-size: 9px; text-decoration: underline;">${githubUrl}</span></li>` : ''}
                ${websiteUrl ? `<li style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;"><strong>Web:</strong> <span style="font-size: 9px; text-decoration: underline;">${websiteUrl}</span></li>` : ''}
              </ul>
            </div>
          ` : ''}

          <!-- Skills -->
          ${skills.length > 0 ? `
            <div style="margin-top: auto; padding-top: 16px;">
              <h3 style="font-weight: 700; border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 4px; margin: 0 0 8px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: rgba(255,255,255,0.9);">Core Skills</h3>
              <div style="display: flex; flex-wrap: wrap; gap: 2px; padding-top: 4px;">
                ${skillsHtml}
              </div>
            </div>
          ` : ''}
        </div>
      </div>

      <!-- Main Content - Right Panel -->
      <div style="width: 66.66%; padding: 32px; display: flex; flex-direction: column; box-sizing: border-box;">
        
        <!-- Name / Title -->
        <div style="margin-bottom: 20px;">
          <h1 style="font-size: 24px; font-weight: 900; letter-spacing: -0.5px; color: #0f172a; text-transform: uppercase; margin: 0;">${fullName}</h1>
          <p style="font-weight: 600; font-size: 12px; margin: 4px 0 0 0; color: ${themeColor};">PROFESSIONAL RESUME</p>
        </div>

        <!-- Profile Summary -->
        ${summary ? `
          <div style="margin-bottom: 24px;">
            <h2 style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 8px 0; border-bottom: 1px solid ${themeColor}20; padding-bottom: 4px; color: ${themeColor};">
              About Me
            </h2>
            <p style="color: #475569; text-align: justify; margin: 0;">${summary}</p>
          </div>
        ` : ''}

        <!-- Experience -->
        ${experience.length > 0 ? `
          <div style="margin-bottom: 24px;">
            <h2 style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 8px 0; border-bottom: 1px solid ${themeColor}20; padding-bottom: 4px; color: ${themeColor};">
              Work Experience
            </h2>
            <div style="display: flex; flex-direction: column; gap: 16px;">
              ${experienceHtml}
            </div>
          </div>
        ` : ''}

        <!-- Education -->
        ${education.length > 0 ? `
          <div style="margin-bottom: 24px;">
            <h2 style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 8px 0; border-bottom: 1px solid ${themeColor}20; padding-bottom: 4px; color: ${themeColor};">
              Education & Academic Details
            </h2>
            <div style="display: flex; flex-direction: column; gap: 16px;">
              ${educationHtml}
            </div>
          </div>
        ` : ''}

        <!-- References -->
        ${references.length > 0 ? `
          <div style="margin-top: auto; padding-top: 16px; border-top: 1px solid #f1f5f9;">
            <h2 style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 8px 0; color: ${themeColor};">
              References
            </h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
              ${referencesHtml}
            </div>
          </div>
        ` : ''}
      </div>
    </div>
  `;
}
