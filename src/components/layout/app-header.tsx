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
        <div className="flex items-center gap-4">
          {username && <span className="text-sm text-muted-foreground">Witaj, {username}!</span>}
          <ModeToggle />
          {onLogout && (
            <Button variant="outline" size="sm" onClick={onLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Wyloguj
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
