import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Chatterbox — Where Teams Connect",
    template: "%s | Chatterbox",
  },
  description:
    "Professional team communication with the power of real-time chat. Servers, channels, voice, video, and more — built for teams that mean business.",
  metadataBase: new URL("https://georgesprojects.com"),
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Chatterbox — Where Teams Connect",
    description:
      "Professional team communication with the power of real-time chat.",
    url: "https://georgesprojects.com",
    siteName: "Chatterbox",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chatterbox — Where Teams Connect",
    description:
      "Professional team communication with the power of real-time chat.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <Toaster richColors position="bottom-right" theme="light" />
        </ThemeProvider>
      </body>
    </html>
  );
}
