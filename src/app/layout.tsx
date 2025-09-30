import "./globals.css";
import Wrapper from "./Wrapper";
import type { Metadata } from "next";
import { Roboto, Roboto_Mono } from "next/font/google";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "College Reviews dashboard",
  description: "created by shoebuddin ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${roboto.variable} ${robotoMono.variable} antialiased bg-background text-foreground`}
      >
        <Wrapper>{children}</Wrapper>
      </body>
    </html>
  );
}
