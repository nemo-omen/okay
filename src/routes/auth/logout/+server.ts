import * as auth from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';

export async function POST(event) {
  if (!event.locals.session) {
    return new Response(null, { status: 401 });
  }
  await auth.invalidateSession(event.locals.session.id);
  auth.deleteSessionTokenCookie(event);

  return redirect(302, '/auth/login');
}