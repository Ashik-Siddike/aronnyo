import 'dotenv/config';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function seed() {
  await client.connect();
  const db = client.db('play_learn_grow');
  console.log('✅ Connected to MongoDB');

  // ========== CLEAN OLD DATA ==========
  console.log('🧹 Cleaning old data...');
  await db.collection('subjects').deleteMany({});
  await db.collection('contents').deleteMany({});
  await db.collection('chapters').deleteMany({});
  // Keep existing real users, add demo students
  await db.collection('users').deleteMany({ role: 'student' });
  await db.collection('profiles').deleteMany({});
  await db.collection('activity').deleteMany({});
  await db.collection('achievements').deleteMany({});
  await db.collection('friends').deleteMany({});

  // ========== SUBJECTS (for all 6 grades) ==========
  console.log('📚 Inserting subjects...');
  const subjectNames = ['গণিত (Math)', 'ইংরেজি (English)', 'বাংলা (Bangla)', 'বিজ্ঞান (Science)'];
  const subjects = [];
  let subId = 1;
  for (let gradeId = 1; gradeId <= 6; gradeId++) {
    for (const name of subjectNames) {
      subjects.push({ _id: subId, name, grade_id: gradeId });
      subId++;
    }
  }
  await db.collection('subjects').insertMany(subjects);
  console.log(`  ✅ ${subjects.length} subjects inserted`);

  // ========== CHAPTERS ==========
  console.log('📖 Inserting chapters...');
  const gradeLevels = {
    1: 'Nursery',
    2: 'Grade 1',
    3: 'Grade 2',
    4: 'Grade 3',
    5: 'Grade 4',
    6: 'Grade 5'
  };

  const chapters = [];
  let chId = 1;

  for (const sub of subjects) {
    let chNames = [];
    if (sub.grade_id === 1) { // Nursery
      if (sub.name === 'গণিত (Math)') chNames = ['১ থেকে ১০ গণনা', 'আকৃতি চেনা', 'রঙ চেনা'];
      if (sub.name === 'ইংরেজি (English)') chNames = ['Alphabets A-Z', 'Rhymes', 'Animals'];
      if (sub.name === 'বাংলা (Bangla)') chNames = ['স্বরবর্ণ', 'ব্যঞ্জনবর্ণ', 'ছড়া'];
      if (sub.name === 'বিজ্ঞান (Science)') chNames = ['পরিবেশ', 'পশুপাখি', 'ফুল ও ফল'];
    } else if (sub.grade_id === 2 || sub.grade_id === 3) { // Grade 1 & 2
      if (sub.name === 'গণিত (Math)') chNames = ['যোগ ও বিয়োগ', 'নামতা (১-৫)', 'পরিমাপ'];
      if (sub.name === 'ইংরেজি (English)') chNames = ['Words', 'Simple Sentences', 'Stories'];
      if (sub.name === 'বাংলা (Bangla)') chNames = ['শব্দ গঠন', 'বাক্য তৈরি', 'গল্প'];
      if (sub.name === 'বিজ্ঞান (Science)') chNames = ['মানবদেহ', 'উদ্ভিদ', 'আবহাওয়া'];
    } else { // Grade 3, 4, 5
      if (sub.name === 'গণিত (Math)') chNames = ['গুণ ও ভাগ', 'ভগ্নাংশ', 'জ্যামিতি'];
      if (sub.name === 'ইংরেজি (English)') chNames = ['Grammar', 'Reading Comprehension', 'Paragraphs'];
      if (sub.name === 'বাংলা (Bangla)') chNames = ['ব্যাকরণ', 'রচনা', 'কবিতা'];
      if (sub.name === 'বিজ্ঞান (Science)') chNames = ['সৌরজগৎ', 'পদার্থ', 'শক্তি'];
    }

    chNames.forEach((ch, idx) => {
      chapters.push({
        _id: chId, name: ch, description: `${ch} — ${gradeLevels[sub.grade_id]}`,
        subject_id: sub._id, grade_id: sub.grade_id, order: idx + 1,
        created_at: new Date().toISOString()
      });
      chId++;
    });
  }
  await db.collection('chapters').insertMany(chapters);
  console.log(`  ✅ ${chapters.length} chapters inserted`);

  // ========== CONTENTS (Lessons) ==========
  console.log('🎬 Inserting lesson contents...');
  
  const contents = [];
  
  for (const sub of subjects) {
    const chaptersForSub = chapters.filter(c => c.subject_id === sub._id);
    
    chaptersForSub.forEach((ch, idx) => {
      // Create different content types
      let type = 'youtube';
      let link = 'https://www.youtube.com/watch?v=DR-cfDsHCGA';
      let pages = [];
      let fileUrl = null;

      if (idx % 3 === 0) {
        type = 'youtube';
        link = 'https://www.youtube.com/watch?v=DR-cfDsHCGA';
      } else if (idx % 3 === 1) {
        type = 'text';
        pages = [
          { title: `${ch.name} - পাঠ ১`, content: 'এটি একটি সুন্দর পাঠ। মনোযোগ দিয়ে পড়ো।' },
          { title: `${ch.name} - পাঠ ২`, content: 'আরও অনেক কিছু শেখার আছে।' }
        ];
        link = null;
      } else {
        type = 'pdf';
        fileUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
        link = null;
      }

      contents.push({
        _id: `content-${sub.grade_id}-${sub._id}-${idx + 1}`,
        title: `${ch.name} - বিস্তারিত`,
        subtitle: `${gradeLevels[sub.grade_id]} - ${sub.name}`,
        description: `${ch.name} এর উপর একটি মজার পাঠ।`,
        content_type: type,
        youtube_link: link,
        file_url: fileUrl,
        pages: pages,
        class: gradeLevels[sub.grade_id],
        subject: sub.name,
        grade_id: sub.grade_id,
        subject_id: sub._id,
        chapter_id: ch._id,
        lesson_order: idx + 1,
        is_published: true,
        created_at: new Date(Date.now() - Math.random() * 30 * 86400000).toISOString()
      });
    });
  }
  await db.collection('contents').insertMany(contents);
  console.log(`  ✅ ${contents.length} lesson contents inserted`);

  // ========== DEMO STUDENTS ==========
  console.log('👨‍🎓 Inserting demo students...');
  const studentNames = [
    { name: 'ফাতিমা রহমান', email: 'fatima@student.247school.com', avatar: '👧', grade: 1 },
    { name: 'আরিফ হোসেন', email: 'arif@student.247school.com', avatar: '👦', grade: 2 },
    { name: 'নুসরাত জাহান', email: 'nusrat@student.247school.com', avatar: '👧', grade: 3 },
    { name: 'সাকিব আহমেদ', email: 'sakib@student.247school.com', avatar: '👦', grade: 4 },
    { name: 'মিম আক্তার', email: 'mim@student.247school.com', avatar: '👧', grade: 5 },
    { name: 'রায়হান ইসলাম', email: 'raihan@student.247school.com', avatar: '👦', grade: 6 },
    { name: 'তানহা সুলতানা', email: 'tanha@student.247school.com', avatar: '👧', grade: 1 },
    { name: 'জুবায়ের খান', email: 'jubayer@student.247school.com', avatar: '👦', grade: 2 },
  ];

  const demoStudents = studentNames.map((s, i) => ({
    _id: `student-${i + 1}`,
    email: s.email,
    full_name: s.name,
    avatar_emoji: s.avatar,
    role: 'student',
    grade_id: s.grade,
    email_verified: true,
    is_anonymous: false,
    providers: ['email'],
    created_at: new Date(Date.now() - (60 + Math.random() * 300) * 86400000).toISOString(),
    updated_at: new Date().toISOString()
  }));
  await db.collection('users').insertMany(demoStudents);
  console.log(`  ✅ ${demoStudents.length} demo students inserted`);

  // ========== DEMO TEACHERS ==========
  console.log('👩‍🏫 Inserting demo teachers...');
  const teachers = [
    { _id: 'teacher-1', email: 'nasrin@teacher.247school.com', full_name: 'নাসরিন আক্তার', role: 'teacher', subject: 'গণিত (Math)' },
    { _id: 'teacher-2', email: 'karim@teacher.247school.com', full_name: 'আব্দুল করিম', role: 'teacher', subject: 'ইংরেজি (English)' },
    { _id: 'teacher-3', email: 'sharmin@teacher.247school.com', full_name: 'শারমিন সুলতানা', role: 'teacher', subject: 'বাংলা (Bangla)' },
    { _id: 'teacher-4', email: 'rafiq@teacher.247school.com', full_name: 'রফিকুল ইসলাম', role: 'teacher', subject: 'বিজ্ঞান (Science)' },
  ].map(t => ({ ...t, email_verified: true, is_anonymous: false, providers: ['email'], created_at: new Date().toISOString(), updated_at: new Date().toISOString() }));
  
  await db.collection('users').deleteMany({ role: 'teacher' });
  await db.collection('users').insertMany(teachers);
  console.log(`  ✅ ${teachers.length} teachers inserted`);

  // ========== STUDENT PROFILES ==========
  console.log('📊 Inserting student profiles...');
  const profiles = demoStudents.map((s, i) => ({
    _id: `profile-${s._id}`,
    user_id: s._id,
    full_name: s.full_name,
    avatar_emoji: s.avatar_emoji || '👦',
    grade_id: s.grade_id,
    total_stars: Math.floor(200 + Math.random() * 1800),
    badges: Math.floor(3 + Math.random() * 20),
    hours_learned: Math.floor(10 + Math.random() * 80),
    accuracy: Math.floor(65 + Math.random() * 35),
    streak: Math.floor(Math.random() * 15),
    level: ['নতুন শিক্ষার্থী', 'তারকা শিক্ষার্থী', 'চ্যাম্পিয়ন', 'মেধাবী'][Math.floor(Math.random() * 4)],
    lessons_completed: Math.floor(5 + Math.random() * 40),
    quizzes_taken: Math.floor(3 + Math.random() * 25),
    created_at: s.created_at,
    updated_at: new Date().toISOString()
  }));
  await db.collection('profiles').insertMany(profiles);
  console.log(`  ✅ ${profiles.length} profiles inserted`);

  // ========== ACTIVITY LOG ==========
  console.log('📝 Inserting activity logs...');
  const actTypes = ['lesson_completed', 'quiz_taken', 'game_played', 'badge_earned', 'login'];
  const activities = [];
  for (const student of demoStudents) {
    const numActs = 5 + Math.floor(Math.random() * 15);
    for (let j = 0; j < numActs; j++) {
      activities.push({
        _id: `activity-${student._id}-${j}`,
        student_id: student._id,
        type: actTypes[Math.floor(Math.random() * actTypes.length)],
        subject: subjectNames[Math.floor(Math.random() * 4)],
        score: Math.floor(50 + Math.random() * 50),
        stars_earned: Math.floor(1 + Math.random() * 10),
        created_at: new Date(Date.now() - Math.random() * 30 * 86400000).toISOString()
      });
    }
  }
  await db.collection('activity').insertMany(activities);
  console.log(`  ✅ ${activities.length} activity logs inserted`);

  // ========== ACHIEVEMENTS ==========
  console.log('🏆 Inserting achievements...');
  const achievementList = [
    { title: 'গণিত চ্যাম্পিয়ন', icon: '🏆', desc: '৫০টি গণিত সমস্যা সমাধান করো', points: 100 },
    { title: 'বই পোকা', icon: '📚', desc: '২৫টি গল্প পড়ো', points: 75 },
    { title: 'তারকা সংগ্রাহক', icon: '⭐', desc: '১০০০ তারকা অর্জন করো', points: 150 },
    { title: 'বিজ্ঞানী', icon: '🧪', desc: '১০টি বিজ্ঞান পরীক্ষা সম্পন্ন করো', points: 80 },
    { title: 'নিয়মিত শিক্ষার্থী', icon: '📅', desc: 'একটানা ৭ দিন লগইন করো', points: 50 },
  ];
  const achievements = [];
  for (const student of demoStudents) {
    const numAch = 1 + Math.floor(Math.random() * achievementList.length);
    const shuffled = [...achievementList].sort(() => Math.random() - 0.5).slice(0, numAch);
    shuffled.forEach((ach, idx) => {
      achievements.push({
        _id: `ach-${student._id}-${idx}`,
        student_id: student._id,
        ...ach,
        earned_at: new Date(Date.now() - Math.random() * 60 * 86400000).toISOString()
      });
    });
  }
  await db.collection('achievements').insertMany(achievements);
  console.log(`  ✅ ${achievements.length} achievements inserted`);

  // ========== FINAL STATS ==========
  const stats = {
    users: await db.collection('users').countDocuments(),
    students: await db.collection('users').countDocuments({ role: 'student' }),
    teachers: await db.collection('users').countDocuments({ role: 'teacher' }),
    subjects: await db.collection('subjects').countDocuments(),
    chapters: await db.collection('chapters').countDocuments(),
    contents: await db.collection('contents').countDocuments(),
  };
  console.log('\n🎉 SEED COMPLETE! Final stats:');
  console.table(stats);

  await client.close();
  process.exit(0);
}

seed().catch(err => { console.error('❌ Seed failed:', err); process.exit(1); });
