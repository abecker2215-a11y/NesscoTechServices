"use client";

import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Text, Sphere, Box, Cylinder, Float, Html, Grid, ContactShadows, Environment } from "@react-three/drei";
import * as THREE from "three";
import { cn } from "@/lib/utils";
import { Camera, Download, Volume2, VolumeX, Shield, AlertTriangle, Building2, Layers } from "lucide-react";

// Device types and data
interface DeviceData {
  id: string;
  type: "server" | "computer" | "router" | "firewall";
  position: [number, number, number];
  department: "IT" | "Finance" | "HR" | "All";
  specs: {
    cpu: string;
    memory: string;
    uptime: string;
    lastMaintenance: string;
  };
  status: "online" | "warning" | "offline";
}

const devices: DeviceData[] = [
  {
    id: "server-1",
    type: "server",
    position: [0, 0, 0],
    department: "IT",
    specs: { cpu: "Intel Xeon 16-core", memory: "64GB DDR4", uptime: "99.9%", lastMaintenance: "2024-10-01" },
    status: "online",
  },
  {
    id: "firewall-1",
    type: "firewall",
    position: [0, 2, 0],
    department: "IT",
    specs: { cpu: "Quad-core", memory: "8GB", uptime: "99.8%", lastMaintenance: "2024-09-15" },
    status: "online",
  },
  {
    id: "firewall-2",
    type: "firewall",
    position: [0, -2, 0],
    department: "IT",
    specs: { cpu: "Quad-core", memory: "8GB", uptime: "99.8%", lastMaintenance: "2024-09-15" },
    status: "online",
  },
  {
    id: "router-1",
    type: "router",
    position: [3, 0, 0],
    department: "IT",
    specs: { cpu: "Dual-core", memory: "4GB", uptime: "99.9%", lastMaintenance: "2024-10-05" },
    status: "online",
  },
  {
    id: "router-2",
    type: "router",
    position: [-3, 0, 0],
    department: "IT",
    specs: { cpu: "Dual-core", memory: "4GB", uptime: "99.9%", lastMaintenance: "2024-10-05" },
    status: "online",
  },
  {
    id: "comp-1",
    type: "computer",
    position: [5, 0, 2],
    department: "Finance",
    specs: { cpu: "Intel i7", memory: "16GB", uptime: "95%", lastMaintenance: "2024-09-20" },
    status: "online",
  },
  {
    id: "comp-2",
    type: "computer",
    position: [5, 0, -2],
    department: "Finance",
    specs: { cpu: "Intel i7", memory: "16GB", uptime: "95%", lastMaintenance: "2024-09-20" },
    status: "online",
  },
  {
    id: "comp-3",
    type: "computer",
    position: [5, 2, 0],
    department: "HR",
    specs: { cpu: "Intel i5", memory: "8GB", uptime: "92%", lastMaintenance: "2024-09-25" },
    status: "warning",
  },
  {
    id: "comp-4",
    type: "computer",
    position: [5, -2, 0],
    department: "HR",
    specs: { cpu: "Intel i5", memory: "8GB", uptime: "92%", lastMaintenance: "2024-09-25" },
    status: "online",
  },
  {
    id: "comp-5",
    type: "computer",
    position: [-5, 0, 2],
    department: "IT",
    specs: { cpu: "Intel i9", memory: "32GB", uptime: "98%", lastMaintenance: "2024-10-10" },
    status: "online",
  },
  {
    id: "comp-6",
    type: "computer",
    position: [-5, 0, -2],
    department: "IT",
    specs: { cpu: "Intel i9", memory: "32GB", uptime: "98%", lastMaintenance: "2024-10-10" },
    status: "online",
  },
  {
    id: "comp-7",
    type: "computer",
    position: [-5, 2, 0],
    department: "Finance",
    specs: { cpu: "Intel i7", memory: "16GB", uptime: "94%", lastMaintenance: "2024-09-18" },
    status: "online",
  },
  {
    id: "comp-8",
    type: "computer",
    position: [-5, -2, 0],
    department: "Finance",
    specs: { cpu: "Intel i7", memory: "16GB", uptime: "94%", lastMaintenance: "2024-09-18" },
    status: "online",
  },
];

