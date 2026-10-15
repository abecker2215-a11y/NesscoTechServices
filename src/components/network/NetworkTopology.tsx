"use client";

import { useState } from "react";
import { Server, Shield, Database, Cloud, Monitor, Router } from "lucide-react";
import { cn } from "@/lib/utils";

interface NetworkNode {
  id: string;
  type: "server" | "router" | "switch" | "firewall" | "workstation" | "cloud" | "storage";
  label: string;
  status: "online" | "offline" | "warning";
  x: number;
  y: number;
}

interface NetworkConnection {
  from: string;
  to: string;
  type: "wired" | "wireless" | "vpn";
}

export function NetworkTopology({ className }: { className?: string }) {
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const nodes: NetworkNode[] = [
    { id: "cloud", type: "cloud", label: "Internet/Cloud", status: "online", x: 50, y: 10 },
    { id: "firewall", type: "firewall", label: "Firewall", status: "online", x: 50, y: 25 },
    { id: "router", type: "router", label: "Router", status: "online", x: 50, y: 40 },
    { id: "switch", type: "switch", label: "Switch", status: "online", x: 50, y: 55 },
    { id: "server", type: "server", label: "Server", status: "online", x: 30, y: 70 },
    { id: "storage", type: "storage", label: "NAS Storage", status: "online", x: 70, y: 70 },
    { id: "workstation1", type: "workstation", label: "Workstation 1", status: "online", x: 20, y: 85 },
    { id: "workstation2", type: "workstation", label: "Workstation 2", status: "online", x: 40, y: 85 },
    { id: "workstation3", type: "workstation", label: "Workstation 3", status: "warning", x: 60, y: 85 },
    { id: "workstation4", type: "workstation", label: "Workstation 4", status: "online", x: 80, y: 85 },
  ];

  const connections: NetworkConnection[] = [
    { from: "cloud", to: "firewall", type: "wired" },
    { from: "firewall", to: "router", type: "wired" },
    { from: "router", to: "switch", type: "wired" },
    { from: "switch", to: "server", type: "wired" },
    { from: "switch", to: "storage", type: "wired" },
    { from: "switch", to: "workstation1", type: "wired" },
    { from: "switch", to: "workstation2", type: "wired" },
    { from: "switch", to: "workstation3", type: "wired" },
    { from: "switch", to: "workstation4", type: "wired" },
  ];

  const getNodeIcon = (type: NetworkNode["type"]) => {
    const icons = {
      server: Server,
      router: Router,
      switch: Router,
      firewall: Shield,
      workstation: Monitor,
      cloud: Cloud,
      storage: Database,
    };
    return icons[type] || Server;
  };

  const getStatusColor = (status: NetworkNode["status"]) => {
    switch (status) {
      case "online":
        return "bg-success";
      case "offline":
        return "bg-destructive";
      case "warning":
        return "bg-warning";
    }
  };

  const getConnectionStyle = (type: NetworkConnection["type"]) => {
    switch (type) {
      case "wired":
        return "stroke-border";
      case "wireless":
        return "stroke-primary stroke-dashed";
      case "vpn":
        return "stroke-success stroke-dotted";
    }
  };

  return (
    <div className={cn("relative w-full aspect-video bg-background border border-border rounded-lg overflow-hidden", className)}>
      <svg className="absolute inset-0 w-full h-full" aria-label="Network topology diagram">
        {/* Connections */}
        {connections.map((conn, index) => {
          const fromNode = nodes.find((n) => n.id === conn.from);
          const toNode = nodes.find((n) => n.id === conn.to);
          if (!fromNode || !toNode) return null;

          return (
            <line
              key={index}
              x1={`${fromNode.x}%`}
              y1={`${fromNode.y}%`}
              x2={`${toNode.x}%`}
              y2={`${toNode.y}%`}
              className={cn("stroke-2", getConnectionStyle(conn.type))}
              strokeWidth="2"
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((node) => {
          const Icon = getNodeIcon(node.type);
          const isSelected = selectedNode?.id === node.id;
          const isHovered = hoveredNode === node.id;

          return (
            <g
              key={node.id}
              onClick={() => setSelectedNode(node)}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              className="cursor-pointer"
            >
              <circle
                cx={`${node.x}%`}
                cy={`${node.y}%`}
                r={isSelected || isHovered ? "8%" : "6%"}
                className={cn(
                  "fill-background stroke-2 transition-all",
                  isSelected ? "stroke-primary" : "stroke-border",
                  isHovered && "stroke-primary/50"
                )}
              />
              <foreignObject
                x={`${node.x}%`}
                y={`${node.y}%`}
                width="6%"
                height="6%"
                transform="translate(-50%, -50%)"
              >
                <div className="w-full h-full flex items-center justify-center">
                  <Icon className="h-4 w-4 text-foreground" aria-hidden="true" />
                </div>
              </foreignObject>
              <circle
                cx={`${node.x + 4}%`}
                cy={`${node.y - 4}%`}
                r="2%"
                className={cn("fill-current", getStatusColor(node.status))}
              />
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-background/95 backdrop-blur-sm border border-border rounded-lg p-4">
        <h4 className="text-sm font-semibold text-foreground mb-3">Network Status</h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-success" aria-hidden="true" />
            <span className="text-muted-foreground">Online</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-warning" aria-hidden="true" />
            <span className="text-muted-foreground">Warning</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-destructive" aria-hidden="true" />
            <span className="text-muted-foreground">Offline</span>
          </div>
        </div>
      </div>

      {/* Selected Node Info */}
      {selectedNode && (
        <div className="absolute top-4 right-4 bg-background/95 backdrop-blur-sm border border-border rounded-lg p-4 min-w-[200px]">
          <div className="flex items-center gap-2 mb-2">
            {(() => {
              const Icon = getNodeIcon(selectedNode.type);
              return <Icon className="h-5 w-5 text-primary" aria-hidden="true" />;
            })()}
            <h4 className="font-semibold text-foreground">{selectedNode.label}</h4>
          </div>
          <div className="space-y-1 text-sm">
            <p className="text-muted-foreground">
              Status:{" "}
              <span className={cn(
                "font-medium",
                selectedNode.status === "online" && "text-success",
                selectedNode.status === "warning" && "text-warning",
                selectedNode.status === "offline" && "text-destructive"
              )}>
                {selectedNode.status}
              </span>
            </p>
            <p className="text-muted-foreground">Type: {selectedNode.type}</p>
          </div>
          <button
            onClick={() => setSelectedNode(null)}
            className="mt-3 text-xs text-primary hover:underline"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
