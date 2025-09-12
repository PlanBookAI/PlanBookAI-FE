import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    // Determine secret and safety fallbacks
    const secret = process.env.TURNSTILE_SECRET_KEY || '';
    const disableTurnstile =
      (process.env.DISABLE_TURNSTILE || '').toLowerCase() === 'true';

    if (!secret) {
      if (disableTurnstile) {
        // Explicitly bypass verification when disabled (useful for dev or preview)
        return NextResponse.json({ success: true, bypassed: true });
      }
      // No secret and not disabled → return a clear error
      return NextResponse.json(
        {
          error:
            'Turnstile secret key is missing. Set TURNSTILE_SECRET_KEY or NEXT_PUBLIC_TURNSTILE_SECRET_KEY.',
        },
        { status: 500 }
      );
    }

    // Verify token with Cloudflare
    const formData = new FormData();
    formData.append('secret', secret);
    formData.append('response', token);

    const response = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        body: formData,
      }
    );

    const result = await response.json();

    if (result.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: 'Invalid token', details: result['error-codes'] },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Turnstile verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
