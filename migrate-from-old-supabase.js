import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import dotenv from 'dotenv';

// Load .env file
dotenv.config();

// Old Supabase credentials - এখানে আপনার পুরানো project এর details দিন
const OLD_SUPABASE_URL = process.env.OLD_SUPABASE_URL;
const OLD_SUPABASE_KEY = process.env.OLD_SUPABASE_SERVICE_KEY;

if (!OLD_SUPABASE_URL || !OLD_SUPABASE_KEY) {
  console.error('❌ Error: OLD_SUPABASE_URL and OLD_SUPABASE_SERVICE_KEY must be set in .env file');
  process.exit(1);
}

const oldSupabase = createClient(OLD_SUPABASE_URL, OLD_SUPABASE_KEY);

const tables = [
  'achievements',
  'activity',
  'contents',
  'profiles',
  'team_members',
  'teams',
  'chapters',
  'grades',
  'quizzes',
  'subjects',
  'users',
  'goals',
  'friends',
  'results',
  'student_activities',
  'student_stats'
];

async function getTableSchema(tableName) {
  console.log(`\n📋 Fetching schema for: ${tableName}`);

  const { data, error } = await oldSupabase.rpc('exec_sql', {
    query: `
      SELECT
        column_name,
        data_type,
        is_nullable,
        column_default
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = '${tableName}'
      ORDER BY ordinal_position;
    `
  });

  if (error) {
    // Try alternative method
    const { data: altData, error: altError } = await oldSupabase
      .from(tableName)
      .select('*')
      .limit(1);

    if (altError) {
      console.log(`⚠️  Could not fetch schema for ${tableName}: ${altError.message}`);
      return null;
    }

    return altData;
  }

  return data;
}

async function exportTableData(tableName) {
  console.log(`\n📦 Exporting data from: ${tableName}`);

  try {
    const { data, error } = await oldSupabase
      .from(tableName)
      .select('*');

    if (error) {
      console.log(`⚠️  Error: ${error.message}`);
      return null;
    }

    console.log(`✅ Exported ${data?.length || 0} rows`);
    return data;
  } catch (err) {
    console.log(`⚠️  Error: ${err.message}`);
    return null;
  }
}

async function generateCreateTableSQL(tableName, sampleData) {
  if (!sampleData || sampleData.length === 0) {
    return `-- No data available for ${tableName}\n`;
  }

  const sample = sampleData[0];
  const columns = Object.keys(sample).map(key => {
    const value = sample[key];
    let type = 'text';

    if (typeof value === 'number') {
      type = Number.isInteger(value) ? 'integer' : 'numeric';
    } else if (typeof value === 'boolean') {
      type = 'boolean';
    } else if (value instanceof Date || (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}/))) {
      type = 'timestamptz';
    } else if (key === 'id') {
      type = 'uuid';
    }

    return `  ${key} ${type}`;
  }).join(',\n');

  return `
CREATE TABLE IF NOT EXISTS ${tableName} (
${columns}
);

ALTER TABLE ${tableName} ENABLE ROW LEVEL SECURITY;

-- Basic policies (adjust based on your needs)
CREATE POLICY "Enable read for authenticated users" ON ${tableName}
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable insert for authenticated users" ON ${tableName}
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON ${tableName}
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users" ON ${tableName}
  FOR DELETE TO authenticated USING (true);
`;
}

async function main() {
  console.log('🚀 Starting migration from old Supabase project...\n');
  console.log('Old Project URL:', OLD_SUPABASE_URL);

  const migrationSQL = [];
  const dataExport = {};

  // Export all data
  for (const tableName of tables) {
    const data = await exportTableData(tableName);
    if (data && data.length > 0) {
      dataExport[tableName] = data;
      const sql = await generateCreateTableSQL(tableName, data);
      migrationSQL.push(sql);
    }
  }

  // Save SQL to file
  const sqlContent = `
/*
  # Complete Schema Migration

  Migrated from old Supabase project
  Date: ${new Date().toISOString()}

  Tables included: ${Object.keys(dataExport).join(', ')}
*/

${migrationSQL.join('\n\n')}
`;

  fs.writeFileSync('migration-schema.sql', sqlContent);
  console.log('\n✅ Schema SQL saved to: migration-schema.sql');

  // Save data to JSON
  fs.writeFileSync('migration-data.json', JSON.stringify(dataExport, null, 2));
  console.log('✅ Data saved to: migration-data.json');

  console.log('\n📊 Migration Summary:');
  console.log('─────────────────────────────────');
  for (const [table, data] of Object.entries(dataExport)) {
    console.log(`  ${table}: ${data.length} rows`);
  }
  console.log('─────────────────────────────────');

  console.log('\n🎉 Migration export complete!');
  console.log('\n📝 Next steps:');
  console.log('1. Review migration-schema.sql');
  console.log('2. Apply schema to new database');
  console.log('3. Import data from migration-data.json');
}

main().catch(console.error);
