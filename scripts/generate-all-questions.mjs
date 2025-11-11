import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load quiz data
const energy = JSON.parse(fs.readFileSync(path.join(__dirname, '../lib/data/quiz/energy.json'), 'utf8'));
const libido = JSON.parse(fs.readFileSync(path.join(__dirname, '../lib/data/quiz/libido.json'), 'utf8'));
const muscle = JSON.parse(fs.readFileSync(path.join(__dirname, '../lib/data/quiz/muscle.json'), 'utf8'));

let md = '# Всички Въпроси от Quiz-овете\n\n';
md += 'Документ съдържащ всички 26 въпроса от трите quiz категории.\n\n';
md += '**Дата на генериране:** ' + new Date().toLocaleString('bg-BG') + '\n\n';
md += '**Общо въпроси:** 78 (26 x 3)\n\n';
md += '---\n\n';

function formatQuiz(quiz, title, emoji) {
  let content = `## ${emoji} ${title}\n\n`;
  content += `**Категория:** ${quiz.quiz_metadata.category_name}\n`;
  content += `**Версия:** ${quiz.quiz_metadata.version}\n`;
  content += `**Общо въпроси:** ${quiz.quiz_metadata.total_questions}\n`;
  content += `**Максимален резултат:** ${quiz.quiz_metadata.max_score}\n`;
  content += `**Очаквано време:** ${quiz.quiz_metadata.estimated_time_minutes} минути\n\n`;
  content += '---\n\n';

  quiz.questions.forEach((q) => {
    content += `### Въпрос ${q.number} (${q.id})\n\n`;
    content += `**Секция:** ${q.section}\n`;
    content += `**Тип:** ${q.type}\n`;
    content += `**Задължителен:** ${q.required ? 'Да' : 'Не'}\n\n`;

    content += `**Въпрос:**\n> ${q.question}\n\n`;

    if (q.description) {
      content += `**Описание:**\n> ${q.description}\n\n`;
    }

    if (q.placeholder) {
      content += `**Placeholder:** ${q.placeholder}\n\n`;
    }

    if (q.options && q.options.length > 0) {
      content += '**Опции:**\n';
      q.options.forEach((opt, i) => {
        content += `${i + 1}. ${opt.text} (${opt.points} точки)\n`;
        if (opt.note) content += `   - Забележка: ${opt.note}\n`;
        if (opt.description) content += `   - ${opt.description}\n`;
      });
      content += '\n';
    }

    if (q.scale) {
      content += '**Скала:**\n';
      content += `- Минимум: ${q.scale.min} (${q.scale.min_label})\n`;
      content += `- Максимум: ${q.scale.max} (${q.scale.max_label})\n`;
      content += `- Множител точки: ${q.scale.points_multiplier}\n\n`;
    }

    if (q.dynamic_copy && q.dynamic_copy.length > 0) {
      content += '**Динамично съдържание:**\n';
      q.dynamic_copy.forEach((dc, i) => {
        content += `${i + 1}. Условие: ${dc.condition}\n`;
        content += `   > ${dc.text}\n`;
      });
      content += '\n';
    }

    content += '---\n\n';
  });

  return content;
}

// Generate markdown for all quizzes
md += formatQuiz(energy, 'ЕНЕРГИЯ И ФОКУС QUIZ', '1️⃣');
md += '\n\n';
md += formatQuiz(libido, 'ЛИБИДО И СЕКСУАЛНО ЗДРАВЕ QUIZ', '2️⃣');
md += '\n\n';
md += formatQuiz(muscle, 'МУСКУЛНА МАСА И СИЛА QUIZ', '3️⃣');

// Add statistics
md += '\n---\n\n';
md += '## Статистика\n\n';
md += `- Energy Quiz: ${energy.questions.length} въпроса\n`;
md += `- Libido Quiz: ${libido.questions.length} въпроса\n`;
md += `- Muscle Quiz: ${muscle.questions.length} въпроса\n`;
md += `- **ОБЩО:** ${energy.questions.length + libido.questions.length + muscle.questions.length} въпроса\n\n`;
md += '---\n\n';
md += '*Генерирано автоматично от Testograph Quiz System*\n';

// Write to file
const outputPath = path.join(__dirname, '../ALL_QUIZ_QUESTIONS.md');
fs.writeFileSync(outputPath, md);

console.log('✅ Файлът ALL_QUIZ_QUESTIONS.md е създаден успешно!');
console.log('📍 Локация:', outputPath);
console.log('📄 Общо въпроси:', energy.questions.length + libido.questions.length + muscle.questions.length);
