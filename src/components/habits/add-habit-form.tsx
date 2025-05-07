
"use client";

import type { FormEvent } from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle, Sparkles } from 'lucide-react';
import type { HabitFrequency } from '@/types/habit';

interface AddHabitFormProps {
  onAddHabit: (name: string, frequency: HabitFrequency) => void;
}

export function AddHabitForm({ onAddHabit }: AddHabitFormProps) {
  const [habitName, setHabitName] = useState('');
  const [frequency, setFrequency] = useState<HabitFrequency>('daily');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (habitName.trim() === '') return;
    onAddHabit(habitName.trim(), frequency);
    setHabitName('');
    setFrequency('daily'); // Reset frequency to default
  };

  return (
    <Card className="mb-8 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Sparkles className="text-primary h-6 w-6" /> {/* Changed icon here */}
          Nowe nawyki
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-grow space-y-1.5">
            <Label htmlFor="habit-name">Nazwa nawyku</Label>
            <Input
              id="habit-name"
              type="text"
              placeholder="e.g. Read for 30 minutes"
              value={habitName}
              onChange={(e) => setHabitName(e.target.value)}
              aria-label="New habit name"
            />
          </div>
          <div className="flex-shrink-0 w-full sm:w-[150px] space-y-1.5">
            <Label htmlFor="frequency-select">Częstotliwość</Label>
            <Select value={frequency} onValueChange={(value) => setFrequency(value as HabitFrequency)}>
              <SelectTrigger id="frequency-select" className="w-full">
                <SelectValue placeholder="Frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" variant="default" className="w-full sm:w-auto">
            <PlusCircle className="mr-2 h-4 w-4" /> Add habit
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

