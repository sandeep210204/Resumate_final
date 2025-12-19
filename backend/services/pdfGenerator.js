const path = require('path');
const fs = require('fs');
const puppeteer = require('puppeteer');

/**
 * Reads a resume HTML template and injects the provided data.
 * Templates live in backend/templates.
 */
function buildTemplateHtml(templateName, data) {
  const templatePath = path.join(__dirname, '../templates', `${templateName}.html`);

  if (!fs.existsSync(templatePath)) {
    const err = new Error('Template not found');
    err.status = 404;
    throw err;
  }

  let template = fs.readFileSync(templatePath, 'utf8');

  // Very small placeholder system
  const replacements = {
    '{{summary}}': (data.summary || '').replace(/["']/g, ''),
    '{{experienceHTML}}': data.experienceHTML || '',
    '{{educationHTML}}': data.educationHTML || '',
    '{{skillsHTML}}': data.skillsHTML || '',
    '{{projectsHTML}}': data.projectsHTML || '',
    '{{certificationsHTML}}': data.certificationsHTML || '',
    '{{name}}': (data.name || '').replace(/["']/g, ''),
    '{{email}}': (data.email || '').replace(/["']/g, ''),
    '{{phone}}': (data.phone || '').replace(/["']/g, ''),
    '{{location}}': (data.location || '').replace(/["']/g, ''),
    '{{linkedin}}': (data.linkedin || '').replace(/["']/g, ''),
    '{{github}}': (data.github || '').replace(/["']/g, ''),
    '{{portfolio}}': (data.portfolio || '').replace(/["']/g, ''),
  };

  Object.entries(replacements).forEach(([key, value]) => {
    template = template.replace(new RegExp(key, 'g'), value);
  });

  return template;
}

async function generatePdfFromTemplate(templateName, data) {
  const html = buildTemplateHtml(templateName, data);
  console.log('Generated HTML length:', html.length);

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
    const page = await browser.newPage();
    
    await page.setContent(html, { 
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0.5in',
        right: '0.5in',
        bottom: '0.5in',
        left: '0.5in'
      }
    });

    console.log('PDF generated, size:', pdfBuffer.length);
    return pdfBuffer;
  } catch (error) {
    console.error('PDF generation error:', error);
    throw new Error(`PDF generation failed: ${error.message}`);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

module.exports = {
  generatePdfFromTemplate,
};


