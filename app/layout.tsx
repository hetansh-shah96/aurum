import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { CartDrawer } from "@/components/CartDrawer";
import { DisclaimerModal } from "@/components/DisclaimerModal";
import { BottomNav } from "@/components/BottomNav";
import { CoinsToastProvider } from "@/components/CoinsToast";
import { DailyClaimModal } from "@/components/DailyClaimModal";
import { LiveActivityFeed } from "@/components/LiveActivityFeed";
import { RankUpModal } from "@/components/RankUpModal";
import { CursorTrail } from "@/components/CursorTrail";

export const metadata: Metadata = {
  title: "AURUM — Luxury Without Limits",
  description: "Browse the world's most exclusive luxury goods. Add to cart. Indulge freely. Nothing gets delivered.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#080808] text-[#F5F0E8] antialiased">
        <CoinsToastProvider>
          <DisclaimerModal />
          <DailyClaimModal />
          <Navbar />
          <CartDrawer />
          <main className="pb-16 md:pb-0">{children}</main>
          <BottomNav />
          <LiveActivityFeed />
          <RankUpModal />
          <CursorTrail />
        </CoinsToastProvider>
      </body>
    </html>
  );
}
