// ** MUI Imports
import { ethers } from 'ethers';
import { JsonRpcProvider } from "@ethersproject/providers";
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { styled, useTheme } from '@mui/material/styles'
import { useState, useEffect } from "react";
import erc20abi from "./ERC20abi.json"


// Styled component for the triangle shaped background image
const TriangleImg = styled('img')({
  right: 0,
  bottom: 0,
  height: 170,
  position: 'absolute'
})

// Styled component for the trophy image
const TrophyImg = styled('img')({
  right: 36,
  bottom: 20,
  height: 98,
  position: 'absolute'
})

const PurpleOvalInput = styled('input')({
  borderRadius: '50px',
  backgroundColor: 'transparent',
  color: '#000000',
  padding: '10px',
  border: '2px solid #6A1B9A',
  outline: 'none',
  marginRight: '10px',
});


const AggiungiPunti = () => {
  // ** Hook
  const theme = useTheme()
  const imageSrc = theme.palette.mode === 'light' ? 'triangle-light.png' : 'triangle-dark.png'

  const [balanceInfo, setBalanceInfo] = useState({
    address: "-",
    balance: "-"
  });

  const goerliProviderUrl =
    "https://goerli.infura.io/v3/39e808bc435f475c92682224863598a5"; // sostituisci con il tuo ID progetto Infura

  const contractAddress = "0xe0bC8029a37d42bb1F8910ae5F0D420f423eF37F";


    //funzione Aggiungi Punti

    const handleMint = async (e) => {
      e.preventDefault();
      const data = new FormData(e.target);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const erc20 = new ethers.Contract(contractAddress, erc20abi, signer);
      await erc20.mint(data.get("receiver"), data.get("amount"));
    };

  return (
    <Card sx={{ position: 'relative' }}>
      <CardContent>
        <Typography variant='h6'>Aggiungi Punti a Cliente! 🥳</Typography>
        <Typography variant='body2' sx={{ letterSpacing: '0.25px' }}>
          Inserisci l'indirizzo:
        </Typography>
        <form onSubmit={handleMint} className="flex">
              <PurpleOvalInput
                placeholder="Indirizzo Cliente"
                type="text"
                name="receiver"               
              />

               <PurpleOvalInput
                placeholder="Quantità di Punti"
                type="text"
                name="amount"
              />

<Typography variant='h5' sx={{ my: 4, color: 'primary.main' }}>
Saldo Corrente :{" "}
            <span className="text-purple-700 font-semibold text-lg">
              {balanceInfo.balance}
            </span>
        </Typography>


        <Button type="submit" size='small' variant='contained'>
          Invia
        </Button>
              </form>
        
        <TriangleImg alt='triangle background' src={`/images/misc/${imageSrc}`} />
        <TrophyImg alt='trophy' src='/images/misc/trophy.png' />
      </CardContent>
    </Card>
  )
}

export default AggiungiPunti
