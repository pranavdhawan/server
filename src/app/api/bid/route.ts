import { NextRequest, NextResponse } from 'next/server';
import { executeAuction } from '@/lib/auction';
import { PrebidBidRequestBody } from '@/lib/types';

// Standard CORS headers allowing any publisher website to call this bidding endpoint
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Accept, X-Requested-With',
  'Access-Control-Max-Age': '86400'
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders
  });
}

export async function POST(request: NextRequest) {
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
