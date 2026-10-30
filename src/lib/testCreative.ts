import { PrebidBidRequestItem, MonetiseUpBidResult } from './types';

/**
 * Generates an official test creative for Prebid.org compliance reviews.
 * Supports both Banner and Video (VAST XML / VAST URL) formats.
 * Triggered when placementId is a designated test ID (e.g. test-placement-123, test-video-placement)
 * or when in test simulation mode.
 */
export function generatePrebidReviewCreative(
  item: PrebidBidRequestItem,
  cpm: number = 2.50
): MonetiseUpBidResult {
  const isVideo = !!(item.video && !item.banner);

  if (isVideo) {
    const playerSize = item.video?.playerSize?.[0] || [640, 480];
    const [width, height] = playerSize;
    const creativeId = `monetiseup_video_test_${width}x${height}_${Date.now()}`;

    // Standard IAB compliant VAST 3.0 response with MonetiseUp sample video creative
    const vastXml = `
<VAST version="3.0">
  <Ad id="${creativeId}">
    <InLine>
      <AdSystem version="1.0">MonetiseUp</AdSystem>
      <AdTitle>MonetiseUp Test Video Creative</AdTitle>
      <Description>Official MonetiseUp Prebid Test Video</Description>
      <Pricing model="cpm" currency="USD">${cpm.toFixed(2)}</Pricing>
      <Creatives>
        <Creative id="cr_${creativeId}" sequence="1">
          <Linear>
            <Duration>00:00:15</Duration>
            <MediaFiles>
              <MediaFile delivery="progressive" type="video/mp4" width="${width}" height="${height}" bitrate="800">
                <![CDATA[https://v.monetiseup.com/creatives/test_video_15s.mp4]]>
              </MediaFile>
            </MediaFiles>
          </Linear>
        </Creative>
      </Creatives>
    </InLine>
  </Ad>
</VAST>
    `.trim();

    return {
      bidId: item.bidId,
      cpm: cpm,
      currency: 'USD',
      width: width,
      height: height,
      creativeId: creativeId,
      mediaType: 'video',
      vastXml: vastXml,
      vastUrl: `https://bid5up.monetiseup.com/api/vast?id=${creativeId}`,
      adomain: ['monetiseup.com'],
      demandSource: 'MonetiseUp'
    };
  }

  // Banner creative
  const [width, height] = (item.sizes && item.sizes.length > 0)
    ? item.sizes[0]
    : [300, 250];

  const creativeId = `monetiseup_test_${width}x${height}_${Date.now()}`;

  const adHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      width: ${width}px;
      height: ${height}px;
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: linear-gradient(135deg, #090d16 0%, #1e293b 100%);
      color: #ffffff;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      padding: 12px;
      border: 2px solid #38bdf8;
      border-radius: 6px;
    }
    .badge {
      background: #0284c7;
      color: #f8fafc;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      padding: 3px 8px;
      border-radius: 9999px;
      margin-bottom: 6px;
    }
    .title {
      font-size: ${Math.max(14, Math.floor(width / 20))}px;
      font-weight: 800;
      color: #38bdf8;
      margin-bottom: 4px;
    }
    .desc {
      font-size: 12px;
      color: #94a3b8;
      margin-bottom: 8px;
    }
    .meta {
      font-size: 10px;
      color: #64748b;
    }
  </style>
</head>
<body>
  <div class="badge">MonetiseUp Demand</div>
  <div class="title">Prebid.js Certified Ad</div>
  <div class="desc">${width}x${height} Banner | CPM: $${cpm.toFixed(2)}</div>
  <div class="meta">Placement: ${item.placementId} | MonetiseUp Demand Network</div>
</body>
</html>
  `.trim();

  return {
    bidId: item.bidId,
    cpm: cpm,
    currency: 'USD',
    width: width,
    height: height,
    creativeId: creativeId,
    mediaType: 'banner',
    adHtml: adHtml,
    adomain: ['monetiseup.com'],
    demandSource: 'MonetiseUp'
  };
}
