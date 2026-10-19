import { NextResponse } from 'next/server';
import { serverConfig } from '@/lib/config';
import { demandPartners } from '@/lib/partners';

export async function GET() {
  const activePartners = demandPartners.filter((p) => p.enabled);

  return NextResponse.json({
    status: 'online',
    service: 'MonetiseUp RTB Engine & Multi-SSP Exchange',
    version: '1.0.0',
    activePartnersCount: activePartners.length,
    partners: demandPartners.map((p) => ({
      name: p.name,
      status: p.status,
      enabled: p.enabled,
      endpoint: p.endpointUrl
    })),
    auction: {
      marginRate: `${serverConfig.auction.marginRate * 100}%`,
      timeoutMs: serverConfig.auction.timeoutMs
    },
    timestamp: new Date().toISOString()
  });
}
