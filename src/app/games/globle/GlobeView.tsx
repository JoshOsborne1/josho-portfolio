"use client";

import { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

interface MarkerData {
  lat: number;
  lng: number;
  color: string;
}

function latLngToXYZ(lat: number, lng: number, r: number): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return [
    -(r * Math.sin(phi) * Math.cos(theta)),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta),
  ];
}

function Globe() {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.08;
  });

  // Use a softer, more stylistic texture to match the glassmorphism theme
  const texture = new THREE.TextureLoader().load(
    "https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
  );

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[2, 64, 64]} />
      {/* Lighten the globe to fit the brighter theme */}
      <meshStandardMaterial map={texture} color="#ffffff" roughness={0.6} />
    </mesh>
  );
}

function Marker({ lat, lng, color }: MarkerData) {
  const [x, y, z] = latLngToXYZ(lat, lng, 2.06);
  return (
    <mesh position={[x, y, z]}>
      <sphereGeometry args={[0.06, 16, 16]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} />
    </mesh>
  );
}

interface GlobeViewProps {
  guesses: MarkerData[];
  answerLat?: number;
  answerLng?: number;
}

export default function GlobeView({ guesses, answerLat, answerLng }: GlobeViewProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.5], fov: 45 }}
      style={{ width: '100%', height: '100%', borderRadius: 'inherit' }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 3, 5]} intensity={1.2} color="#ffffff" />
      <directionalLight position={[-5, -3, -5]} intensity={0.5} color="#A78BFA" />
      <Globe />
      {guesses.map((g, i) => (
        <Marker key={i} lat={g.lat} lng={g.lng} color={g.color} />
      ))}
      {answerLat !== undefined && answerLng !== undefined && (
        <Marker lat={answerLat} lng={answerLng} color="#F59E0B" />
      )}
      <OrbitControls enableZoom={false} autoRotate={false} enablePan={false} />
    </Canvas>
  );
}