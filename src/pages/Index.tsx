import { useState } from 'react';
import { BookOpen, Upload, Search, Users, Star, Download, LogIn } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import SubjectCard from '../components/SubjectCard';
import UploadModal from '../components/UploadModal';
import AuthModal from '../components/AuthModal';
import Hero from '../components/Hero';
import Stats from '../components/Stats';
import { useAuth } from '@/hooks/useAuth';
import { useSubjects, useNotes } from '@/hooks/useNotes';

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, signOut, loading } = useAuth();
  
  const { data: subjects = [], isLoading: subjectsLoading } = useSubjects();
  const { data: recentNotes = [] } = useNotes();

  const filteredSubjects = subjects.filter(subject =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUploadClick = () => {
    if (!user) {
      setIsAuthModalOpen(true);
    } else {
      setIsUploadModalOpen(true);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
      <div className="text-xl">Loading...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">BCA Notes Hub</h1>
                <p className="text-sm text-gray-500">Your Study Companion</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {user ? (
                <>
                  <span className="text-sm text-gray-600">Welcome, {user.email}</span>
                  <Button 
                    onClick={handleUploadClick}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Notes
                  </Button>
                  <Button variant="outline" onClick={signOut}>
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={() => setIsAuthModalOpen(true)}>
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                  <Button 
                    onClick={handleUploadClick}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Notes
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <Hero />

      {/* Stats Section */}
      <Stats />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search subjects or codes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Subjects Grid */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Browse by Subject</h2>
            <p className="text-gray-600">Access comprehensive notes for all BCA subjects</p>
          </div>
          
          {subjectsLoading ? (
            <div className="text-center">Loading subjects...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSubjects.map((subject) => (
                <SubjectCard key={subject.id} subject={subject} />
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity Section */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Star className="h-5 w-5 text-yellow-500 mr-2" />
            Recent Activity
          </h3>
          <div className="space-y-3">
            {recentNotes.slice(0, 3).map((note) => (
              <div key={note.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Download className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{note.title}</p>
                    <p className="text-sm text-gray-500">
                      {note.subjects?.name} - {new Date(note.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Badge variant="secondary">New</Badge>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold">BCA Notes Hub</h3>
              </div>
              <p className="text-gray-400">
                Your one-stop platform for all BCA study materials and exam preparation resources.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">All Subjects</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Upload Notes</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Study Groups</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help & Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Connect</h4>
              <p className="text-gray-400 mb-2">Join our community of BCA students</p>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="text-gray-400 border-gray-600 hover:bg-gray-800">
                  <Users className="h-4 w-4 mr-1" />
                  Discord
                </Button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 BCA Notes Hub. Made with ❤️ for BCA students.</p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <UploadModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)} 
        subjects={subjects}
      />
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </div>
  );
};

export default Index;
