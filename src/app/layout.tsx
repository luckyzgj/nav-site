import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { getSiteSettings } from '@/utils/settings';

const inter = Inter({ subsets: ["latin"] });

// 使用动态元数据
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  
  // 强制使用数据库中的设置，不使用默认值
  return {
    title: {
      absolute: settings.siteName,
    },
    description: settings.siteDescription,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
