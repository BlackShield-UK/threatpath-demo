import React, { useState, useCallback } from 'react';
import { 
  Shield, 
  Server, 
  Cloud, 
  Monitor, 
  Wifi, 
  Lock, 
  AlertTriangle, 
  Eye,
  Plus,
  Settings,
  Target,
  ArrowRight,
  Database,
  Smartphone
} from 'lucide-react';

export default function ThreatPathDemo() {
  const [currentView, setCurrentView] = useState('diagram');
  const [selectedNode, setSelectedNode] = useState(null);
  const [nodes, setNodes] = useState([
    { id: 1, type: 'internet', x: 50, y: 100, label: 'Internet', controls: [] },
    { id: 2, type: 'firewall', x: 200, y: 100, label: 'Perimeter Firewall', controls: ['DPI', 'IPS'] },
    { id: 3, type: 'dmz', x: 350, y: 100, label: 'DMZ Network', controls: ['Network Segmentation'] },
    { id: 4, type: 'server', x: 500, y: 50, label: 'Web Server', controls: ['WAF', 'Endpoint Protection'] },
    { id: 5, type: 'firewall', x: 200, y: 200, label: 'Internal Firewall', controls: ['Access Control Lists'] },
    { id: 6, type: 'network', x: 350, y: 200, label: 'Internal LAN', controls: ['Network Monitoring'] },
    { id: 7, type: 'server', x: 500, y: 200, label: 'Domain Controller', controls: ['MFA', 'Privileged Access Management'] },
    { id: 8, type: 'endpoint', x: 650, y: 200, label: 'Employee Workstation', controls: ['Endpoint Detection'] }
  ]);

  const [attackPaths, setAttackPaths] = useState([
    {
      id: 1,
      name: "Web Application Attack → Lateral Movement",
      steps: [
        { from: 1, to: 4, ttp: "T1190: Exploit Public-Facing Application", risk: "high" },
        { from: 4, to: 6, ttp: "T1021: Remote Services", risk: "medium" },
        { from: 6, to: 7, ttp: "T1078: Valid Accounts", risk: "high" },
        { from: 7, to: 8, ttp: "T1021.001: Remote Desktop Protocol", risk: "medium" }
      ]
    }
  ]);

  const nodeIcons = {
    internet: Cloud,
    firewall: Shield,
    server: Server,
    network: Wifi,
    dmz: Monitor,
    endpoint: Smartphone,
    database: Database
  };

  const NodeComponent = ({ node, isSelected, onClick }) => {
    const IconComponent = nodeIcons[node.type] || Server;
    
    return (
      <div
        className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 ${
          isSelected ? 'ring-2 ring-blue-500' : ''
        }`}
        style={{ left: node.x, top: node.y }}
        onClick={() => onClick(node)}
      >
        <div className="bg-white rounded-lg shadow-lg p-3 border-2 border-gray-300 hover:border-blue-400 min-w-24 text-center">
          <IconComponent className="w-6 h-6 mx-auto mb-1 text-gray-700" />
          <div className="text-xs font-medium text-gray-800">{node.label}</div>
          {node.controls.length > 0 && (
            <div className="flex justify-center mt-1">
              <Lock className="w-3 h-3 text-green-600" />
            </div>
          )}
        </div>
      </div>
    );
  };

  const ControlsPanel = ({ node, onClose }) => {
    const [newControl, setNewControl] = useState('');
    
    const securityControls = [
      'Firewall Rules', 'IDS/IPS', 'WAF', 'Endpoint Protection', 
      'MFA', 'Access Control Lists', 'Network Segmentation',
      'Privileged Access Management', 'Endpoint Detection', 'DPI'
    ];

    const addControl = (control) => {
      setNodes(nodes.map(n => 
        n.id === node.id 
          ? { ...n, controls: [...n.controls, control] }
          : n
      ));
    };

    const removeControl = (control) => {
      setNodes(nodes.map(n => 
        n.id === node.id 
          ? { ...n, controls: n.controls.filter(c => c !== control) }
          : n
      ));
    };

    return (
      <div className="bg-white rounded-lg shadow-xl p-6 border">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Security Controls: {node.label}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">×</button>
        </div>
        
        <div className="mb-4">
          <h4 className="font-medium mb-2">Active Controls:</h4>
          <div className="space-y-1">
            {node.controls.map((control, idx) => (
              <div key={idx} className="flex justify-between items-center bg-green-50 p-2 rounded">
                <span className="text-sm">{control}</span>
                <button 
                  onClick={() => removeControl(control)}
                  className="text-red-500 text-xs hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">Available Controls:</h4>
          <div className="grid grid-cols-1 gap-1 max-h-32 overflow-y-auto">
            {securityControls
              .filter(control => !node.controls.includes(control))
              .map((control, idx) => (
                <button
                  key={idx}
                  onClick={() => addControl(control)}
                  className="text-left text-sm p-2 hover:bg-gray-100 rounded"
                >
                  + {control}
                </button>
              ))
            }
          </div>
        </div>
      </div>
    );
  };

  const AttackPathView = () => {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Identified Attack Paths</h2>
        
        {attackPaths.map(path => (
          <div key={path.id} className="mb-8 bg-white rounded-lg shadow-lg border">
            <div className="bg-red-50 p-4 border-b">
              <h3 className="text-lg font-semibold flex items-center">
                <Target className="w-5 h-5 mr-2 text-red-600" />
                {path.name}
              </h3>
            </div>
            
            <div className="p-4">
              {path.steps.map((step, idx) => {
                const fromNode = nodes.find(n => n.id === step.from);
                const toNode = nodes.find(n => n.id === step.to);
                
                return (
                  <div key={idx} className="flex items-center mb-4 p-3 bg-gray-50 rounded">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className="font-medium">{fromNode?.label}</span>
                        <ArrowRight className="w-4 h-4 mx-2" />
                        <span className="font-medium">{toNode?.label}</span>
                        <span className={`ml-4 px-2 py-1 text-xs rounded ${
                          step.risk === 'high' ? 'bg-red-200 text-red-800' : 'bg-yellow-200 text-yellow-800'
                        }`}>
                          {step.risk.toUpperCase()} RISK
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">{step.ttp}</div>
                      
                      <div className="mt-2">
                        <span className="text-xs font-medium text-gray-500">Mitigations: </span>
                        {toNode?.controls.length > 0 ? (
                          <span className="text-xs text-green-600">{toNode.controls.join(', ')}</span>
                        ) : (
                          <span className="text-xs text-red-600">No controls detected</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Recommendations:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Implement Web Application Firewall (WAF) on web servers</li>
            <li>• Enable network micro-segmentation between DMZ and internal networks</li>
            <li>• Deploy endpoint detection and response (EDR) on all workstations</li>
            <li>• Implement privileged access management for domain controllers</li>
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">ThreatPath Pro</h1>
            <div className="flex space-x-4">
              <button
                onClick={() => setCurrentView('diagram')}
                className={`px-4 py-2 rounded-lg flex items-center ${
                  currentView === 'diagram' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <Monitor className="w-4 h-4 mr-2" />
                Network Diagram
              </button>
              <button
                onClick={() => setCurrentView('attacks')}
                className={`px-4 py-2 rounded-lg flex items-center ${
                  currentView === 'attacks' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Attack Paths
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        {currentView === 'diagram' && (
          <div className="bg-white rounded-lg shadow-lg">
            <div className="p-4 border-b">
              <h2 className="text-xl font-semibold">Network Architecture</h2>
              <p className="text-gray-600">Click on nodes to configure security controls</p>
            </div>
            
            <div className="relative h-96 bg-gray-50">
              {/* Connection lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <line x1="200" y1="100" x2="350" y2="100" stroke="#94a3b8" strokeWidth="2" />
                <line x1="350" y1="100" x2="500" y2="50" stroke="#94a3b8" strokeWidth="2" />
                <line x1="200" y1="200" x2="350" y2="200" stroke="#94a3b8" strokeWidth="2" />
                <line x1="350" y1="200" x2="500" y2="200" stroke="#94a3b8" strokeWidth="2" />
                <line x1="500" y1="200" x2="650" y2="200" stroke="#94a3b8" strokeWidth="2" />
                <line x1="200" y1="100" x2="200" y2="200" stroke="#94a3b8" strokeWidth="2" />
              </svg>
              
              {/* Nodes */}
              {nodes.map(node => (
                <NodeComponent
                  key={node.id}
                  node={node}
                  isSelected={selectedNode?.id === node.id}
                  onClick={setSelectedNode}
                />
              ))}
              
              {/* Trust Boundary */}
              <div className="absolute border-2 border-dashed border-red-400 bg-red-50 bg-opacity-30 rounded"
                   style={{ left: 150, top: 170, width: 520, height: 60 }}>
                <span className="absolute -top-6 left-2 text-xs font-medium text-red-600">Internal Network</span>
              </div>
            </div>
          </div>
        )}

        {currentView === 'attacks' && <AttackPathView />}
      </div>

      {/* Controls Panel */}
      {selectedNode && currentView === 'diagram' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="max-w-md w-full mx-4">
            <ControlsPanel 
              node={selectedNode} 
              onClose={() => setSelectedNode(null)} 
            />
          </div>
        </div>
      )}
    </div>
  );
}