const connections = [
  [0, 1], [0, 2], [1, 3], [2, 4], [3, 5], [3, 6], [3, 7], [3, 8], [4, 9], [4, 10], [4, 11], [4, 12],
];

function Server({ device, optimized, onClick, onHover }: { device: DeviceData; optimized: boolean; onClick: () => void; onHover: (device: DeviceData | null) => void }) {
  const mesh = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });

  const color = optimized ? "#10b981" : device.status === "warning" ? "#f59e0b" : device.status === "offline" ? "#ef4444" : "#3b82f6";
  const secondaryColor = optimized ? "#059669" : device.status === "warning" ? "#d97706" : device.status === "offline" ? "#dc2626" : "#2563eb";

  return (
    <group position={device.position} scale={1.2} ref={mesh}>
      {/* Main server body */}
      <Box
        args={[1.2, 1.8, 1]}
        onPointerOver={(e) => { e.stopPropagation(); onHover(device); }}
        onPointerOut={() => onHover(null)}
        onClick={(e) => { e.stopPropagation(); onClick(); }}
      >
        <meshStandardMaterial
          color="#1e293b"
          metalness={0.8}
          roughness={0.2}
        />
      </Box>

      {/* Front panel */}
      <Box args={[1.1, 1.7, 0.1]} position={[0, 0, 0.5]}>
        <meshStandardMaterial
          color="#0f172a"
          metalness={0.9}
          roughness={0.1}
        />
      </Box>

      {/* Status lights */}
      {[0, 0.4, -0.4].map((y, i) => (
        <Sphere key={i} args={[0.05, 8, 8]} position={[0.4, 0.6 + y, 0.6]}>
          <meshStandardMaterial
            color={i === 0 ? color : i === 1 ? "#22c55e" : "#3b82f6"}
            emissive={i === 0 ? color : i === 1 ? "#22c55e" : "#3b82f6"}
            emissiveIntensity={0.8}
          />
        </Sphere>
      ))}

      {/* Vents */}
      {[0.3, 0, -0.3].map((y, i) => (
        <Box key={i} args={[0.1, 0.3, 0.05]} position={[-0.5, 0.4 + y, 0.5]}>
          <meshStandardMaterial color="#334155" />
        </Box>
      ))}

      {/* Top branding strip */}
      <Box args={[1.1, 0.15, 0.05]} position={[0, 0.85, 0.5]}>
        <meshStandardMaterial color={secondaryColor} />
      </Box>

      <pointLight position={[0, 2, 0]} intensity={0.5} color={color} />
    </group>
  );
}

function Computer({ device, optimized, onClick, onHover }: { device: DeviceData; optimized: boolean; onClick: () => void; onHover: (device: DeviceData | null) => void }) {
  const color = optimized ? "#10b981" : device.status === "warning" ? "#f59e0b" : device.status === "offline" ? "#ef4444" : "#6b7280";
  const screenColor = optimized ? "#10b981" : device.status === "warning" ? "#f59e0b" : device.status === "offline" ? "#ef4444" : "#3b82f6";

  return (
    <group position={device.position}>
      {/* Monitor frame */}
      <Box
        args={[0.9, 0.6, 0.05]}
        onPointerOver={(e) => { e.stopPropagation(); onHover(device); }}
        onPointerOut={() => onHover(null)}
        onClick={(e) => { e.stopPropagation(); onClick(); }}
      >
        <meshStandardMaterial
          color="#1e293b"
          metalness={0.7}
          roughness={0.3}
        />
      </Box>

      {/* Screen */}
      <Box args={[0.8, 0.5, 0.02]} position={[0, 0, 0.03]}>
        <meshStandardMaterial
          color="#0f172a"
          emissive={screenColor}
          emissiveIntensity={0.3}
        />
      </Box>

      {/* Screen glow */}
      <Sphere args={[0.15, 8, 8]} position={[0, 0, 0.05]}>
        <meshStandardMaterial
          color={screenColor}
          emissive={screenColor}
          emissiveIntensity={0.5}
          transparent
          opacity={0.3}
        />
      </Sphere>

      {/* Stand */}
      <Box args={[0.05, 0.3, 0.05]} position={[0, -0.45, 0]}>
        <meshStandardMaterial color="#374151" metalness={0.5} roughness={0.5} />
      </Box>

      {/* Base */}
      <Box args={[0.3, 0.02, 0.2]} position={[0, -0.6, 0]}>
        <meshStandardMaterial color="#374151" metalness={0.5} roughness={0.5} />
      </Box>

      {/* Status LED */}
      <Sphere args={[0.02, 8, 8]} position={[0.4, -0.25, 0.03]}>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.8}
        />
      </Sphere>
    </group>
  );
}

