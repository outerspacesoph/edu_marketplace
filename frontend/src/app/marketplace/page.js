"use client";
import { WalletContext } from "@/context/wallet";
import { useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import MarketplaceJson from "../marketplace.json";
import styles from "./marketplace.module.css";
import Header from "../components/header/Header";
import axios from "axios";
import CourseCard from "../components/card/CourseCard";
import { useOCAuth } from "@opencampus/ocid-connect-js";
import Login from "../components/login/page";

export default function Marketplace() {
  const [items, setItems] = useState();
  const { isConnected, signer } = useContext(WalletContext);
  const { authState } = useOCAuth();

  async function getNFTitems() {
    const itemsArray = [];
    if (!signer) return;
    let contract = new ethers.Contract(
      MarketplaceJson.address,
      MarketplaceJson.abi,
      signer
    );

    let transaction = await contract.listAllNFTs();

    for (const i of transaction) {
      const tokenId = parseInt(i.tokenId);
      const tokenURI = await contract.tokenURI(tokenId);
      const meta = (await axios.get(tokenURI)).data;
      const price = ethers.formatEther(i.price);

      const item = {
        price,
        tokenId,
        creator: i.creator,
        currentOwner: i.currentOwner,
        image: meta.image,
        name: meta.name,
        description: meta.description,
      };

      itemsArray.push(item);
    }
    return itemsArray;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const itemsArray = await getNFTitems();
        setItems(itemsArray);
      } catch (error) {
        console.error("Error fetching NFT items:", error);
      }
    };

    fetchData();
  }, [isConnected]);

  return (
    <div>
      {!authState || !authState.isAuthenticated || !isConnected ? (
        <Login />
      ) : (
        <div className={styles.container}>
          <Header />
          <div className={styles.innerContainer}>
            <div className={styles.content}>
              <div className={styles.nftSection}>
                <h2 className={styles.heading}> Browse listings</h2>
                {items?.length > 0 ? (
                  <div className={styles.nftGrid}>
                    {items?.map((value, index) => (
                      <CourseCard item={value} key={index} />
                    ))}
                  </div>
                ) : (
                  <div className={styles.noNFT}>No Courses Listed...</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
