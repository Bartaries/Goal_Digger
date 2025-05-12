import { Shovel, LogOut } from 'lucide-react';
import { ModeToggle } from '@/components/mode-toggle';
import { Button } from '@/components/ui/button';

interface AppHeaderProps {
  username?: string | null;
  onLogout?: () => void;
}

export function AppHeader({ username, onLogout }: AppHeaderProps) {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shovel className="h-8 w-8 text-primary -rotate-90" />
          <h1 className="text-2xl font-bold text-primary">Goal Digger</h1>
        </div>
        <div className="flex items-center gap-2">
          {username && <span className="text-sm text-muted-foreground">Hej, {username}!</span>}
          <ModeToggle />
          {onLogout && (
            <Button variant="outline" size="icon" onClick={onLogout} aria-label="Wyloguj">
              <LogOut className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