function Router({ device, optimized, onClick, onHover }: { device: DeviceData; optimized: boolean; onClick: () => void; onHover: (device: DeviceData | null) => void }) {
  const color = optimized ? "#10b981" : device.status === "warning" ? "#f59e0b" : device.status === "offline" ? "#ef4444" : "#f59e0b";
  const baseColor = "#1e293b";

  return (
    <group position={device.position}>
      {/* Main router body */}
      <Box
        args={[0.7, 0.15, 0.5]}
        onPointerOver={(e) => { e.stopPropagation(); onHover(device); }}
        onPointerOut={() => onHover(null)}
        onClick={(e) => { e.stopPropagation(); onClick(); }}
      >
        <meshStandardMaterial
          color={baseColor}
          metalness={0.7}
          roughness={0.3}
        />
      </Box>

      {/* Top panel */}
      <Box args={[0.65, 0.05, 0.45]} position={[0, 0.1, 0]}>
        <meshStandardMaterial color="#334155" metalness={0.5} roughness={0.4} />
      </Box>

      {/* Antennas */}
      {[[-0.25, 0.25], [0.25, 0.25], [0, 0.35]].map(([x, z], i) => (
        <Cylinder key={i} args={[0.02, 0.03, 0.4, 8]} position={[x, 0.3, z]} rotation={[0, 0, 0.2]}>
          <meshStandardMaterial color="#475569" metalness={0.6} roughness={0.4} />
        </Cylinder>
      ))}

      {/* Antenna tips */}
      {[[-0.25, 0.25], [0.25, 0.25], [0, 0.35]].map(([x, z], i) => (
        <Sphere key={i} args={[0.04, 8, 8]} position={[x, 0.5, z]}>
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
        </Sphere>
      ))}

      {/* Status lights */}
      {[0.2, 0, -0.2].map((x, i) => (
        <Sphere key={i} args={[0.02, 8, 8]} position={[x, 0.05, 0.3]}>
          <meshStandardMaterial
            color={i === 0 ? "#22c55e" : i === 1 ? "#3b82f6" : color}
            emissive={i === 0 ? "#22c55e" : i === 1 ? "#3b82f6" : color}
            emissiveIntensity={0.8}
          />
        </Sphere>
      ))}

      {/* Ethernet ports */}
      {[0.2, 0.1, 0, -0.1, -0.2].map((y, i) => (
        <Box key={i} args={[0.08, 0.03, 0.05]} position={[0.35, y, 0]}>
          <meshStandardMaterial color="#0f172a" />
        </Box>
      ))}
    </group>
  );
}

