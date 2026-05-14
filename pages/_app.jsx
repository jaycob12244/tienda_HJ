import { AppProvider } from '../context/AppContext';
import '../styles/globals.css';
import DotField from '../components/ui/DotField';

export default function App({ Component, pageProps }) {
  return (
    <AppProvider>
      <DotField spacing={28} hoverRadius={180} maxLength={22} />
      <Component {...pageProps} />
    </AppProvider>
  );
}
