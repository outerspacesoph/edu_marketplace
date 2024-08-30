"use client";
import { WalletContext } from "@/context/wallet";
import { useParams, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import MarketplaceJson from "../../marketplace.json";
import { ethers } from "ethers";
import axios from "axios";
import GetIpfsUrlFromPinata from "@/app/utils";
import Image from "next/image";
import styles from "./course.module.css";
import Header from "@/app/components/header/Header";

export default function CoursePage() {
  const params = useParams();
  const tokenId = params.tokenId;
  const [item, setItem] = useState();
  const [msg, setmsg] = useState();
  const [btnContent, setBtnContent] = useState("Buy Course");
  const { isConnected, userAddress, signer } = useContext(WalletContext);
  const router = useRouter();

  async function getNFTData() {
    if (!signer) return;
    let contract = new ethers.Contract(
      MarketplaceJson.address,
      MarketplaceJson.abi,
      signer
    );
    let tokenURI = await contract.tokenURI(tokenId);
    console.log("Token URI:", tokenURI);
    const listedToken = await contract.getListingById(tokenId);
    tokenURI = GetIpfsUrlFromPinata(tokenURI);
    console.log("Converted IPFS URL:", tokenURI);
    const meta = (await axios.get(tokenURI)).data;
    console.log("Metadata:", meta);
    const item = {
      price: meta.price,
      tokenId,
      creator: listedToken.creator,
      currentOwner: listedToken.currentOwner,
      image: meta.image,
      name: meta.name,
      description: meta.description,
      courseContent: meta.courseContent,
    };
    console.log("Item data:", item);
    return item;
  }

  useEffect(() => {
    async function fetchData() {
      if (!signer) return;
      try {
        const itemTemp = await getNFTData();
        setItem(itemTemp);
      } catch (error) {
        console.error("Error fetching Course items:", error);
        setItem(null);
      }
    }

    fetchData();
  }, [isConnected]);

  async function buyCourse() {
    try {
      if (!signer) return;
      let contract = new ethers.Contract(
        MarketplaceJson.address,
        MarketplaceJson.abi,
        signer
      );
      const salePrice = ethers.parseUnits(item.price, "ether").toString();
      setBtnContent("Processing...");
      setmsg("Buying the Course...");
      let transaction = await contract.purchaseNFT(tokenId, {
        value: salePrice,
      });
      await transaction.wait();
      alert("You successfully bought the Course!");
      setmsg("");
      setBtnContent("Buy Course");
      router.push("/");
    } catch (e) {
      console.log("Buying Error: ", e);
    }
  }

  function isVideoFile(url) {
    const videoExtensions = ["mp4", "webm", "ogg"];
    const extension = url.split(".").pop().toLowerCase();
    console.log("File Extension Detected:", extension);
    return videoExtensions.includes(extension);
  }

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.innerContainer}>
        {isConnected ? (
          <div className={styles.content}>
            <div className={styles.nftGrid}>
              <Image
                src={item?.image}
                alt={item?.name}
                width={800}
                height={520}
              />
              <div className={styles.details}>
                <div className={styles.stats}>
                  <div className={styles.stat}>
                    <span className={styles.label}>Course Name:</span>
                    <span className={styles.value}>{item?.name}</span>
                  </div>
                  <div className={styles.stat}>
                    <span className={styles.label}>Description:</span>
                    <span className={styles.value}>{item?.description}</span>
                  </div>
                  <div className={styles.stat}>
                    <span className={styles.label}>Price:</span>
                    <span className={styles.value}>{item?.price} EDU</span>
                  </div>
                  <div className={styles.stat}>
                    <span className={styles.label}>Seller:</span>
                    <span className={styles.value}>{item?.creator}</span>
                  </div>
                </div>
                <div className={styles.ctaBtn}>
                  <div className={styles.msg}>{msg}</div>
                  {userAddress.toLowerCase() === item?.creator.toLowerCase() ? (
                    <div className={styles.msgAlert}>*You own this course*</div>
                  ) : (
                    <button onClick={buyCourse} className={styles.Btn}>
                      {btnContent === "Processing..." && (
                        <span className={styles.spinner} />
                      )}
                      {btnContent}
                    </button>
                  )}
                </div>
              </div>
            </div>
            {userAddress.toLowerCase() === item?.currentOwner.toLowerCase() && (
              <div className={styles.courseContent}>
                {isVideoFile(GetIpfsUrlFromPinata(item?.courseContent)) ? (
                  <video
                    controls
                    width="100%"
                    src={GetIpfsUrlFromPinata(item?.courseContent)}
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  // Use an iframe to display the URL as an embedded webpage
                  <iframe
                    src={GetIpfsUrlFromPinata(item?.courseContent)}
                    width="100%"
                    height="500"
                    allowFullScreen
                  >
                    Your browser does not support iframes.
                  </iframe>
                )}
                //////////////////////////////////////////////////////////////////////////////////////////
                <a
                  href={GetIpfsUrlFromPinata(item?.courseContent)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.download}
                >
                  Click to Download Course Content
                </a>
                ////////////////////////////////////////////////////////////////////////////////////
              </div>
            )}
          </div>
        ) : (
          <div className={styles.notConnected}>
            Connect Your Wallet to Continue...
          </div>
        )}
      </div>
    </div>
  );
}
