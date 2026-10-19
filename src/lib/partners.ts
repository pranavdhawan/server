import {
  PrebidBidRequestBody,
  OpenRtbBidRequest,
  OpenRtbBidResponse,
  MonetiseUpBidResult
} from './types';

export interface DemandPartnerConfig {
  id: string;
  name: string;
  status: 'active' | 'onboarding';
  enabled: boolean;
  endpointUrl: string;
  userSyncUrl?: string;
  timeoutMs: number;
  credentials: Record<string, string | undefined>;
}

export const demandPartners: DemandPartnerConfig[] = [
  {
    id: 'adagio',
    name: 'Adagio',
    status: 'active',
    enabled: process.env.ENABLE_ADAGIO !== 'false',
    endpointUrl: process.env.ADAGIO_ENDPOINT_URL || 'https://mp.4dex.io/prebid',
    userSyncUrl: 'https://mp.4dex.io/usersync',
    timeoutMs: Number(process.env.ADAGIO_TIMEOUT_MS) || 120,
    credentials: {
      organizationId: process.env.ADAGIO_ORG_ID || '1687'
    }
  },
  {
    id: '152media',
    name: '152Media',
    status: 'active',
    enabled: process.env.ENABLE_152MEDIA === 'true',
    endpointUrl: process.env.MEDIA152_ENDPOINT_URL || 'https://east.152media-ssp.com/pbjs',
    userSyncUrl: 'https://cs.152media-ssp.com',
    timeoutMs: Number(process.env.MEDIA152_TIMEOUT_MS) || 120,
    credentials: {
      siteId: process.env.MEDIA152_SITE_ID
    }
  },
  {
    id: 'pubmatic',
    name: 'PubMatic',
    status: 'active',
    enabled: process.env.ENABLE_PUBMATIC === 'true',
    endpointUrl: process.env.PUBMATIC_ENDPOINT_URL || 'https://hbopenbid.pubmatic.com/translator?source=prebid-client',
    userSyncUrl: 'https://image8.pubmatic.com/AdServer/ImgSync?p=',
    timeoutMs: Number(process.env.PUBMATIC_TIMEOUT_MS) || 120,
    credentials: {
      publisherId: process.env.PUBMATIC_PUBLISHER_ID,
      siteId: process.env.PUBMATIC_SITE_ID
    }
  },
  {
    id: 'openx',
    name: 'OpenX',
    status: 'active',
    enabled: process.env.ENABLE_OPENX === 'true',
    endpointUrl: process.env.OPENX_ENDPOINT_URL || 'https://rtb.openx.net/openrtbb/prebidjs',
    userSyncUrl: 'https://u.openx.net/w/1.0/pd',
    timeoutMs: Number(process.env.OPENX_TIMEOUT_MS) || 120,
    credentials: {
      delDomain: process.env.OPENX_DEL_DOMAIN,
      unit: process.env.OPENX_UNIT_ID
    }
  },
  {
    id: 'nobid',
    name: 'Nobid',
    status: 'active',
    enabled: process.env.ENABLE_NOBID === 'true',
    endpointUrl: process.env.NOBID_ENDPOINT_URL || 'https://ads.servenobid.com/',
    userSyncUrl: 'https://public.servenobid.com/sync.html',
    timeoutMs: Number(process.env.NOBID_TIMEOUT_MS) || 120,
    credentials: {
      siteId: process.env.NOBID_SITE_ID
    }
  },
  {
    id: 'onlinemediasolutions',
    name: 'OnlineMediaSolutions',
    status: 'active',
    enabled: process.env.ENABLE_OMS === 'true',
    endpointUrl: process.env.OMS_ENDPOINT_URL || 'https://rt.marphezis.com/hb',
    userSyncUrl: 'https://rt.marphezis.com/sync?dpid=0',
    timeoutMs: Number(process.env.OMS_TIMEOUT_MS) || 120,
    credentials: {
      publisherId: process.env.OMS_PUBLISHER_ID
    }
  },
  {
    id: 'scalibur',
    name: 'Scalibur',
    status: 'active',
    enabled: process.env.ENABLE_SCALIBUR === 'true',
    endpointUrl: process.env.SCALIBUR_ENDPOINT_URL || 'https://srv.scalibur.io/adserver/ortb?type=prebid',
    userSyncUrl: 'https://srv.scalibur.io/adserver/sync',
    timeoutMs: Number(process.env.SCALIBUR_TIMEOUT_MS) || 120,
    credentials: {
      apiKey: process.env.SCALIBUR_API_KEY,
      zoneId: process.env.SCALIBUR_ZONE_ID
    }
  },
  {
    id: 'triplelift',
    name: 'TripleLift',
    status: 'onboarding',
    enabled: process.env.ENABLE_TRIPLELIFT === 'true',
    endpointUrl: process.env.TRIPLELIFT_ENDPOINT_URL || 'https://tlx.3lift.com/header/auction',
    userSyncUrl: 'https://eb2.3lift.com/sync',
    timeoutMs: Number(process.env.TRIPLELIFT_TIMEOUT_MS) || 120,
    credentials: {
      invCode: process.env.TRIPLELIFT_INV_CODE
    }
  },
  {
    id: 'eskimi',
    name: 'Eskimi',
    status: 'onboarding',
    enabled: process.env.ENABLE_ESKIMI === 'true',
    endpointUrl: process.env.ESKIMI_ENDPOINT_URL || 'https://ittr.eskimi.com/prebidjs',
    userSyncUrl: 'https://ittpx.eskimi.com/sync?sp_id=137',
    timeoutMs: Number(process.env.ESKIMI_TIMEOUT_MS) || 120,
    credentials: {
      token: process.env.ESKIMI_TOKEN
    }
  },
  {
    id: 'equativ',
    name: 'Equativ',
    status: 'onboarding',
    enabled: process.env.ENABLE_EQUATIV === 'true',
    endpointUrl: process.env.EQUATIV_ENDPOINT_URL || 'https://prg.smartadserver.com/prebid/v1',
    userSyncUrl: 'https://sync.smartadserver.com/getuid',
    timeoutMs: Number(process.env.EQUATIV_TIMEOUT_MS) || 120,
    credentials: {
      networkId: process.env.EQUATIV_NETWORK_ID,
      siteId: process.env.EQUATIV_SITE_ID
    }
  }
];

