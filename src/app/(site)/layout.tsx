import './globals.css';
import { getSiteSettings } from '@/utils/settings';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar siteName={settings.siteName || '123导航'} />
      <main className="flex-grow">{children}</main>
      <Footer
        siteName={settings.siteName || '123导航'}
        siteDescription={settings.siteDescription}
        statisticsCode={settings.statisticsCode}
      />
    </div>
  );
}
