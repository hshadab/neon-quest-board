import React from 'react';
import { Calendar, Clock, Target } from 'lucide-react';
import { Quest, Difficulty } from '@/types/quest';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface QuestCardProps {
  quest: Quest;
  onClick: () => void;
}

const QuestCard: React.FC<QuestCardProps> = ({ quest, onClick }) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', quest.id);
    e.currentTarget.classList.add('opacity-50');
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('opacity-50');
  };

  const getDifficultyColor = (difficulty: Difficulty) => {
    const colors = {
      easy: 'bg-success/20 text-success border-success/30',
      medium: 'bg-warning/20 text-warning border-warning/30', 
      hard: 'bg-destructive/20 text-destructive border-destructive/30',
      epic: 'bg-gradient-accent text-accent-foreground border-accent/30',
    };
    return colors[difficulty];
  };

  const formatDueDate = (dueDate?: string) => {
    if (!dueDate) return null;
    const date = new Date(dueDate);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { text: 'Overdue', color: 'text-destructive' };
    if (diffDays === 0) return { text: 'Today', color: 'text-warning' };
    if (diffDays === 1) return { text: 'Tomorrow', color: 'text-warning' };
    if (diffDays <= 7) return { text: `${diffDays}d`, color: 'text-muted-foreground' };
    return { text: date.toLocaleDateString(), color: 'text-muted-foreground' };
  };

  const dueDateInfo = formatDueDate(quest.dueDate);

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={onClick}
      className={cn(
        "group relative p-4 rounded-lg cursor-pointer transition-all duration-300",
        "bg-card-glass/50 backdrop-blur-glass border border-card-border/30",
        "hover:bg-card-glass/70 hover:border-primary/50 hover:shadow-neon hover:-translate-y-1",
        "active:scale-95"
      )}
    >
      {/* Title */}
      <h4 className="font-semibold text-card-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
        {quest.title}
      </h4>

      {/* Tags */}
      {quest.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {quest.tags.slice(0, 3).map((tag, index) => (
            <Badge
              key={index}
              variant="outline"
              className="text-xs bg-muted/20 border-muted/30 text-muted-foreground hover:bg-primary/10 hover:border-primary/30"
            >
              {tag}
            </Badge>
          ))}
          {quest.tags.length > 3 && (
            <Badge variant="outline" className="text-xs bg-muted/20 border-muted/30 text-muted-foreground">
              +{quest.tags.length - 3}
            </Badge>
          )}
        </div>
      )}

      {/* Difficulty & Progress */}
      <div className="flex items-center justify-between mb-3">
        <div className={cn(
          "px-2 py-1 rounded-full text-xs font-medium border",
          getDifficultyColor(quest.difficulty)
        )}>
          <Target className="w-3 h-3 inline mr-1" />
          {quest.difficulty.toUpperCase()}
        </div>
        
        {quest.progress > 0 && (
          <div className="text-xs text-muted-foreground">
            {quest.progress}%
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <Progress 
          value={quest.progress} 
          className="h-1.5 bg-muted/30"
        />
      </div>

      {/* Due Date & Checklist Info */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        {dueDateInfo && (
          <div className={cn("flex items-center gap-1", dueDateInfo.color)}>
            <Calendar className="w-3 h-3" />
            {dueDateInfo.text}
          </div>
        )}
        
        {quest.checklist.length > 0 && (
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {quest.checklist.filter(item => item.completed).length}/{quest.checklist.length}
          </div>
        )}
      </div>

      {/* Glow effect on hover */}
      <div className="absolute inset-0 rounded-lg bg-gradient-neon opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
};

export default QuestCard;