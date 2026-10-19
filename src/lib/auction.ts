import { PrebidBidRequestBody, MonetiseUpBidResult } from './types';
import { serverConfig } from './config';
import { demandPartners, queryPartnerDemand } from './partners';
import { generatePrebidReviewCreative } from './testCreative';

/**
 * MonetiseUp Multi-Partner Auction Engine
 * - For Prebid test placement IDs (test-placement-123): Guaranteed test ad for PR certification.
 * - For live placements: Dispatches requests to all enabled demand partners in parallel (Adagio, Pubmatic, etc.),
 *   picks the highest CPM winner, and applies MonetiseUp take-rate margin.
 */
export async function executeAuction(
  requestBody: PrebidBidRequestBody
): Promise<MonetiseUpBidResult[]> {
  const winningBids: MonetiseUpBidResult[] = [];
  const liveBidsToQuery: typeof requestBody.bids = [];

  // Check each ad unit in the request
  for (const bidItem of requestBody.bids) {
    const pId = (bidItem.placementId || '').toLowerCase();

    // If it's a test placement (used by Prebid PR reviewers & local testing)
    if (pId.startsWith('test') || pId === '12345') {
      winningBids.push(generatePrebidReviewCreative(bidItem, 1.75));
    } else {
      liveBidsToQuery.push(bidItem);
    }
  }

  // If there are live production ad units, query all active partners in parallel
  if (liveBidsToQuery.length > 0) {
    const activePartners = demandPartners.filter((p) => p.enabled);
    const subRequest = { ...requestBody, bids: liveBidsToQuery };

    const partnerPromises = activePartners.map((partner) =>
      queryPartnerDemand(partner, subRequest)
    );

    const results = await Promise.allSettled(partnerPromises);
    const bidsByImpId: Map<string, MonetiseUpBidResult[]> = new Map();

    for (const res of results) {
      if (res.status === 'fulfilled' && Array.isArray(res.value)) {
        for (const bid of res.value) {
          const list = bidsByImpId.get(bid.bidId) || [];
          list.push(bid);
          bidsByImpId.set(bid.bidId, list);
        }
      }
    }

    const margin = serverConfig.auction.marginRate;

    // Pick highest CPM bid for each ad slot
    for (const [, candidates] of bidsByImpId.entries()) {
      if (!candidates || candidates.length === 0) continue;
      candidates.sort((a, b) => b.cpm - a.cpm);
      const winner = candidates[0];
      const netCpm = Math.round(winner.cpm * (1 - margin) * 10000) / 10000;

      winningBids.push({
        ...winner,
        cpm: Math.max(netCpm, 0.01)
      });
    }
  }

  return winningBids;
}
