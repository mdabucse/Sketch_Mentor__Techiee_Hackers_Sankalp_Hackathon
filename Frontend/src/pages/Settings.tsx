
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, User, Bell, Palette, Shield, Download } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useUserActivities } from '@/hooks/useUserActivities';

const SettingsPage = () => {
  const { currentUser } = useAuth();
  const { trackActivity } = useUserActivities();
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    marketing: true
  });

  // Track page access when component mounts
  useEffect(() => {
    trackActivity('page_visited', { 
      page: 'Settings',
      timestamp: new Date().toISOString()
    });
  }, [trackActivity]);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 overflow-auto p-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Settings
        </h1>
        
        <Card className="bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle>Settings</CardTitle>
            <CardDescription>
              Manage your account settings and preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 dark:text-gray-300">
              Settings panel content will be available soon.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
