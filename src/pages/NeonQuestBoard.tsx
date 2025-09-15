import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Calendar, Filter, Command } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import QuestColumn from '@/components/quest-board/QuestColumn';
import QuestCard from '@/components/quest-board/QuestCard';
import QuestDetailModal from '@/components/quest-board/QuestDetailModal';
import WeekStrip from '@/components/quest-board/WeekStrip';
import FiltersPanel from '@/components/quest-board/FiltersPanel';
import { useQuestBoard } from '@/hooks/useQuestBoard';
import { Quest, QuestStatus, Difficulty } from '@/types/quest';

const NeonQuestBoard = () => {
  const {
    quests,
    addQuest,
    updateQuest,
    deleteQuest,
    moveQuest,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
  } = useQuestBoard();

  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'k':
            e.preventDefault();
            setCommandOpen(true);
            break;
          case 'n':
            e.preventDefault();
            handleCreateQuest();
            break;
          case 'f':
            e.preventDefault();
            document.getElementById('search-input')?.focus();
            break;
        }
      }
      if (e.key === 'Escape') {
        setSelectedQuest(null);
        setCommandOpen(false);
        setShowFilters(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleCreateQuest = () => {
    const newQuest: Omit<Quest, 'id' | 'createdAt' | 'updatedAt'> = {
      title: 'New Quest',
      description: '',
      status: 'backlog',
      difficulty: 'medium',
      tags: [],
      progress: 0,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      checklist: [],
      activities: [],
    };
    const quest = addQuest(newQuest);
    setSelectedQuest(quest);
  };

  const filteredQuests = useMemo(() => {
    return quests.filter(quest => {
      const matchesSearch = quest.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           quest.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           quest.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesTags = filters.tags.length === 0 || 
                         quest.tags.some(tag => filters.tags.includes(tag));
      
      const matchesDifficulty = filters.difficulties.length === 0 ||
                               filters.difficulties.includes(quest.difficulty);
      
      return matchesSearch && matchesTags && matchesDifficulty;
    });
  }, [quests, searchTerm, filters]);

  const questsByStatus = useMemo(() => {
    const statusGroups: Record<QuestStatus, Quest[]> = {
      backlog: [],
      doing: [],
      review: [],
      done: [],
    };

    filteredQuests.forEach(quest => {
      statusGroups[quest.status].push(quest);
    });

    return statusGroups;
  }, [filteredQuests]);

  const columns: Array<{ id: QuestStatus; title: string; accent: string }> = [
    { id: 'backlog', title: 'Backlog', accent: 'neon-blue' },
    { id: 'doing', title: 'Doing', accent: 'neon-purple' },
    { id: 'review', title: 'Review', accent: 'neon-pink' },
    { id: 'done', title: 'Done', accent: 'neon-green' },
  ];

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold bg-gradient-neon bg-clip-text text-transparent animate-glow-pulse">
            Neon Quest Board
          </h1>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="text-primary border border-primary/20 hover:bg-primary/10 hover:shadow-neon"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <Button
              onClick={handleCreateQuest}
              className="bg-gradient-accent text-accent-foreground hover:shadow-purple border border-accent/20"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Quest
            </Button>
          </div>
        </div>

        {/* Week Strip */}
        <WeekStrip quests={quests} />

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            id="search-input"
            placeholder="Search quests... (Ctrl+F)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-card-glass/50 backdrop-blur-glass border-card-border/50 focus:border-primary/50 focus:shadow-neon"
          />
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="animate-fade-in">
            <FiltersPanel 
              filters={filters} 
              setFilters={setFilters} 
              allQuests={quests}
            />
          </div>
        )}
      </div>

      {/* Quest Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map((column) => (
          <QuestColumn
            key={column.id}
            title={column.title}
            accent={column.accent}
            quests={questsByStatus[column.id]}
            onQuestClick={setSelectedQuest}
            onQuestMove={moveQuest}
            status={column.id}
          />
        ))}
      </div>

      {/* Quest Detail Modal */}
      {selectedQuest && (
        <QuestDetailModal
          quest={selectedQuest}
          onClose={() => setSelectedQuest(null)}
          onUpdate={updateQuest}
          onDelete={deleteQuest}
        />
      )}

      {/* Command Palette Hint */}
      <div className="fixed bottom-6 right-6 text-muted-foreground text-sm">
        <kbd className="px-2 py-1 bg-card-glass rounded border border-border text-xs">Ctrl</kbd>
        <span className="mx-1">+</span>
        <kbd className="px-2 py-1 bg-card-glass rounded border border-border text-xs">K</kbd>
        <span className="ml-2">Command</span>
      </div>
    </div>
  );
};

export default NeonQuestBoard;