/**
 * Universal OpenRTB 2.5 Caller for connected Demand Partners
 */
export async function queryPartnerDemand(
  partner: DemandPartnerConfig,
  requestBody: PrebidBidRequestBody
): Promise<MonetiseUpBidResult[]> {
  if (!partner.enabled) {
    return [];
  }

  // Dedicated Adagio native 4dex protocol
  if (partner.id === 'adagio') {
    const orgId = partner.credentials.organizationId || '1687';
    const siteDomain = requestBody.domain || 'kunstlichewelt.de';
    const sitePage = requestBody.page || `https://${siteDomain}/`;
    const endpointWithQuery = `${partner.endpointUrl}?orgid=${encodeURIComponent(orgId)}&site=${encodeURIComponent(siteDomain)}`;

    const adUnits = requestBody.bids.map((bidItem) => ({
      adUnitCode: bidItem.placementId,
      bidId: bidItem.bidId,
      bidder: 'adagio',
      params: {
        organizationId: orgId,
        site: siteDomain,
        placement: bidItem.placementId,
        ...(bidItem.params || {})
      },
      mediaTypes: {
        banner: {
          sizes: bidItem.sizes && bidItem.sizes.length > 0 ? bidItem.sizes : [[300, 250]]
        }
      }
    }));

    const payload = {
      organizationId: orgId,
      secure: 1,
      site: {
        domain: siteDomain,
        page: sitePage,
        referrer: requestBody.referer || '',
        top: true
      },
      device: {
        userAgent: requestBody.device?.ua || 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        language: requestBody.device?.language || 'en',
        js: 1
      },
      pageviewId: `pv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      adUnits: adUnits,
      gdprConsent: requestBody.consent?.gdprApplies !== undefined ? {
        consentRequired: requestBody.consent.gdprApplies ? 1 : 0,
        consentString: requestBody.consent.consentString || ''
      } : undefined,
      uspConsent: requestBody.consent?.uspConsent ? {
        uspConsent: requestBody.consent.uspConsent
      } : undefined
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), partner.timeoutMs);

      const response = await fetch(endpointWithQuery, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok || response.status === 204) return [];
      const data = await response.json();
      const rawBids = data.bids || data.seatbid?.[0]?.bid || [];
      if (!Array.isArray(rawBids) || rawBids.length === 0) return [];

      const results: MonetiseUpBidResult[] = [];
      for (const bid of rawBids) {
        const cpm = Number(bid.cpm || bid.price || 0);
        const adHtml = bid.ad || bid.adm || '';
        if (!cpm || !adHtml) continue;

        results.push({
          bidId: bid.requestId || bid.impid || bid.bidId,
          cpm: cpm,
          currency: bid.currency || data.cur || 'USD',
          width: Number(bid.width || bid.w || 300),
          height: Number(bid.height || bid.h || 250),
          creativeId: bid.creativeId || bid.crid || `crid_${Date.now()}`,
          adHtml: adHtml,
          adomain: bid.adomain && Array.isArray(bid.adomain) ? bid.adomain : ['adagio.io'],
          demandSource: 'Adagio'
        });
      }
      return results;
    } catch {
      return [];
    }
  }

  // Standard OpenRTB 2.5 Caller for other partners (Pubmatic, OpenX, 152Media, etc.)
  const impressions = requestBody.bids.map((bidItem) => {
    const formats = (bidItem.sizes || []).map(([w, h]) => ({ w, h }));
    const [primaryW, primaryH] = formats.length > 0 ? [formats[0].w, formats[0].h] : [300, 250];

    return {
      id: bidItem.bidId,
      tagid: bidItem.placementId,
      bidfloor: bidItem.floor || 0.1,
      bidfloorcur: bidItem.floorCurrency || 'USD',
      banner: { w: primaryW, h: primaryH, format: formats },
      ext: {
        partnerId: partner.id,
        credentials: partner.credentials,
        ...(bidItem.params || {})
      }
    };
  });

  const openRtbRequest: OpenRtbBidRequest = {
    id: requestBody.id,
    imp: impressions,
    site: {
      page: requestBody.page || 'https://example.com',
      domain: requestBody.domain || 'example.com',
      ref: requestBody.referer
    },
    device: {
      ua: requestBody.device?.ua || 'Mozilla/5.0',
      ip: requestBody.device?.ip || '127.0.0.1',
      language: requestBody.device?.language || 'en'
    },
    user: {
      ext: { consent: requestBody.consent?.consentString }
    },
    regs: {
      ext: {
        gdpr: requestBody.consent?.gdprApplies ? 1 : 0,
        us_privacy: requestBody.consent?.uspConsent
      }
    },
    tmax: partner.timeoutMs
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), partner.timeoutMs);

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-OpenRTB-Version': '2.5'
    };

    if (partner.credentials.apiKey || partner.credentials.token) {
      headers['Authorization'] = `Bearer ${partner.credentials.apiKey || partner.credentials.token}`;
    }

    const response = await fetch(partner.endpointUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(openRtbRequest),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok || response.status === 204) return [];
    const data: OpenRtbBidResponse = await response.json();
    if (!data.seatbid || data.seatbid.length === 0) return [];

    const results: MonetiseUpBidResult[] = [];
    for (const seat of data.seatbid) {
      for (const bid of seat.bid) {
        results.push({
          bidId: bid.impid,
          cpm: Number(bid.price),
          currency: data.cur || 'USD',
          width: bid.w || 300,
          height: bid.h || 250,
          creativeId: bid.crid || bid.id,
          adHtml: bid.adm,
          adomain: bid.adomain && bid.adomain.length > 0 ? bid.adomain : [`${partner.id}.com`],
          demandSource: partner.name,
          dealId: bid.dealid
        });
      }
    }
    return results;
  } catch {
    return [];
  }
}
