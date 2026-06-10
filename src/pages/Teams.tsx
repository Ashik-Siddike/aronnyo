
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Github, GraduationCap, Code, Palette, Brain, Star, Trophy, Sparkles, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const teamMembers = [
  {
    id: 2,
    name: "SK Asaduzzaman",
    position: "AI/ML Engineer & Feature Architect",
    bio: "Talented AI/ML Engineer who integrated key smart features into 247School. He proposed the brilliant concept for the 'Writing Wizard' handwriting game, helped develop multiple learning modules, and optimized client-side AI performance for a seamless child-friendly experience.",
    image: "/assets/SK Asaduzzaman.jpeg",
    avatar: "🎨",
    color: "from-eduplay-green to-teal-500",
    skills: ["AI/ML Models", "Neural Networks", "Writing Wizard Game", "Tailwind CSS", "Figma Design", "Responsive Layouts"],
    email: "asaduzzaman247s@gmail.com",
    github: "Asaduzzaman-SK"
  },
  {
    id: 1,
    name: "MD Ashik Siddike",
    position: "Founder & Lead Developer",
    bio: "Full-stack developer and visionary behind 247School. Built the entire platform architecture, MongoDB database, API infrastructure, and AI integration. Passionate about using technology to make education accessible, interactive, and joyful for every child in Bangladesh.",
    image: "/assets/me- md ashik siddike .jpg",
    avatar: "👨‍💻",
    color: "from-eduplay-blue to-eduplay-purple",
    skills: ["React", "Node.js", "MongoDB", "TypeScript", "System Architecture", "AI Integration", "Express.js", "Next.js", "React Native"],
    email: "ashiksiddike@gmail.com",
    github: "Ashik-Siddike"
  },
  {
    id: 3,
    name: "Turna Paul",
    position: "Educational Trainer",
    bio: "Pedagogical expert who guided the development of lesson plans. Focused on EYFS and Key Stage 1 curriculum alignment, conducted real-world classroom pilot testing in kindergartens, and managed student feedback.",
    image: "/assets/turna paul.jpeg",
    avatar: "🏫",
    color: "from-pink-500 to-rose-500",
    skills: ["Curriculum Design", "Early Childhood Education", "User Testing", "Trainer", "Feedback Analysis"],
    email: "turnapaul@gmail.com",
    github: "Turna-Paul"
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
            A passionate team on a mission to revolutionize how children in Bangladesh learn — making education fun, interactive, and accessible to all. 🇧🇩
          </p>
        </div>

        {/* Team Members */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20 items-stretch">
          {teamMembers.map((member, index) => {
            const isLeader = member.id === 1;
            return (
              <Card
                key={member.id}
                className={`bg-white border-0 playful-shadow transition-all duration-500 animate-fade-in overflow-hidden relative flex flex-col justify-between ${
                  isLeader 
                    ? 'ring-4 ring-eduplay-purple shadow-[0_10px_35px_rgba(147,51,234,0.3)] scale-102 md:scale-105 z-10 border border-eduplay-purple/30 hover:shadow-[0_15px_45px_rgba(147,51,234,0.45)] hover:-translate-y-2' 
                    : 'hover:scale-105 hover:-translate-y-2'
                }`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                {/* Gradient Header */}
                <div className={`bg-gradient-to-r ${member.color} p-8 text-center flex flex-col items-center justify-center relative`}>
                  {isLeader && (
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-amber-500 text-yellow-950 text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1 z-10 uppercase tracking-wider animate-pulse">
                      <Star className="w-3.5 h-3.5 fill-yellow-950 text-yellow-950" />
                      Founder & Leader
                    </div>
                  )}
                  {member.image ? (
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-28 h-28 rounded-full mb-3 object-cover border-4 border-white/80 shadow-lg hover:scale-105 transition-transform duration-300 bg-white"
                    />
                  ) : (
                    <div className="text-6xl mb-3 animate-bounce-gentle">{member.avatar}</div>
                  )}
                  <h2 className="text-2xl font-bold text-white mb-1">{member.name}</h2>
                  <p className="text-white/90 font-medium">{member.position}</p>
                </div>
                
                <CardContent className="p-6 flex flex-col flex-grow justify-between">
                  <div>
                    <p className="text-gray-600 text-center mb-6 leading-relaxed min-h-[100px]">
                      {member.bio}
                    </p>
                    
                    {/* Skills */}
                    <div className="flex flex-wrap justify-center gap-2 mb-6 min-h-[80px] items-center">
                      {member.skills.map((skill, i) => (
                        <span key={i} className="px-3 py-1 bg-gradient-to-r from-eduplay-purple/10 to-eduplay-blue/10 text-eduplay-purple text-sm font-medium rounded-full border border-eduplay-purple/20">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Links */}
                  <div className="flex justify-center items-center gap-4 mt-4">
                    {member.email && (
                      <a 
                        href={`mailto:${member.email}`} 
                        className="flex items-center justify-center w-12 h-12 rounded-full bg-eduplay-blue/10 hover:bg-eduplay-blue/20 transition-all duration-300 hover:scale-110 shadow-sm p-0" 
                        title="Email"
                      >
                        <Mail className="w-5 h-5 text-eduplay-blue" />
                      </a>
                    )}
                    {member.github && (
                      <a 
                        href={`https://github.com/${member.github}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-600/10 hover:bg-gray-600/20 transition-all duration-300 hover:scale-110 shadow-sm p-0" 
                        title="GitHub"
                      >
                        <Github className="w-5 h-5 text-gray-600" />
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
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
