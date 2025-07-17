import fs from 'fs/promises';
import path from 'path';
import fetch from 'node-fetch'; // optional in Node 18+

const INPUT_PATH = path.join('input.txt');
const DATA_PATH = path.join('data', 'papers-data.json');

const headers = {
  'User-Agent': 'doi-fetcher/1.0 (mailto:your@email.com)',
};

async function fetchPaperMetadata(doi) {
  const url = `https://api.crossref.org/works/${encodeURIComponent(doi)}`;
  try {
    const res = await fetch(url, { headers });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const item = data.message;

    return {
      title: Array.isArray(item.title) ? item.title[0] : item.title || 'Unknown',
      authors: item.author?.map(a => `${a.given} ${a.family}`) || [],
      journal: item['container-title']?.[0] || '',
      publisher: item.publisher || '',
      doi: item.DOI,
      url: `https://doi.org/${item.DOI}`,
      year: item.issued?.['date-parts']?.[0]?.[0] || null,
      volume: item.volume || '',
      issue: item.issue || '',
      pp: item.page || ''
    };
  } catch (err) {
    console.warn(`⚠️ Crossref failed for ${doi}: ${err.message}`);
    return null;
  }
}

async function smartFetchMetadata(input) {
  const trimmed = input.trim().replace(/\s+$/, '');
  const doi = trimmed.replace(/^https?:\/\/(dx\.)?doi\.org\//, '');
  return await fetchPaperMetadata(doi);
}

async function loadDOIsFromInput() {
  const raw = await fs.readFile(INPUT_PATH, 'utf8');
  return raw
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.length);
}

async function loadExistingMetadata() {
  try {
    const raw = await fs.readFile(DATA_PATH, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error(`❌ Failed to load ${DATA_PATH}: ${err.message}`);
    process.exit(1);
  }
}

async function main() {
  const inputDois = await loadDOIsFromInput();
  const existingData = await loadExistingMetadata();
  const existingDois = new Set(existingData.map(p => p.doi));

  const newDois = inputDois.filter(d => {
    const doi = d.replace(/^https?:\/\/(dx\.)?doi\.org\//, '');
    return !existingDois.has(doi);
  });

  if (newDois.length === 0) {
    console.log('✅ No new DOIs to add. All are already in data.json.');
    return;
  }

  console.log(`📥 Fetching ${newDois.length} new papers...`);

  const newMetadata = [];
  for (const doi of newDois) {
    const meta = await smartFetchMetadata(doi);
    if (meta) newMetadata.push(meta);
  }

  if (newMetadata.length === 0) {
    console.log('⚠️ No new metadata could be fetched.');
    return;
  }

  const updated = [...newMetadata, ...existingData];

  await fs.writeFile(DATA_PATH, JSON.stringify(updated, null, 2));
  console.log(`✅ Added ${newMetadata.length} new papers to data.json`);
}

main().catch(err => {
  console.error('❌ Error running fetch script:', err);
  process.exit(1);
});
