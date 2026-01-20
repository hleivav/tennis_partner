import fs from 'fs';
import mammoth from 'mammoth';
import TurndownService from 'turndown';

async function convert() {
  try {
    const docxPath = 'tennispartner.docx';
    const mdOut = 'docs/tennispartner.md';
    const result = await mammoth.convertToHtml({ path: docxPath });
    const html = result.value; // The generated HTML
    const turndownService = new TurndownService({ headingStyle: 'atx' });
    const markdown = turndownService.turndown(html);

    fs.writeFileSync(mdOut, '# TennisPartner — konverterat kravdokument\n\n' + markdown);
    console.log('Wrote', mdOut);

    // Create a short summary (first two paragraphs)
    const paragraphs = markdown.split(/\n\n+/).filter(p => p.trim());
    const summary = paragraphs.slice(0, 2).join('\n\n');

    // Update README.md with a short summary section (append)
    const readmePath = 'README.md';
    let readme = fs.readFileSync(readmePath, 'utf8');
    const summarySection = '\n\n---\n\n## Kort sammanfattning\n\n' + summary + '\n\n---\n';

    if (!readme.includes('## Kort sammanfattning')) {
      readme = readme + summarySection;
      fs.writeFileSync(readmePath, readme);
      console.log('Appended summary to README.md');
    } else {
      console.log('README.md already contains a summary section. Skipping append.');
    }

  } catch (err) {
    console.error('Error converting docx:', err);
    process.exit(1);
  }
}

convert();
