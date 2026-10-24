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

    // Attach request metadata if missing
    if (!body.device) {
      body.device = {
        ua: request.headers.get('user-agent') || undefined,
        ip: request.headers.get('x-forwarded-for') || request.ip || undefined,
        language: request.headers.get('accept-language')?.split(',')[0] || undefined
      };
    }

    // Run the multi-DSP auction
    const winningBids = await executeAuction(body);

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
