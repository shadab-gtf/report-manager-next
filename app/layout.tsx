import type { Metadata, Viewport } from "next";
import { Inter, Give_You_Glory } from "next/font/google";
import { AppProviders } from "@/components/providers/app-providers";
import { PwaRegistry } from "@/components/ui/pwa-registry";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const giveYouGlory = Give_You_Glory({ subsets: ["latin"], weight: "400", variable: "--font-give-you-glory" });

export const metadata: Metadata = {
  metadataBase: new URL("https://report-manager.local"),
  title: {
    default: "Report Manager",
    template: "%s | Report Manager",
  },
  description:
    "Enterprise employee productivity and daily reporting platform.",
  applicationName: "Report Manager",
  appleWebApp: {
    capable: true,
    title: "Report Manager",
    statusBarStyle: "default",
    startupImage: [
      {
        url: "/appstore-images/windows/SplashScreen.scale-200.png",
        media: "(orientation: landscape)",
      },
    ],
  },
  icons: {
    icon: [
      { url: "/brand-logo.svg", type: "image/svg+xml" },
      {
        url: "/appstore-images/android/launchericon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/appstore-images/android/launchericon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/appstore-images/ios/180.png",
        sizes: "180x180",
        type: "image/png",
      },
      {
        url: "/appstore-images/ios/167.png",
        sizes: "167x167",
        type: "image/png",
      },
      {
        url: "/appstore-images/ios/152.png",
        sizes: "152x152",
        type: "image/png",
      },
    ],
    shortcut: [{ url: "/brand-logo.svg", type: "image/svg+xml" }],
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#2563EB",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full ${inter.className} ${inter.variable} ${giveYouGlory.variable}`} suppressHydrationWarning>
      <body className="min-h-full">
        <AppProviders>
          {children}
          <PwaRegistry />
        </AppProviders>
      </body>
    </html>
  );
}
