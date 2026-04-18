// Play Learn Grow - Express.js API Server
// Connects React frontend to MongoDB database

import 'dotenv/config';
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

// POST /api/activity
app.post('/api/activity', async (req, res) => {
  try {
    const activity = {
      _id: `activity-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...req.body,
      created_at: new Date().toISOString()
    };
    await getCollection('activity').insertOne(activity);
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
// STUDENT DASHBOARD ROUTE
// ==========================================

app.get('/api/student-dashboard', async (req, res) => {
  try {
    const studentId = req.query.userId || 'student-1'; // Default to first demo student (Fatima)
    
    const [profile, activities, achievements, users] = await Promise.all([
      getCollection('profiles').findOne({ user_id: studentId }),
      getCollection('activity').find({ student_id: studentId }).sort({ created_at: -1 }).limit(10).toArray(),
      getCollection('achievements').find({ student_id: studentId }).sort({ earned_at: -1 }).toArray(),
      getCollection('users').find({ role: 'student' }).toArray()
    ]);

    if (!profile) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const friends = users
      .filter(u => u._id !== studentId)
      .slice(0, 4)
      .map(u => ({
        name: u.full_name,
        avatar: u.avatar_emoji || '👧',
        stars: Math.floor(500 + Math.random() * 1000),
        isOnline: Math.random() > 0.5
      }));

    const dashboardData = {
      name: profile.full_name || 'শিক্ষার্থী',
      totalStars: profile.total_stars || 0,
      badges: profile.badges || 0,
      hoursLearned: profile.hours_learned || 0,
      accuracy: profile.accuracy || 0,
      streak: profile.streak || 0,
      level: profile.level || 'নতুন শিক্ষার্থী',
      rank: Math.floor(1 + Math.random() * 5), // Mock rank for now
      totalStudents: users.length,
      subjects: [
        { name: "Math", progress: 88, icon: "🔢", color: "text-eduplay-blue", lessonsCompleted: profile.lessons_completed || 15, totalLessons: 20, lastScore: 95, timeSpent: "14h" },
        { name: "English", progress: 75, icon: "📖", color: "text-eduplay-green", lessonsCompleted: 10, totalLessons: 20, lastScore: 88, timeSpent: "11h" },
        { name: "Bangla", progress: 92, icon: "🇧🇩", color: "text-eduplay-orange", lessonsCompleted: 18, totalLessons: 20, lastScore: 96, timeSpent: "13h" },
        { name: "Science", progress: 70, icon: "🔬", color: "text-eduplay-purple", lessonsCompleted: 8, totalLessons: 20, lastScore: 85, timeSpent: "9h" }
      ],
      recentAchievements: achievements.map(a => ({
        title: a.title,
        description: a.desc,
        icon: a.icon,
        date: new Date(a.earned_at).toLocaleDateString(),
        points: a.points
      })),
      weeklyActivity: [
        { day: "শনি", lessons: 3, stars: 14, minutes: 50 },
        { day: "রবি", lessons: 4, stars: 18, minutes: 65 },
        { day: "সোম", lessons: 3, stars: 12, minutes: 45 },
        { day: "মঙ্গল", lessons: 5, stars: 20, minutes: 75 },
        { day: "বুধ", lessons: 4, stars: 16, minutes: 55 },
        { day: "বৃহঃ", lessons: 3, stars: 11, minutes: 40 },
        { day: "শুক্র", lessons: 2, stars: 8, minutes: 30 }
      ],
      favoriteSubjects: ["Math", "Bangla"],
      currentGoals: [
        { subject: "Science", target: 20, current: 8, description: "২০টি বিজ্ঞান পাঠ সম্পন্ন করো" },
        { subject: "English", target: 20, current: 10, description: "২০টি ইংরেজি গল্প পড়ো" },
        { subject: "Math", target: 100, current: 82, description: "১০০টি গণিত সমস্যা সমাধান করো" }
      ],
      friends: friends
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
      return res.status(404).json({ error: 'Student not found' });
    }

    const dashboardData = {
      name: profile.full_name || 'শিক্ষার্থী',
      age: 6, // default
      grade: 'Nursery (A)',
      totalLearningTime: `${profile.hours_learned || 0} ঘন্টা`,
      lessonsCompleted: profile.lessons_completed || 0,
      averageAccuracy: profile.accuracy || 0,
      currentStreak: profile.streak || 0,
      subjects: [
        { name: "গণিত (Math)", progress: 88, timeSpent: "14h", accuracy: 95, lastActivity: "আজ" },
        { name: "ইংরেজি (English)", progress: 75, timeSpent: "11h", accuracy: 88, lastActivity: "গতকাল" },
        { name: "বাংলা (Bangla)", progress: 92, timeSpent: "14h", accuracy: 96, lastActivity: "আজ" },
        { name: "বিজ্ঞান (Science)", progress: 70, timeSpent: "10h", accuracy: 85, lastActivity: "আজ" }
      ],
      weeklyStats: {
        lessonsThisWeek: 18,
        starsEarned: profile.total_stars > 100 ? 95 : profile.total_stars,
        timeSpent: "10h 45m",
        improvement: "+18%"
      },
      recentActivity: activities.map(a => ({
        subject: a.subject,
        lesson: a.type === 'lesson_completed' ? 'পাঠ সম্পন্ন' : (a.type === 'quiz_taken' ? 'কুইজ' : 'অ্যাক্টিভিটি'),
        score: `${a.score}% ⭐`,
        time: new Date(a.created_at).toLocaleDateString()
      })),
      recommendations: [
        `${profile.full_name} বাংলায় অসাধারণ করছে! তাকে আরও গল্পের বই পড়তে উৎসাহিত করুন। 📚`,
        "বিজ্ঞানে প্রতিদিন ১৫ মিনিট অনুশীলন করলে আরও ভালো করবে। 🔬",
        `দারুণ! একটানা ${profile.streak || 1} দিন স্ট্রিক — ${profile.full_name}কে পুরস্কৃত করুন! 🎉`,
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
    const users = await getCollection('users').find({ role: 'student' }).toArray();
    const profiles = await getCollection('profiles').find({}).toArray();
    
    // Map profiles to users
    const allTimeLeaders = profiles
      .filter(p => users.some(u => u._id === p.user_id))
      .sort((a, b) => (b.total_stars || 0) - (a.total_stars || 0))
      .slice(0, 10)
      .map((p, index) => ({
        rank: index + 1,
        id: p.user_id,
        name: p.full_name,
        avatar: "👧", // Default emoji or should get from user
        stars: p.total_stars || 0,
        badges: p.badges || 0,
        streak: p.streak || 0,
        level: p.level || "শিক্ষার্থী"
      }));

    // Generate weekly by adding some randomness to all-time to simulate weekly diff
    const weeklyLeaders = [...allTimeLeaders]
      .sort(() => 0.5 - Math.random())
      .slice(0, 5)
      .map((p, index) => ({
        ...p,
        rank: index + 1,
        stars: Math.floor(p.stars * 0.1) // Simulate weekly stars
      }))
      .sort((a, b) => b.stars - a.stars)
      .map((p, index) => ({ ...p, rank: index + 1 }));

    res.json({ allTimeLeaders, weeklyLeaders });
  } catch (error) {
    console.error('Leaderboard error:', error);
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
