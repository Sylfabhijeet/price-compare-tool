import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "PriceCompare - Find the Best Deals Across E-commerce Platforms",
    description: "Compare prices, offers, and reviews from Amazon, Flipkart, Myntra, and more. Find the best deals with credit and debit card offers.",
    keywords: "price comparison, e-commerce, deals, offers, discounts, Amazon, Flipkart, Myntra",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
