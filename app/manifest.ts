import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Report Manager",
    short_name: "Reports",
    description:
      "Enterprise employee productivity and daily reporting platform.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "any",
    background_color: "#F8FAFC",
    theme_color: "#2563EB",
    icons: [
      {
        src: "/brand-logo.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/appstore-images/android/launchericon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/appstore-images/android/launchericon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/appstore-images/android/launchericon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/appstore-images/android/launchericon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/appstore-images/ios/180.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
    ],
    screenshots: [
      {
        src: "/appstore-images/windows/SplashScreen.scale-200.png",
        sizes: "1240x600",
        type: "image/png",
        form_factor: "wide",
      },
    ],
  };
}