function Firewall({ device, optimized, onClick, onHover }: { device: DeviceData; optimized: boolean; onClick: () => void; onHover: (device: DeviceData | null) => void }) {
  const color = optimized ? "#10b981" : device.status === "warning" ? "#f59e0b" : device.status === "offline" ? "#ef4444" : "#ef4444";
  const bodyColor = "#1e293b";
  const accentColor = "#dc2626";

  return (
    <group position={device.position} scale={0.9}>
      {/* Main firewall body */}
      <Box
        args={[0.7, 1.0, 0.4]}
        onPointerOver={(e) => { e.stopPropagation(); onHover(device); }}
        onPointerOut={() => onHover(null)}
        onClick={(e) => { e.stopPropagation(); onClick(); }}
      >
        <meshStandardMaterial
          color={bodyColor}
          metalness={0.8}
          roughness={0.2}
        />
      </Box>

      {/* Front panel */}
      <Box args={[0.65, 0.9, 0.05]} position={[0, 0, 0.2]}>
        <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.1} />
      </Box>

      {/* Shield emblem */}
      <Cylinder args={[0.15, 0.15, 0.06, 6]} position={[0, 0.2, 0.25]} rotation={[0, 0, 0]}>
        <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.4} />
      </Cylinder>

      {/* Status display */}
      <Box args={[0.3, 0.15, 0.02]} position={[0, -0.2, 0.25]}>
        <meshStandardMaterial color="#0a0a0a" emissive={color} emissiveIntensity={0.2} />
      </Box>

      {/* Status indicators */}
      {[0.3, 0.1, -0.1].map((y, i) => (
        <Sphere key={i} args={[0.03, 8, 8]} position={[0.25, y, 0.25]}>
          <meshStandardMaterial
            color={i === 0 ? "#22c55e" : i === 1 ? "#3b82f6" : color}
            emissive={i === 0 ? "#22c55e" : i === 1 ? "#3b82f6" : color}
            emissiveIntensity={0.8}
          />
        </Sphere>
      ))}

      {/* Port LEDs */}
      {[0.2, 0.1, 0, -0.1, -0.2].map((y, i) => (
        <Sphere key={i} args={[0.015, 8, 8]} position={[-0.25, y, 0.25]}>
          <meshStandardMaterial
            color={i % 2 === 0 ? "#22c55e" : "#3b82f6"}
            emissive={i % 2 === 0 ? "#22c55e" : "#3b82f6"}
            emissiveIntensity={0.6}
          />
        </Sphere>
      ))}

      {/* Top vents */}
      {[0.2, 0, -0.2].map((x, i) => (
        <Box key={i} args={[0.08, 0.02, 0.3]} position={[x, 0.5, 0]}>
          <meshStandardMaterial color="#334155" />
        </Box>
      ))}

      {/* Branding strip */}
      <Box args={[0.6, 0.08, 0.02]} position={[0, 0.45, 0.2]}>
        <meshStandardMaterial color={accentColor} />
      </Box>
    </group>
  );
}

function Connection({ start, end, color, animated }: { start: [number, number, number]; end: [number, number, number]; color: string; animated: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (animated && meshRef.current) {
      const material = meshRef.current.material as THREE.MeshStandardMaterial;
      material.opacity = (Math.sin(state.clock.getElapsedTime() * 2) + 1) / 2;
    }
  });

  const midX = (start[0] + end[0]) / 2;
  const midY = (start[1] + end[1]) / 2;
  const midZ = (start[2] + end[2]) / 2;
  const length = Math.sqrt(
    Math.pow(end[0] - start[0], 2) +
    Math.pow(end[1] - start[1], 2) +
    Math.pow(end[2] - start[2], 2)
  );

  return (
    <mesh ref={meshRef} position={[midX, midY, midZ]}>
      <cylinderGeometry args={[0.02, 0.02, length, 8]} />
      <meshStandardMaterial
        color={color}
        transparent={animated}
        opacity={1}
        emissive={color}
        emissiveIntensity={0.1}
      />
    </mesh>
  );
}

