import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppStateProvider } from "@/context/app-state-context";
import { ToastProvider } from "@/context/toast-context";
import { WalletProvider } from '@/components/solana/WalletProvider';
import "@/ai/genkit"; // Initialize Genkit
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Aetherium Nexus",
    description: "Operating System for Emergence",
    manifest: "/manifest.json",
    themeColor: "#0a0f14",
    viewport: "width=device-width, initial-scale=1, maximum-scale=1",
    appleWebApp: {
        capable: true,
        statusBarStyle: "black-translucent",
        title: "Aetherium Nexus",
    },
    other: {
        "mobile-web-app-capable": "yes",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <Script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js" strategy="afterInteractive" />
                <WalletProvider>
                    <AppStateProvider>
                        <ToastProvider>
                            {children}
                        </ToastProvider>
                    </AppStateProvider>
                </WalletProvider>
            </body>
        </html>
    );
}
