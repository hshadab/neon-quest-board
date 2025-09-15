import React, { useState } from 'react';
import { X, Plus, Trash2, CheckCircle2, Circle, Calendar, Target, Tag } from 'lucide-react';
import { Quest, ChecklistItem, Activity, Difficulty, QuestStatus } from '@/types/quest';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface QuestDetailModalProps {
  quest: Quest;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Quest>) => void;
  onDelete: (id: string) => void;
}

const QuestDetailModal: React.FC<QuestDetailModalProps> = ({
  quest,
  onClose,
  onUpdate,
  onDelete,
}) => {
  const [title, setTitle] = useState(quest.title);
  const [description, setDescription] = useState(quest.description);
  const [newChecklistItem, setNewChecklistItem] = useState('');
  const [newActivity, setNewActivity] = useState('');
  const [newTag, setNewTag] = useState('');

  const handleSave = () => {
    onUpdate(quest.id, { title, description });
  };

  const addChecklistItem = () => {
    if (!newChecklistItem.trim()) return;
    
    const item: ChecklistItem = {
      id: Date.now().toString(),
      text: newChecklistItem.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    
    onUpdate(quest.id, {
      checklist: [...quest.checklist, item],
    });
    setNewChecklistItem('');
  };

  const toggleChecklistItem = (itemId: string) => {
    const updatedChecklist = quest.checklist.map(item =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    
    const completedCount = updatedChecklist.filter(item => item.completed).length;
    const progress = Math.round((completedCount / updatedChecklist.length) * 100);
    
    onUpdate(quest.id, {
      checklist: updatedChecklist,
      progress: updatedChecklist.length > 0 ? progress : quest.progress,
    });
  };

  const removeChecklistItem = (itemId: string) => {
    const updatedChecklist = quest.checklist.filter(item => item.id !== itemId);
    const completedCount = updatedChecklist.filter(item => item.completed).length;
    const progress = updatedChecklist.length > 0 
      ? Math.round((completedCount / updatedChecklist.length) * 100)
      : quest.progress;
    
    onUpdate(quest.id, {
      checklist: updatedChecklist,
      progress,
    });
  };

  const addActivity = () => {
    if (!newActivity.trim()) return;
    
    const activity: Activity = {
      id: Date.now().toString(),
      text: newActivity.trim(),
      type: 'note',
      createdAt: new Date().toISOString(),
    };
    
    onUpdate(quest.id, {
      activities: [activity, ...quest.activities],
    });
    setNewActivity('');
  };

  const addTag = () => {
    if (!newTag.trim() || quest.tags.includes(newTag.trim())) return;
    
    onUpdate(quest.id, {
      tags: [...quest.tags, newTag.trim()],
    });
    setNewTag('');
  };

  const removeTag = (tagToRemove: string) => {
    onUpdate(quest.id, {
      tags: quest.tags.filter(tag => tag !== tagToRemove),
    });
  };

  const updateStatus = (status: QuestStatus) => {
    onUpdate(quest.id, { status });
  };

  const updateDifficulty = (difficulty: Difficulty) => {
    onUpdate(quest.id, { difficulty });
  };

  const updateDueDate = (dueDate: string) => {
    onUpdate(quest.id, { dueDate });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-xl bg-card-glass backdrop-blur-glass border border-card-border shadow-glass animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/30">
          <div className="flex-1">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleSave}
              className="text-xl font-bold bg-transparent border-none p-0 focus:ring-0 text-card-foreground"
              placeholder="Quest title..."
            />
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex h-[70vh]">
          {/* Left Panel - Details */}
          <div className="flex-1 p-6 space-y-6 overflow-y-auto">
            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={handleSave}
                placeholder="Describe this quest..."
                className="bg-card-glass/30 border-border/50 focus:border-primary/50"
                rows={3}
              />
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <Select value={quest.status} onValueChange={updateStatus}>
                  <SelectTrigger className="bg-card-glass/30 border-border/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="backlog">Backlog</SelectItem>
                    <SelectItem value="doing">Doing</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Difficulty</label>
                <Select value={quest.difficulty} onValueChange={updateDifficulty}>
                  <SelectTrigger className="bg-card-glass/30 border-border/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                    <SelectItem value="epic">Epic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Due Date & Progress */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Due Date</label>
                <Input
                  type="date"
                  value={quest.dueDate ? new Date(quest.dueDate).toISOString().split('T')[0] : ''}
                  onChange={(e) => updateDueDate(e.target.value ? new Date(e.target.value).toISOString() : '')}
                  className="bg-card-glass/30 border-border/50 focus:border-primary/50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Progress: {quest.progress}%</label>
                <Progress value={quest.progress} className="h-3" />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium mb-2">Tags</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {quest.tags.map((tag, index) => (
                  <Badge 
                    key={index}
                    variant="outline" 
                    className="bg-muted/20 border-muted/30 text-muted-foreground"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-1 text-destructive hover:text-destructive/80"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  placeholder="Add tag..."
                  className="bg-card-glass/30 border-border/50 focus:border-primary/50"
                />
                <Button onClick={addTag} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Checklist */}
            <div>
              <label className="block text-sm font-medium mb-2">Checklist</label>
              <div className="space-y-2 mb-3">
                {quest.checklist.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-2 p-2 rounded bg-card-glass/20 border border-border/30"
                  >
                    <button
                      onClick={() => toggleChecklistItem(item.id)}
                      className={cn(
                        "flex-shrink-0 transition-colors",
                        item.completed ? "text-success" : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {item.completed ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <Circle className="w-4 h-4" />
                      )}
                    </button>
                    <span
                      className={cn(
                        "flex-1 transition-colors",
                        item.completed && "line-through text-muted-foreground"
                      )}
                    >
                      {item.text}
                    </span>
                    <button
                      onClick={() => removeChecklistItem(item.id)}
                      className="flex-shrink-0 text-destructive hover:text-destructive/80 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newChecklistItem}
                  onChange={(e) => setNewChecklistItem(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addChecklistItem()}
                  placeholder="Add checklist item..."
                  className="bg-card-glass/30 border-border/50 focus:border-primary/50"
                />
                <Button onClick={addChecklistItem} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Right Panel - Activity */}
          <div className="w-80 border-l border-border/30 p-6">
            <h3 className="text-lg font-semibold mb-4">Activity</h3>
            
            {/* Add Activity */}
            <div className="space-y-3 mb-6">
              <Textarea
                value={newActivity}
                onChange={(e) => setNewActivity(e.target.value)}
                placeholder="Add a note..."
                className="bg-card-glass/30 border-border/50 focus:border-primary/50"
                rows={2}
              />
              <Button 
                onClick={addActivity} 
                size="sm" 
                className="w-full"
                disabled={!newActivity.trim()}
              >
                Add Note
              </Button>
            </div>

            {/* Activities List */}
            <div className="space-y-3 overflow-y-auto max-h-96">
              {quest.activities.map((activity) => (
                <div
                  key={activity.id}
                  className="p-3 rounded bg-card-glass/20 border border-border/30"
                >
                  <p className="text-sm text-card-foreground mb-1">{activity.text}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(activity.createdAt).toLocaleDateString()} at{' '}
                    {new Date(activity.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              ))}
              {quest.activities.length === 0 && (
                <p className="text-muted-foreground text-sm text-center py-8">
                  No activity yet
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border/30">
          <Button
            variant="destructive"
            onClick={() => {
              onDelete(quest.id);
              onClose();
            }}
            className="bg-destructive/20 text-destructive border border-destructive/30 hover:bg-destructive/30"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Quest
          </Button>
          
          <div className="text-xs text-muted-foreground">
            Created {new Date(quest.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestDetailModal;