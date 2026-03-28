import { ModeProvider } from './context/ModeContext';
import Layout from './components/layout/Layout';

export default function App() {
  return (
    <ModeProvider>
      <Layout />
    </ModeProvider>
  );
}
