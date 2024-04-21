import "~/styles/globals.css";
import { Toaster, toast } from "sonner";

import { Inter } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import Navbar from "~/components/navigation";
import { SessionProvider } from "next-auth/react";
import { NextAuthSessionProviders } from "~/components/provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "CU-Activities",
  description: "Chula Activities In A Singularity",
  icons: [{ rel: "icon", url: "/favicon.ico?v=2" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NextAuthSessionProviders>
      <html lang="en">
        <body className={`font-sans ${inter.variable}`}>
          <Navbar />
          <TRPCReactProvider>{children}</TRPCReactProvider>
          {/* it's for any notification */}
          <Toaster />
          {/* Footer - Optional */}
          {/* <footer className="bg-secondary text-primary h-12 w-full p-4 text-center">
            &copy; 2024 CU Act
          </footer> */}
        </body>
      </html>
    </NextAuthSessionProviders>
  );
}
