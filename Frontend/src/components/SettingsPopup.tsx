
import React from 'react';
import { Settings, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from '../contexts/ThemeContext';

export const SettingsPopup = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-start"
        >
          <Settings className="mr-3 h-5 w-5" />
          Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Appearance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-gray-700 dark:text-gray-300">Theme</p>
                <Button variant="outline" onClick={toggleTheme} className="w-32">
                  {theme === 'light' ? (
                    <>
                      <Sun className="mr-2 h-4 w-4" /> Light Mode
                    </>
                  ) : (
                    <>
                      <Moon className="mr-2 h-4 w-4" /> Dark Mode
                    </>
                  )}
                </Button>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Switch between light and dark themes for the application.
              </p>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
