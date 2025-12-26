import * as fs from 'fs';

const data = JSON.parse(fs.readFileSync('migration-data.json', 'utf8'));

// Generate INSERT statements
console.log('-- GRADES');
if (data.grades && data.grades.length > 0) {
  for (const grade of data.grades) {
    const name = grade.name || grade.class_name || `Grade ${grade.id}`;
    const description = (grade.description || '').replace(/'/g, "''");
    console.log(`INSERT INTO grades (name, description, order_index) VALUES ('${name}', '${description}', ${grade.id || 0}) ON CONFLICT DO NOTHING;`);
  }
}

console.log('\n-- SUBJECTS');
if (data.subjects && data.subjects.length > 0) {
  for (const subject of data.subjects) {
    const id = subject.id;
    const name = (subject.name || subject.subject_name || '').replace(/'/g, "''");
    const description = (subject.description || '').replace(/'/g, "''");
    const icon = (subject.icon || '').replace(/'/g, "''");
    const color = subject.color || '#000000';

    if (id && name) {
      console.log(`INSERT INTO subjects (id, name, description, icon, color) VALUES ('${id}', '${name}', '${description}', '${icon}', '${color}') ON CONFLICT (id) DO NOTHING;`);
    }
  }
}

console.log('\n-- CONTENTS');
if (data.contents && data.contents.length > 0) {
  for (const content of data.contents) {
    const id = content.id;
    const title = (content.title || '').replace(/'/g, "''");
    const subtitle = content.subtitle ? `'${content.subtitle.replace(/'/g, "''")}'` : 'NULL';
    const description = content.description ? `'${content.description.replace(/'/g, "''")}'` : 'NULL';
    const contentType = content.content_type === 'youtube' ? 'video' : (content.content_type || 'lesson');
    const youtubeLink = content.youtube_link ? `'${content.youtube_link}'` : 'NULL';
    const fileUrl = content.file_url ? `'${content.file_url}'` : 'NULL';
    const isPublished = content.is_published !== false;
    const orderIndex = content.lesson_order || 0;

    // Prepare content_data JSON
    let contentData = '{}';
    if (content.pages) {
      contentData = JSON.stringify({ pages: content.pages }).replace(/'/g, "''");
    } else if (content.content_data) {
      contentData = JSON.stringify(content.content_data).replace(/'/g, "''");
    }

    console.log(`INSERT INTO contents (id, title, subtitle, description, content_type, youtube_link, file_url, is_published, order_index, content_data) VALUES ('${id}', '${title}', ${subtitle}, ${description}, '${contentType}', ${youtubeLink}, ${fileUrl}, ${isPublished}, ${orderIndex}, '${contentData}'::jsonb) ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, subtitle = EXCLUDED.subtitle, description = EXCLUDED.description, youtube_link = EXCLUDED.youtube_link, is_published = EXCLUDED.is_published;`);
  }
}

console.log('\n-- Done! Copy the SQL above and run it in Supabase SQL Editor');
