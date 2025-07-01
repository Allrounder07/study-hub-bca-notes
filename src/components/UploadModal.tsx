
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText, Tag, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useUploadNote } from "@/hooks/useNotes";

interface Subject {
  id: string;
  name: string;
  code: string;
}

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjects: Subject[];
}

const UploadModal = ({ isOpen, onClose, subjects }: UploadModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    subject_id: '',
    description: '',
    tags: '',
    uploader_name: '',
    file: null as File | null
  });
  
  const { toast } = useToast();
  const { user } = useAuth();
  const uploadNoteMutation = useUploadNote();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.subject_id) {
      toast({
        title: "Missing Information",
        description: "Please fill in title and select a subject.",
        variant: "destructive"
      });
      return;
    }

    try {
      const tagsArray = formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [];
      
      await uploadNoteMutation.mutateAsync({
        title: formData.title,
        description: formData.description,
        subject_id: formData.subject_id,
        tags: tagsArray,
        uploader_name: formData.uploader_name || user?.email || 'Anonymous',
        user_id: user?.id
      });

      // Reset form
      setFormData({
        title: '',
        subject_id: '',
        description: '',
        tags: '',
        uploader_name: '',
        file: null
      });
      
      onClose();
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, file });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5 text-blue-600" />
            <span>Upload Study Notes</span>
          </DialogTitle>
          <DialogDescription>
            Share your notes with fellow BCA students. Help others succeed in their studies!
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Data Structures - Trees and Graphs"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject *</Label>
            <Select onValueChange={(value) => setFormData({ ...formData, subject_id: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select a subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.code} - {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Brief description of the content covered..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="tags"
                placeholder="e.g., algorithms, sorting, binary-tree"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="uploader">Your Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="uploader"
                placeholder="Your name (optional)"
                value={formData.uploader_name}
                onChange={(e) => setFormData({ ...formData, uploader_name: e.target.value })}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">Upload File (Optional)</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
              <input
                id="file"
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.txt,.ppt,.pptx"
                className="hidden"
              />
              <label htmlFor="file" className="cursor-pointer">
                <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                {formData.file ? (
                  <p className="text-sm text-green-600 font-medium">{formData.file.name}</p>
                ) : (
                  <>
                    <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-400 mt-1">PDF, DOC, DOCX, TXT, PPT up to 10MB</p>
                  </>
                )}
              </label>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={uploadNoteMutation.isPending}
            >
              <Upload className="h-4 w-4 mr-2" />
              {uploadNoteMutation.isPending ? "Uploading..." : "Upload Notes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UploadModal;
