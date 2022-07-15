import React, { useEffect, useState, useRef } from "react";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";
import { create } from "ipfs-http-client";
import Slider from '@mui/material/Slider';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export const StyledButton = styled.button`
  padding: 8px;
`;

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft,setClaimingNft]=useState(false);
  const [feedback,setFeedback]=useState("Maybe its your lucky dayn ")

  const claimNfts=(_amount)=>{
    setClaimingNft(true)
    blockchain.smartContract.methods.mint(_amount).send({
      from:blockchain.account,
      value:blockchain.web3.utils.toWei(buyingCost.toString(),"ether")
    }).once("error",(err)=>{
      console.log(err)
      setFeedback("ERROR")
        setClaimingNft(false)
    }).then((receipt)=>{
        console.log(receipt)
        setClaimingNft(false)
        setFeedback("success")
        // isWhitelistO?"0":(0.000003*_amount).toString()
    })
  }

  const[mintAmount,setMintAmount]=useState(0);
  const[totalSupply,setTotalSupply]=useState(0);
  const[totalUsedSupply,setTotalUsedSupply]=useState(0)
  const[cost,setCost]=useState(0)
  const [accountConnected,setAccountConnected]=useState(0)
  const[walletTockens,setWalletTockens]=useState(0);
  const[maxMintAmount,setMaxMintAmount]=useState(3)
  const[isWhitelistO,setIsWhitelistO]=useState(1)
  const[isWhiteListOn,setIsWhiteListOn]=useState(false)
  const[buyingCost,setBuyingCost]=useState(0);
  const[walletIsWhiteListO,setWalletIsWhiteListO]=useState(false)
  const[walletIsWhiteListL,setWalletIsWhiteListL]=useState(false)

  const[nftPerAddressLimitFreeO,setNftPerAddressLimitFreeO]=useState(0)
  const[nftPerAddressLimitFreeL,setNftPerAddressLimitFreeL]=useState(0);
  const[nftPerAddressLimitO,setNftPerAddressLimitO]=useState(0);
  const[ nftPerAddressLimitL,setNftPerAddressLimitL]=useState(0);
  const[nftPerAddressLimitFreePublic,setNftPerAddressLimitFreePublic]=useState(0);
  const[nftPerAddressLimitPublic,setNftPerAddressLimitPublic]=useState(0);

  useEffect(() => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
      setAccountConnected(1)
      getTotalUsedSupplyFromContract()
      getMaxSupplyFromContract()
      getNftInWalletOfOwnerFromContract()
      getMaxMintAmountFromContract()
      getWhiteListStatus()
      getCostFromContract();
      getIfWalletInListO();
      getIfWalletInListL();
      setLimitsOfAccounts()
      console.log(blockchain.smartContract.methods)
    }
  }, [blockchain.smartContract, dispatch]);


  const getMaxSupplyFromContract=async ()=>{
    await blockchain.smartContract.methods.maxSupply().call(function (err, res) {
      if (err) {
        console.log("An error occured", err)
        return
      }
      console.log("The balance is: ", res)
      setTotalSupply(res)
    })
  }

  const getNftInWalletOfOwnerFromContract=async()=>{
    await blockchain.smartContract.methods.walletOfOwner(blockchain.account).call(function (err, res) {
      if (err) {
        console.log("An error occured", err)
        return
      }
      console.log("The remaining is: ", res)
      setWalletTockens(res.length)
    })
  }

  const getMaxMintAmountFromContract=async ()=>{
    await blockchain.smartContract.methods.maxMintAmount().call(function (err, res) {
      if (err) {
        console.log("An error occured", err)
        return
      }
      console.log("The max amount is: ", res)
      setMaxMintAmount(res);
    })
  }

  const getTotalUsedSupplyFromContract=async()=>{
    

    await blockchain.smartContract.methods.totalSupply().call(function (err, res) {
      if (err) {
        console.log("An error occured", err)
        return
      }
      console.log("The remaining is: ", res)
      setTotalUsedSupply(res)
    })

    
  }

  const getWhiteListStatus=async()=>{
    await blockchain.smartContract.methods.onlyWhiteListed().call(function (err, res) {
      if (err) {
        console.log("An error occured", err)
        return
      }
      console.log("The whitelist is: ", res)
      setIsWhiteListOn(res)
    })
  }
  const getCostFromContract=async()=>{
    await blockchain.smartContract.methods.cost().call(function (err, res) {
      if (err) {
        console.log("An error occured", err)
        return
      }
      console.log("The cost is: ", res)
      setCost(parseFloat(res/1000000000000000000))
    })
  }
  const getIfWalletInListO=async()=>{
    await blockchain.smartContract.methods.isWhiteListedO(blockchain.account).call(function (err, res) {
      if (err) {
        console.log("An error occured", err)
        return
      }
      console.log("The WALLET IS o LIST is: ", res)
      setWalletIsWhiteListO(res)
    })
  }
  const getIfWalletInListL=async()=>{
    await blockchain.smartContract.methods.isWhiteListedL(blockchain.account).call(function (err, res) {
      if (err) {
        console.log("An error occured", err)
        return
      }
      console.log("The WALLET IS L LIST is: ", res)
      setWalletIsWhiteListL(res)
    })
  }
  const setLimitsOfAccounts=async()=>{
    await blockchain.smartContract.methods.nftPerAddressLimitFreeO().call(function (err, res) {
      if (err) {
        console.log("An error occured", err)
        return
      }
      console.log("The setNftPerAddressLimitFreeO is: ", res)
      setNftPerAddressLimitFreeO(res)
    })
    await blockchain.smartContract.methods.nftPerAddressLimitFreeL().call(function (err, res) {
      if (err) {
        console.log("An error occured", err)
        return
      }
      console.log("The setNftPerAddressLimitFreeL is: ", res)
      setNftPerAddressLimitFreeL(res)
    })
    await blockchain.smartContract.methods.nftPerAddressLimitO().call(function (err, res) {
      if (err) {
        console.log("An error occured", err)
        return
      }
      console.log("The setNftPerAddressLimitO is: ", res)
      setNftPerAddressLimitO(res)
    })
    await blockchain.smartContract.methods.nftPerAddressLimitL().call(function (err, res) {
      if (err) {
        console.log("An error occured", err)
        return
      }
      console.log("The nftPerAddressLimitL is: ", res)
      setNftPerAddressLimitL(res)
    })
    await blockchain.smartContract.methods.nftPerAddressLimitFreePublic().call(function (err, res) {
      if (err) {
        console.log("An error occured", err)
        return
      }
      console.log("The nftPerAddressLimitFreePublic is: ", res)
      setNftPerAddressLimitFreePublic(res)
    })
    await blockchain.smartContract.methods.nftPerAddressLimitPublic().call(function (err, res) {
      if (err) {
        console.log("An error occured", err)
        return
      }
      console.log("The nftPerAddressLimitPublic is: ", res)
      setNftPerAddressLimitPublic(res)
    })
  }
  // setInterval(async ()=>{
  //   if(accountConnected){
  //     console.log("in interval")
  //     await blockchain.smartContract.methods.totalSupply().call(function (err, res) {
  //       if (err) {
  //         console.log("An error occured", err)
  //         return
  //       }
  //       console.log("The remaining is: ", res)
  //       setRemainingAmount(res)
  //     })
  //   }
  // },1000)

