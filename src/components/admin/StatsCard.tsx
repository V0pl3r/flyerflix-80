
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatsCard = ({ title, value, icon, trend }: StatsCardProps) => {
  return (
    <Card className="bg-[#222222] border-none">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-gray-400">{title}</p>
            <h3 className="text-2xl font-bold text-white">{value}</h3>
            
            {trend && (
              <p className={`text-xs ${trend.isPositive ? 'text-emerald-500' : 'text-red-500'} flex items-center`}>
                {trend.isPositive ? '↑' : '↓'} {trend.value}%
                <span className="text-gray-400 ml-1">vs último mês</span>
              </p>
            )}
          </div>
          
          <div className="p-3 bg-[#1A1F2C] rounded-lg text-[#ea384c]">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
