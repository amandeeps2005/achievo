
// src/components/journal/journal-entry-item.tsx
"use client";

import type { JournalEntry, Goal } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit3, Trash2, Link as LinkIcon, CalendarDays } from 'lucide-react';
import { useJournal } from '@/context/journal-context';
import { useGoals } from '@/context/goal-context';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

interface JournalEntryItemProps {
  entry: JournalEntry;
  onEdit: (entry: JournalEntry) => void;
}

export default function JournalEntryItem({ entry, onEdit }: JournalEntryItemProps) {
  const { deleteJournalEntry } = useJournal();
  const { getGoalById } = useGoals();

  const linkedGoal = entry.goalId ? getGoalById(entry.goalId) : null;

  const handleDelete = () => {
    deleteJournalEntry(entry.id);
  };
  
  const formattedUpdatedAt = formatDistanceToNow(new Date(entry.updatedAt), { addSuffix: true });

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg text-primary">{entry.title}</CardTitle>
          {linkedGoal && (
            <Badge variant="secondary" className="ml-2 whitespace-nowrap text-xs">
              <LinkIcon className="w-3 h-3 mr-1" />
              {linkedGoal.title?.substring(0, 20) || linkedGoal.originalGoal.substring(0, 20)}...
            </Badge>
          )}
           {!linkedGoal && entry.goalId && ( 
            <Badge variant="outline" className="ml-2 whitespace-nowrap text-xs">
              Linked Goal (Not Found)
            </Badge>
          )}
        </div>
        <CardDescription className="text-xs text-muted-foreground flex items-center">
            <CalendarDays className="w-3 h-3 mr-1" /> Last updated: {formattedUpdatedAt}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-foreground whitespace-pre-wrap line-clamp-4">
          {entry.content}
        </p>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button variant="outline" size="sm" onClick={() => onEdit(entry)}>
          <Edit3 className="w-4 h-4 mr-2" /> Edit
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              <Trash2 className="w-4 h-4 mr-2" /> Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the journal entry titled "<span className="font-semibold">{entry.title}</span>".
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                Delete Entry
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
