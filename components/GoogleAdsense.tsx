'use client';

import { useEffect } from 'react';

const AD_CLIENT = 'ca-pub-9891812277341685';
const SRC = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${AD_CLIENT}`;

/** AdSense スクリプトローダー（layout.tsx から呼ぶ） */
export default function GoogleAdsense() {
  useEffect(() => {
    if (document.querySelector(`script[src="${SRC}"]`)) return;
    const script = document.createElement('script');
    script.src = SRC;
    script.async = true;
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);
  }, []);

  return null;
}
