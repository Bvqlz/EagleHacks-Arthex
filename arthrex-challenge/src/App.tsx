import { ModeProvider } from './context/ModeContext';
import Layout from './components/layout/Layout';
import WelcomeModal from './components/ui/WelcomeModal';

export default function App() {
  return (
    <ModeProvider>
      <Layout />
      <WelcomeModal />
    </ModeProvider>
  );
}
