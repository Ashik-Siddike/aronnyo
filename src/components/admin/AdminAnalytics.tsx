import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { ArrowLeft, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const dailyActiveData = [
  { name: 'Mon', users: 120 },
  { name: 'Tue', users: 150 },
  { name: 'Wed', users: 180 },
  { name: 'Thu', users: 190 },
  { name: 'Fri', users: 160 },
  { name: 'Sat', users: 210 },
  { name: 'Sun', users: 240 },
];

const subjectPopularityData = [
  { subject: 'Math', views: 400 },
  { subject: 'English', views: 300 },
  { subject: 'Science', views: 250 },
  { subject: 'Bangla', views: 350 },
];

export default function AdminAnalytics() {
  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="bg-slate-900 text-white py-6">
        <div className="container mx-auto px-4 flex items-center gap-4">
          <Link to="/admin">
            <Button variant="ghost" className="text-white hover:bg-white/20">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-blue-400" /> Analytics Dashboard
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Daily Active Users Chart */}
          <Card className="shadow-lg border-0 rounded-2xl">
            <CardHeader className="bg-blue-50/50 border-b rounded-t-2xl">
              <CardTitle className="text-slate-700">Daily Active Users (7 Days)</CardTitle>
            </CardHeader>
            <CardContent className="p-6 h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyActiveData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <RechartsTooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={4} dot={{ r: 6, fill: '#3b82f6', strokeWidth: 2, stroke: 'white' }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Subject Popularity Chart */}
          <Card className="shadow-lg border-0 rounded-2xl">
            <CardHeader className="bg-purple-50/50 border-b rounded-t-2xl">
              <CardTitle className="text-slate-700">Subject Popularity (Views)</CardTitle>
            </CardHeader>
            <CardContent className="p-6 h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subjectPopularityData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="subject" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <RechartsTooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="views" fill="#8b5cf6" radius={[6, 6, 0, 0]} barSize={50} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
