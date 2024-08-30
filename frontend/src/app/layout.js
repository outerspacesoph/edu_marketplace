import { Teko } from "next/font/google";
import "./globals.css";
import { WalletContextProvider } from "@/context/wallet";
import React from "react";
import OCConnectWrapper from "./components/OCConnectWrapper";

const teko = Teko({ subsets: ["latin"] });

export const metadata = {
  title: "EDUVERSE",
  description: "Where Education Meets Blockchain Innovation",
};

export default function RootLayout({ children }) {
  const opts = {
    redirectUri: "http://localhost:3000/redirect", // Adjust this URL
  };

  return (
    <html lang="en">
      <WalletContextProvider>
        <body className={teko.className}>
          <OCConnectWrapper opts={opts} sandboxMode={true}>
            {children}
          </OCConnectWrapper>
        </body>
      </WalletContextProvider>
    </html>
  );
}
