"use client";

import type { FormEvent } from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';

interface AddHabitFormProps {
  onAddHabit: (name: string) => void;
}

export function AddHabitForm({ onAddHabit }: AddHabitFormProps) {
  const [habitName, setHabitName] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (habitName.trim() === '') return;
    onAddHabit(habitName.trim());
    setHabitName('');
  };

  return (
    <Card className="mb-8 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <PlusCircle className="text-primary" />
          Add New Habit
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="text"
            placeholder="e.g., Read for 30 minutes"
            value={habitName}
            onChange={(e) => setHabitName(e.target.value)}
            className="flex-grow"
            aria-label="New habit name"
          />
          <Button type="submit" variant="default">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Habit
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
