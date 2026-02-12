import { ImageResponse } from 'next/og';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0F1A14 0%, #223328 60%, #7B9F8A 100%)',
          fontFamily: 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial',
          color: 'white',
        }}
      >
        <div style={{ width: 1040, display: 'flex', flexDirection: 'column', gap: 18, padding: 64 }}>
          <div style={{ fontSize: 54, fontWeight: 900, letterSpacing: 0.4 }}>SEQHER</div>
          <div style={{ fontSize: 28, opacity: 0.95, lineHeight: 1.2 }}>
            Equal health and rights — Nigeria & Canada
          </div>
          <div style={{ fontSize: 18, opacity: 0.85 }}>seqher.org</div>
        </div>
      </div>
    ),
    size
  );
}

