import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';


const walletAddress = [
  '0x015329bfd20ea6bc042e7fc63dc92d1ce890ced3',
  '0x219442a97e68e5207fbd3ca97bef40b7685bd600',
  '0xaa2ba3a9ced6fb7506edd895bdb7281a56c220bf',
  '0xd395a4c3a70eace52dac434f2de2bd1f33d1c898',
  '0x7eebd77d7fdf66b37c6ff8c8d40d994a2bab502d',
  '0x30abec085ccbb6c1e4c1850d9ac9298ef51257c2',
  '0xf9c83c42a5f47838c5c9eff333f9c1f5be16ce0a',
  '0x7873500139a4fbdf924562f54db4310164a0f89d',
  '0xc574ba509deb6a66fd08870631d70e2628a468da',
  '0xd81f5bfa1a0d0de12370b7c0208f86f0dfa931d0'
]

const CreaTessera = () => {

  const handleClick = () => {
    const indirizzo = walletAddress[Math.floor(Math.random() * walletAddress.length)];
    alert(`Questo è il tuo codice tessera: ${indirizzo}`);
  }
  
  return (
    <Card>
      <CardMedia sx={{ height: '9.375rem' }} image='/images/cards/watch-on-hand.jpg' />
      <CardContent sx={{ padding: theme => `${theme.spacing(3, 5.25, 4)} !important` }}>
        <Typography variant='h6' sx={{ marginBottom: 2 }}>
          Crea Nuova Card
        </Typography>
        <Typography sx={{ marginBottom: 2 }}>Nuovo Cliente!!</Typography>
        <Typography variant='body2'>
          Crea una nuova tessera fedeltà per un utente.
        </Typography>
      </CardContent>
      <Button variant='contained' sx={{ py: 2.5, width: '100%', borderTopLeftRadius: 0, borderTopRightRadius: 0 }} onClick={handleClick} >
        Crea Tessera
      </Button>
    </Card>
  )
}

export default CreaTessera;