function DataParticle({ path, color }: { path: [number, number, number][]; color: string }) {
  const mesh = useRef<THREE.Mesh>(null);
  const [progress, setProgress] = useState(0);

  useFrame(() => {
    setProgress((prev) => (prev + 0.01) % 1);
    if (mesh.current) {
      const pointIndex = Math.floor(progress * (path.length - 1));
      const nextIndex = Math.min(pointIndex + 1, path.length - 1);
      const currentPoint = path[pointIndex];
      const nextPoint = path[nextIndex];
      const t = (progress * (path.length - 1)) - pointIndex;
      mesh.current.position.x = currentPoint[0] + (nextPoint[0] - currentPoint[0]) * t;
      mesh.current.position.y = currentPoint[1] + (nextPoint[1] - currentPoint[1]) * t;
      mesh.current.position.z = currentPoint[2] + (nextPoint[2] - currentPoint[2]) * t;
    }
  });

  return (
    <mesh ref={mesh}>
      <sphereGeometry args={[0.08, 8, 8]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
}

function NetworkScene({ optimized, onDeviceClick, onHover, visibleGroups, threatMode }: { optimized: boolean; onDeviceClick: (device: DeviceData) => void; onHover: (device: DeviceData | null) => void; visibleGroups: Set<string>; threatMode: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current && !optimized) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
    }
  });

  const visibleDevices = useMemo(() => {
    if (visibleGroups.has("All")) return devices;
    return devices.filter(d => visibleGroups.has(d.department));
  }, [visibleGroups]);

  const visibleDeviceIds = useMemo(() => new Set(visibleDevices.map(d => d.id)), [visibleDevices]);

  const visibleConnections = useMemo(() => {
    return connections.filter(([i, j]) => visibleDeviceIds.has(devices[i].id) && visibleDeviceIds.has(devices[j].id));
  }, [visibleDeviceIds]);

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      <pointLight position={[0, 10, 0]} intensity={0.3} color="#3b82f6" />

      <Grid args={[20, 20]} cellSize={1} cellThickness={0.5} cellColor="#6b7280" sectionSize={5} sectionThickness={1} sectionColor="#4b5563" fadeDistance={25} fadeStrength={1} followCamera={false} infiniteGrid />

      <ContactShadows position={[0, -3, 0]} opacity={0.5} scale={20} blur={2} far={10} resolution={256} color="#000000" />

      {visibleDevices.map((device) => {
        const Component = device.type === "server" ? Server : device.type === "computer" ? Computer : device.type === "router" ? Router : Firewall;
        return (
          <Component
            key={device.id}
            device={device}
            optimized={optimized}
            onClick={() => onDeviceClick(device)}
            onHover={onHover}
          />
        );
      })}

      {visibleConnections.map(([i, j], idx) => {
        const start = devices[i].position;
        const end = devices[j].position;
        const color = optimized ? "#10b981" : threatMode && idx % 5 === 0 ? "#ef4444" : "#6b7280";
        return <Connection key={`${i}-${j}`} start={start} end={end} color={color} animated={optimized || threatMode} />;
      })}

      {optimized && visibleConnections.map(([i, j], idx) => {
        const path = [devices[i].position, devices[j].position];
        const color = threatMode && idx % 5 === 0 ? "#ef4444" : "#10b981";
        return <DataParticle key={`particle-${i}-${j}`} path={path} color={color} />;
      })}
    </group>
  );
}

function CameraControls() {
  return null;
}

interface Network3DInteractiveProps {
  className?: string;
  tourMode?: boolean;
  tourStep?: number;
  onTourAction?: (action: string) => void;
  onStateChange?: (state: { optimized: boolean; threatMode: boolean; devicesOnline: number; threatsDetected: number }) => void;
  onLoad?: () => void;
  onError?: (error: Error) => void;
  onCameraAngle?: (angle: "top" | "front" | "isometric" | "reset") => void;
  onToggleGroup?: (group: string) => void;
}

