
"use client";

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn } from 'lucide-react';

interface LoginFormProps {
  onLoginSuccess: (username: string) => void;
}

export function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Simple mock login: any non-empty username/password works, or even empty for this simplicity.
    // In a real app, you'd validate credentials here.
    onLoginSuccess(username || "Użytkownik"); // Pass the entered username, or a default if empty
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex justify-center">
            <LogIn className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold">Witaj w Goal Digger!</CardTitle>
          <CardDescription>Zaloguj się, aby kontynuować swoją podróż.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Nazwa użytkownika</Label>
              <Input
                id="username"
                type="text"
                placeholder="np. JanKowalski"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                
                className="text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Hasło</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                
                className="text-base"
              />
            </div>
            <Button type="submit" className="w-full text-lg py-3">
              <LogIn className="mr-2 h-5 w-5" /> Zaloguj się
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
