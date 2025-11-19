import { openapi } from '@/lib/openapi';
export const { HEAD, PUT, POST, PATCH, DELETE } = openapi.createProxy({
  allowedOrigins: ['https://api.steampowered.com', 'https://partner.steam-api.com'],
});

export async function GET(request: Request) {
  const url = new URL(request.url);
  const targetUrl = url.searchParams.get('url');

  if (
    !targetUrl ||
    !(
      targetUrl.startsWith('https://api.steampowered.com') ||
      targetUrl.startsWith('https://partner.steam-api.com')
    )
  ) {
    return new Response('Invalid or missing target URL.', { status: 400 });
  }

  // Forward headers except host and some blacklisted ones
  const headers = new Headers(request.headers);
  // headers.delete('host');
  // headers.delete('cookie');

  // Proxy the GET request
  const proxiedResponse = await fetch(targetUrl, {
    method: 'GET',
    headers,
  });
  if (proxiedResponse.status >= 400) {
    const text = await proxiedResponse.text();

    // Check if the response is HTML and try to extract the text after the first <h1></h1>
    if (
      text.startsWith('<') &&
      text.includes('</h1>')
    ) {
      // Get all content after the first </h1> WITHOUT any following closing tags (</body>, </html>, etc)
      const afterH1 = text.split('</h1>')[1];
      if (afterH1 && afterH1.trim()) {
        // Remove any trailing HTML closing tags
        const cleaned = afterH1.replace(/<\/[a-zA-Z]+>/g, '').trim();
        if (cleaned) {
          return new Response(cleaned, { status: proxiedResponse.status });
        }
      }
    }
    return new Response(text, { status: proxiedResponse.status });
  }

  // Copy response headers except for some restricted ones
  const responseHeaders = new Headers(proxiedResponse.headers);
  responseHeaders.delete('set-cookie');
  responseHeaders.set('Access-Control-Allow-Origin', '*');

  const json = await proxiedResponse.json();
  return new Response(JSON.stringify(json ?? {}), {
    headers: {
      ...responseHeaders,
      'Content-Type': 'application/json',

    },
  });
}