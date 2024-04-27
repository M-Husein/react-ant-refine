import { useEffect } from 'react';

export const SplashScreen: React.FC = () => {
  useEffect(() => {
    const loader = document.getElementById('_splashScreen');
    // console.log('loader: ', loader);
    // Show loading
    loader?.classList.remove('hidden');
    
    return () => { // Hide loading
      loader?.classList.add('hidden');
    }
  }, []);

  return null;
}
