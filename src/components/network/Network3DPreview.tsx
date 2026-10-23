"use client";

import { useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, Box, Cylinder, Grid, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui";

interface DeviceData {
  id: string;
  type: "server" | "computer" | "router" | "firewall";
  position: [number, number, number];
}

const devices: DeviceData[] = [
  { id: "server-1", type: "server", position: [0, 0, 0] },
  { id: "firewall-1", type: "firewall", position: [0, 2, 0] },
  { id: "firewall-2", type: "firewall", position: [0, -2, 0] },
  { id: "router-1", type: "router", position: [3, 0, 0] },
  { id: "router-2", type: "router", position: [-3, 0, 0] },
  { id: "comp-1", type: "computer", position: [5, 0, 2] },
  { id: "comp-2", type: "computer", position: [5, 0, -2] },
  { id: "comp-3", type: "computer", position: [5, 2, 0] },
  { id: "comp-4", type: "computer", position: [5, -2, 0] },
  { id: "comp-5", type: "computer", position: [-5, 0, 2] },
  { id: "comp-6", type: "computer", position: [-5, 0, -2] },
  { id: "comp-7", type: "computer", position: [-5, 2, 0] },
  { id: "comp-8", type: "computer", position: [-5, -2, 0] },
];

const connections = [
  [0, 1], [0, 2], [1, 3], [2, 4], [3, 5], [3, 6], [3, 7], [3, 8], [4, 9], [4, 10], [4, 11], [4, 12],
];

function Server({ position, color }: { position: [number, number, number]; color: string }) {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <group position={position} scale={1.2}>
      <Box ref={mesh} args={[1, 1.5, 1]}>
        <meshStandardMaterial color={color} metalness={0.5} roughness={0.3} emissive={color} emissiveIntensity={0.2} />
      </Box>
      <pointLight position={[0, 2, 0]} intensity={0.5} color={color} />
    </group>
  );
}

function Computer({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <group position={position}>
      <Box args={[0.8, 0.5, 0.5]}>
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.5} emissive={color} emissiveIntensity={0.1} />
      </Box>
      <Box args={[0.8, 0.05, 0.6]} position={[0, -0.3, 0]}>
        <meshStandardMaterial color="#374151" />
      </Box>
    </group>
  );
}

function Router({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <group position={position}>
      <Cylinder args={[0.4, 0.4, 0.3, 32]} rotation={[0, 0, Math.PI / 2]}>
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.2} emissive={color} emissiveIntensity={0.2} />
      </Cylinder>
      <Sphere args={[0.15, 16, 16]} position={[0.3, 0, 0]}>
        <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.8} />
      </Sphere>
    </group>
  );
}

function Firewall({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <group position={position} scale={0.8}>
      <Box args={[0.6, 0.8, 0.3]}>
        <meshStandardMaterial color={color} metalness={0.5} roughness={0.3} emissive={color} emissiveIntensity={0.2} />
      </Box>
    </group>
  );
}

function Connection({ start, end, color }: { start: [number, number, number]; end: [number, number, number]; color: string }) {
  const midX = (start[0] + end[0]) / 2;
  const midY = (start[1] + end[1]) / 2;
  const midZ = (start[2] + end[2]) / 2;
  const length = Math.sqrt(
    Math.pow(end[0] - start[0], 2) +
    Math.pow(end[1] - start[1], 2) +
    Math.pow(end[2] - start[2], 2)
  );

  return (
    <mesh position={[midX, midY, midZ]}>
      <cylinderGeometry args={[0.02, 0.02, length, 8]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.1} />
    </mesh>
  );
}

function NetworkScene({ optimized }: { optimized: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current && !optimized) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
    }
  });

  const color = optimized ? "#10b981" : "#3b82f6";

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      <pointLight position={[0, 10, 0]} intensity={0.3} color="#3b82f6" />

      <Grid args={[20, 20]} cellSize={1} cellThickness={0.5} cellColor="#6b7280" sectionSize={5} sectionThickness={1} sectionColor="#4b5563" fadeDistance={25} fadeStrength={1} followCamera={false} infiniteGrid />

      <ContactShadows position={[0, -3, 0]} opacity={0.5} scale={20} blur={2} far={10} resolution={256} color="#000000" />

      {devices.map((device) => {
        const Component = device.type === "server" ? Server : device.type === "computer" ? Computer : device.type === "router" ? Router : Firewall;
        return <Component key={device.id} position={device.position} color={color} />;
      })}

      {connections.map(([i, j]) => {
        const start = devices[i].position;
        const end = devices[j].position;
        return <Connection key={`${i}-${j}`} start={start} end={end} color={color} />;
      })}
    </group>
  );
}

interface Network3DPreviewProps {
  className?: string;
}

export function Network3DPreview({ className }: Network3DPreviewProps) {
  const [optimized, setOptimized] = useState(false);

  return (
    <div className={cn("relative w-full h-64 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-lg overflow-hidden", className)}>
      <Canvas camera={{ position: [0, 5, 12], fov: 50 }}>
        <NetworkScene optimized={optimized} />
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minDistance={8}
          maxDistance={20}
          autoRotate={!optimized}
          autoRotateSpeed={0.5}
        />
      </Canvas>

      <div className="absolute top-4 left-4">
        <div className="bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/10">
          <p className="text-xs text-white font-medium">
            {optimized ? "✓ Optimized" : "⚠ Current"}
          </p>
        </div>
      </div>

      <div className="absolute bottom-4 left-4 right-4 flex gap-2">
        <button
          onClick={() => setOptimized(!optimized)}
          className="flex-1 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors"
        >
          {optimized ? "View Current" : "View Optimized"}
        </button>
        <Button
          size="sm"
          href="/network-visualization"
          className="gap-1 text-xs"
        >
          Full Demo <ArrowRight className="h-3 w-3" />
        </Button>
      </div>

      <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2">
        <div className="bg-black/60 backdrop-blur-sm px-3 py-1 rounded-lg border border-white/10">
          <p className="text-xs text-white">Drag to rotate • Scroll to zoom</p>
        </div>
      </div>
    </div>
  );
}
