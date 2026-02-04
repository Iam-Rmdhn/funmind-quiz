import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // Default redirect to dashboard if 'next' param is not present
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Sync google avatar to profile if it exists in metadata
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.user_metadata?.avatar_url) {
        await supabase
          .from('profiles')
          .update({ avatar_url: user.user_metadata.avatar_url })
          .eq('id', user.id)
          .is('avatar_url', null) // Only update if currently null
      }

      // Sync username from Google name if it exists and user has default username
      const name = user?.user_metadata?.full_name || user?.user_metadata?.name;
      if (name) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', user.id)
          .single();

        // Check if username is default (starts with 'user_') using a heuristic
        if (profile?.username && profile.username.startsWith('user_')) {
          // Sanitize name: lowercase, replace non-alphanumeric with _, trim
          const baseUsername = name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '_')
            .replace(/^_+|_+$/g, '')
            .slice(0, 20); // Reasonable length limit

          if (baseUsername) {
            // First try with just the name
            const { error: updateError } = await supabase
              .from('profiles')
              .update({ username: baseUsername })
              .eq('id', user.id);

            // If that fails (likely unique constraint), try appending random numbers
            if (updateError) {
               const randomSuffix = Math.floor(1000 + Math.random() * 9000);
               const uniqueUsername = `${baseUsername}_${randomSuffix}`;
               await supabase
                 .from('profiles')
                 .update({ username: uniqueUsername })
                 .eq('id', user.id);
            }
          }
        }
      }
      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'
      
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
