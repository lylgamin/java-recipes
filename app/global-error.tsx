'use client';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ja">
      <body style={{ padding: '40px', textAlign: 'center', fontFamily: 'sans-serif' }}>
        <h2>エラーが発生しました</h2>
        <button
          style={{ marginTop: '16px', padding: '8px 16px', cursor: 'pointer' }}
          onClick={() => reset()}
        >
          再試行
        </button>
      </body>
    </html>
  );
}
