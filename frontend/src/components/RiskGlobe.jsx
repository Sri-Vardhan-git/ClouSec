import React, { useRef, useEffect, useMemo } from 'react';
import Globe from 'react-globe.gl';
import { useSecurity } from '../context/SecurityContext';

// Mapping AWS regions to approximate Lat/Lng
const REGION_COORDS = {
  "us-east-1": { lat: 37.92, lng: -78.02 },
  "us-west-2": { lat: 45.83, lng: -119.70 },
  "ap-south-1": { lat: 19.07, lng: 72.87 }, // Mumbai
  "eu-west-1": { lat: 53.14, lng: -7.69 },
  "ap-northeast-1": { lat: 35.67, lng: 139.65 }
};

export default function RiskGlobe() {
  const globeEl = useRef();
  const { findings } = useSecurity();

  // Generate ripple data based on active findings
  const ringData = useMemo(() => {
    const counts = {};
    findings.forEach(f => {
      counts[f.region] = (counts[f.region] || 0) + 1;
    });

    return Object.entries(counts).map(([region, count]) => ({
      ...REGION_COORDS[region],
      color: 'rgb(239, 68, 68)',
      maxR: Math.min(count * 5, 20), // Ripple size based on risk volume
      propagationSpeed: 1,
      repeatPeriod: 1000
    })).filter(d => d.lat !== undefined);
  }, [findings]);

  useEffect(() => {
    // Set initial camera position and slow rotation
    globeEl.current.controls().autoRotate = true;
    globeEl.current.controls().autoRotateSpeed = 0.5;
    globeEl.current.pointOfView({ lat: 20, lng: 0, altitude: 2.5 });
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing">
      <Globe
        ref={globeEl}
        width={600}
        height={600}
        backgroundColor="rgba(0,0,0,0)"
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        ringsData={ringData}
        ringColor={d => d.color}
        ringMaxRadius="maxR"
        ringPropagationSpeed="propagationSpeed"
        ringRepeatPeriod="repeatPeriod"
        atmosphereColor="#4f46e5"
        atmosphereAltitude={0.15}
      />
    </div>
  );
}