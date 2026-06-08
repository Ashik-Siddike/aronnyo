import React, { createContext, useContext, useState } from 'react';

type Lang = 'bn' | 'en';

const translations = {
  en: {
    // ── Navigation ──
    home: 'Home', dashboard: 'Dashboard', leaderboard: 'Leaderboard',
    profile: 'Profile', logout: 'Logout', login: 'Login',
    learn: 'Learn', games: 'Games', progressMenu: 'Progress',
    classes: 'Classes', subjects: 'Subjects', attendance: 'Attendance',
    reportCard: 'Report Card', teams: 'Teams', parentPanel: 'Parent Panel',
    timetable: 'Timetable', assignments: 'Assignments', lessons: 'Lessons',
    messages: 'Messages', adventureMap: 'Adventure Map',

    // ── MobileDock ──
    dockHome: 'Home', dockLearn: 'Learn', dockGames: 'Games',
    dockProgress: 'Progress', dockProfile: 'Profile',

    // ── Hero Section ──
    heroTag: 'Kids Learning Made Fun!',
    heroWelcome: 'Welcome to',
    heroAppName: '247School',
    heroSubtitle: 'Fun & Interactive Learning for Young Minds',
    heroDesc: 'Discover exciting lessons, play educational games, and track your progress on a magical learning journey!',
    heroStart: '🚀 Start Learning',
    heroExplore: '📚 Explore Subjects',
    heroStudents: 'Happy Students',
    heroLessons: 'Fun Lessons',
    heroFree: '100% Free',

    // ── Subjects Section ──
    subjectsTitle: 'Choose Your Subject',
    subjectsSubtitle: 'Pick a subject and start your learning adventure!',
    math: 'Mathematics', english: 'English', bangla: 'Bangla', science: 'Science',
    mathDesc: 'Numbers, counting, shapes and more!',
    englishDesc: 'Letters, words, reading and writing!',
    banglaDesc: 'বাংলা অক্ষর, শব্দ ও গল্প!',
    scienceDesc: 'Explore nature, animals and space!',

    // ── Games Section ──
    gamesTitle: 'Fun Learning Games',
    gamesSubtitle: 'Learn by playing exciting educational games!',
    countingGame: 'Counting Game', additionGame: 'Addition Game',
    subtractionGame: 'Subtraction Game', multiplicationGame: 'Multiplication Game',
    spellingWizard: 'Spelling Wizard', animalQuiz: 'Animal Quiz',
    writingWizard: 'Writing Wizard',
    plantExplorer: 'Plant Explorer', memoryMatch: 'Memory Match',
    playNow: 'Play Now', madeWithLove: 'Made with Love',

    // ── Dashboard ──
    totalStars: 'Total Stars', accuracy: 'Accuracy', streak: 'Streak', rank: 'Rank',
    quizzes: 'Quizzes', myProgress: 'My Progress', weeklyActivity: 'Weekly Activity',
    recentAchievements: 'Recent Achievements', currentGoals: 'Current Goals',
    goodMorning: 'Good Morning', keepLearning: 'Keep up the great work!',
    todayGoal: "Today's Goal", continueLesson: 'Continue Lesson',
    quickActions: 'Quick Actions', recentActivity: 'Recent Activity',
    viewAll: 'View All', startLearning: 'Start Learning',

    // ── Common ──
    loading: 'Loading...', save: 'Save', cancel: 'Cancel', search: 'Search',
    present: 'Present', absent: 'Absent', late: 'Late',
    submit: 'Submit', next: 'Next', back: 'Back', completed: 'Completed',
    close: 'Close', edit: 'Edit', delete: 'Delete', add: 'Add',
    yes: 'Yes', no: 'No', ok: 'OK', error: 'Error', success: 'Success',
    required: 'Required', optional: 'Optional',

    // ── Auth ──
    loginTitle: 'Welcome Back!', loginSubtitle: 'Sign in to continue your learning journey',
    registerTitle: 'Join 247School!', registerSubtitle: 'Create your free account today',
    email: 'Email', password: 'Password', name: 'Full Name',
    forgotPassword: 'Forgot Password?', haveAccount: 'Already have an account?',
    noAccount: "Don't have an account?", signIn: 'Sign In', signUp: 'Sign Up',

    // ── Leaderboard ──
    leaderboardTitle: 'Leaderboard', leaderboardSubtitle: 'See who is learning the most!',
    topLearners: 'Top Learners', thisWeek: 'This Week', allTime: 'All Time',
    myRank: 'My Rank', stars: 'Stars', level: 'Level', allGrades: 'All Grades',

    // ── Assignments ──
    assignmentsTitle: 'Assignments', dueDate: 'Due Date', submittedOn: 'Submitted On',
    notSubmitted: 'Not Submitted', pendingAssignments: 'Pending',
    completedAssignments: 'Completed', submitAssignment: 'Submit Assignment',
    uploadFile: 'Upload File', noAssignments: 'No assignments yet!',

    // ── Messages ──
    messagesTitle: 'Messages', newMessage: 'New Message', send: 'Send',
    typeMessage: 'Type a message...', noMessages: 'No messages yet!',
    teacher: 'Teacher', parent: 'Parent', student: 'Student',

    // ── Timetable ──
    timetableTitle: 'Timetable', monday: 'Monday', tuesday: 'Tuesday',
    wednesday: 'Wednesday', thursday: 'Thursday', friday: 'Friday',
    saturday: 'Saturday', sunday: 'Sunday', period: 'Period', subject: 'Subject',
    time: 'Time', room: 'Room', noClass: 'No class',

    // ── Profile ──
    profileTitle: 'My Profile', editProfile: 'Edit Profile', grade: 'Grade',
    school: 'School', age: 'Age', badges: 'Badges', certificates: 'Certificates',
    aboutMe: 'About Me',

    // ── Attendance ──
    attendanceTitle: 'Attendance', totalDays: 'Total Days', presentDays: 'Present Days',
    absentDays: 'Absent Days', attendanceRate: 'Attendance Rate',
    monthlyView: 'Monthly View',

    // ── Story Mode ──
    adventureMapTitle: 'Adventure Map', completedLabel: 'Done', lockedLabel: 'Locked',
    playBtn: 'Play!', playAgainBtn: 'Again', tapToStart: 'Tap a level to begin',
    wellDone: 'Well done!', ratePrompt: 'Rate your experience', saveContinue: 'Save & Continue',
    starsCollected: 'stars collected', journeyComplete: 'Journey Complete!',

    // ── Video Lessons ──
    videoLessonsTitle: 'Video Lessons', watchLesson: 'Watch Lesson',
    duration: 'Duration', views: 'Views', allSubjects: 'All Subjects',
    markWatched: 'Mark as Watched', alreadyWatched: 'Completed ✓',
    upNext: 'Up Next', videoStars: 'Stars Earned',
    watchedCount: 'Watched', outOf: 'of',

    // ── Certificate ──
    certificateTitle: 'Certificate of Achievement',
    certificateDesc: 'This certifies that the student has completed the learning journey.',
    downloadCert: 'Download Certificate', printCert: 'Print',
    issuedOn: 'Issued on', studentName: 'Student Name',

    // ── Messages (extra) ──
    inbox: 'Inbox', broadcast: 'Announcement', announcement: '📢 Announcement',
    sendReply: 'Reply', online: 'Online', adminReply: 'Admin',
    broadcastSent: 'Announcement sent!', noInbox: 'No messages yet.',
    messageFrom: 'Message from',

    // ── Timetable (extra) ──
    teacherLabel: 'Teacher', todaySchedule: "Today's Schedule",
    classCount: 'classes', noClassToday: 'No class scheduled today.',
    allDays: 'All Days', dbLive: 'Live from DB', fallbackData: 'Sample data',

    // ── Admin ──
    adminPanel: 'Admin Panel', systemModules: 'System Modules',
    activeModules: 'Active Modules', manageUsers: 'Manage Users',
    manageContent: 'Content Library', syncData: 'Sync Data',
    terminateSession: 'Sign Out',

    // ── Report Card ──
    reportCardTitle: 'Report Card', percentage: 'Percentage',
    remarks: 'Remarks', excellent: 'Excellent', good: 'Good', average: 'Average',
    needsImprovement: 'Needs Improvement',

    // ── Parent Panel ──
    parentPanelTitle: "Parent's Panel", myChild: 'My Child', childProgress: "Child's Progress",
    weeklyReport: 'Weekly Report', contactTeacher: 'Contact Teacher',

    // ── Features Section ──
    featuresTitle: 'Why Kids Love 247School',
    feature1Title: 'Interactive Lessons', feature1Desc: 'Fun, engaging content designed for young learners',
    feature2Title: 'Progress Tracking', feature2Desc: 'Monitor learning with detailed reports',
    feature3Title: 'Educational Games', feature3Desc: 'Learn while playing exciting games',
    feature4Title: 'Safe & Free', feature4Desc: '100% safe, free platform for every child',

    // ── Class Selection ──
    selectClass: 'Select Your Class', nursery: 'Nursery', class1: 'Class 1',
    class2: 'Class 2', class3: 'Class 3', class4: 'Class 4', class5: 'Class 5',

    // ── Not Found ──
    notFound: 'Page Not Found', notFoundDesc: 'The page you are looking for does not exist.',
    goHome: 'Go Home',

    // ── Footer ──
    footerTagline: 'Learning 24/7, One Lesson at a Time! 🌟',
    footerCopy: '© 2026 247School. Designed with ❤️ for young learners everywhere.',
    new: 'New',

    // ── Localization Fixes ──
    startYourAdventure: 'Start Your Learning Adventure',
    chooseClass: 'Choose Your Class',
    classSubtitle: 'Select your class - get curriculum made just for you! 🌟',
    readyToStart: 'Ready to Start Learning?',
    selectClassAbove: 'Choose any class above and view your lessons! 🎯',
    interactive: 'Interactive',
    gamified: 'Gamified',
    progress: 'Progress',
    firstGrade: '1st Grade',
    secondGrade: '2nd Grade',
    thirdGrade: '3rd Grade',
    fourthGrade: '4th Grade',
    fifthGrade: '5th Grade',
    viewProgressDashboard: 'View Progress Dashboard',
    interactiveGames: 'Interactive Games',
    educationalSubjects: 'Educational Subjects',
    funGuaranteed: 'Fun Guaranteed',
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
    whyKidsLoveTitle: 'Why Kids Love 247School!',
    whyKidsLoveDesc: "We've designed every feature to make learning feel like playing! Here's what makes 247School special 🌈",
    featureGamesTitle: 'Fun Games & Quizzes',
    featureGamesDesc: 'Learn through exciting games, puzzles, and interactive quizzes!',
    featureRewardsTitle: 'Rewards & Badges',
    featureRewardsDesc: 'Earn stars, badges, and trophies as you complete lessons!',
    featureTrackTitle: 'Track Progress',
    featureTrackDesc: "See how much you've learned with colorful progress charts!",
    featureAudioTitle: 'Audio Narration',
    featureAudioDesc: 'Listen to friendly voices read lessons and instructions!',
    featureActivitiesTitle: 'Interactive Activities',
    featureActivitiesDesc: 'Drag-and-drop, match games, and hands-on learning!',
    featureParentTitle: 'Parent Dashboard',
    featureParentDesc: 'Parents can track progress and celebrate achievements!',
    didYouKnow: 'Did you know?',
    didYouKnowDesc: "Kids who use 247School spend 3x more time learning and remember 85% more information compared to traditional methods! That's the power of fun learning! 🚀",
    moreEngagement: 'More Engagement',
    betterRetention: 'Better Retention',
    trackYourProgress: 'Track Your Amazing Progress!',
    trackYourProgressDesc: "See how much you've learned, celebrate your achievements, and discover what's next! 📈",
    hours: 'Hours',
    subjectProgress: 'Subject Progress',
    mathMaster: 'Math Master',
    mathMasterDesc: 'Solved 50 problems!',
    bookworm: 'Bookworm',
    bookwormDesc: 'Read 25 stories!',
    starCollector: 'Star Collector',
    starCollectorDesc: 'Earned 1000 stars!',
    learningStreak: 'Learning Streak!',
    keepItUpSuperstar: 'Keep it up, superstar! 🌟',
    nextGoal: 'Next Goal',
    complete10Science: 'Complete 10 Science Lessons',
    only4More: 'Only 4 more to go! 🚀',
    videoLessons: 'Video Lessons',
    storyMode: 'Story Mode',
    schoolTools: 'School Tools',
    myClasses: 'My Classes',
    nurseryStandard: 'Nursery',
    class1Standard: '1st Standard',
    class2Standard: '2nd Standard',
    class3Standard: '3rd Standard',
    class4Standard: '4th Standard',
    class5Standard: '5th Standard',
    installApp: 'Install App!',
    pwaDesc: 'Use 247School as an app on your device',
    install: 'Install',
    later: 'Later',
    fast: 'Fast',
    offline: 'Offline',
    notifications: 'Notifications',
    tourWelcome: 'Welcome to 247School!',
    tourWelcomeDesc: 'In this short tour we will show you the best features of the app.',
    tourChooseClass: 'Choose Class',
    tourChooseClassDesc: 'Select your grade level and view matching curriculum.',
    tourPlayGames: 'Play Fun Games',
    tourPlayGamesDesc: 'Math, Science, Languages — all subjects have fun games! Learn while playing!',
    tourTrackProgress: 'Track Progress',
    tourTrackProgressDesc: 'Earn points, build streaks, and rise to the top of the Leaderboard!',
    tourEarnCertificate: 'Get Certificate',
    tourEarnCertificateDesc: 'Complete the curriculum and receive a beautiful certificate in your name!',
    tourStartTitle: "Let's Start!",
    tourStartDesc: 'Start learning now and discover something new every day!',
    tourBack: 'Back',
    tourNext: 'Next',
    tourSkip: 'Skip',
    dailyChallenge: 'Daily Challenge',
    waiting: 'Waiting...',
    start: 'Start',
    toastChallengeComplete: 'Awesome! You won {stars} stars! 🌟',
    toastChallengeError: 'Sorry, something went wrong.',
  },

  bn: {
    // ── Navigation ──
    home: 'হোম', dashboard: 'ড্যাশবোর্ড', leaderboard: 'লিডারবোর্ড',
    profile: 'প্রোফাইল', logout: 'লগআউট', login: 'লগইন',
    learn: 'শেখো', games: 'গেমস', progressMenu: 'অগ্রগতি',
    classes: 'ক্লাস', subjects: 'বিষয়', attendance: 'উপস্থিতি',
    reportCard: 'রিপোর্ট কার্ড', teams: 'টিম', parentPanel: 'অভিভাবক প্যানেল',
    timetable: 'সময়সূচি', assignments: 'অ্যাসাইনমেন্ট', lessons: 'পাঠ',
    messages: 'বার্তা', adventureMap: 'অ্যাডভেঞ্চার ম্যাপ',

    // ── MobileDock ──
    dockHome: 'হোম', dockLearn: 'পড়া', dockGames: 'গেমস',
    dockProgress: 'অগ্রগতি', dockProfile: 'প্রোফাইল',

    // ── Hero Section ──
    heroTag: 'বাচ্চাদের শেখা এখন মজার!',
    heroWelcome: 'স্বাগতম',
    heroAppName: '২৪৭স্কুল',
    heroSubtitle: 'ছোটদের জন্য মজাদার ইন্টারেক্টিভ শিক্ষা',
    heroDesc: 'মজার পাঠ আবিষ্কার করো, শিক্ষামূলক গেম খেলো এবং তোমার অগ্রগতি ট্র্যাক করো!',
    heroStart: '🚀 পড়া শুরু করো',
    heroExplore: '📚 বিষয় দেখো',
    heroStudents: 'সুখী শিক্ষার্থী',
    heroLessons: 'মজার পাঠ',
    heroFree: '১০০% বিনামূল্যে',

    // ── Subjects Section ──
    subjectsTitle: 'তোমার বিষয় বেছে নাও',
    subjectsSubtitle: 'একটি বিষয় বেছে নিয়ে শেখার যাত্রা শুরু করো!',
    math: 'গণিত', english: 'ইংরেজি', bangla: 'বাংলা', science: 'বিজ্ঞান',
    mathDesc: 'সংখ্যা, গণনা, আকৃতি এবং আরও অনেক কিছু!',
    englishDesc: 'অক্ষর, শব্দ, পড়া ও লেখা!',
    banglaDesc: 'বাংলা অক্ষর, শব্দ ও গল্প!',
    scienceDesc: 'প্রকৃতি, প্রাণী ও মহাকাশ আবিষ্কার করো!',

    // ── Games Section ──
    gamesTitle: 'মজার শিক্ষামূলক গেমস',
    gamesSubtitle: 'খেলতে খেলতে শেখো!',
    countingGame: 'গণনার গেম', additionGame: 'যোগের গেম',
    subtractionGame: 'বিয়োগের গেম', multiplicationGame: 'গুণের গেম',
    spellingWizard: 'বানান জাদুকর', animalQuiz: 'প্রাণী কুইজ',
    writingWizard: 'বর্ণমালা জাদুকর',
    plantExplorer: 'উদ্ভিদ অন্বেষণ', memoryMatch: 'স্মৃতি মিলাও',
    playNow: 'এখনই খেলো', madeWithLove: 'ভালোবাসা দিয়ে তৈরি',

    // ── Dashboard ──
    totalStars: 'মোট তারা', accuracy: 'নির্ভুলতা', streak: 'ধারাবাহিকতা', rank: 'র‍্যাংক',
    quizzes: 'কুইজ', myProgress: 'আমার অগ্রগতি', weeklyActivity: 'সাপ্তাহিক কার্যক্রম',
    recentAchievements: 'সাম্প্রতিক অর্জন', currentGoals: 'বর্তমান লক্ষ্য',
    goodMorning: 'শুভ সকাল', keepLearning: 'চমৎকার কাজ চালিয়ে যাও!',
    todayGoal: 'আজকের লক্ষ্য', continueLesson: 'পাঠ চালিয়ে যাও',
    quickActions: 'দ্রুত কাজ', recentActivity: 'সাম্প্রতিক কার্যক্রম',
    viewAll: 'সব দেখো', startLearning: 'পড়া শুরু করো',

    // ── Common ──
    loading: 'লোড হচ্ছে...', save: 'সংরক্ষণ', cancel: 'বাতিল', search: 'খুঁজুন',
    present: 'উপস্থিত', absent: 'অনুপস্থিত', late: 'দেরি',
    submit: 'জমা দিন', next: 'পরবর্তী', back: 'পেছনে', completed: 'সম্পন্ন',
    close: 'বন্ধ', edit: 'সম্পাদনা', delete: 'মুছুন', add: 'যোগ করুন',
    yes: 'হ্যাঁ', no: 'না', ok: 'ঠিক আছে', error: 'ত্রুটি', success: 'সফল',
    required: 'আবশ্যক', optional: 'ঐচ্ছিক',

    // ── Auth ──
    loginTitle: 'আবার স্বাগতম!', loginSubtitle: 'শেখার যাত্রা চালিয়ে যেতে সাইন ইন করো',
    registerTitle: '২৪৭স্কুলে যোগ দাও!', registerSubtitle: 'আজই বিনামূল্যে অ্যাকাউন্ট খোলো',
    email: 'ইমেইল', password: 'পাসওয়ার্ড', name: 'পুরো নাম',
    forgotPassword: 'পাসওয়ার্ড ভুলে গেছো?', haveAccount: 'ইতিমধ্যে অ্যাকাউন্ট আছে?',
    noAccount: 'অ্যাকাউন্ট নেই?', signIn: 'সাইন ইন', signUp: 'সাইন আপ',

    // ── Leaderboard ──
    leaderboardTitle: 'লিডারবোর্ড', leaderboardSubtitle: 'দেখো কে সবচেয়ে বেশি শিখছে!',
    topLearners: 'সেরা শিক্ষার্থী', thisWeek: 'এই সপ্তাহ', allTime: 'সর্বকালীন',
    myRank: 'আমার র‍্যাংক', stars: 'তারা', level: 'স্তর', allGrades: 'সব ক্লাস',

    // ── Assignments ──
    assignmentsTitle: 'অ্যাসাইনমেন্ট', dueDate: 'জমা দেওয়ার তারিখ', submittedOn: 'জমা দেওয়া হয়েছে',
    notSubmitted: 'জমা দেওয়া হয়নি', pendingAssignments: 'বাকি',
    completedAssignments: 'সম্পন্ন', submitAssignment: 'অ্যাসাইনমেন্ট জমা দাও',
    uploadFile: 'ফাইল আপলোড করো', noAssignments: 'এখনো কোনো অ্যাসাইনমেন্ট নেই!',

    // ── Messages ──
    messagesTitle: 'বার্তা', newMessage: 'নতুন বার্তা', send: 'পাঠাও',
    typeMessage: 'বার্তা লিখুন...', noMessages: 'এখনো কোনো বার্তা নেই!',
    teacher: 'শিক্ষক', parent: 'অভিভাবক', student: 'শিক্ষার্থী',

    // ── Timetable ──
    timetableTitle: 'সময়সূচি', monday: 'সোমবার', tuesday: 'মঙ্গলবার',
    wednesday: 'বুধবার', thursday: 'বৃহস্পতিবার', friday: 'শুক্রবার',
    saturday: 'শনিবার', sunday: 'রবিবার', period: 'পিরিয়ড', subject: 'বিষয়',
    time: 'সময়', room: 'রুম', noClass: 'কোনো ক্লাস নেই',

    // ── Profile ──
    profileTitle: 'আমার প্রোফাইল', editProfile: 'প্রোফাইল সম্পাদনা', grade: 'শ্রেণি',
    school: 'স্কুল', age: 'বয়স', badges: 'ব্যাজ', certificates: 'সার্টিফিকেট',
    aboutMe: 'আমার সম্পর্কে',

    // ── Attendance ──
    attendanceTitle: 'উপস্থিতি', totalDays: 'মোট দিন', presentDays: 'উপস্থিত দিন',
    absentDays: 'অনুপস্থিত দিন', attendanceRate: 'উপস্থিতির হার',
    monthlyView: 'মাসিক দেখুন',

    // ── Story Mode ──
    adventureMapTitle: 'অ্যাডভেঞ্চার ম্যাপ', completedLabel: 'সম্পন্ন', lockedLabel: 'লক',
    playBtn: 'খেলো!', playAgainBtn: 'আবার', tapToStart: 'একটি স্তর বেছে নাও',
    wellDone: 'দারুণ হয়েছে!', ratePrompt: 'তোমার অভিজ্ঞতা রেট করো', saveContinue: 'সংরক্ষণ করো →',
    starsCollected: 'তারা সংগ্রহ', journeyComplete: 'যাত্রা সম্পন্ন!',

    // ── Video Lessons ──
    videoLessonsTitle: 'ভিডিও পাঠ', watchLesson: 'পাঠ দেখো',
    duration: 'সময়কাল', views: 'দেখা হয়েছে', allSubjects: 'সব বিষয়',
    markWatched: 'দেখা হয়েছে', alreadyWatched: 'সম্পন্ন ✓',
    upNext: 'পরের পাঠ', videoStars: 'অর্জিত তারা',
    watchedCount: 'দেখেছি', outOf: 'এর মধ্যে',

    // ── Certificate ──
    certificateTitle: 'অর্জনের সনদ',
    certificateDesc: 'এই সনদপত্রে প্রমাণিত হয় যে শিক্ষার্থী শেখার যাত্রা সম্পন্ন করেছে।',
    downloadCert: 'সনদ ডাউনলোড করো', printCert: 'প্রিন্ট করো',
    issuedOn: 'প্রদানের তারিখ', studentName: 'শিক্ষার্থীর নাম',

    // ── Assignments (extra) ──
    allAssignments: 'সব', pendingLabel: 'সক্রিয়', overdueLabel: 'মেয়াদ শেষ',
    assignmentDesc: 'বিবরণ', noDescription: 'কোনো বিবরণ দেওয়া হয়নি।',
    submitSuccess: 'অ্যাসাইনমেন্ট জমা হয়েছে! 🎉', submitFailed: 'জমা হয়নি, আবার চেষ্টা করো।',
    fileRequired: 'একটি ফাইল সংযুক্ত করো', confirmSubmit: 'এই অ্যাসাইনমেন্ট জমা দেবে?',

    // ── Messages (extra) ──
    inbox: 'ইনবক্স', broadcast: 'ঘোষণা', announcement: '📢 ঘোষণা',
    sendReply: 'উত্তর দাও', online: 'অনলাইন', adminReply: 'অ্যাডমিন',
    broadcastSent: 'ঘোষণা পাঠানো হয়েছে!', noInbox: 'এখনো কোনো বার্তা নেই।',
    messageFrom: 'বার্তা থেকে',

    // ── Timetable (extra) ──
    teacherLabel: 'শিক্ষক', todaySchedule: 'আজকের সময়সূচি',
    classCount: 'ক্লাস', noClassToday: 'আজ কোনো ক্লাস নেই।',
    allDays: 'সব দিন', dbLive: 'DB থেকে সরাসরি', fallbackData: 'নমুনা ডেটা',

    // ── Admin ──
    adminPanel: 'অ্যাডমিন প্যানেল', systemModules: 'সিস্টেম মডিউল',
    activeModules: 'সক্রিয় মডিউল', manageUsers: 'ব্যবহারকারী ব্যবস্থাপনা',
    manageContent: 'কন্টেন্ট লাইব্রেরি', syncData: 'ডেটা সিঙ্ক করো',
    terminateSession: 'সাইন আউট',

    // ── Report Card ──
    reportCardTitle: 'রিপোর্ট কার্ড', percentage: 'শতাংশ',
    remarks: 'মন্তব্য', excellent: 'চমৎকার', good: 'ভালো', average: 'গড়',
    needsImprovement: 'উন্নতি প্রয়োজন',

    // ── Parent Panel ──
    parentPanelTitle: 'অভিভাবক প্যানেল', myChild: 'আমার সন্তান', childProgress: 'সন্তানের অগ্রগতি',
    weeklyReport: 'সাপ্তাহিক রিপোর্ট', contactTeacher: 'শিক্ষকের সাথে যোগাযোগ',

    // ── Features Section ──
    featuresTitle: 'কেন বাচ্চারা ২৪৭স্কুল ভালোবাসে',
    feature1Title: 'ইন্টারেক্টিভ পাঠ', feature1Desc: 'ছোটদের জন্য মজাদার শিক্ষামূলক কন্টেন্ট',
    feature2Title: 'অগ্রগতি ট্র্যাকিং', feature2Desc: 'বিস্তারিত রিপোর্টে শেখার অগ্রগতি দেখো',
    feature3Title: 'শিক্ষামূলক গেমস', feature3Desc: 'মজার গেম খেলতে খেলতে শেখো',
    feature4Title: 'নিরাপদ ও বিনামূল্যে', feature4Desc: 'প্রতিটি শিশুর জন্য ১০০% নিরাপদ প্ল্যাটফর্ম',

    // ── Class Selection ──
    selectClass: 'তোমার ক্লাস বেছে নাও', nursery: 'নার্সারি', class1: 'প্রথম শ্রেণি',
    class2: 'দ্বিতীয় শ্রেণি', class3: 'তৃতীয় শ্রেণি', class4: 'চতুর্থ শ্রেণি', class5: 'পঞ্চম শ্রেণি',

    // ── Not Found ──
    notFound: 'পেজ পাওয়া যায়নি', notFoundDesc: 'আপনি যে পেজটি খুঁজছেন তা বিদ্যমান নেই।',
    goHome: 'হোমে যাও',

    // ── Footer ──
    footerTagline: '২৪/৭ শিখতে থাকো, একটি পাঠ একটি পাঠ করে! 🌟',
    footerCopy: '© ২০২৬ ২৪৭স্কুল। বাংলাদেশের ছোটদের জন্য ❤️ দিয়ে তৈরি।',
    new: 'নতুন',

    // ── Localization Fixes ──
    startYourAdventure: 'শেখার নতুন অভিজ্ঞতা শুরু হোক',
    chooseClass: 'তোমার শ্রেণি বেছে নাও',
    classSubtitle: 'তোমার ক্লাস সিলেক্ট করো — তোমার জন্য তৈরি পাঠ্যক্রম পাবে! 🌟',
    readyToStart: 'শেখার যাত্রা শুরু করতে প্রস্তুত?',
    selectClassAbove: 'উপরে যেকোনো ক্লাস বেছে নাও এবং তোমার পাঠ্যক্রম দেখো! 🎯',
    interactive: 'ইন্টারঅ্যাক্টিভ',
    gamified: 'মজাদার',
    progress: 'প্রগ্রেস',
    firstGrade: '১ম শ্রেণি',
    secondGrade: '২য় শ্রেণি',
    thirdGrade: '৩য় শ্রেণি',
    fourthGrade: '৪র্থ শ্রেণি',
    fifthGrade: '৫ম শ্রেণি',
    viewProgressDashboard: 'অগ্রগতি ড্যাশবোর্ড দেখাও',
    interactiveGames: 'ইন্টারঅ্যাক্টিভ গেম',
    educationalSubjects: 'শিক্ষামূলক বিষয়',
    funGuaranteed: 'মজা গ্যারান্টি',
    easy: 'সহজ',
    medium: 'মধ্যম',
    hard: 'কঠিন',
    whyKidsLoveTitle: 'কেন বাচ্চারা ২৪৭স্কুল ভালোবাসে!',
    whyKidsLoveDesc: 'আমরা প্রতিটি ফিচার এমনভাবে তৈরি করেছি যাতে মনে হয় খেলাধুলা করছ! এখানে দেখো ২৪৭স্কুল এর বিশেষত্ব 🌈',
    featureGamesTitle: 'মজার গেম এবং কুইজ',
    featureGamesDesc: 'মজাদার গেম, ধাঁধা এবং কুইজের মাধ্যমে শেখো!',
    featureRewardsTitle: 'পুরস্কার ও ব্যাজ',
    featureRewardsDesc: 'লেসন শেষ করে স্টার, ব্যাজ এবং ট্রফি অর্জন করো!',
    featureTrackTitle: 'অগ্রগতি ট্র্যাক করো',
    featureTrackDesc: 'রঙিন চার্ট দিয়ে তোমার অগ্রগতি কেমন তা দেখে নাও!',
    featureAudioTitle: 'অডিও বর্ণনা',
    featureAudioDesc: 'সহজ মিষ্টি কণ্ঠে লেসন ও নির্দেশনা শুনে শুনে শেখো!',
    featureActivitiesTitle: 'ইন্টারেক্টিভ কার্যক্রম',
    featureActivitiesDesc: 'ড্র্যাগ-অ্যান্ড-ড্রপ, ম্যাচিং গেম এবং হাতের কাজ শেখার সুযোগ!',
    featureParentTitle: 'অভিভাবক প্যানেল',
    featureParentDesc: 'অভিভাবকরাও সন্তানের অগ্রগতি দেখতে ও খুশি উদযাপন করতে পারেন!',
    didYouKnow: 'তুমি কি জানতে?',
    didYouKnowDesc: '২৪৭স্কুল ব্যবহারকারী শিশুরা ৩ গুণ বেশি সময় মনোযোগ দিতে পারে এবং ঐতিহ্যবাহী পদ্ধতির চেয়ে ৮৫% বেশি মনে রাখতে পারে! এটাই তো মজার শিক্ষার জাদু! 🚀',
    moreEngagement: 'বেশি মনোযোগ',
    betterRetention: 'দীর্ঘস্থায়ী স্মৃতি',
    trackYourProgress: 'তোমার চমৎকার অগ্রগতি ট্র্যাক করো!',
    trackYourProgressDesc: 'তুমি কতটুকু শিখেছ তা দেখো, অর্জনগুলো উদযাপন করো এবং সামনে কী আছে তা জানো! 📈',
    hours: 'ঘণ্টা',
    subjectProgress: 'বিষয়ভিত্তিক অগ্রগতি',
    mathMaster: 'গণিত শিক্ষক',
    mathMasterDesc: '৫০টি সমস্যার সমাধান করেছ!',
    bookworm: 'বইপোকা',
    bookwormDesc: '২৫টি গল্প পড়েছ!',
    starCollector: 'তারকা সংগ্রাহক',
    starCollectorDesc: '১০০০ তারা অর্জন করেছ!',
    learningStreak: 'শেখার ধারা!',
    keepItUpSuperstar: 'চালিয়ে যাও, superstar! 🌟',
    nextGoal: 'পরবর্তী লক্ষ্য',
    complete10Science: '১০টি বিজ্ঞান লেসন শেষ করো',
    only4More: 'আর মাত্র ৪টি বাকি আছে! 🚀',
    videoLessons: 'ভিডিও পাঠ',
    storyMode: 'গল্পের মোড',
    schoolTools: 'স্কুলের টুলস',
    myClasses: 'আমার ক্লাসসমূহ',
    nurseryStandard: 'নার্সারি',
    class1Standard: '১ম স্ট্যান্ডার্ড',
    class2Standard: '২য় স্ট্যান্ডার্ড',
    class3Standard: '৩য় স্ট্যান্ডার্ড',
    class4Standard: '৪র্থ স্ট্যান্ডার্ড',
    class5Standard: '৫ম স্ট্যান্ডার্ড',
    installApp: 'অ্যাপ ইন্সটল করুন!',
    pwaDesc: '247School আপনার ডিভাইসে অ্যাপ হিসেবে ব্যবহার করুন',
    install: 'ইন্সটল করুন',
    later: 'পরে',
    fast: 'দ্রুত',
    offline: 'অফলাইন',
    notifications: 'নোটিফিকেশন',
    tourWelcome: '247School-এ স্বাগতম!',
    tourWelcomeDesc: 'এই সংক্ষিপ্ত ট্যুরে আমরা অ্যাপটির সেরা ফিচারগুলো দেখাবো।',
    tourChooseClass: 'শ্রেণি বেছে নাও',
    tourChooseClassDesc: 'তোমার শ্রেণি সিলেক্ট করো এবং সেই অনুযায়ী পাঠ্যক্রম দেখো।',
    tourPlayGames: 'মজার গেম খেলো',
    tourPlayGamesDesc: 'গণিত, বিজ্ঞান, ভাষা — সব বিষয়ের মজাদার গেম এখানে! খেলে খেলে শেখো!',
    tourTrackProgress: 'অগ্রগতি ট্র্যাক করো',
    tourTrackProgressDesc: 'পয়েন্ট আয় করো, স্ট্রিক বাড়াও এবং Leaderboard-এ শীর্ষে উঠো!',
    tourEarnCertificate: 'সার্টিফিকেট পাও',
    tourEarnCertificateDesc: 'কোর্স সম্পন্ন করলে তোমার নামে সুন্দর সার্টিফিকেট পাবে!',
    tourStartTitle: 'শুরু করো!',
    tourStartDesc: 'এখন শেখা শুরু করো এবং প্রতিদিন নতুন কিছু আবিষ্কার করো!',
    tourBack: 'পেছনে',
    tourNext: 'পরবর্তী',
    tourSkip: 'বাদ দাও',
    dailyChallenge: 'আজকের চ্যালেঞ্জ',
    waiting: 'অপেক্ষা...',
    start: 'শুরু করো',
    toastChallengeComplete: 'অসাধারণ! তুমি {stars} স্টার জিতেছ! 🌟',
    toastChallengeError: 'দুঃখিত, কিছু সমস্যা হয়েছে।',
  },
} as const;

export type TranslationKey = keyof typeof translations.en;
export type T = typeof translations.en;

interface LangContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: T;
  isBn: boolean;
}

const LangContext = createContext<LangContextType | undefined>(undefined);

export const useLang = () => {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be inside LangProvider');
  return ctx;
};

export const LangProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Lang>(() =>
    (localStorage.getItem('247school_lang') as Lang) || 'en'
  );

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem('247school_lang', l);
  };

  const t = lang === 'bn' ? translations.bn : translations.en;

  return (
    <LangContext.Provider value={{ lang, setLang, t, isBn: lang === 'bn' }}>
      {children}
    </LangContext.Provider>
  );
};
