'use client';

import { useEffect } from 'react';

// AdSense パブリッシャーID（ads.txt と一致させること）
const AD_CLIENT = 'ca-pub-9891812277341685';

interface AdUnitProps {
  /** AdSense 管理画面で発行した広告ユニットのスロットID */
  slot: string;
  /** 広告フォーマット。デフォルト: 'auto' */
  format?: string;
  /** レスポンシブ広告を有効にするか */
  responsive?: boolean;
  className?: string;
}

/**
 * Google AdSense 手動広告ユニット
 *
 * 使い方:
 *   <AdUnit slot="1234567890" />
 *
 * slot は AdSense 管理画面 > 広告ユニット > コードを取得 で確認できる。
 * 未設定の場合は何も表示しない（開発時のレイアウト確認用にプレースホルダー表示）。
 */
export default function AdUnit({ slot, format = 'auto', responsive = true, className }: AdUnitProps) {
  useEffect(() => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch {
      // AdSense スクリプト未読み込み時は無視
    }
  }, []);

  // slot が未設定の場合はプレースホルダー表示（開発確認用）
  if (!slot) {
    return (
      <div
        className={className}
        style={{
          background: '#f8fafc',
          border: '1px dashed #cbd5e1',
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 90,
          color: '#94a3b8',
          fontSize: 12,
        }}
      >
        広告枠（slot 未設定）
      </div>
    );
  }

  return (
    <ins
      className={`adsbygoogle${className ? ` ${className}` : ''}`}
      style={{ display: 'block' }}
      data-ad-client={AD_CLIENT}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive ? 'true' : 'false'}
    />
  );
}
