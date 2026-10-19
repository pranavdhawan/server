export const serverConfig = {
  // Auction Settings
  auction: {
    defaultCurrency: 'USD',
    // MonetiseUp margin percentage deducted from gross bid (e.g. 0.10 = 10% take-rate)
    marginRate: Number(process.env.MONETISEUP_MARGIN_RATE) || 0.10,
    // Overall fan-out timeout to prevent browser Prebid timeouts
    timeoutMs: Number(process.env.AUCTION_TIMEOUT_MS) || 150
  }
};
