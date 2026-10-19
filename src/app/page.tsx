'use client';

import { useState } from 'react';

const partnersList = [
  { name: 'Adagio', status: 'Active', protocol: 'OpenRTB 2.5', speed: '~95ms' },
  { name: '152Media', status: 'Active', protocol: 'OpenRTB 2.5', speed: '~110ms' },
  { name: 'Pubmatic', status: 'Active', protocol: 'OpenRTB 2.5', speed: '~85ms' },
  { name: 'OpenX', status: 'Active', protocol: 'OpenRTB 2.5', speed: '~90ms' },
  { name: 'Nobid', status: 'Active', protocol: 'OpenRTB 2.5', speed: '~115ms' },
  { name: 'OnlineMediaSolutions', status: 'Active', protocol: 'OpenRTB 2.5', speed: '~105ms' },
  { name: 'Scalibur', status: 'Active', protocol: 'OpenRTB 2.5', speed: '~120ms' },
  { name: 'TripleLift', status: 'Onboarding', protocol: 'OpenRTB 2.5', speed: 'Pending' },
  { name: 'Eskimi', status: 'Onboarding', protocol: 'OpenRTB 2.5', speed: 'Pending' },
  { name: 'Equativ', status: 'Onboarding', protocol: 'OpenRTB 2.5', speed: 'Pending' }
];

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [placementId, setPlacementId] = useState('test-banner-1');
  const [size, setSize] = useState('300x250');

  const runTestAuction = async () => {
    setLoading(true);
    setResponse(null);

    const [w, h] = size.split('x').map(Number);

    const testPayload = {
      id: `auction_${Date.now()}`,
      page: 'https://example-publisher.com/article',
      domain: 'example-publisher.com',
      bids: [
        {
          bidId: `bid_${Math.random().toString(36).substring(2, 9)}`,
          placementId: placementId,
          sizes: [[w, h]],
          floor: 0.50,
          floorCurrency: 'USD'
        }
      ]
    };

    try {
      const res = await fetch('/api/bid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testPayload)
      });
      const data = await res.json();
      setResponse(data);
    } catch (err: any) {
      setResponse({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: '40px 24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <header style={{ marginBottom: '40px', borderBottom: '1px solid #1e293b', paddingBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <h1 style={{ fontSize: '28px', fontWeight: '800', letterSpacing: '-0.5px', color: '#f8fafc' }}>
                MonetiseUp
              </h1>
              <span style={{
                background: 'rgba(14, 165, 233, 0.15)',
                color: '#38bdf8',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                padding: '4px 10px',
                borderRadius: '9999px',
                fontSize: '12px',
                fontWeight: '700'
              }}>
                Demand Aggregator Engine
              </span>
              <span style={{
                background: 'rgba(34, 197, 94, 0.15)',
                color: '#4ade80',
                border: '1px solid rgba(74, 222, 128, 0.3)',
                padding: '4px 10px',
                borderRadius: '9999px',
                fontSize: '12px',
                fontWeight: '700'
              }}>
                ● 7 Active Partners
              </span>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '15px' }}>
              Next.js Multi-SSP Header Bidding Server for Prebid.js
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <a
              href="/api/health"
              target="_blank"
              style={{
                background: '#1e293b',
                color: '#e2e8f0',
                padding: '8px 16px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '13px',
                fontWeight: '600',
                border: '1px solid #334155'
              }}
            >
              API Diagnostics ↗
            </a>
          </div>
        </div>
      </header>

      {/* Connected Demand Partners Table */}
      <section style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '24px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#f8fafc' }}>
            Connected Demand Partners (10)
          </h2>
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>
            Parallel fan-out with 120ms timeout & margin deduction
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
          {partnersList.map((partner) => (
            <div
              key={partner.name}
              style={{
                background: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '8px',
                padding: '12px 16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <strong style={{ display: 'block', fontSize: '14px', color: '#f1f5f9' }}>{partner.name}</strong>
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>{partner.protocol}</span>
              </div>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  background: partner.status === 'Active' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(234, 179, 8, 0.15)',
                  color: partner.status === 'Active' ? '#4ade80' : '#facc15',
                  border: partner.status === 'Active' ? '1px solid rgba(74, 222, 128, 0.3)' : '1px solid rgba(250, 204, 21, 0.3)'
                }}
              >
                {partner.status}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Simulator Section */}
      <section style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '28px', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px' }}>
          Live Multi-Partner Auction Simulator
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '24px' }}>
          Simulates a real Prebid auction dispatching across all connected SSPs and returning the highest-paying ad.
        </p>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: '24px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px', fontWeight: '600' }}>
              Placement ID
            </label>
            <input
              type="text"
              value={placementId}
              onChange={(e) => setPlacementId(e.target.value)}
              style={{
                background: '#1e293b',
                border: '1px solid #334155',
                color: '#fff',
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '14px',
                width: '200px'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px', fontWeight: '600' }}>
              Banner Size
            </label>
            <select
              value={size}
              onChange={(e) => setSize(e.target.value)}
              style={{
                background: '#1e293b',
                border: '1px solid #334155',
                color: '#fff',
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            >
              <option value="300x250">300x250 (Medium Rectangle)</option>
              <option value="728x90">728x90 (Leaderboard)</option>
              <option value="320x50">320x50 (Mobile Banner)</option>
              <option value="300x600">300x600 (Half Page)</option>
            </select>
          </div>

          <button
            onClick={runTestAuction}
            disabled={loading}
            style={{
              background: '#0284c7',
              color: '#ffffff',
              border: 'none',
              padding: '11px 24px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '700',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'background 0.2s'
            }}
          >
            {loading ? 'Running Multi-Partner Auction...' : '⚡ Trigger Live Bid Request'}
          </button>
        </div>

        {/* Results view */}
        {response && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px', marginTop: '24px' }}>
            {/* JSON Output */}
            <div style={{ background: '#020617', border: '1px solid #1e293b', borderRadius: '8px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', color: '#38bdf8', fontWeight: '700' }}>Prebid Response Payload</span>
                <span style={{ fontSize: '12px', color: '#4ade80' }}>200 OK</span>
              </div>
              <pre style={{ fontSize: '12px', color: '#cbd5e1', overflowX: 'auto', maxHeight: '350px' }}>
                {JSON.stringify(response, null, 2)}
              </pre>
            </div>

            {/* Live Creative Render Preview */}
            <div style={{ background: '#020617', border: '1px solid #1e293b', borderRadius: '8px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '12px', color: '#f59e0b', fontWeight: '700' }}>Winning Creative Preview</span>
                {response && response[0] ? (
                  <span style={{ fontSize: '12px', color: '#4ade80', fontWeight: '700' }}>
                    Winning Demand: {response[0].demandSource || 'MonetiseUp'} (${response[0].cpm} CPM)
                  </span>
                ) : (
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                    No Winning Bid (204 No Content)
                  </span>
                )}
              </div>

              {response && response[0]?.adHtml ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#0b0f19', padding: '16px', borderRadius: '6px' }}>
                  <iframe
                    title="Ad Preview"
                    srcDoc={response[0].adHtml}
                    style={{
                      width: `${response[0].width}px`,
                      height: `${response[0].height}px`,
                      border: 'none',
                      borderRadius: '4px'
                    }}
                  />
                </div>
              ) : (
                <div style={{ padding: '24px', textAlign: 'center', color: '#94a3b8', fontSize: '13px', background: '#0b0f19', borderRadius: '6px' }}>
                  <p style={{ fontWeight: '600', color: '#cbd5e1', marginBottom: '4px' }}>No bids returned from connected SSPs</p>
                  <p style={{ fontSize: '12px', color: '#64748b' }}>
                    All 7 active SSP endpoints were queried. Configure your real partner credentials in <code>.env.local</code> to receive live ads.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
