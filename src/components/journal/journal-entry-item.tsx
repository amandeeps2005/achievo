
// src/components/journal/journal-entry-item.tsx
"use client";

import type { JournalEntry } from '@/types';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit3, Trash2, Link as LinkIconLucide, CalendarDays, Eye, MoreVertical } from 'lucide-react'; // Renamed Link to LinkIconLucide
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
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';

interface JournalEntryItemProps {
  entry: JournalEntry;
  onEdit: () => void;
}

export default function JournalEntryItem({ entry, onEdit }: JournalEntryItemProps) {
  const { deleteJournalEntry } = useJournal();
  const { getGoalById } = useGoals();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const linkedGoal = entry.goalId ? getGoalById(entry.goalId) : null;

  const handleDelete = () => {
    deleteJournalEntry(entry.id);
    setIsDeleteDialogOpen(false); 
  };
  
  const formattedUpdatedAt = formatDistanceToNow(new Date(entry.updatedAt), { addSuffix: true });

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <Link href={`/my-journal/${entry.id}`} passHref legacyBehavior>
            <a className="flex-grow cursor-pointer hover:underline" aria-label={`View journal entry: ${entry.title}`}>
              <CardTitle 
                className="text-lg text-primary"
              >
                {entry.title}
              </CardTitle>
            </a>
          </Link>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                <MoreVertical className="w-4 h-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/my-journal/${entry.id}`} className="flex items-center w-full">
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onEdit}>
                <Edit3 className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                onSelect={(e) => { e.preventDefault(); setIsDeleteDialogOpen(true); }}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
            <CardDescription className="text-xs text-muted-foreground flex items-center">
                <CalendarDays className="w-3 h-3 mr-1" /> Last updated: {formattedUpdatedAt}
            </CardDescription>
            {linkedGoal && (
                <Badge variant="secondary" className="whitespace-nowrap text-xs py-0.5 px-1.5">
                <LinkIconLucide className="w-3 h-3 mr-1" /> {/* Updated to LinkIconLucide */}
                {linkedGoal.title?.substring(0, 20) || linkedGoal.originalGoal.substring(0, 20)}...
                </Badge>
            )}
            {!linkedGoal && entry.goalId && ( 
                <Badge variant="outline" className="whitespace-nowrap text-xs py-0.5 px-1.5">
                Linked Goal (Not Found)
                </Badge>
            )}
        </div>
      </CardHeader>
      <Link href={`/my-journal/${entry.id}`} passHref legacyBehavior>
        <a className="flex-grow cursor-pointer hover:bg-muted/20 transition-colors duration-150" aria-label={`View content of journal entry: ${entry.title}`}>
          <CardContent className="py-2">
            <p className="text-sm text-foreground whitespace-pre-wrap line-clamp-3">
              {entry.content}
            </p>
          </CardContent>
        </a>
      </Link>
      <CardFooter className="flex justify-end space-x-2 pt-3">
      </CardFooter>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
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
    </Card>
  );
}