// useEffect( ()=>{
//   if(accountConnected)
//   {
//     getTotalSupplyFromContract()
//   }
 
// },[totalSupply])
  const calculate=async (e)=>{
    let _mintAmount=e.target.value
    if(isWhiteListOn){
      if(walletIsWhiteListO){
          // let freeMintAvailable=nftPerAddressLimitFreeO-walletTockens;
          // if(_mintAmount<=freeMintAvailable){
          // }
          // else{
          // }
      }
      else if(walletIsWhiteListL){

       
        // walletTockens<nftPerAddressLimitL
        let freeMintAvailable=nftPerAddressLimitFreeL-walletTockens;
        if(_mintAmount<=freeMintAvailable){
          setBuyingCost(0)
             
        }
        else{
            let paidMintCheck=_mintAmount-freeMintAvailable;
            setBuyingCost(paidMintCheck*cost);
          }
      }
      else{
        setBuyingCost(_mintAmount*cost);
      }
    }else{
      

      let freeMintAvailable=nftPerAddressLimitFreePublic>walletTockens?nftPerAddressLimitFreePublic-walletTockens:0;
      
      if(_mintAmount<=freeMintAvailable){
          setBuyingCost(0)
      }
      else{
        //  console.log("before paid mint");
          let paidMintCheck=_mintAmount-freeMintAvailable;
          // console.log("paid mint",paidMintCheck);
          setBuyingCost(paidMintCheck*cost);
           
          // console.log("after paid mint");
      }
    }
  }
  return (
    <s.Screen>
      {blockchain.account === "" || blockchain.smartContract === null ? (
        <s.Container flex={1} ai={"center"} jc={"center"}>
          <s.TextTitle>Connect to the Blockchain</s.TextTitle>
          <s.SpacerSmall />
          <StyledButton
            onClick={(e) => {
              e.preventDefault();
              dispatch(connect());
            }}
          >
            CONNECT
          </StyledButton>
          <s.SpacerSmall />
          {blockchain.errorMsg !== "" ? (
            <s.TextDescription>{blockchain.errorMsg}</s.TextDescription>
          ) : null}
        </s.Container>
      ) : (<Grid container sx={{height:"100vh",alignItems:"center",justifyContent:"center"}}>

        <Grid item xs={6} sx={{marginLeft:"50px"}}>
          <Typography sx={{fontSize:"30px"}}>Sale Type: {isWhiteListOn?"Pre Sale":"Public Sale"}</Typography>
          <Typography sx={{fontSize:"30px"}}>Total Supply: {totalSupply}</Typography>
          <Typography sx={{fontSize:"16px"}}>Total Supply used: {totalUsedSupply}</Typography>
          <Typography sx={{fontSize:"16px"}}>Number of NFT in your wallet: {walletTockens}</Typography>
          <Typography sx={{fontSize:"16px"}}>Mint Price: {cost.toString()} ETH</Typography>
          <Typography sx={{fontSize:"16px"}}>Number of NFT to MINT: {mintAmount}</Typography>
        
              <Slider
            aria-label="Temperature"
            defaultValue={0}
            getAriaValueText={""}
            valueLabelDisplay="auto"
            step={1}
            marks
            min={0}
            max={maxMintAmount-walletTockens}
            onChange={(e)=>{
              console.log(e.target.value)
              setMintAmount(e.target.value)
              calculate(e)

            }}
            sx={{width:"100px",marginY:5}}
          />
          <Button variant="contained" sx={{marginY:2}} disabled={(mintAmount>0||(totalUsedSupply<totalSupply))?false:true} onClick={(e) => {
            
              e.preventDefault();
              claimNfts(mintAmount)
        
            }}>Mint ({buyingCost} ETH)</Button>
             {/* <Button variant="contained" sx={{marginY:2}}  onClick={async (e) => {
              e.preventDefault();
              await blockchain.smartContract.methods.walletOfOwner(blockchain.account).call(function (err, res) {
                if (err) {
                  console.log("An error occured", err)
                  return
                }
                console.log("The balance is: ", res)
              })

             
            }}>GET AMOUNT</Button> */}
            {/*ASASAS8*/}
        </Grid>
    
      
        </Grid>
      )}
    </s.Screen>
  );
}

export default App;
