// Play Learn Grow - Express.js API Server
// Connects React frontend to MongoDB database

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Try to load from server/.env first
dotenv.config({ path: path.join(__dirname, '.env') });
// Fallback to root .env
dotenv.config();
import express from 'express';
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:8081', 'http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// MongoDB Connection
let db;
let client;

// Ensure DB connection middleware for Serverless (Vercel)
app.use(async (req, res, next) => {
  if (!db) {
    try {
      await connectDB();
    } catch (error) {
      console.error('Failed to connect to DB in middleware:', error);
      return res.status(500).json({ error: 'Database connection failed' });
    }
  }
  next();
});

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  const maxRetries = 3;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 MongoDB connection attempt ${attempt}/${maxRetries}...`);
      client = new MongoClient(uri, {
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        retryWrites: true,
        w: 'majority',
      });
      await client.connect();
      db = client.db(process.env.DB_NAME || 'play_learn_grow');
      
      // Verify connection
      await db.command({ ping: 1 });
      console.log('✅ Connected to MongoDB - Database:', db.databaseName);
      return db;
    } catch (error) {
      console.error(`❌ Attempt ${attempt} failed:`, error.message);
      if (client) {
        try { await client.close(); } catch {}
      }
      if (attempt === maxRetries) {
        console.error('❌ All connection attempts failed. Check your network and MongoDB Atlas IP whitelist.');
        console.log('💡 Tips:');
        console.log('   1. Ensure your IP is whitelisted in MongoDB Atlas (Network Access → Add Current IP)');
        console.log('   2. Check your internet connection');
        console.log('   3. Try using a different DNS (e.g., Google DNS 8.8.8.8)');
        process.exit(1);
      }
      // Wait before retry
      await new Promise(r => setTimeout(r, 2000 * attempt));
    }
  }
}

// Helper: Get collection
const getCollection = (name) => db.collection(name);

// ==========================================
// AUTH / USERS ROUTES
// ==========================================

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = await getCollection('users').findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // For demo purposes: simple password check
    // In production, use bcrypt hashing
    const validPasswords = {
      'ashiksiddike@gmail.com': 'ashik1234',
      'admin@school.com': 'admin123',
      'demo@school.com': 'demo123',
      'teacher@school.com': 'teacher123',
      'parent@school.com': 'parent123',
      'virifat01@gmail.com': 'rifat123'
    };

    // Also allow shortcut login
    if (email === 'ashik' && password === 'ashik123') {
      const adminUser = await getCollection('users').findOne({ email: 'ashiksiddike@gmail.com' });
      if (adminUser) {
        return res.json({
          user: {
            id: adminUser._id,
            email: adminUser.email,
            user_metadata: { full_name: adminUser.full_name, role: adminUser.role || 'admin' }
          },
          profile: {
            id: adminUser._id,
            email: adminUser.email,
            full_name: adminUser.full_name,
            role: adminUser.role || 'admin',
            created_at: adminUser.created_at
          },
          session: {
            access_token: `token-${Date.now()}`,
            expires_at: Date.now() + 3600000
          }
        });
      }
    }

    const storedPassword = validPasswords[email.toLowerCase()];
    if (!storedPassword || storedPassword !== password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    res.json({
      user: {
        id: user._id,
        email: user.email,
        user_metadata: { full_name: user.full_name, role: user.role }
      },
      profile: {
        id: user._id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        created_at: user.created_at
      },
      session: {
        access_token: `token-${Date.now()}`,
        expires_at: Date.now() + 3600000
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/auth/register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, fullName, role = 'student' } = req.body;
    
    if (!email || !password || !fullName) {
      return res.status(400).json({ error: 'Email, password, and full name required' });
    }

    const existingUser = await getCollection('users').findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    const newUser = {
      _id: `user-${Date.now()}`,
      email: email.toLowerCase(),
      full_name: fullName,
      role,
      email_verified: false,
      is_anonymous: false,
      providers: ['email'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    await getCollection('users').insertOne(newUser);

    res.status(201).json({
      user: {
        id: newUser._id,
        email: newUser.email,
        user_metadata: { full_name: newUser.full_name, role: newUser.role }
      },
      profile: {
        id: newUser._id,
        email: newUser.email,
        full_name: newUser.full_name,
        role: newUser.role,
        created_at: newUser.created_at
      },
      session: {
        access_token: `token-${Date.now()}`,
        expires_at: Date.now() + 3600000
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==========================================
// USERS ROUTES
// ==========================================

// GET /api/users
app.get('/api/users', async (req, res) => {
  try {
    const users = await getCollection('users').find({}).toArray();
    res.json(users.map(u => ({
      id: u._id,
      email: u.email,
      full_name: u.full_name,
      role: u.role,
      created_at: u.created_at
    })));
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/users/:id
app.delete('/api/users/:id', async (req, res) => {
  try {
    await getCollection('users').deleteOne({ _id: req.params.id });
    res.json({ success: true });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/users/:id
app.put('/api/users/:id', async (req, res) => {
  try {
    const { full_name, role, email } = req.body;
    const update = { updated_at: new Date().toISOString() };
    if (full_name) update.full_name = full_name;
    if (role) update.role = role;
    if (email) update.email = email;
    
    await getCollection('users').updateOne(
      { _id: req.params.id },
      { $set: update }
    );
    res.json({ success: true });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==========================================
// GRADES ROUTES
// ==========================================

// GET /api/grades
app.get('/api/grades', async (req, res) => {
  try {
    const grades = await getCollection('grades')
      .find({})
      .sort({ order: 1 })
      .toArray();
    res.json(grades.map(g => ({
      id: g._id,
      name: g.name,
      order_index: g.order || g._id,
    })));
  } catch (error) {
    console.error('Get grades error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/grades
app.post('/api/grades', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Grade name required' });
    
    const lastGrade = await getCollection('grades').find({}).sort({ _id: -1 }).limit(1).toArray();
    const newId = lastGrade.length > 0 ? (typeof lastGrade[0]._id === 'number' ? lastGrade[0]._id + 1 : 1) : 1;
    
    const newGrade = { _id: newId, name, order: newId };
    await getCollection('grades').insertOne(newGrade);
    
    res.status(201).json({ id: newId, name, order_index: newId });
  } catch (error) {
    console.error('Create grade error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/grades/:id
app.delete('/api/grades/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await getCollection('grades').deleteOne({ _id: id });
    await getCollection('subjects').deleteMany({ grade_id: id });
    res.json({ success: true });
  } catch (error) {
    console.error('Delete grade error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==========================================
// SUBJECTS ROUTES
// ==========================================

// GET /api/subjects
app.get('/api/subjects', async (req, res) => {
  try {
    const { grade_id } = req.query;
    const filter = grade_id ? { grade_id: parseInt(grade_id) } : {};
    const subjects = await getCollection('subjects').find(filter).toArray();
    res.json(subjects.map(s => ({
      id: s._id,
      name: s.name,
      grade_id: s.grade_id,
      order_index: s._id,
    })));
  } catch (error) {
    console.error('Get subjects error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/subjects
app.post('/api/subjects', async (req, res) => {
  try {
    const { name, grade_id } = req.body;
    if (!name || !grade_id) return res.status(400).json({ error: 'Name and grade_id required' });
    
    const lastSubject = await getCollection('subjects').find({}).sort({ _id: -1 }).limit(1).toArray();
    const newId = lastSubject.length > 0 ? (typeof lastSubject[0]._id === 'number' ? lastSubject[0]._id + 1 : 1) : 1;
    
    const newSubject = { _id: newId, name, grade_id: parseInt(grade_id) };
    await getCollection('subjects').insertOne(newSubject);
    
    res.status(201).json({ id: newId, name, grade_id: parseInt(grade_id), order_index: newId });
  } catch (error) {
    console.error('Create subject error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/subjects/:id
app.delete('/api/subjects/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await getCollection('subjects').deleteOne({ _id: id });
    res.json({ success: true });
  } catch (error) {
    console.error('Delete subject error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==========================================
// CHAPTERS ROUTES
// ==========================================

// GET /api/chapters
app.get('/api/chapters', async (req, res) => {
  try {
    const { subject_id, grade_id } = req.query;
    const filter = {};
    if (subject_id) filter.subject_id = parseInt(subject_id);
    if (grade_id) filter.grade_id = parseInt(grade_id);
    
    const chapters = await getCollection('chapters').find(filter).sort({ order: 1 }).toArray();
    res.json(chapters.map(c => ({
      id: c._id,
      name: c.name,
      description: c.description,
      subject_id: c.subject_id,
      grade_id: c.grade_id,
      order: c.order,
      created_at: c.created_at
    })));
  } catch (error) {
    console.error('Get chapters error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==========================================
// ATTENDANCE ROUTES
// ==========================================

// GET /api/attendance
app.get('/api/attendance', async (req, res) => {
  try {
    const { date, student_id } = req.query;
    const filter = {};
    if (date) filter.date = date;
    if (student_id) filter.student_id = student_id;
    
    const attendance = await getCollection('attendance').find(filter).toArray();
    res.json(attendance);
  } catch (error) {
    console.error('Get attendance error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/attendance
app.post('/api/attendance', async (req, res) => {
  try {
    const { date, records } = req.body;
    if (!date || !Array.isArray(records)) {
      return res.status(400).json({ error: 'Date and records array required' });
    }

    const operations = records.map(record => ({
      updateOne: {
        filter: { date, student_id: record.student_id },
        update: { 
          $set: { 
            status: record.status,
            updated_at: new Date().toISOString()
          },
          $setOnInsert: {
            created_at: new Date().toISOString()
          }
        },
        upsert: true
      }
    }));

    if (operations.length > 0) {
      await getCollection('attendance').bulkWrite(operations);
    }
    
    res.json({ success: true, message: `Saved ${operations.length} records` });
  } catch (error) {
    console.error('Save attendance error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==========================================
// REPORT CARDS ROUTES
// ==========================================

// GET /api/report-cards
app.get('/api/report-cards', async (req, res) => {
  try {
    const { student_id } = req.query;
    const filter = {};
    if (student_id) filter.student_id = student_id;
    
    const reports = await getCollection('report_cards').find(filter).toArray();
    res.json(reports);
  } catch (error) {
    console.error('Get report cards error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/report-cards
app.post('/api/report-cards', async (req, res) => {
  try {
    const { student_id, ...reportData } = req.body;
    if (!student_id) return res.status(400).json({ error: 'Student ID required' });

    const update = {
      ...reportData,
      updated_at: new Date().toISOString()
    };

    await getCollection('report_cards').updateOne(
      { student_id },
      { 
        $set: update,
        $setOnInsert: { created_at: new Date().toISOString() }
      },
      { upsert: true }
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error('Save report card error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==========================================
// CONTENTS ROUTES
// ==========================================

// GET /api/contents
app.get('/api/contents', async (req, res) => {
  try {
    const { grade_id, subject_id, chapter_id } = req.query;
    const filter = {};
    if (grade_id) filter.grade_id = parseInt(grade_id);
    if (subject_id) filter.subject_id = parseInt(subject_id);
    if (chapter_id) filter.chapter_id = parseInt(chapter_id);
    
    const contents = await getCollection('contents').find(filter).toArray();
    res.json(contents.map(c => ({
      id: c._id,
      title: c.title,
      subtitle: c.subtitle,
      description: c.description,
      content_type: c.content_type,
      youtube_link: c.youtube_link,
      file_url: c.file_url,
      pages: c.pages,
      class: c.class,
      subject: c.subject,
      grade_id: c.grade_id,
      subject_id: c.subject_id,
      chapter_id: c.chapter_id,
      lesson_order: c.lesson_order,
      is_published: c.is_published !== false, // default true
      created_at: c.created_at
    })));
  } catch (error) {
    console.error('Get contents error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/contents
app.post('/api/contents', async (req, res) => {
  try {
    const { title, description, content_type, youtube_link, file_url, pages, 
            class: cls, subject, grade_id, subject_id, chapter_id, is_published } = req.body;
    
    if (!title) return res.status(400).json({ error: 'Title required' });
    
    const newContent = {
      _id: `content-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title,
      subtitle: req.body.subtitle || null,
      description: description || '',
      content_type: content_type || 'youtube',
      youtube_link: youtube_link || null,
      file_url: file_url || null,
      pages: pages || [],
      class: cls || null,
      subject: subject || null,
      grade_id: grade_id ? parseInt(grade_id) : null,
      subject_id: subject_id ? parseInt(subject_id) : null,
      chapter_id: chapter_id ? parseInt(chapter_id) : null,
      is_published: is_published !== false,
      created_at: new Date().toISOString()
    };

    await getCollection('contents').insertOne(newContent);
    res.status(201).json({ ...newContent, id: newContent._id });
  } catch (error) {
    console.error('Create content error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/contents/:id
app.put('/api/contents/:id', async (req, res) => {
  try {
    const update = { ...req.body };
    delete update._id;
    delete update.id;
    
    if (update.grade_id) update.grade_id = parseInt(update.grade_id);
    if (update.subject_id) update.subject_id = parseInt(update.subject_id);
    if (update.chapter_id) update.chapter_id = parseInt(update.chapter_id);
    
    await getCollection('contents').updateOne(
      { _id: req.params.id },
      { $set: update }
    );
    res.json({ success: true });
  } catch (error) {
    console.error('Update content error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/contents/:id
app.delete('/api/contents/:id', async (req, res) => {
  try {
    await getCollection('contents').deleteOne({ _id: req.params.id });
    res.json({ success: true });
  } catch (error) {
    console.error('Delete content error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==========================================
// TEAMS ROUTES
// ==========================================

// GET /api/teams
app.get('/api/teams', async (req, res) => {
  try {
    const teams = await getCollection('teams').find({}).toArray();
    res.json(teams.map(t => ({
      id: t._id,
      name: t.name,
      description: t.description,
      created_at: t.created_at
    })));
  } catch (error) {
    console.error('Get teams error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==========================================
// ACTIVITY ROUTES
// ==========================================

// POST /api/quiz-submit  — saves quiz result & updates profile + leaderboard
app.post('/api/quiz-submit', async (req, res) => {
  try {
    const {
      student_id,
      subject,
      quiz_name,
      score,           // percentage 0-100
      correct_answers,
      total_questions,
      time_spent,      // minutes
      stars_earned
    } = req.body;

    if (!student_id || !subject || score === undefined) {
      return res.status(400).json({ error: 'student_id, subject and score required' });
    }

    // 1️⃣ Save activity record
    const activity = {
      _id: `quiz-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      student_id,
      activity_type: 'quiz_completed',
      type: 'quiz_taken',
      subject,
      lesson_name: quiz_name || 'Quiz',
      score,
      correct_answers,
      total_questions,
      stars_earned: stars_earned || Math.round((score / 100) * 20),
      time_spent: time_spent || 5,
      created_at: new Date().toISOString()
    };
    await getCollection('activity').insertOne(activity);

    // 2️⃣ Update student profile: total_stars, lessons_completed, accuracy, hours_learned
    const starsToAdd = activity.stars_earned;
    const hoursToAdd = (time_spent || 5) / 60;
    await getCollection('profiles').updateOne(
      { user_id: student_id },
      {
        $inc: {
          total_stars: starsToAdd,
          quizzes_completed: 1,
          hours_learned: hoursToAdd
        },
        $set: { updated_at: new Date().toISOString() }
      },
      { upsert: false }
    );

    // 3️⃣ Re-calculate accuracy and update
    const allActivities = await getCollection('activity')
      .find({ student_id, activity_type: 'quiz_completed' })
      .toArray();
    if (allActivities.length > 0) {
      const avgAccuracy = Math.round(
        allActivities.reduce((sum, a) => sum + (a.score || 0), 0) / allActivities.length
      );
      await getCollection('profiles').updateOne(
        { user_id: student_id },
        { $set: { accuracy: avgAccuracy } }
      );
    }

    res.status(201).json({ success: true, activity });
  } catch (error) {
    console.error('Quiz submit error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/activity
app.post('/api/activity', async (req, res) => {
  try {
    const { student_id, stars_earned, time_spent } = req.body;
    const activity = {
      _id: `activity-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...req.body,
      created_at: new Date().toISOString()
    };
    await getCollection('activity').insertOne(activity);

    // Auto-update profile stars & hours for any activity
    if (student_id && stars_earned) {
      await getCollection('profiles').updateOne(
        { user_id: student_id },
        {
          $inc: {
            total_stars: stars_earned,
            lessons_completed: req.body.activity_type === 'lesson_completed' ? 1 : 0,
            hours_learned: (time_spent || 0) / 60
          },
          $set: { updated_at: new Date().toISOString() }
        },
        { upsert: false }
      );
    }
    res.status(201).json(activity);
  } catch (error) {
    console.error('Create activity error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/activity/:userId
app.get('/api/activity/:userId', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const userId = req.params.userId;
    
    let query = {};
    if (userId !== 'all') {
      query = { student_id: userId };
    }
    
    const activities = await getCollection('activity')
      .find(query)
      .sort({ created_at: -1 })
      .limit(limit)
      .toArray();
    res.json(activities);
  } catch (error) {
    console.error('Get activities error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==========================================
// PROFILES ROUTES
// ==========================================

// GET /api/profiles/:userId
app.get('/api/profiles/:userId', async (req, res) => {
  try {
    const profile = await getCollection('profiles').findOne({ user_id: req.params.userId });
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.json(profile);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/profiles/:userId
app.put('/api/profiles/:userId', async (req, res) => {
  try {
    const update = { ...req.body, updated_at: new Date().toISOString() };
    delete update._id;
    
    await getCollection('profiles').updateOne(
      { user_id: req.params.userId },
      { $set: update },
      { upsert: true }
    );
    res.json({ success: true });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==========================================
// ATTENDANCE ROUTES
// ==========================================

// GET attendance for a specific date (+ optional class filter)
app.get('/api/attendance', async (req, res) => {
  try {
    const { date, class: className } = req.query;
    if (!date) return res.status(400).json({ error: 'date query param required' });

    const filter = { date };
    if (className) filter.class = className;

    const records = await getCollection('attendance').find(filter).toArray();
    res.json(records);
  } catch (error) {
    console.error('Attendance GET error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST — save/update attendance for a date (bulk upsert)
app.post('/api/attendance', async (req, res) => {
  try {
    const { date, records, marked_by } = req.body;
    if (!date || !Array.isArray(records)) {
      return res.status(400).json({ error: 'date and records[] required' });
    }

    const col = getCollection('attendance');
    const ops = records.map(r => ({
      updateOne: {
        filter: { student_id: r.student_id, date },
        update: {
          $set: {
            student_id: r.student_id,
            date,
            status: r.status,          // 'present' | 'absent' | 'late'
            marked_by: marked_by || 'teacher',
            updated_at: new Date().toISOString()
          },
          $setOnInsert: { created_at: new Date().toISOString() }
        },
        upsert: true
      }
    }));

    const result = await col.bulkWrite(ops);

    // Return quick summary
    const present = records.filter(r => r.status === 'present').length;
    const absent  = records.filter(r => r.status === 'absent').length;
    const late    = records.filter(r => r.status === 'late').length;

    res.json({
      message: 'Attendance saved successfully',
      date,
      summary: { total: records.length, present, absent, late },
      upserted: result.upsertedCount,
      modified: result.modifiedCount
    });
  } catch (error) {
    console.error('Attendance POST error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET attendance summary for a student (monthly stats)
app.get('/api/attendance/student/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    const { month } = req.query; // format: YYYY-MM

    const filter = { student_id: studentId };
    if (month) filter.date = { $regex: `^${month}` };

    const records = await getCollection('attendance').find(filter).sort({ date: -1 }).toArray();
    const present = records.filter(r => r.status === 'present').length;
    const absent  = records.filter(r => r.status === 'absent').length;
    const late    = records.filter(r => r.status === 'late').length;
    const total   = records.length;
    const rate    = total > 0 ? Math.round((present / total) * 100) : 0;

    res.json({ records, summary: { total, present, absent, late, attendanceRate: rate } });
  } catch (error) {
    console.error('Student attendance error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==========================================
// STUDENT DASHBOARD ROUTE
// ==========================================

app.get('/api/student-dashboard', async (req, res) => {
  try {
    const studentId = req.query.userId || 'student-1';

    const [profile, activities, achievements, users, profiles] = await Promise.all([
      getCollection('profiles').findOne({ user_id: studentId }),
      getCollection('activity').find({ student_id: studentId }).sort({ created_at: -1 }).limit(50).toArray(),
      getCollection('achievements').find({ student_id: studentId }).sort({ earned_at: -1 }).toArray(),
      getCollection('users').find({ role: 'student' }).toArray(),
      getCollection('profiles').find({}).toArray()
    ]);

    if (!profile) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // ── Real Rank ────────────────────────────────────────────────────────────
    const sortedProfiles = profiles.sort((a, b) => (b.total_stars || 0) - (a.total_stars || 0));
    const rank = sortedProfiles.findIndex(p => p.user_id === studentId) + 1;

    // ── Real Friends (other students) ─────────────────────────────────────
    const avatarEmojis = ['👦', '👧', '🧒', '🧑', '👩'];
    const getAvatar = (id) => avatarEmojis[(id?.charCodeAt(id.length - 1) || 0) % avatarEmojis.length];
    const friends = users
      .filter(u => u._id !== studentId)
      .slice(0, 4)
      .map(u => ({
        name: u.full_name,
        avatar: getAvatar(u._id),
        stars: profiles.find(p => p.user_id === u._id)?.total_stars || 0,
        isOnline: Math.random() > 0.5
      }));

    // ── Real Subject Stats from activity ─────────────────────────────────
    const subjectDefs = [
      { name: "Math",    icon: "🔢", color: "text-eduplay-blue",   route: "math" },
      { name: "English", icon: "📖", color: "text-eduplay-green",  route: "english" },
      { name: "Bangla",  icon: "🇧🇩", color: "text-eduplay-orange", route: "bangla" },
      { name: "Science", icon: "🔬", color: "text-eduplay-purple", route: "science" }
    ];

    const subjects = subjectDefs.map(sub => {
      const subActivities = activities.filter(a =>
        a.subject && a.subject.toLowerCase().includes(sub.name.toLowerCase())
      );
      const quizActivities = subActivities.filter(a => a.activity_type === 'quiz_completed');
      const lessonActivities = subActivities.filter(a => a.activity_type === 'lesson_completed');
      const totalMins = subActivities.reduce((s, a) => s + (a.time_spent || 0), 0);
      const avgScore = quizActivities.length > 0
        ? Math.round(quizActivities.reduce((s, a) => s + (a.score || 0), 0) / quizActivities.length)
        : 0;
      const lessonsCompleted = lessonActivities.length;
      const progress = Math.min(Math.round((lessonsCompleted / 20) * 100), 100);
      const hours = Math.round(totalMins / 60);

      return {
        ...sub,
        progress,
        lessonsCompleted,
        totalLessons: 20,
        lastScore: avgScore,
        timeSpent: hours > 0 ? `${hours}h` : `${totalMins}m`
      };
    });

    // ── Real Weekly Activity (last 7 days) ────────────────────────────────
    const days = ['শনি', 'রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহঃ', 'শুক্র'];
    const weeklyActivity = days.map((day, i) => {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() - (6 - i));
      const dateStr = targetDate.toISOString().split('T')[0];
      const dayActivities = activities.filter(a => a.created_at && a.created_at.startsWith(dateStr));
      return {
        day,
        lessons: dayActivities.filter(a => a.activity_type === 'lesson_completed').length,
        stars: dayActivities.reduce((s, a) => s + (a.stars_earned || 0), 0),
        minutes: dayActivities.reduce((s, a) => s + (a.time_spent || 0), 0)
      };
    });

    // ── Real Achievements ────────────────────────────────────────────────
    const recentAchievements = achievements.length > 0
      ? achievements.slice(0, 5).map(a => ({
          title: a.title,
          description: a.desc || a.description || '',
          icon: a.icon || '🏆',
          date: new Date(a.earned_at).toLocaleDateString('bn-BD'),
          points: a.points || 0
        }))
      : [
          { title: 'স্বাগতম!', description: 'প্ল্যাটফর্মে যোগ দেওয়ার জন্য ধন্যবাদ', icon: '🎉', date: 'আজ', points: 10 }
        ];

    // ── Current Goals (based on activity counts) ─────────────────────────
    const mathLessons = activities.filter(a => a.subject?.toLowerCase().includes('math') && a.activity_type === 'lesson_completed').length;
    const engLessons = activities.filter(a => a.subject?.toLowerCase().includes('english') && a.activity_type === 'lesson_completed').length;
    const sciLessons = activities.filter(a => a.subject?.toLowerCase().includes('science') && a.activity_type === 'lesson_completed').length;

    const currentGoals = [
      { subject: "Math",    target: 20, current: Math.min(mathLessons, 20), description: "২০টি গণিত পাঠ সম্পন্ন করো" },
      { subject: "English", target: 15, current: Math.min(engLessons, 15),  description: "১৫টি ইংরেজি পাঠ পড়ো" },
      { subject: "Science", target: 10, current: Math.min(sciLessons, 10),  description: "১০টি বিজ্ঞান পাঠ সম্পন্ন করো" }
    ];

    const dashboardData = {
      name: profile.full_name || 'শিক্ষার্থী',
      totalStars: profile.total_stars || 0,
      badges: profile.badges || 0,
      hoursLearned: Math.round(profile.hours_learned || 0),
      accuracy: profile.accuracy || 0,
      streak: profile.streak || 0,
      level: profile.level || 'নতুন শিক্ষার্থী',
      rank: rank || 1,
      totalStudents: users.length,
      subjects,
      recentAchievements,
      weeklyActivity,
      favoriteSubjects: subjects.sort((a, b) => b.lessonsCompleted - a.lessonsCompleted).slice(0, 2).map(s => s.name),
      currentGoals,
      friends
    };

    res.json(dashboardData);
  } catch (error) {
    console.error('Student dashboard error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// ==========================================
// PARENT DASHBOARD ROUTE
// ==========================================

app.get('/api/parent-dashboard', async (req, res) => {
  try {
    const studentId = req.query.userId || 'student-1';
    
    const [profile, activities, users] = await Promise.all([
      getCollection('profiles').findOne({ user_id: studentId }),
      getCollection('activity').find({ student_id: studentId }).sort({ created_at: -1 }).limit(5).toArray(),
      getCollection('users').findOne({ _id: studentId })
    ]);

    if (!profile) {
      return res.status(404).json({ error: 'Student profile not found for this user.' });
    }

    const period = req.query.period || 'week'; // today, week, month, session
    
    // Generate dynamic chart data based on period
    let timeData = [];
    if (period === 'today') {
      timeData = [
        { name: '8 AM', score: 10, time: 5 },
        { name: '10 AM', score: 25, time: 15 },
        { name: '1 PM', score: 15, time: 10 },
        { name: '4 PM', score: 40, time: 20 },
        { name: '8 PM', score: 30, time: 15 },
      ];
    } else if (period === 'week') {
      timeData = [
        { name: 'শনি', score: 85, time: 45 },
        { name: 'রবি', score: 70, time: 30 },
        { name: 'সোম', score: 90, time: 60 },
        { name: 'মঙ্গল', score: 60, time: 20 },
        { name: 'বুধ', score: 85, time: 40 },
        { name: 'বৃহঃ', score: 75, time: 35 },
        { name: 'শুক্র', score: 95, time: 55 },
      ];
    } else if (period === 'month') {
      timeData = [
        { name: 'Week 1', score: 300, time: 180 },
        { name: 'Week 2', score: 350, time: 210 },
        { name: 'Week 3', score: 400, time: 250 },
        { name: 'Week 4', score: 380, time: 220 },
      ];
    } else {
      timeData = [
        { name: 'Jan', score: 1200, time: 800 },
        { name: 'Feb', score: 1400, time: 950 },
        { name: 'Mar', score: 1100, time: 700 },
        { name: 'Apr', score: 1600, time: 1100 },
      ];
    }

    const dashboardData = {
      name: profile.full_name || 'শিক্ষার্থী',
      age: 6, // default
      grade: 'Nursery (A)',
      totalLearningTime: `${profile.hours_learned || 0} ঘন্টা`,
      lessonsCompleted: profile.lessons_completed || 0,
      averageAccuracy: profile.accuracy || 0,
      currentStreak: profile.streak || 0,
      timeData,
      subjects: [
        { name: "গণিত (Math)", progress: 88, timeSpent: "14h", accuracy: 95, lastActivity: "আজ" },
        { name: "ইংরেজি (English)", progress: 75, timeSpent: "11h", accuracy: 88, lastActivity: "গতকাল" },
        { name: "বাংলা (Bangla)", progress: 92, timeSpent: "14h", accuracy: 96, lastActivity: "আজ" },
        { name: "বিজ্ঞান (Science)", progress: 70, timeSpent: "10h", accuracy: 85, lastActivity: "আজ" }
      ],
      periodStats: {
        lessonsCompleted: period === 'today' ? 2 : (period === 'week' ? 18 : 65),
        starsEarned: period === 'today' ? 15 : (period === 'week' ? 95 : 320),
        timeSpent: period === 'today' ? "45m" : (period === 'week' ? "10h 45m" : "42h 10m"),
        improvement: period === 'today' ? "+2%" : (period === 'week' ? "+18%" : "+35%")
      },
      recentActivity: activities.map(a => ({
        subject: a.subject,
        lesson: a.type === 'lesson_completed' ? 'পাঠ সম্পন্ন' : (a.type === 'quiz_taken' ? 'কুইজ' : 'অ্যাক্টিভিটি'),
        score: `${a.score}% ⭐`,
        time: new Date(a.created_at).toLocaleDateString()
      })),
      recommendations: [
        `${profile.full_name || 'শিক্ষার্থী'} বাংলায় অসাধারণ করছে! তাকে আরও গল্পের বই পড়তে উৎসাহিত করুন। 📚`,
        "বিজ্ঞানে প্রতিদিন ১৫ মিনিট অনুশীলন করলে আরও ভালো করবে। 🔬",
        `দারুণ! একটানা ${profile.streak || 1} দিন স্ট্রিক — ${profile.full_name || 'শিক্ষার্থী'}কে পুরস্কৃত করুন! 🎉`,
        `গণিতে চমৎকার নির্ভুলতা — এভাবেই চালিয়ে যাক। ✨`
      ]
    };

    res.json(dashboardData);
  } catch (error) {
    console.error('Parent dashboard error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==========================================
// LEADERBOARD ROUTE
// ==========================================

app.get('/api/leaderboard', async (req, res) => {
  try {
    const { subject } = req.query; // optional filter

    const [users, profiles] = await Promise.all([
      getCollection('users').find({ role: 'student' }).toArray(),
      getCollection('profiles').find({}).toArray()
    ]);

    const avatarEmojis = ['👦', '👧', '🧒', '👶', '🧑', '👩', '👨', '🧒‍♀️', '🧒‍♂️', '🧑‍🎓'];

    // Helper to get a consistent avatar for a user
    const getAvatar = (userId) => {
      const seed = userId ? userId.charCodeAt(userId.length - 1) % avatarEmojis.length : 0;
      return avatarEmojis[seed];
    };

    // ── ALL-TIME LEADERS: sorted by total_stars from profiles ──────────────
    const allTimeLeaders = profiles
      .filter(p => users.some(u => u._id === p.user_id))
      .sort((a, b) => (b.total_stars || 0) - (a.total_stars || 0))
      .slice(0, 10)
      .map((p, index) => ({
        rank: index + 1,
        id: p.user_id,
        name: p.full_name || 'Student',
        avatar: getAvatar(p.user_id),
        stars: p.total_stars || 0,
        badges: p.badges || 0,
        streak: p.streak || 0,
        level: p.level || 'শিক্ষার্থী',
        accuracy: p.accuracy || 0,
        quizzes: p.quizzes_completed || 0
      }));

    // ── WEEKLY LEADERS: sum stars from activity in the last 7 days ─────────
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    let activityFilter = {
      created_at: { $gte: oneWeekAgo.toISOString() }
    };
    if (subject) activityFilter.subject = subject;

    const weeklyActivities = await getCollection('activity')
      .find(activityFilter)
      .toArray();

    // Group by student_id and sum stars
    const weeklyStarsMap = {};
    weeklyActivities.forEach(a => {
      if (!weeklyStarsMap[a.student_id]) {
        weeklyStarsMap[a.student_id] = { stars: 0, count: 0 };
      }
      weeklyStarsMap[a.student_id].stars += (a.stars_earned || 0);
      weeklyStarsMap[a.student_id].count++;
    });

    // Build weekly leaderboard
    const weeklyLeaders = Object.entries(weeklyStarsMap)
      .sort((a, b) => b[1].stars - a[1].stars)
      .slice(0, 10)
      .map(([studentId, data], index) => {
        const profile = profiles.find(p => p.user_id === studentId);
        return {
          rank: index + 1,
          id: studentId,
          name: profile?.full_name || 'Student',
          avatar: getAvatar(studentId),
          stars: data.stars,
          badges: profile?.badges || 0,
          streak: profile?.streak || 0,
          level: profile?.level || 'শিক্ষার্থী',
          quizzes: data.count
        };
      });

    // If no weekly activity yet, fall back to all-time with reduced stars
    const finalWeekly = weeklyLeaders.length >= 3
      ? weeklyLeaders
      : allTimeLeaders.slice(0, 5).map((p, i) => ({
          ...p,
          rank: i + 1,
          stars: Math.max(Math.floor(p.stars * 0.15), 1)
        }));

    res.json({ allTimeLeaders, weeklyLeaders: finalWeekly });
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// ==========================================
// REPORT CARDS ROUTES
// ==========================================

app.get('/api/report-cards', async (req, res) => {
  try {
    const { student_id } = req.query;
    const filter = student_id ? { student_id } : {};
    const cards = await getCollection('report_cards').find(filter).sort({ created_at: -1 }).toArray();
    res.json(cards);
  } catch (error) {
    console.error('Report cards GET error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/report-cards', async (req, res) => {
  try {
    const { student_id, exam_name, exam_year, teacher_comment, principal_comment, total_marks, rank, subjects } = req.body;
    if (!student_id) return res.status(400).json({ error: 'student_id required' });

    const result = await getCollection('report_cards').updateOne(
      { student_id, exam_name, exam_year },
      {
        $set: {
          student_id, exam_name, exam_year,
          teacher_comment, principal_comment,
          total_marks, rank,
          subjects: subjects || [],
          updated_at: new Date().toISOString()
        },
        $setOnInsert: { created_at: new Date().toISOString() }
      },
      { upsert: true }
    );

    res.json({ message: 'Report card saved', upserted: result.upsertedCount > 0 });
  } catch (error) {
    console.error('Report cards POST error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==========================================
// STATS ROUTE (for admin dashboard)
// ==========================================

app.get('/api/stats', async (req, res) => {
  try {
    const [users, contents, grades, subjects] = await Promise.all([
      getCollection('users').find({}).toArray(),
      getCollection('contents').find({}).toArray(),
      getCollection('grades').countDocuments(),
      getCollection('subjects').countDocuments()
    ]);

    res.json({
      totalStudents: users.filter(u => u.role === 'student').length,
      totalTeachers: users.filter(u => u.role === 'teacher').length,
      totalLessons: contents.length,
      totalGrades: grades,
      totalSubjects: subjects,
      publishedContent: contents.filter(c => c.is_published !== false).length,
      draftContent: contents.filter(c => c.is_published === false).length,
      activeUsers: users.length,
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==========================================
// HEALTH CHECK
// ==========================================

app.get('/api/health', async (req, res) => {
  try {
    await db.command({ ping: 1 });
    res.json({ status: 'ok', database: 'connected', timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ status: 'error', database: 'disconnected' });
  }
});

// ==========================================
// START SERVER OR EXPORT FOR SERVERLESS
// ==========================================

// In serverless environments (like Vercel), we don't start the server
// The platform handles the incoming requests and passes them to our app
if (process.env.NODE_ENV !== 'production' || process.env.RENDER) {
  async function start() {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Play Learn Grow API running on http://localhost:${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    });
  }

  start().catch(console.error);
}

// Export for Vercel
export default app;
