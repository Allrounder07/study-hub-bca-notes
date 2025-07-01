
import { GraduationCap, Users, BookOpen, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-full">
              <GraduationCap className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
            BCA Notes Hub
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Your comprehensive platform for BCA study materials, notes, and exam preparation resources
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 px-8 py-3 text-lg font-semibold">
              <BookOpen className="h-5 w-5 mr-2" />
              Browse Notes
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-700 px-8 py-3 text-lg font-semibold">
              <Users className="h-5 w-5 mr-2" />
              Join Community
            </Button>
          </div>
          
          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <BookOpen className="h-8 w-8 text-blue-200 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Comprehensive Notes</h3>
              <p className="text-blue-100 text-sm">Access notes for all 6 BCA subjects with detailed explanations</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <Users className="h-8 w-8 text-blue-200 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Student Community</h3>
              <p className="text-blue-100 text-sm">Connect with fellow students and share knowledge</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <Award className="h-8 w-8 text-blue-200 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Exam Ready</h3>
              <p className="text-blue-100 text-sm">Curated content perfect for exam preparation</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
