import { Shield, Lock, Eye, FileText, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-purple-50/30 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-gradient-to-r from-eduplay-purple/10 to-eduplay-blue/10 px-4 py-2 rounded-full border border-eduplay-purple/20 mb-6 animate-fade-in">
            <Shield className="w-5 h-5 text-eduplay-purple mr-2" />
            <span className="text-eduplay-purple font-semibold">Privacy & Security</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6 animate-fade-in">
            Privacy <span className="bg-gradient-to-r from-eduplay-purple to-eduplay-blue bg-clip-text text-transparent">Policy</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto animate-fade-in delay-150">
            Your privacy is important to us. Learn how we collect, use, and protect your information.
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8">
          <Card className="border-0 playful-shadow hover:shadow-xl transition-shadow bg-white animate-fade-in delay-200">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <FileText className="w-6 h-6 mr-3 text-eduplay-blue" />
                1. Information We Collect
              </h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                When you use our app, we may collect the following types of information:
              </p>
              <ul className="space-y-3">
                {[
                  "Personal information such as name and email address when you register.",
                  "Usage data, including lessons completed and scores, to track progress.",
                  "Device information for troubleshooting and performance improvement."
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-eduplay-green mr-3 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 playful-shadow hover:shadow-xl transition-shadow bg-white animate-fade-in delay-300">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <Eye className="w-6 h-6 mr-3 text-eduplay-purple" />
                2. How We Use Your Information
              </h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                We use the collected information for the following purposes:
              </p>
              <ul className="space-y-3">
                {[
                  "To provide, maintain, and improve our educational services.",
                  "To personalize the learning experience for each student.",
                  "To communicate with parents or guardians regarding progress.",
                  "To analyze usage patterns and improve app functionality."
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-eduplay-purple mr-3 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 playful-shadow hover:shadow-xl transition-shadow bg-white animate-fade-in delay-400">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <Lock className="w-6 h-6 mr-3 text-eduplay-orange" />
                3. Data Security
              </h2>
              <p className="text-gray-600 leading-relaxed">
                We implement strict security measures to protect your personal information. Your data is encrypted and stored securely. We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties without your consent, except as required by law.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-0 playful-shadow hover:shadow-xl transition-shadow bg-white animate-fade-in delay-500">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <Shield className="w-6 h-6 mr-3 text-eduplay-green" />
                4. Children's Privacy
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Our app is designed for children. We take extra precautions to protect their privacy. We do not collect unnecessary personal information from children under 13 without verifiable parental consent.
              </p>
            </CardContent>
          </Card>

          <div className="text-center mt-12 text-gray-500 text-sm animate-fade-in delay-700">
            <p>Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            <p className="mt-2">If you have any questions, please contact us at support@247school.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
