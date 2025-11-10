import puppeteer from 'puppeteer';
import handlebars from 'handlebars';
import fs from 'fs/promises';
import path from 'path';

export const generatePropertyPDF = async (property) => {
  try {
    // Read template
    const templatePath = path.join(process.cwd(), 'templates', 'pdf', 'property.hbs');
    const templateContent = await fs.readFile(templatePath, 'utf-8');
    const template = handlebars.compile(templateContent);

    // Generate HTML
    const html = template({
      property,
      generatedDate: new Date().toLocaleDateString(),
    });

    // Launch browser
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox'],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    // Generate PDF
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm',
      },
    });

    await browser.close();

    return pdf;
  } catch (error) {
    console.error('PDF Generation Error:', error);
    throw error;
  }
};

export const generateInvoicePDF = async (invoice) => {
  try {
    const templatePath = path.join(process.cwd(), 'templates', 'pdf', 'invoice.hbs');
    const templateContent = await fs.readFile(templatePath, 'utf-8');
    const template = handlebars.compile(templateContent);

    const html = template({
      invoice,
      generatedDate: new Date().toLocaleDateString(),
    });

    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox'],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
    });

    await browser.close();

    return pdf;
  } catch (error) {
    console.error('Invoice PDF Generation Error:', error);
    throw error;
  }
};