import { Shovel } from 'lucide-react';
import { ModeToggle } from '@/components/mode-toggle';

interface AppHeaderProps {
  username?: string | null;
}

export function AppHeader({ username }: AppHeaderProps) {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shovel className="h-8 w-8 text-primary -rotate-90" />
          <h1 className="text-2xl font-bold text-primary">Goal Digger</h1>
        </div>
        <div className="flex items-center gap-2">
          {username && <span className="text-sm text-muted-foreground mr-2">Witaj, {username}!</span>}
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
