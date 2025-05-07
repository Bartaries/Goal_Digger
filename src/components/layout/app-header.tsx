import { Target } from 'lucide-react';
import { ModeToggle } from '@/components/mode-toggle';

export function AppHeader() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-primary">Goal Digger</h1>
        </div>
        <ModeToggle />
      </div>
    </header>
  );
}
