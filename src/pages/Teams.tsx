
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Github, GraduationCap, Code, Palette, Brain, Star, Trophy, Sparkles, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const teamMembers = [
  {
    id: 1,
    name: "Ashik Siddike",
    position: "Founder & Lead Developer",
    bio: "Full-stack developer and visionary behind 247School. Built the entire platform architecture, MongoDB database, and API infrastructure. Passionate about using technology to make education accessible, interactive, and joyful for every child in Bangladesh.",
    avatar: "👨‍💻",
    color: "from-eduplay-blue to-eduplay-purple",
    skills: ["React", "Node.js", "MongoDB", "TypeScript", "System Architecture"],
    github: "Ashik-Siddike"
  },
  {
    id: 2,
    name: "Aronnyo (Virifat)",
    position: "Co-Founder & UI/UX Specialist",
    bio: "Creative developer focused on building engaging, interactive learning experiences. Designed the beautiful UI, gamified lesson system, and kid-friendly dashboards that make learning fun for young minds.",
    avatar: "🎨",
    color: "from-eduplay-green to-teal-500",
    skills: ["JavaScript", "UI/UX Design", "Gamification", "Frontend Development"],
    email: "virifat01@gmail.com"
  }
];

const projectStats = [
  { icon: "📚", label: "Lessons Created", value: "40+", color: "text-eduplay-blue" },
  { icon: "🎮", label: "Interactive Games", value: "8", color: "text-eduplay-green" },
  { icon: "🗣️", label: "Languages", value: "3", color: "text-eduplay-purple" },
  { icon: "📱", label: "Responsive", value: "100%", color: "text-eduplay-orange" },
];

const techStack = [
  { name: "React + TypeScript", icon: "⚛️", desc: "Frontend Framework" },
  { name: "Node.js + Express", icon: "🟢", desc: "Backend API Server" },
  { name: "MongoDB Atlas", icon: "🍃", desc: "Cloud Database" },
  { name: "Vite", icon: "⚡", desc: "Build Tool" },
  { name: "Tailwind CSS", icon: "🎨", desc: "Styling Framework" },
  { name: "Shadcn/UI", icon: "🧩", desc: "Component Library" },
];

const Teams = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-purple-50/30 py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-gradient-to-r from-eduplay-purple/10 to-eduplay-blue/10 px-4 py-2 rounded-full border border-eduplay-purple/20 mb-6 animate-fade-in">
            <Sparkles className="w-5 h-5 text-eduplay-purple mr-2" />
            <span className="text-eduplay-purple font-semibold">The Team Behind 247School</span>
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-800 mb-6 animate-fade-in">
            Meet Our <span className="bg-gradient-to-r from-eduplay-purple to-eduplay-blue bg-clip-text text-transparent">Amazing Team</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-fade-in delay-150">
            Two passionate developers on a mission to revolutionize how children in Bangladesh learn — making education fun, interactive, and accessible to all. 🇧🇩
          </p>
        </div>

        {/* Team Members */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-20">
          {teamMembers.map((member, index) => (
            <Card
              key={member.id}
              className="bg-white border-0 playful-shadow hover:scale-105 transition-all duration-500 animate-fade-in overflow-hidden"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              {/* Gradient Header */}
              <div className={`bg-gradient-to-r ${member.color} p-8 text-center`}>
                <div className="text-6xl mb-3 animate-bounce-gentle">{member.avatar}</div>
                <h2 className="text-2xl font-bold text-white mb-1">{member.name}</h2>
                <p className="text-white/90 font-medium">{member.position}</p>
              </div>
              
              <CardContent className="p-6">
                <p className="text-gray-600 text-center mb-6 leading-relaxed">
                  {member.bio}
                </p>
                
                {/* Skills */}
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  {member.skills.map((skill, i) => (
                    <span key={i} className="px-3 py-1 bg-gradient-to-r from-eduplay-purple/10 to-eduplay-blue/10 text-eduplay-purple text-sm font-medium rounded-full border border-eduplay-purple/20">
                      {skill}
                    </span>
                  ))}
                </div>
                
                {/* Links */}
                <div className="flex justify-center space-x-4">
                  {member.email && (
                    <a href={`mailto:${member.email}`} className="p-2 rounded-full bg-eduplay-blue/10 hover:bg-eduplay-blue/20 transition-colors" title="Email">
                      <Mail className="w-5 h-5 text-eduplay-blue" />
                    </a>
                  )}
                  {member.github && (
                    <a href={`https://github.com/${member.github}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-gray-600/10 hover:bg-gray-600/20 transition-colors" title="GitHub">
                      <Github className="w-5 h-5 text-gray-600" />
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Project Stats */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
            <Trophy className="w-8 h-8 inline-block text-eduplay-yellow mr-2" />
            Project Highlights
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {projectStats.map((stat, i) => (
              <Card key={i} className="border-0 playful-shadow text-center hover:scale-110 transition-all duration-300 bg-white">
                <CardContent className="p-6">
                  <div className="text-4xl mb-2 animate-bounce-gentle" style={{ animationDelay: `${i * 200}ms` }}>{stat.icon}</div>
                  <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
            <Code className="w-8 h-8 inline-block text-eduplay-blue mr-2" />
            Technology Stack
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
            {techStack.map((tech, i) => (
              <Card key={i} className="border-0 playful-shadow text-center hover:scale-110 transition-all duration-300 bg-white cursor-pointer">
                <CardContent className="p-4">
                  <div className="text-3xl mb-2">{tech.icon}</div>
                  <div className="text-sm font-bold text-gray-800">{tech.name}</div>
                  <div className="text-xs text-gray-500 mt-1">{tech.desc}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Mission Statement */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-eduplay-purple via-eduplay-blue to-eduplay-green p-10 rounded-3xl max-w-4xl mx-auto playful-shadow">
            <Heart className="w-12 h-12 text-white/80 mx-auto mb-4 animate-pulse" />
            <h2 className="text-3xl font-bold text-white mb-4">আমাদের লক্ষ্য 🇧🇩</h2>
            <p className="text-white/90 text-lg mb-4 leading-relaxed max-w-2xl mx-auto">
              বাংলাদেশের প্রতিটি শিশুর জন্য একটি আনন্দময় শিক্ষার প্ল্যাটফর্ম তৈরি করা — যেখানে শেখা হবে খেলার মতো মজার, এবং প্রতিটি শিশু তার নিজের গতিতে এগিয়ে যেতে পারবে।
            </p>
            <p className="text-white/80 text-base italic">
              "শিক্ষাই জাতির মেরুদণ্ড — আমরা সেই মেরুদণ্ডকে শক্তিশালী করতে চাই" ✨
            </p>
            <div className="mt-6">
              <Link to="/">
                <Button size="lg" className="bg-white text-eduplay-purple hover:bg-white/90 hover:scale-105 transition-all duration-300 text-lg px-8 py-6 rounded-2xl">
                  <GraduationCap className="w-6 h-6 mr-2" />
                  Explore 247School
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Teams;
