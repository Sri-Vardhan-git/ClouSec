import { useEffect, useState } from 'react';
import axios from 'axios';
import FindingCard from '../components/FindingCard';
import { motion, AnimatePresence } from 'framer-motion';

export default function ServicePage({ service }) {
  const [findings, setFindings] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/findings?status=OPEN')
      .then(res => setFindings(res.data.filter(f => f.service === service)))
      .catch(err => console.error(err));
  }, [service]);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-10">
        <h2 className="text-5xl font-black text-white italic uppercase tracking-tighter">
          {service} <span className="text-indigo-500 text-3xl not-italic opacity-50">#security</span>
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {findings.map((f, i) => (
            <FindingCard key={i} finding={f} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}