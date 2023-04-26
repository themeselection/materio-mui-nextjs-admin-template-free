import { useEffect } from 'react';
import { useRouter } from 'next/router';

function Auth({ children }) {
  const router = useRouter();

  useEffect(() => {
    // Controlla se l'applicazione è in esecuzione nel browser prima di utilizzare sessionStorage
    if (typeof window !== 'undefined') {
      const uid = sessionStorage.getItem('uid');
      if (!uid) {
        router.push('/pages/login');
      }
    }
  }, [router]);

  // Controlla se l'applicazione è in esecuzione nel browser prima di utilizzare sessionStorage
  const uid = typeof window !== 'undefined' ? sessionStorage.getItem('uid') : null;

  // Restituisci il contenuto del componente figlio solo se l'utente è autenticato
  return uid ? children : null;
}

export default Auth;