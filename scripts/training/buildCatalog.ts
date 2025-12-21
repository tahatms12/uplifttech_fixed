import fs from 'fs';
import path from 'path';
import { loadCurriculumFile } from './parseCurriculum';

const CURRICULUM_MARKDOWN_PATH = path.join(
  process.cwd(),
  'UPLIFT TECHNOLOGIES HEALTHCARE-OPERATIONS TRAINING CURRICULUM.md'
);
const CURRICULUM_EXPORT_PATH = path.join(process.cwd(), 'src/data/training/exports/curriculum.generated.json');

function buildCatalog() {
  const curriculum = loadCurriculumFile(CURRICULUM_MARKDOWN_PATH);
  fs.mkdirSync(path.dirname(CURRICULUM_EXPORT_PATH), { recursive: true });
  fs.writeFileSync(CURRICULUM_EXPORT_PATH, JSON.stringify(curriculum, null, 2));
}

buildCatalog();