export function Network3DInteractive({
  className,
  tourMode = false,
  tourStep = 0,
  onTourAction,
  onStateChange,
  onLoad,
  onError,
  onCameraAngle,
  onToggleGroup,
}: Network3DInteractiveProps) {
  const [optimized, setOptimized] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<DeviceData | null>(null);
  const [hoveredDevice, setHoveredDevice] = useState<DeviceData | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [threatMode, setThreatMode] = useState(false);
  const [threatsMitigated, setThreatsMitigated] = useState(0);
  const [visibleGroups, setVisibleGroups] = useState<Set<string>>(new Set(["All"]));
  const [cameraPosition, setCameraPosition] = useState<[number, number, number]>([0, 5, 12]);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      // Disable auto-rotate for users who prefer reduced motion
      // This will be handled in the OrbitControls autoRotate prop
    }
  }, []);

  // Tour mode integration
  useEffect(() => {
    if (!tourMode) return;

    switch (tourStep) {
      case 1:
        setOptimized(false);
        setThreatMode(false);
        break;
      case 2:
        setOptimized(true);
        setThreatMode(false);
        break;
      case 3:
        setThreatMode(true);
        break;
      case 4:
        // Ready for device click
        break;
      case 5:
        // Complete - no action
        break;
    }
  }, [tourStep, tourMode]);

  // Report state changes
  useEffect(() => {
    if (onStateChange) {
      const onlineDevices = devices.filter(d => d.status === "online").length;
      onStateChange({
        optimized,
        threatMode,
        devicesOnline: onlineDevices,
        threatsDetected: threatMode ? 1 : 0,
      });
    }
  }, [optimized, threatMode, onStateChange]);

  // Error handling
  useEffect(() => {
    const handleWebGLError = () => {
      const error = new Error("WebGL not supported");
      onError?.(error);
    };

    // Check for WebGL support
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) {
      handleWebGLError();
    }

    return () => {};
  }, [onError]);

  const handleDeviceClick = useCallback((device: DeviceData) => {
    setSelectedDevice(device);
    if (soundEnabled) {
      // Play click sound (would need audio files)
    }
  }, [soundEnabled]);

  const handleScreenshot = useCallback(() => {
    // Screenshot functionality would need a different approach without canvasRef
    // For now, we'll just log it
    console.log("Screenshot requested");
  }, []);

  const toggleGroup = useCallback((group: string) => {
    setVisibleGroups((prev) => {
      const next = new Set(prev);
      if (next.has(group)) {
        next.delete(group);
        if (next.size === 0) next.add("All");
      } else {
        next.delete("All");
        next.add(group);
      }
      return next;
    });
    onToggleGroup?.(group);
  }, [onToggleGroup]);

  const setCameraAngle = useCallback((angle: "top" | "front" | "isometric" | "reset") => {
    const positions: Record<string, [number, number, number]> = {
      top: [0, 15, 0],
      front: [0, 0, 15],
      isometric: [10, 10, 10],
      reset: [0, 5, 12],
    };
    setCameraPosition(positions[angle]);
    onCameraAngle?.(angle);
  }, [onCameraAngle]);

  const handleThreatMitigate = useCallback(() => {
    setThreatsMitigated((prev) => prev + 1);
    setThreatMode(false);
    setTimeout(() => setThreatMode(true), 5000);
  }, []);

  return (
    <div
      className={cn("relative w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-lg overflow-hidden", className)}
      role="application"
      aria-label="Interactive 3D network visualization"
      tabIndex={0}
      onKeyDown={(e) => {
        // Keyboard navigation
        if (e.key === "Escape") {
          setSelectedDevice(null);
        }
      }}
    >
      <Canvas camera={{ position: cameraPosition, fov: 50 }}>
        <NetworkScene
          optimized={optimized}
          onDeviceClick={handleDeviceClick}
          onHover={setHoveredDevice}
          visibleGroups={visibleGroups}
          threatMode={threatMode}
        />
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minDistance={8}
          maxDistance={20}
          autoRotate={!optimized && !tourMode}
          autoRotateSpeed={0.5}
        />
        <Environment preset="city" />
      </Canvas>

      {/* Top Controls - Hide in tour mode */}
      {!tourMode && (
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start gap-2">
          <div className="flex flex-col gap-2">
            <div className="bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/10">
              <p className="text-xs text-white font-medium">
                {optimized ? "✓ Optimized Network" : "⚠ Current Network"}
              </p>
            </div>
            {threatMode && (
              <div className="bg-red-500/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-red-400">
                <p className="text-xs text-white font-medium flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  Threat Detected!
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="bg-black/60 backdrop-blur-sm p-2 rounded-lg border border-white/10 hover:bg-black/80 transition-colors"
              title={soundEnabled ? "Mute" : "Unmute"}
            >
              {soundEnabled ? <Volume2 className="h-4 w-4 text-white" /> : <VolumeX className="h-4 w-4 text-white" />}
            </button>
            <button
              onClick={handleScreenshot}
              className="bg-black/60 backdrop-blur-sm p-2 rounded-lg border border-white/10 hover:bg-black/80 transition-colors"
              title="Screenshot"
            >
              <Download className="h-4 w-4 text-white" />
            </button>
          </div>
        </div>
      )}

      {/* Camera Controls - Hide on mobile and in tour mode */}
      {!isMobile && !tourMode && (
        <div className="absolute top-16 left-4 flex flex-col gap-1">
          <div className="bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg border border-white/10">
            <Camera className="h-3 w-3 text-white mb-1" />
            <div className="flex flex-col gap-1">
              {["top", "front", "isometric", "reset"].map((angle) => (
                <button
                  key={angle}
                  onClick={() => setCameraAngle(angle as any)}
                  className="text-xs text-white capitalize hover:text-primary transition-colors text-left"
                >
                  {angle}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Group Filters - Hide on mobile and in tour mode */}
      {!isMobile && !tourMode && (
        <div className="absolute top-16 right-4 flex flex-col gap-1">
          <div className="bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg border border-white/10">
            <Layers className="h-3 w-3 text-white mb-1" />
            <div className="flex flex-col gap-1">
              {["All", "IT", "Finance", "HR"].map((group) => (
                <button
                  key={group}
                  onClick={() => toggleGroup(group)}
                  className={cn(
                    "text-xs capitalize hover:text-primary transition-colors text-left",
                    visibleGroups.has(group) ? "text-white" : "text-muted-foreground"
                  )}
                >
                  {group}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Stats Overlay - Hide in tour mode */}
      {!tourMode && (
        <div className="absolute bottom-20 left-4">
          <div className="bg-black/60 backdrop-blur-sm px-3 py-2 rounded-lg border border-white/10">
            <p className="text-xs text-white font-medium mb-1">Network Stats</p>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Devices: {devices.length}</p>
              <p className="text-xs text-muted-foreground">Connections: {connections.length}</p>
              <p className="text-xs text-muted-foreground">Throughput: {optimized ? "1.2 Gbps" : "450 Mbps"}</p>
              <p className="text-xs text-muted-foreground">Uptime: {optimized ? "99.9%" : "97.5%"}</p>
            </div>
          </div>
        </div>
      )}

      {/* Threat Mitigation - Show in tour mode for step 3 */}
      {(threatMode || (tourMode && tourStep === 3)) && (
        <div className="absolute bottom-20 right-4">
          <button
            onClick={() => {
              handleThreatMitigate();
              onTourAction?.("threatMitigated");
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <Shield className="h-4 w-4" />
            Mitigate Threat
          </button>
        </div>
      )}

      {/* Hover Tooltip */}
      {hoveredDevice && !selectedDevice && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="bg-black/80 backdrop-blur-sm px-3 py-2 rounded-lg border border-white/10">
            <p className="text-xs text-white font-medium">{hoveredDevice.type.toUpperCase()}</p>
            <p className="text-xs text-muted-foreground">{hoveredDevice.department}</p>
          </div>
        </div>
      )}

      {/* Device Details Panel */}
      {selectedDevice && (
        <div className="absolute top-1/2 right-4 transform -translate-y-1/2 w-64 bg-black/80 backdrop-blur-sm rounded-lg border border-white/10 p-4">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-sm font-semibold text-white">{selectedDevice.type.toUpperCase()}</h3>
            <button onClick={() => setSelectedDevice(null)} className="text-muted-foreground hover:text-white">
              ×
            </button>
          </div>
          <div className="space-y-2">
            <div>
              <p className="text-xs text-muted-foreground">Department</p>
              <p className="text-xs text-white">{selectedDevice.department}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">CPU</p>
              <p className="text-xs text-white">{selectedDevice.specs.cpu}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Memory</p>
              <p className="text-xs text-white">{selectedDevice.specs.memory}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Uptime</p>
              <p className="text-xs text-white">{selectedDevice.specs.uptime}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Last Maintenance</p>
              <p className="text-xs text-white">{selectedDevice.specs.lastMaintenance}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Status</p>
              <p className={cn("text-xs font-medium", selectedDevice.status === "online" ? "text-success" : selectedDevice.status === "warning" ? "text-warning" : "text-destructive")}>
                {selectedDevice.status.toUpperCase()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Controls - Hide in tour mode, simplify on mobile */}
      {!tourMode && (
        <div className="absolute bottom-4 left-4 right-4 flex gap-2">
          <button
            onClick={() => setOptimized(!optimized)}
            className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-lg"
          >
            {optimized ? "View Current State" : "View Optimized State"}
          </button>
          <button
            onClick={() => setThreatMode(!threatMode)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg",
              threatMode ? "bg-red-500 text-white hover:bg-red-600" : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {threatMode ? "Stop Threat Sim" : "Simulate Threat"}
          </button>
        </div>
      )}

      {/* Threat Score */}
      {threatsMitigated > 0 && (
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2">
          <div className="bg-success/80 backdrop-blur-sm px-3 py-1 rounded-lg border border-success">
            <p className="text-xs text-white font-medium">Threats Mitigated: {threatsMitigated}</p>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="absolute bottom-28 left-1/2 transform -translate-x-1/2">
        <div className="bg-black/60 backdrop-blur-sm px-3 py-1 rounded-lg border border-white/10">
          <p className="text-xs text-white">Drag to rotate • Scroll to zoom • Click devices for details</p>
        </div>
      </div>
    </div>
  );
}
