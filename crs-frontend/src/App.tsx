import { ThemeProvider } from '@/context/ThemeContext';
import { MainLayout } from '@/layouts/MainLayout';
import { ConnectionTestPage } from '@/pages/ConnectionTestPage';

function App() {
  return (
    <ThemeProvider>
      <MainLayout>
        <ConnectionTestPage />
      </MainLayout>
    </ThemeProvider>
  );
}

export default App;
