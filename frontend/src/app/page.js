"use client";
import { useContext } from "react";
import Image from "next/image";
import Header from "./components/header/Header";
import styles from "./page.module.css";
import Link from "next/link";
import { useOCAuth } from "@opencampus/ocid-connect-js";
import Login from "./components/login/page";
import { WalletContext } from "@/context/wallet";

export default function HomePage() {
  const { authState } = useOCAuth();
  const { isConnected } = useContext(WalletContext);
  return (
    <div>
      {!authState || !authState.isAuthenticated || !isConnected ? (
        <Login />
      ) : (
        <div className={styles.container}>
          <Header />

          <div className={styles.hero}>
            <div>
              <h1 className={styles.heading}>EDUVERSE</h1>
              {/* <div>
                <h4>User Info</h4>
                <pre>{JSON.stringify(ocAuth.getAuthInfo(), null, 2)}</pre>
              </div> */}
              <h2 className={styles.heading2}>
                Empowering Decentralized Knowledge Sharing, One Collectible at a
                Time.
              </h2>
              <p className={styles.description}>
                EDUVERSE is a decentralized platform where users can share,
                sell, and mint both educational courses and unique content as
                collectibles. Harness the power of blockchain to engage in
                transparent, secure, and innovative exchanges, transforming the
                way knowledge and creativity are shared and collected in the
                digital age.
              </p>
              <div className={styles.btns}>
                <Link
                  href="/marketplace"
                  className={`${styles.btn} ${styles.buyBtn}`}
                >
                  Browse
                </Link>
                <Link href="/sell" className={styles.btn}>
                  List Your Content
                </Link>
              </div>
            </div>
            <Image src="/home.png" alt="home" width={700} height={700} />
          </div>
          <footer className={styles.footer}>
            <div className={styles.footerContent}>
              <div className={styles.footerLinks}>
                <Link href="/about">About Us</Link>
                <Link href="/contact">Contact</Link>
                <Link href="/privacy">Privacy Policy</Link>
              </div>
              <p className={styles.footerText}>
                © 2024 EduVerse. All Rights Reserved.
              </p>
            </div>
          </footer>
        </div>
      )}
    </div>
  );
}
