import { useState, useEffect } from "react";
import Web3 from "web3";
import NFT_ABI from "./ERC721abi.json";
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { styled, useTheme } from '@mui/material/styles'


const INFURA_ENDPOINT =
  "https://goerli.infura.io/v3/39e808bc435f475c92682224863598a5"; // sostituisci con il tuo ID progetto Infura
const NFT_CONTRACT_ADDRESS = "0x5Ec4c3560E110cE766f327C792522D619e396BAe";
const NFT_TOKEN_ID = "1";

const NFTViewer = () => {
  const [nftMetadata, setNftMetadata] = useState(null);

  useEffect(() => {
    async function fetchNftMetadata() {
      const web3 = new Web3(INFURA_ENDPOINT);
      const nftContract = new web3.eth.Contract(NFT_ABI, NFT_CONTRACT_ADDRESS);
      const metadataURI = await nftContract.methods
        .tokenURI(NFT_TOKEN_ID)
        .call();
      const cleanUri = metadataURI.replace("ipfs://", "https://ipfs.io/ipfs/");
      const metadataResponse = await fetch(cleanUri);
      const metadata = await metadataResponse.json();
      const imageUrl = metadata.image.replace(
        "ipfs://",
        "https://ipfs.io/ipfs/"
      );
      metadata.image = imageUrl;
      setNftMetadata(metadata);
    }
    fetchNftMetadata();
  }, []);

  return (

<Card sx={{ position: 'relative' }}>
      <CardContent>  
      { nftMetadata && (  
        <div>
            <h1>{nftMetadata.name}</h1>
            <p>{nftMetadata.description}</p>
            <h2>Descrizione Evento:</h2>
            <ul>
  {Object.keys(nftMetadata.attributes).map((key) => (
    <li key={key}>
      <span>{nftMetadata.attributes[key].trait_type}: </span>
      {nftMetadata.attributes[key].value}
    </li>
  ))}
</ul>
        </div>
        
      )}
        </CardContent>
        </Card>
        

  );
};

export default NFTViewer;
