import { NextRequest, NextResponse } from 'next/server';
import { demandPartners } from '@/lib/partners';

// 1x1 transparent GIF buffer
const TRANSPARENT_1X1_GIF = Buffer.from(
  'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
  'base64'
);

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const syncType = searchParams.get('type') || 'image';

  // Read GDPR / CCPA privacy signals
  const gdpr = searchParams.get('gdpr') || '';
  const gdprConsent = searchParams.get('gdpr_consent') || '';
  const usPrivacy = searchParams.get('us_privacy') || '';

  // If iframe sync requested, respond with HTML dropping sync pixels for all active partners
  if (syncType === 'iframe') {
    const syncQuery = `gdpr=${gdpr}&gdpr_consent=${encodeURIComponent(gdprConsent)}&us_privacy=${encodeURIComponent(usPrivacy)}`;

    const partnerPixels = demandPartners
      .filter((p) => p.userSyncUrl)
      .map(
        (p) =>
          `  <!-- ${p.name} User Sync -->\n  <img src="${p.userSyncUrl}?${syncQuery}" width="1" height="1" style="display:none;" />`
      )
      .join('\n');

    const html = `
<!DOCTYPE html>
<html>
<head><title>MonetiseUp Universal User Sync</title></head>
<body>
${partnerPixels}
</body>
</html>
    `.trim();

    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }

  // Default: Return 1x1 transparent image pixel
  return new NextResponse(TRANSPARENT_1X1_GIF, {
    status: 200,
    headers: {
      'Content-Type': 'image/gif',
      'Content-Length': TRANSPARENT_1X1_GIF.length.toString(),
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Access-Control-Allow-Origin': '*'
    }
  });
}
