
import { FileText, Users, Download, Star } from "lucide-react";

const Stats = () => {
  const stats = [
    {
      icon: FileText,
      value: "130+",
      label: "Study Notes",
      color: "text-blue-600"
    },
    {
      icon: Users,
      value: "500+",
      label: "Active Students",
      color: "text-green-600"
    },
    {
      icon: Download,
      value: "2.5K+",
      label: "Downloads",
      color: "text-purple-600"
    },
    {
      icon: Star,
      value: "4.9",
      label: "Rating",
      color: "text-yellow-600"
    }
  ];

  return (
    <section className="py-12 bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
