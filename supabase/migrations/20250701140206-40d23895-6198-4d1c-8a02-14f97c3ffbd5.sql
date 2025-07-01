
-- Create subjects table to store the 6 BCA subjects
CREATE TABLE public.subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  color TEXT DEFAULT 'bg-blue-500',
  icon TEXT DEFAULT '📚',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notes table to store uploaded study materials
CREATE TABLE public.notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
  file_url TEXT,
  file_name TEXT,
  file_size INTEGER,
  tags TEXT[],
  uploader_name TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  download_count INTEGER DEFAULT 0,
  is_approved BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user profiles table for additional user information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert the 6 BCA subjects
INSERT INTO public.subjects (name, code, description, color, icon) VALUES
('Programming Fundamentals', 'BCA-101', 'C/C++, Java, Python programming concepts and practical implementations', 'bg-blue-500', '💻'),
('Data Structures & Algorithms', 'BCA-201', 'Arrays, Linked Lists, Trees, Graphs, Sorting & Searching algorithms', 'bg-green-500', '🔗'),
('Database Management Systems', 'BCA-301', 'SQL, NoSQL, Database design, Normalization, and RDBMS concepts', 'bg-purple-500', '🗄️'),
('Web Development', 'BCA-401', 'HTML, CSS, JavaScript, React, Node.js, and full-stack development', 'bg-orange-500', '🌐'),
('Software Engineering', 'BCA-501', 'SDLC, Agile, Testing, Project management, and software design patterns', 'bg-red-500', '⚙️'),
('Computer Networks', 'BCA-601', 'TCP/IP, OSI model, Network protocols, Security, and network administration', 'bg-indigo-500', '🔗');

-- Enable Row Level Security
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for subjects (public read access)
CREATE POLICY "Anyone can view subjects" ON public.subjects FOR SELECT USING (true);

-- Create policies for notes
CREATE POLICY "Anyone can view approved notes" ON public.notes 
  FOR SELECT USING (is_approved = true);

CREATE POLICY "Users can insert their own notes" ON public.notes 
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own notes" ON public.notes 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notes" ON public.notes 
  FOR DELETE USING (auth.uid() = user_id);

-- Create policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles 
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles 
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, username)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'username'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update notes count for subjects
CREATE OR REPLACE FUNCTION public.update_subject_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- This function can be used to update statistics
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create indexes for better performance
CREATE INDEX idx_notes_subject_id ON public.notes(subject_id);
CREATE INDEX idx_notes_user_id ON public.notes(user_id);
CREATE INDEX idx_notes_created_at ON public.notes(created_at DESC);
