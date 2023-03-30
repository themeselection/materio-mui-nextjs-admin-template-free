// ** Icon imports
import Login from 'mdi-material-ui/Login'
import Table from 'mdi-material-ui/Table'
import CubeOutline from 'mdi-material-ui/CubeOutline'
import HomeOutline from 'mdi-material-ui/HomeOutline'
import FormatLetterCase from 'mdi-material-ui/FormatLetterCase'
import AccountCogOutline from 'mdi-material-ui/AccountCogOutline'
import CreditCardOutline from 'mdi-material-ui/CreditCardOutline'
import AccountPlusOutline from 'mdi-material-ui/AccountPlusOutline'
import AlertCircleOutline from 'mdi-material-ui/AlertCircleOutline'
import GoogleCirclesExtended from 'mdi-material-ui/GoogleCirclesExtended'
import Abacus from 'mdi-material-ui/Abacus'
import Cards from 'mdi-material-ui/Cards'
import Robot from 'mdi-material-ui/RobotHappyOutline'

const navigation = () => {
  return [
    {
      title: 'Dashboard',
      icon: HomeOutline,
      path: '/'
    },
    {
      title: 'Loyalty',
      icon: Abacus,
      path: '/Loyalty'
    },
    {
      title: 'NFT Management',
      icon: Cards,
      path: '/NFT'
    },
    {
      title: 'AI Chatbot',
      icon: Robot,
      path: '/AI'
    },
    {
      title: 'Impostazioni Account',
      icon: AccountCogOutline,
      path: '/account-settings'
    },
    {
      sectionTitle: 'Pages'
    },
    {
      title: 'Login',
      icon: Login,
      path: '/pages/login',
      openInNewTab: true
    },
    {
      title: 'Registrati',
      icon: AccountPlusOutline,
      path: '/pages/register',
      openInNewTab: true
    },
    {
      title: 'Error',
      icon: AlertCircleOutline,
      path: '/pages/error',
      openInNewTab: true
    },
    {
      sectionTitle: 'Feature Future'
    },
    {
      title: 'NFT Management',
      icon: FormatLetterCase,
      path: '/'
    },
    {
      title: 'Rewards',
      path: '/',
      icon: GoogleCirclesExtended
    },
    {
      title: 'On Chain Viewer',
      icon: CreditCardOutline,
      path: '/'
    },
    {
      title: 'ENS - Wallet con nome utente',
      icon: Table,
      path: '/'
    },
    {
      icon: CubeOutline,
      title: 'Direct Support',
      path: '/'
    }
  ]
}

export default navigation
