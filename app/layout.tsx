import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "ExclusiveLink - Share Exclusive Content with Your Followers",
    description: "Platform for content creators to share exclusive materials with followers through subscription verification and secret codes.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-BR" className="dark">
            <body className={inter.className}>{children}</body>
        </html>
    );
}
