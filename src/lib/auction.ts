import { PrebidBidRequestBody, MonetiseUpBidResult } from './types';
import { serverConfig } from './config';
import { demandPartners, queryPartnerDemand } from './partners';
import { generatePrebidReviewCreative } from './testCreative';

/**
 * MonetiseUp Multi-Partner Auction Engine
 * Dispatches requests to all enabled demand partners in parallel (Adagio, Pubmatic, etc.),
 * picks the highest CPM winner, applies MonetiseUp take-rate margin,
 * and handles official test placements for Banner and Video.
 */
export async function executeAuction(
  requestBody: PrebidBidRequestBody
): Promise<MonetiseUpBidResult[]> {
  const winningBids: MonetiseUpBidResult[] = [];
  const allBids = requestBody.bids || [];

  // Separate test bids from live demand bids
  const testBids = allBids.filter(b => b.placementId && b.placementId.startsWith('test-'));
  const liveBids = allBids.filter(b => !b.placementId || !b.placementId.startsWith('test-'));

  // 1. Process designated test placements immediately (for Prebid reviews & testing)
  for (const testBid of testBids) {
    winningBids.push(generatePrebidReviewCreative(testBid, 2.50));
  }

  // 2. Query live demand partners in parallel for production slots
  if (liveBids.length > 0) {
    const activePartners = demandPartners.filter((p) => p.enabled);
    const subRequest = { ...requestBody, bids: liveBids };

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
