import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const SecurityContext = createContext();

export const SecurityProvider = ({ children }) => {
  const [data, setData] = useState({ findings: [], inventory: null, dashboard: null });
  const [loading, setLoading] = useState(true);

  const refreshData = async () => {
    try {
      const [f, i, d] = await Promise.all([
        axios.get('http://localhost:5000/findings?status=OPEN'),
        axios.get('http://localhost:5000/inventory'),
        axios.get('http://localhost:5000/dashboard')
      ]);
      setData({ findings: f.data, inventory: i.data, dashboard: d.data });
      setLoading(false);
    } catch (err) {
      console.error("Data Sync Error", err);
    }
  };

  useEffect(() => { refreshData(); }, []);

  return (
    <SecurityContext.Provider value={{ ...data, loading, refreshData }}>
      {children}
    </SecurityContext.Provider>
  );
};

export const useSecurity = () => useContext(SecurityContext);