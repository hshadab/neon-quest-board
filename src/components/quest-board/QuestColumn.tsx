import React from 'react';
import { Quest, QuestStatus } from '@/types/quest';
import QuestCard from './QuestCard';
import { cn } from '@/lib/utils';

interface QuestColumnProps {
  title: string;
  accent: string;
  quests: Quest[];
  onQuestClick: (quest: Quest) => void;
  onQuestMove: (questId: string, newStatus: QuestStatus) => void;
  status: QuestStatus;
}

const QuestColumn: React.FC<QuestColumnProps> = ({
  title,
  accent,
  quests,
  onQuestClick,
  onQuestMove,
  status,
}) => {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('bg-card-glass/30');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-card-glass/30');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-card-glass/30');
    
    const questId = e.dataTransfer.getData('text/plain');
    if (questId) {
      onQuestMove(questId, status);
    }
  };

  const accentColors = {
    'neon-blue': 'border-neon-blue shadow-neon text-neon-blue',
    'neon-purple': 'border-neon-purple shadow-purple text-neon-purple',
    'neon-pink': 'border-neon-pink text-neon-pink',
    'neon-green': 'border-neon-green text-neon-green',
  };

  return (
    <div className="flex flex-col h-full">
      {/* Column Header */}
      <div className={cn(
        "flex items-center justify-between p-4 mb-4 rounded-lg border-2 backdrop-blur-glass transition-all duration-300",
        "bg-card-glass/20",
        accentColors[accent] || 'border-primary text-primary'
      )}>
        <h3 className="font-bold text-lg">{title}</h3>
        <span className="text-sm bg-card-glass/50 px-2 py-1 rounded-full border border-current/20">
          {quests.length}
        </span>
      </div>

      {/* Quest Cards */}
      <div
        className="flex-1 space-y-3 p-2 rounded-lg border-2 border-dashed border-border/30 min-h-[200px] transition-colors duration-200"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {quests.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
            Drop quests here
          </div>
        ) : (
          quests.map((quest) => (
            <QuestCard
              key={quest.id}
              quest={quest}
              onClick={() => onQuestClick(quest)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default QuestColumn;