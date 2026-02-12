import { ImageResponse } from 'next/og';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #F2F3F0 0%, #E6EFEA 60%, #F7F0D1 100%)',
          fontFamily: 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial',
        }}
      >
        <div
          style={{
            width: 1040,
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
            padding: 64,
            borderRadius: 32,
            background: 'rgba(255, 255, 255, 0.75)',
            border: '1px solid rgba(0,0,0,0.06)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  background: '#7B9F8A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: 28,
                  fontWeight: 800,
                }}
              >
                S
              </div>
              <div style={{ fontSize: 36, fontWeight: 800, color: '#223328' }}>SEQHER</div>
            </div>
            <div style={{ fontSize: 18, color: '#3E5A49' }}>Nigeria • Canada</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ fontSize: 54, fontWeight: 800, color: '#18251E', lineHeight: 1.05 }}>
              Society for Equal Health and Rights
            </div>
            <div style={{ fontSize: 26, color: '#2E4537', lineHeight: 1.25 }}>
              Advancing equal health and rights through community-led programs, advocacy, and care.
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 8 }}>
            {['Health Equity', 'Human Rights', 'Inclusion', 'SDGs'].map((tag) => (
              <div
                key={tag}
                style={{
                  padding: '10px 14px',
                  borderRadius: 999,
                  background: 'rgba(123, 159, 138, 0.14)',
                  color: '#223328',
                  fontSize: 18,
                  fontWeight: 600,
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    size
  );
}

