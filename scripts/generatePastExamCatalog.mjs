import { writeFileSync } from 'node:fs';

const BASE = 'https://www.ipa.go.jp';
const INDEX = `${BASE}/shiken/mondai-kaiotu/index.html`;

const html = await fetch(INDEX).then(r => r.text());
const pageCodes = [...new Set([...html.matchAll(/\/shiken\/mondai-kaiotu\/(\d{4}[a-z0-9]+)\.html/g)].map(m => m[1]))];

function toSeason(code) {
  if (code.includes('a')) return 'Autumn';
  return 'Spring';
}

function toYear(token) {
  const m = token.match(/^(\d{4})/);
  return m ? Number(m[1]) : 0;
}

const sets = [];
for (const code of pageCodes) {
  const pageUrl = `${BASE}/shiken/mondai-kaiotu/${code}.html`;
  const pageHtml = await fetch(pageUrl).then(r => r.text()).catch(() => '');
  if (!pageHtml) continue;

  const pdfs = [...new Set([...pageHtml.matchAll(/href="([^"]+_fe_[^"]+\.pdf)"/g)].map(m => m[1]))];
  const qs = pdfs.filter(p => p.endsWith('_qs.pdf'));
  const ans = pdfs.filter(p => p.endsWith('_ans.pdf'));

  for (const q of qs) {
    const stem = q.slice(0, -7);
    const a = ans.find(x => x.startsWith(stem));
    const token = stem.split('/').pop();
    const year = toYear(token);
    sets.push({
      id: `fe-${token}`,
      label: `${year} FE Public Set ${token}`,
      year,
      season: toSeason(token),
      sourceUrl: pageUrl,
      questionPdfUrl: new URL(q, BASE).toString(),
      answerPdfUrl: new URL(a ?? q, BASE).toString(),
    });
  }
}

const unique = [...new Map(sets.map(s => [s.id, s])).values()].sort((a, b) => {
  if (b.year !== a.year) return b.year - a.year;
  return a.id.localeCompare(b.id);
});

writeFileSync('past-exam-catalog.json', JSON.stringify(unique, null, 2), 'utf-8');
writeFileSync(
  'src/data/pastExamSetsGenerated.ts',
  `import type { PastExamSet } from './pastExams';\n\nexport const generatedPastExamSets: PastExamSet[] = ${JSON.stringify(unique, null, 2)};\n`,
  'utf-8',
);

console.log(`Generated ${unique.length} FE sets.`);
