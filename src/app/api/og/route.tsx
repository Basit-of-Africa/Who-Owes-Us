import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get('name') || 'Public Figure';
    const party = searchParams.get('party') || 'CIVIC ARCHIVE';
    const state = searchParams.get('state') || '';
    const score = searchParams.get('score') || '0';
    const forfeiture = searchParams.get('forfeiture') || '0';
    const cases = searchParams.get('cases') || '0';

    const numScore = parseInt(score, 10);
    const scoreColor = numScore > 50 ? '#ef4444' : numScore > 20 ? '#f59e0b' : '#10b981';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor: '#0a101d',
            padding: '60px 70px',
            fontFamily: 'sans-serif',
            position: 'relative',
          }}
        >
          {/* Background Accent glow */}
          <div
            style={{
              position: 'absolute',
              top: '-100px',
              right: '-100px',
              width: '500px',
              height: '500px',
              borderRadius: '50%',
              backgroundColor: '#eab308',
              opacity: 0.12,
              filter: 'blur(100px)',
            }}
          />

          {/* Top Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '14px',
                  height: '14px',
                  borderRadius: '50%',
                  backgroundColor: '#eab308',
                }}
              />
              <span
                style={{
                  color: '#94a3b8',
                  fontSize: '18px',
                  fontWeight: 900,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                }}
              >
                Federal Republic of Nigeria • Civic Integrity Archive
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#1e293b',
                padding: '8px 18px',
                borderRadius: '10px',
                border: '1px solid #334155',
              }}
            >
              <span
                style={{
                  color: '#eab308',
                  fontSize: '16px',
                  fontWeight: 900,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                Official Dossier
              </span>
            </div>
          </div>

          {/* Center Main Candidate Name & Affiliation */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span
                style={{
                  backgroundColor: '#eab308',
                  color: '#0a101d',
                  fontSize: '18px',
                  fontWeight: 900,
                  padding: '6px 14px',
                  borderRadius: '8px',
                  textTransform: 'uppercase',
                }}
              >
                {party}
              </span>
              {state ? (
                <span
                  style={{
                    color: '#cbd5e1',
                    fontSize: '20px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                  }}
                >
                  • {state} State
                </span>
              ) : null}
            </div>

            <h1
              style={{
                color: '#ffffff',
                fontSize: '64px',
                fontWeight: 900,
                lineHeight: 1.1,
                margin: 0,
                textTransform: 'uppercase',
                letterSpacing: '-0.02em',
              }}
            >
              {name}
            </h1>
          </div>

          {/* Bottom Metrics Bar */}
          <div
            style={{
              display: 'flex',
              gap: '24px',
              backgroundColor: '#111827',
              border: '1px solid #1f2937',
              borderRadius: '20px',
              padding: '24px 32px',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <span style={{ color: '#94a3b8', fontSize: '14px', fontWeight: 800, textTransform: 'uppercase' }}>
                Accountability Risk
              </span>
              <span style={{ color: scoreColor, fontSize: '38px', fontWeight: 900, marginTop: '4px' }}>
                {score} <span style={{ fontSize: '20px', color: '#64748b' }}>/ 100</span>
              </span>
            </div>

            <div style={{ width: '1px', backgroundColor: '#374151' }} />

            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <span style={{ color: '#94a3b8', fontSize: '14px', fontWeight: 800, textTransform: 'uppercase' }}>
                Total Restitution Tied
              </span>
              <span style={{ color: '#eab308', fontSize: '38px', fontWeight: 900, marginTop: '4px' }}>
                {forfeiture !== '0' ? `₦${forfeiture}` : '₦0 (Clean)'}
              </span>
            </div>

            <div style={{ width: '1px', backgroundColor: '#374151' }} />

            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <span style={{ color: '#94a3b8', fontSize: '14px', fontWeight: 800, textTransform: 'uppercase' }}>
                Verified Court Cases
              </span>
              <span style={{ color: '#ffffff', fontSize: '38px', fontWeight: 900, marginTop: '4px' }}>
                {cases} Charges
              </span>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    return new Response(`Failed to generate the image: ${e.message}`, {
      status: 500,
    });
  }
}
