
-- Create user_activities table to track user actions
CREATE TABLE public.user_activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  activity_type TEXT NOT NULL,
  details JSONB DEFAULT '{}',
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;

-- Create policy for users to insert their own activities
CREATE POLICY "Users can insert their own activities" 
  ON public.user_activities 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy for users to view their own activities
CREATE POLICY "Users can view their own activities" 
  ON public.user_activities 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy for users to update their own activities
CREATE POLICY "Users can update their own activities" 
  ON public.user_activities 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policy for users to delete their own activities
CREATE POLICY "Users can delete their own activities" 
  ON public.user_activities 
  FOR DELETE 
  USING (auth.uid() = user_id);
