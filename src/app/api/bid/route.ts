import { NextRequest, NextResponse } from 'next/server';
import { executeAuction } from '@/lib/auction';
import { PrebidBidRequestBody } from '@/lib/types';

// Helper to construct CORS headers supporting withCredentials: true
function getCorsHeaders(request: NextRequest) {
  const origin = request.headers.get('origin') || '*';
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Accept, X-Requested-With',
    'Access-Control-Max-Age': '86400'
  };
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(request)
  });
}

export async function POST(request: NextRequest) {
  const corsHeaders = getCorsHeaders(request);
  try {
    let body: PrebidBidRequestBody;

    // Prebid usually sends text/plain to avoid CORS preflight, or application/json
    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      body = await request.json();
    } else {
      const rawText = await request.text();
      body = JSON.parse(rawText || '{}');
    }

    if (!body || !body.bids || body.bids.length === 0) {
      return NextResponse.json([], { status: 200, headers: corsHeaders });
    }

    const clientIp = request.headers.get('x-forwarded-for') || request.ip || 'unknown';
    const clientUa = request.headers.get('user-agent') || 'unknown';

    // Attach request metadata if missing
    if (!body.device) {
      body.device = {
        ua: clientUa,
        ip: clientIp,
        language: request.headers.get('accept-language')?.split(',')[0] || undefined
      };
    } else {
      if (!body.device.ip) body.device.ip = clientIp;
      if (!body.device.ua) body.device.ua = clientUa;
    }

    const domain = body.domain || body.site?.domain || 'unknown';
    const placementList = (body.bids || []).map(b => b.placementId).join(', ');
    console.log(`[Auction Inbound] Domain: "${domain}" | Placements: [${placementList}] | Client IP: ${clientIp}`);

    // Run the multi-DSP auction
    const winningBids = await executeAuction(body);

    console.log(`[Auction Outbound] Returning ${winningBids.length} winning bid(s) to Prebid.`);

    return NextResponse.json(winningBids, {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  } catch (error: any) {
    console.error('[MonetiseUp Server] Error processing bid request:', error);
    // In ad tech, return empty array rather than 500 so publishers auction continues gracefully
    return NextResponse.json([], {
      status: 200,
      headers: corsHeaders
    });
  }
}
