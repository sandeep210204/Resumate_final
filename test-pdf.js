const puppeteer = require('puppeteer');

async function testPdf() {
  try {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setContent('<html><body><h1>Test PDF</h1></body></html>');
    const pdf = await page.pdf({ format: 'A4' });
    await browser.close();
    
    require('fs').writeFileSync('test.pdf', pdf);
    console.log('Test PDF created successfully');
  } catch (error) {
    console.error('PDF test failed:', error);
  }
}

testPdf();