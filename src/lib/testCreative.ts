import { PrebidBidRequestItem, MonetiseUpBidResult } from './types';

/**
 * Generates an official test creative for Prebid.org compliance reviews.
 * Triggered exclusively when placementId is a designated test ID (e.g. test-placement-123).
 */
export function generatePrebidReviewCreative(
  item: PrebidBidRequestItem,
  cpm: number = 1.75
): MonetiseUpBidResult {
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
  <div class="meta">Placement: ${item.placementId} | Org: 1687 (Adagio Powered)</div>
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
    adHtml: adHtml,
    adomain: ['monetiseup.com'],
    demandSource: 'MonetiseUp'
  };
}
