import { writeFileSync } from 'node:fs';

const catalog = [
  {
    id: 'fe-2022-sample',
    year: 2022,
    sourcePage: 'https://www.ipa.go.jp/shiken/mondai-kaiotu/2022r04.html',
    questionPdf: 'https://www.ipa.go.jp/shiken/mondai-kaiotu/2022r04h_fe_pm_qs.pdf',
    answerPdf: 'https://www.ipa.go.jp/shiken/mondai-kaiotu/2022r04h_fe_pm_ans.pdf',
  },
  {
    id: 'fe-2025-sample',
    year: 2025,
    sourcePage: 'https://www.ipa.go.jp/shiken/mondai-kaiotu/2025r07.html',
    questionPdf: 'https://www.ipa.go.jp/shiken/mondai-kaiotu/2025r07h_fe_pm_qs.pdf',
    answerPdf: 'https://www.ipa.go.jp/shiken/mondai-kaiotu/2025r07h_fe_pm_ans.pdf',
  },
  {
    id: 'fe-2024-sample',
    year: 2024,
    sourcePage: 'https://www.ipa.go.jp/shiken/mondai-kaiotu/2024r06.html',
    questionPdf: 'https://www.ipa.go.jp/shiken/mondai-kaiotu/2024r06h_fe_pm_qs.pdf',
    answerPdf: 'https://www.ipa.go.jp/shiken/mondai-kaiotu/2024r06h_fe_pm_ans.pdf',
  },
  {
    id: 'fe-2023-sample',
    year: 2023,
    sourcePage: 'https://www.ipa.go.jp/shiken/mondai-kaiotu/2023r05.html',
    questionPdf: 'https://www.ipa.go.jp/shiken/mondai-kaiotu/2023r05h_fe_pm_qs.pdf',
    answerPdf: 'https://www.ipa.go.jp/shiken/mondai-kaiotu/2023r05h_fe_pm_ans.pdf',
  },
];

writeFileSync('past-exam-catalog.json', JSON.stringify(catalog, null, 2), 'utf-8');
console.log('Generated past-exam-catalog.json');
