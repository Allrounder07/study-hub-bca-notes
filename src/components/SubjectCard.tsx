
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, TrendingUp, Clock } from "lucide-react";
import { useNotes } from "@/hooks/useNotes";

interface Subject {
  id: string;
  name: string;
  code: string;
  description: string;
  color: string;
  icon: string;
}

interface SubjectCardProps {
  subject: Subject;
}

const SubjectCard = ({ subject }: SubjectCardProps) => {
  const { data: notes = [] } = useNotes(subject.id);
  const totalNotes = notes.length;
  const recentUploads = notes.filter(note => {
    const noteDate = new Date(note.created_at);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return noteDate > weekAgo;
  }).length;

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-md bg-white">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className={`w-12 h-12 ${subject.color} rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg`}>
            {subject.icon}
          </div>
          <Badge variant="secondary" className="text-xs">
            {subject.code}
          </Badge>
        </div>
        <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
          {subject.name}
        </CardTitle>
        <CardDescription className="text-sm text-gray-600 line-clamp-2">
          {subject.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-1">
            <FileText className="h-4 w-4" />
            <span>{totalNotes} notes</span>
          </div>
          <div className="flex items-center space-x-1">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span>{recentUploads} recent</span>
          </div>
        </div>
        <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md">
          <Clock className="h-4 w-4 mr-2" />
          Browse Notes
        </Button>
      </CardContent>
    </Card>
  );
};

export default SubjectCard;
