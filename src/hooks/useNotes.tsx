
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Subject {
  id: string;
  name: string;
  code: string;
  description: string;
  color: string;
  icon: string;
}

interface Note {
  id: string;
  title: string;
  description?: string;
  subject_id: string;
  file_url?: string;
  file_name?: string;
  file_size?: number;
  tags?: string[];
  uploader_name?: string;
  download_count: number;
  created_at: string;
  subjects?: Subject;
}

export const useSubjects = () => {
  return useQuery({
    queryKey: ['subjects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .order('code');
      
      if (error) throw error;
      return data as Subject[];
    }
  });
};

export const useNotes = (subjectId?: string) => {
  return useQuery({
    queryKey: ['notes', subjectId],
    queryFn: async () => {
      let query = supabase
        .from('notes')
        .select(`
          *,
          subjects (
            id,
            name,
            code,
            description,
            color,
            icon
          )
        `)
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

      if (subjectId) {
        query = query.eq('subject_id', subjectId);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data as Note[];
    }
  });
};

export const useUploadNote = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (noteData: {
      title: string;
      description?: string;
      subject_id: string;
      tags?: string[];
      uploader_name?: string;
      user_id?: string;
    }) => {
      const { data, error } = await supabase
        .from('notes')
        .insert([noteData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      toast({
        title: "Success! 🎉",
        description: "Your note has been uploaded successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });
};
