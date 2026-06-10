// Script to populate realistic demo data for ashiksiddike50@gmail.com (student ID: user-1781111829622)
import 'dotenv/config';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('MONGODB_URI not found in .env');
  process.exit(1);
}

const studentId = 'user-1781111829622';

console.log('Connecting to database...');
const client = new MongoClient(uri);

try {
  await client.connect();
  const db = client.db('play_learn_grow');
  
  // Verify user exists
  const user = await db.collection('users').findOne({ _id: studentId });
  if (!user) {
    console.error(`❌ Student user not found with ID ${studentId}. Please sign up first.`);
    process.exit(1);
  }
  console.log(`✅ Found user: ${user.email} (${user.full_name})`);

  // 1. Clear existing activities and achievements
  console.log('Clearing old demo data...');
  await db.collection('activity').deleteMany({ student_id: studentId });
  await db.collection('achievements').deleteMany({ student_id: studentId });

  // 2. Generate realistic activities over the last 7 days
  const now = new Date();
  
  const getPastDateISO = (daysAgo, hour = 10, min = 0) => {
    const d = new Date(now);
    d.setDate(d.getDate() - daysAgo);
    d.setHours(hour, min, 0, 0);
    return d.toISOString();
  };

  const activities = [
    // Today (0 days ago)
    {
      _id: `act-${studentId}-1`,
      student_id: studentId,
      activity_type: 'lesson_completed',
      subject: 'Math',
      lesson_name: 'Basic Addition',
      score: 100,
      stars_earned: 15,
      time_spent: 10,
      created_at: getPastDateISO(0, 16, 30)
    },
    {
      _id: `act-${studentId}-2`,
      student_id: studentId,
      activity_type: 'game_played',
      subject: 'Math',
      lesson_name: 'বর্ণমালা জাদুকর (Writing Wizard)',
      score: 100,
      stars_earned: 10,
      time_spent: 5,
      created_at: getPastDateISO(0, 17, 10)
    },
    // Yesterday (1 day ago)
    {
      _id: `act-${studentId}-3`,
      student_id: studentId,
      activity_type: 'quiz_completed',
      subject: 'Math',
      lesson_name: 'Addition Quiz',
      score: 90,
      stars_earned: 20,
      time_spent: 8,
      created_at: getPastDateISO(1, 14, 20)
    },
    {
      _id: `act-${studentId}-4`,
      student_id: studentId,
      activity_type: 'lesson_completed',
      subject: 'English',
      lesson_name: 'Adjectives for Kids',
      score: 85,
      stars_earned: 12,
      time_spent: 15,
      created_at: getPastDateISO(1, 15, 0)
    },
    // 2 days ago
    {
      _id: `act-${studentId}-5`,
      student_id: studentId,
      activity_type: 'lesson_completed',
      subject: 'Bangla',
      lesson_name: 'স্বরবর্ণ পরিচিতি',
      score: 100,
      stars_earned: 15,
      time_spent: 12,
      created_at: getPastDateISO(2, 11, 10)
    },
    {
      _id: `act-${studentId}-6`,
      student_id: studentId,
      activity_type: 'video_watched',
      subject: 'English',
      lesson_name: 'Learn English Alphabet',
      score: 100,
      stars_earned: 10,
      time_spent: 5,
      created_at: getPastDateISO(2, 11, 40)
    },
    // 3 days ago
    {
      _id: `act-${studentId}-7`,
      student_id: studentId,
      activity_type: 'game_played',
      subject: 'English',
      lesson_name: 'Memory Match',
      score: 80,
      stars_earned: 12,
      time_spent: 6,
      created_at: getPastDateISO(3, 16, 5)
    },
    // 4 days ago
    {
      _id: `act-${studentId}-8`,
      student_id: studentId,
      activity_type: 'quiz_completed',
      subject: 'Bangla',
      lesson_name: 'Bangla Vowels Quiz',
      score: 100,
      stars_earned: 25,
      time_spent: 10,
      created_at: getPastDateISO(4, 10, 15)
    },
    {
      _id: `act-${studentId}-9`,
      student_id: studentId,
      activity_type: 'lesson_completed',
      subject: 'Science',
      lesson_name: 'Plants Around Us',
      score: 90,
      stars_earned: 15,
      time_spent: 18,
      created_at: getPastDateISO(4, 10, 45)
    },
    {
      _id: `act-${studentId}-10`,
      student_id: studentId,
      activity_type: 'game_played',
      subject: 'Math',
      lesson_name: 'Counting Game',
      score: 100,
      stars_earned: 10,
      time_spent: 7,
      created_at: getPastDateISO(4, 11, 30)
    },
    // 5 days ago
    {
      _id: `act-${studentId}-11`,
      student_id: studentId,
      activity_type: 'lesson_completed',
      subject: 'Science',
      lesson_name: 'Animals and Habitats',
      score: 80,
      stars_earned: 12,
      time_spent: 14,
      created_at: getPastDateISO(5, 15, 0)
    },
    {
      _id: `act-${studentId}-12`,
      student_id: studentId,
      activity_type: 'video_watched',
      subject: 'Science',
      lesson_name: 'Solar System Planets',
      score: 100,
      stars_earned: 15,
      time_spent: 8,
      created_at: getPastDateISO(5, 15, 30)
    },
    // 6 days ago
    {
      _id: `act-${studentId}-13`,
      student_id: studentId,
      activity_type: 'lesson_completed',
      subject: 'Math',
      lesson_name: 'Basic Subtraction',
      score: 85,
      stars_earned: 10,
      time_spent: 11,
      created_at: getPastDateISO(6, 9, 30)
    }
  ];

  console.log(`Inserting ${activities.length} activity documents...`);
  await db.collection('activity').insertMany(activities);

  // 3. Insert Achievements
  const achievements = [
    {
      _id: `ach-${studentId}-1`,
      student_id: studentId,
      title: 'বই পোকা (Book Worm)',
      icon: '📚',
      desc: '৫টি রিডিং লেসন সম্পন্ন করো',
      points: 75,
      earned_at: getPastDateISO(5, 16, 0)
    },
    {
      _id: `ach-${studentId}-2`,
      student_id: studentId,
      title: 'গণিত জাদুকর (Math Wizard)',
      icon: '🔢',
      desc: 'গণিতে ১০০% স্কোর অর্জন করো',
      points: 50,
      earned_at: getPastDateISO(4, 11, 0)
    },
    {
      _id: `ach-${studentId}-3`,
      student_id: studentId,
      title: 'উদীয়মান তারকা (Rising Star)',
      icon: '⭐',
      desc: '১০০টি স্টার সংগ্রহ করো',
      points: 80,
      earned_at: getPastDateISO(2, 12, 0)
    },
    {
      _id: `ach-${studentId}-4`,
      student_id: studentId,
      title: 'ধারাবাহিক শিক্ষার্থী (Streak Master)',
      icon: '🔥',
      desc: 'একটানা ৫ দিন লগইন করো',
      points: 50,
      earned_at: getPastDateISO(0, 17, 30)
    }
  ];

  console.log(`Inserting ${achievements.length} achievements...`);
  await db.collection('achievements').insertMany(achievements);

  // 4. Update Profile Stats
  // Sum of activity stars = 181, sum of achievement points = 255. Total = 436.
  const profileUpdate = {
    total_stars: 436,
    badges: 4,
    hours_learned: 8.5,
    accuracy: 88,
    streak: 5,
    level: 'মেধাবী (Rising Star)',
    lessons_completed: 12,
    quizzes_taken: 6,
    updated_at: new Date().toISOString()
  };

  console.log('Updating profile document...');
  const result = await db.collection('profiles').updateOne(
    { user_id: studentId },
    { $set: profileUpdate },
    { upsert: true }
  );

  if (result.matchedCount > 0 || result.upsertedCount > 0) {
    console.log('✅ PROFILE UPDATED SUCCESSFULLY!');
  } else {
    console.warn('⚠️ Profile update matched 0 documents.');
  }

  // 5. Insert Results (Report Card)
  console.log('Seeding result document...');
  await db.collection('results').deleteMany({ student_id: studentId });
  const resultDoc = {
    _id: `res-${studentId}-annual-2026`,
    student_id: studentId,
    student_name: user.full_name || 'Ashik Siddike',
    class: 'Nursery',
    section: 'A',
    roll: 1,
    exam: 'বার্ষিক পরীক্ষা',
    year: '2026',
    subjects: [
      { name: 'গণিত (Math)', icon: '🔢', marks: 95, total: 100, comment: 'চমৎকার যোগ-বিয়োগ দক্ষতা!' },
      { name: 'ইংরেজি (English)', icon: '📖', marks: 88, total: 100, comment: 'রিডিং ও স্পেলিং-এ বেশ ভালো করছে' },
      { name: 'বাংলা (Bangla)', icon: '🇧🇩', marks: 92, total: 100, comment: 'অক্ষর গঠন ও উচ্চারণ চমৎকার' },
      { name: 'বিজ্ঞান (Science)', icon: '🔬', marks: 85, total: 100, comment: 'গাছপালা ও প্রকৃতি সম্পর্কে কৌতূহলী' },
      { name: 'সাধারণ জ্ঞান', icon: '🌍', marks: 90, total: 100, comment: 'খুব ভালো সাধারণ জ্ঞান ও বুদ্ধি' },
      { name: 'চারু ও কারুকলা', icon: '🎨', marks: 95, total: 100, comment: 'ছবি আঁকা ও রঙ করার কাজে মনোযোগী' }
    ],
    attendance: { present: 120, total: 125 },
    rank: 1,
    totalStudents: 35,
    teacher_comment: 'আশিক ক্লাসের অন্যতম মেধাবী ছাত্র। সে কুইজ এবং গেমগুলোতে অত্যন্ত উৎসাহের সাথে অংশগ্রহণ করে। তার হাতের লেখা ও ছবির হাতও অনেক সুন্দর!',
    principal_comment: 'অত্যন্ত চমৎকার ও সন্তোষজনক ফলাফল। এই ধারাবাহিকতা বজায় রাখো।',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  await db.collection('results').insertOne(resultDoc);
  console.log('✅ RESULTS SEEDED SUCCESSFULLY!');

  // 6. Insert Assignments
  console.log('Seeding assignments...');
  await db.collection('assignments').deleteMany({ is_global: true });
  const assignmentsList = [
    {
      _id: 'assign-math-1',
      title: 'গণিত হোমওয়ার্ক: যোগফল নির্ণয়',
      subject: 'Math',
      due_date: '2026-06-15',
      description: '১ থেকে ১০ পর্যন্ত সংখ্যাগুলোর যোগফল অনুশীলনীটি সম্পন্ন করো।',
      is_global: true,
      submitted_by: [],
      created_at: new Date().toISOString()
    },
    {
      _id: 'assign-english-1',
      title: 'English Essay: My Pet',
      subject: 'English',
      due_date: '2026-06-20',
      description: 'Write 5 sentences about your favourite pet and draw its picture.',
      is_global: true,
      submitted_by: [],
      created_at: new Date().toISOString()
    },
    {
      _id: 'assign-science-1',
      title: 'বিজ্ঞান: পাতা সংগ্রহ ও পরিচিতি',
      subject: 'Science',
      due_date: '2026-06-12',
      description: 'তোমার চারপাশের ৩টি ভিন্ন গাছের পাতা সংগ্রহ করে খাতায় আঠা দিয়ে লাগাও এবং নাম লেখো।',
      is_global: true,
      submitted_by: [],
      created_at: new Date().toISOString()
    }
  ];
  await db.collection('assignments').insertMany(assignmentsList);
  console.log('✅ ASSIGNMENTS SEEDED SUCCESSFULLY!');

} catch (err) {
  console.error('❌ Database operations failed:', err);
} finally {
  await client.close();
  console.log('Connection closed.');
}
