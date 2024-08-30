"use client";
import React from "react";
import styles from "./Login.module.css";
import { useOCAuth } from "@opencampus/ocid-connect-js";
import LoginButton from "./LoginButton";
import { useContext, useEffect } from "react";
import { WalletContext } from "@/context/wallet";
import { BrowserProvider } from "ethers";

export default function Login() {
  const {
    isConnected,
    setIsConnected,
    userAddress,
    setUserAddress,
    signer,
    setSigner,
  } = useContext(WalletContext);

  const { authState, ocAuth } = useOCAuth();

  const connectWallet = async () => {
    if (!window.ethereum) {
      throw new Error("Please install Metamask");
    }

    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      setSigner(signer);
      const accounts = await provider.send("eth_requestAccounts", []);
      setIsConnected(true);
      setUserAddress(accounts[0]);
      const network = await provider.getNetwork();
      const chainID = network.chainId;
      const opencampusNetworkId = "656476";

      if (chainID.toString() !== opencampusNetworkId) {
        alert("Please switch to the Open Campus network");
        return;
      }
    } catch (error) {
      console.error("connection error: ", error);
    }
  };

  useEffect(() => {
    console.log(authState);
  }, [authState]);
  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginContent}>
        <img
          className="logo"
          src="https://i.imgur.com/htpTI68.png"
          alt="EDUVERSE"
          width={300}
          height={300}
        />
        <h1 className="title">EDUVERSE🌎</h1>
        <h2 className="subtitle">Connect your wallet to get started!</h2>
        <div className={styles.loginContent}>
          {authState.isAuthenticated ? (
            <button>
              You are logged in as {ocAuth.getAuthInfo().edu_username}
            </button>
          ) : (
            <LoginButton />
          )}
        </div>
        <button
          className={`${styles.ctaBtn} ${
            isConnected ? styles.activebtn : styles.inactivebtn
          }`}
          onClick={connectWallet}
        >
          {isConnected ? <>{userAddress?.slice(0, 8)}...</> : "Connect wallet"}
        </button>
      </div>
    </div>
  );
}
