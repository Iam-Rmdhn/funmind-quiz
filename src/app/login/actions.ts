'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

interface AuthState {
  error: string | null;
  success?: boolean;
}

export async function login(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const supabase = await createClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    if (error.message.includes('Invalid login credentials')) {
      return { error: 'Invalid credentials. If you just signed up, please verify your email.' };
    }
    return { error: error.message };
  }

  revalidatePath('/', 'layout');
  redirect('/dashboard');
}

export async function signup(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const supabase = await createClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const username = formData.get('username') as string;

  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  if (!username || username.trim().length < 3) {
    return { error: 'Username must be at least 3 characters' };
  }

  // Check if username is already taken
  const { data: existingUser } = await supabase
    .from('profiles')
    .select('username')
    .eq('username', username.trim().toLowerCase())
    .single();

  if (existingUser) {
    return { error: 'Username is already taken' };
  }
  const { getAuthCallbackUrl } = await import('@/lib/get-url');

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: getAuthCallbackUrl(),
      data: {
        username: username.trim(),
      },
    },
  });

  if (error) {
    // Handle common Supabase errors with user-friendly messages
    if (error.message.includes('rate limit') || error.message.includes('too many requests')) {
      return { error: 'Too many signup attempts. Please wait a few minutes and try again.' };
    }
    if (error.message.includes('already registered') || error.message.includes('already exists')) {
      return { error: 'An account with this email already exists. Try logging in instead.' };
    }
    return { error: error.message };
  }

  if (data.user && !data.session) {
    return {
      error:
        'Account created! Please check your email to confirm your registration before logging in.',
    };
  }

  revalidatePath('/', 'layout');
  redirect('/dashboard');
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return { success: true };
}

export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getUserProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();

  return profile;
}

export async function signInWithGoogle() {
  const supabase = await createClient();
  const { getAuthCallbackUrl } = await import('@/lib/get-url');

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: getAuthCallbackUrl(),
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  if (error) {
    return { error: error.message, url: null };
  }

  return { error: null, url: data.url };
}
