import React, { useEffect } from 'react';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

interface AdSenseBannerProps {
  className?: string;
  slotId?: string; // Optional: If you want to pass specific ad slots
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal' | 'vertical';
}

export const AdSenseBanner: React.FC<AdSenseBannerProps> = ({ 
  className = "", 
  slotId = "1234567890", // Replace with a default Ad Slot ID from your AdSense dashboard
  format = "auto" 
}) => {
  
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense error:", e);
    }
  }, []);

  return (
    <div className={`w-full flex justify-center my-8 overflow-hidden ${className}`}>
        {/* Responsive Display Ad */}
        <ins className="adsbygoogle"
            style={{ display: 'block', minWidth: '300px', minHeight: '90px' }}
            data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // REPLACE WITH YOUR PUBLISHER ID
            data-ad-slot={slotId}
            data-ad-format={format}
            data-full-width-responsive="true"></ins>
    </div>
  );
};