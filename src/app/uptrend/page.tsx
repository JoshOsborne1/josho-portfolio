// src/app/uptrend/page.tsx
// Uptrend landing page — serves the HTML from /public/uptrend.html via iframe

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Uptrend — Website Uptime Monitoring for UK Businesses',
  description: 'Know the moment your website goes down. Uptrend monitors your site 24/7 and alerts you instantly. From £29/month.',
};

export default function UptrendPage() {
  return (
    <iframe
      src="/uptrend.html"
      style={{ width: '100%', height: '100vh', border: 'none', display: 'block' }}
      title="Uptrend — Website Uptime Monitoring"
    />
  );
}
