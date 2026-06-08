import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SecurityProvider } from './context/SecurityContext';

import Sidebar from './components/Sidebar';

import Dashboard from './pages/Dashboard';
import EC2Page from './pages/EC2Page';
import S3Page from './pages/S3Page';
import IAMPage from './pages/IAMPage';

function App() {
  return (
    <SecurityProvider>
      <BrowserRouter>
        <div className="flex bg-[#070708] min-h-screen text-slate-300 relative">
          
          {/* Sidebar (fixed width) */}
          <Sidebar />

          {/* Persistent Floating AI */}

          {/* Main Content */}
          <main className="flex-1 ml-[100px] p-8 overflow-x-hidden">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/ec2" element={<EC2Page />} />
              <Route path="/s3" element={<S3Page />} />
              <Route path="/iam" element={<IAMPage />} />
            </Routes>
          </main>

        </div>
      </BrowserRouter>
    </SecurityProvider>
  );
}

export default App;
