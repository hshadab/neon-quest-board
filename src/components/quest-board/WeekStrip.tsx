import React from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Quest } from '@/types/quest';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface WeekStripProps {
  quests: Quest[];
}

const WeekStrip: React.FC<WeekStripProps> = ({ quests }) => {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());

  const weekDays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + index);
    return date;
  });

  const getQuestsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return quests.filter(quest => {
      if (!quest.dueDate) return false;
      const questDate = new Date(quest.dueDate).toISOString().split('T')[0];
      return questDate === dateString;
    });
  };

  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString();
  };

  const getStatusColor = (quest: Quest) => {
    const colors = {
      backlog: 'bg-neon-blue/20',
      doing: 'bg-neon-purple/20',
      review: 'bg-neon-pink/20',
      done: 'bg-neon-green/20',
    };
    return colors[quest.status];
  };

  return (
    <div className="bg-card-glass/30 backdrop-blur-glass border border-card-border/50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-card-foreground flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          This Week
        </h3>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm text-muted-foreground min-w-[120px] text-center">
            {startOfWeek.toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric' 
            })} - {weekDays[6].toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric' 
            })}
          </span>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((date, index) => {
          const dayQuests = getQuestsForDate(date);
          const isCurrentDay = isToday(date);

          return (
            <div
              key={index}
              className={cn(
                "relative p-3 rounded-lg border transition-all duration-200",
                isCurrentDay
                  ? "bg-primary/10 border-primary/30 shadow-neon"
                  : "bg-card-glass/20 border-border/30 hover:bg-card-glass/30"
              )}
            >
              {/* Day Header */}
              <div className="text-center mb-2">
                <div className="text-xs text-muted-foreground font-medium">
                  {date.toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div className={cn(
                  "text-lg font-bold",
                  isCurrentDay ? "text-primary" : "text-card-foreground"
                )}>
                  {date.getDate()}
                </div>
              </div>

              {/* Quest Indicators */}
              <div className="space-y-1">
                {dayQuests.slice(0, 3).map((quest, questIndex) => (
                  <div
                    key={quest.id}
                    className={cn(
                      "text-xs p-1 rounded text-center truncate border",
                      getStatusColor(quest),
                      "border-current/20"
                    )}
                    title={quest.title}
                  >
                    {quest.title}
                  </div>
                ))}
                {dayQuests.length > 3 && (
                  <div className="text-xs text-muted-foreground text-center">
                    +{dayQuests.length - 3} more
                  </div>
                )}
                {dayQuests.length === 0 && (
                  <div className="text-xs text-muted-foreground/50 text-center italic">
                    No quests
                  </div>
                )}
              </div>

              {/* Today indicator */}
              {isCurrentDay && (
                <div className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full animate-glow-pulse" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeekStrip;