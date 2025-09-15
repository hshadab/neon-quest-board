import React from 'react';
import { X, Filter, Hash, Target } from 'lucide-react';
import { Quest, QuestFilters, Difficulty } from '@/types/quest';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FiltersPanelProps {
  filters: QuestFilters;
  setFilters: (filters: QuestFilters) => void;
  allQuests: Quest[];
}

const FiltersPanel: React.FC<FiltersPanelProps> = ({
  filters,
  setFilters,
  allQuests,
}) => {
  const allTags = Array.from(
    new Set(allQuests.flatMap(quest => quest.tags))
  ).sort();

  const allDifficulties: Difficulty[] = ['easy', 'medium', 'hard', 'epic'];

  const toggleTag = (tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter(t => t !== tag)
      : [...filters.tags, tag];
    
    setFilters({ ...filters, tags: newTags });
  };

  const toggleDifficulty = (difficulty: Difficulty) => {
    const newDifficulties = filters.difficulties.includes(difficulty)
      ? filters.difficulties.filter(d => d !== difficulty)
      : [...filters.difficulties, difficulty];
    
    setFilters({ ...filters, difficulties: newDifficulties });
  };

  const clearAllFilters = () => {
    setFilters({ tags: [], difficulties: [] });
  };

  const hasActiveFilters = filters.tags.length > 0 || filters.difficulties.length > 0;

  const getDifficultyColor = (difficulty: Difficulty, isActive: boolean) => {
    const baseColors = {
      easy: 'border-success/30 text-success hover:bg-success/10',
      medium: 'border-warning/30 text-warning hover:bg-warning/10',
      hard: 'border-destructive/30 text-destructive hover:bg-destructive/10',
      epic: 'border-accent/30 text-accent hover:bg-accent/10',
    };
    
    const activeColors = {
      easy: 'bg-success/20 border-success text-success shadow-glow-soft',
      medium: 'bg-warning/20 border-warning text-warning shadow-glow-soft',
      hard: 'bg-destructive/20 border-destructive text-destructive shadow-glow-soft',
      epic: 'bg-accent/20 border-accent text-accent shadow-glow-soft',
    };
    
    return isActive ? activeColors[difficulty] : baseColors[difficulty];
  };

  return (
    <div className="bg-card-glass/40 backdrop-blur-glass border border-card-border/50 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-card-foreground flex items-center gap-2">
          <Filter className="w-5 h-5 text-primary" />
          Filters
        </h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            Clear All
          </Button>
        )}
      </div>

      {/* Tags Filter */}
      <div>
        <h4 className="text-sm font-medium text-card-foreground mb-2 flex items-center gap-2">
          <Hash className="w-4 h-4 text-primary" />
          Tags ({allTags.length})
        </h4>
        <div className="flex flex-wrap gap-2">
          {allTags.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">No tags available</p>
          ) : (
            allTags.map(tag => {
              const isActive = filters.tags.includes(tag);
              const questCount = allQuests.filter(quest => quest.tags.includes(tag)).length;
              
              return (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={cn(
                    "px-3 py-1 rounded-full text-sm font-medium border transition-all duration-200",
                    "hover:scale-105 active:scale-95",
                    isActive
                      ? "bg-primary/20 border-primary text-primary shadow-neon"
                      : "bg-card-glass/20 border-border/30 text-muted-foreground hover:bg-primary/10 hover:border-primary/30"
                  )}
                >
                  {tag} ({questCount})
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Difficulty Filter */}
      <div>
        <h4 className="text-sm font-medium text-card-foreground mb-2 flex items-center gap-2">
          <Target className="w-4 h-4 text-primary" />
          Difficulty
        </h4>
        <div className="flex flex-wrap gap-2">
          {allDifficulties.map(difficulty => {
            const isActive = filters.difficulties.includes(difficulty);
            const questCount = allQuests.filter(quest => quest.difficulty === difficulty).length;
            
            return (
              <button
                key={difficulty}
                onClick={() => toggleDifficulty(difficulty)}
                className={cn(
                  "px-3 py-1 rounded-full text-sm font-medium border transition-all duration-200",
                  "hover:scale-105 active:scale-95",
                  getDifficultyColor(difficulty, isActive)
                )}
              >
                {difficulty.toUpperCase()} ({questCount})
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="pt-2 border-t border-border/30">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Active filters:</span>
            {filters.tags.map(tag => (
              <Badge
                key={tag}
                variant="outline"
                className="bg-primary/10 border-primary/30 text-primary"
              >
                {tag}
                <button
                  onClick={() => toggleTag(tag)}
                  className="ml-1 hover:text-primary/80"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
            {filters.difficulties.map(difficulty => (
              <Badge
                key={difficulty}
                variant="outline"
                className="bg-accent/10 border-accent/30 text-accent"
              >
                {difficulty}
                <button
                  onClick={() => toggleDifficulty(difficulty)}
                  className="ml-1 hover:text-accent/80"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FiltersPanel;