import React, { useState } from 'react';
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
  Target,
  ArrowRight,
  Database,
  Smartphone,
  Globe,
  Laptop,
  Router,
  Container,
  CloudLightning,
  HardDrive,
  Zap,
  Layers,
  Cpu,
  Settings,
  Users,
  Key
} from 'lucide-react';

export default function ThreatPathDemo() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [savedDiagrams, setSavedDiagrams] = useState([]);
  const [currentDiagramName, setCurrentDiagramName] = useState('Advanced Network');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showLoadDialog, setShowLoadDialog] = useState(false);
  const [currentView, setCurrentView] = useState('diagram');
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedThreatActor, setSelectedThreatActor] = useState('apt29');
  const [showNodePalette, setShowNodePalette] = useState(false);
  const [selectedBoundary, setSelectedBoundary] = useState(null);
  
  const [boundaries, setBoundaries] = useState([
    {
      id: 'internal',
      name: '🔒 Internal Network Zone',
      x: 200,
      y: 250,
      width: 400,
      height: 120,
      color: 'red'
    },
    {
      id: 'cloud',
      name: '☁️ Cloud Infrastructure',
      x: 650,
      y: 50,
      width: 200,
      height: 140,
      color: 'blue'
    },
    {
      id: 'devices',
      name: '📱 End User Devices',
      x: 100,
      y: 400,
      width: 350,
      height: 80,
      color: 'green'
    }
  ]);
  
  const [nodes, setNodes] = useState([
    { id: 1, type: 'internet', x: 100, y: 100, label: 'Internet', controls: [] },
    { id: 2, type: 'firewall', x: 250, y: 100, label: 'Perimeter Firewall', controls: ['IPS/IDS', 'DPI'] },
    { id: 3, type: 'server', x: 400, y: 100, label: 'Web Server', controls: ['WAF'] },
    { id: 4, type: 'database', x: 550, y: 100, label: 'Customer DB', controls: ['Encryption at Rest'] },
    { id: 5, type: 'endpoint', x: 250, y: 200, label: 'Employee Laptop', controls: ['Endpoint Protection'] },
    { id: 6, type: 'cloud-aws', x: 700, y: 80, label: 'AWS Cloud', controls: ['CloudTrail', 'GuardDuty'] },
    { id: 7, type: 'kubernetes', x: 750, y: 130, label: 'Kubernetes', controls: ['Pod Security Standards'] },
    { id: 8, type: 'mobile', x: 150, y: 250, label: 'Mobile Devices', controls: ['Mobile Device Management (MDM)'] },
    { id: 9, type: 'iot', x: 350, y: 280, label: 'IoT Sensors', controls: [] },
    { id: 10, type: 'storage', x: 650, y: 180, label: 'Cloud Storage', controls: ['Encryption in Transit'] }
  ]);

  const threatActors = {
    apt29: {
      name: "APT29 (Cozy Bear)",
      description: "Russian state-sponsored group targeting cloud infrastructure",
      attackPaths: [{
        id: 1,
        name: "Cloud → Container → Data Exfiltration",
        steps: [
          { from: 1, to: 6, ttp: "T1190: Exploit Public-Facing Application", risk: "high", description: "Attack cloud services directly" },
          { from: 6, to: 7, ttp: "T1611: Escape to Host", risk: "high", description: "Container escape to Kubernetes" },
          { from: 7, to: 4, ttp: "T1005: Data from Local System", risk: "medium", description: "Access customer database" },
          { from: 8, to: 5, ttp: "T1566.002: Spearphishing Link", risk: "high", description: "Mobile phishing attack" }
        ]
      }]
    },
    apt1: {
      name: "APT1 (Comment Crew)", 
      description: "Chinese military unit specializing in IoT and infrastructure attacks",
      attackPaths: [{
        id: 2,
        name: "IoT → Network Pivot → Cloud Compromise",
        steps: [
          { from: 9, to: 5, ttp: "T1200: Hardware Additions", risk: "medium", description: "Compromise IoT device" },
          { from: 5, to: 3, ttp: "T1021: Remote Services", risk: "medium", description: "Lateral movement to servers" },
          { from: 3, to: 6, ttp: "T1078.004: Cloud Accounts", risk: "high", description: "Abuse cloud credentials" },
          { from: 6, to: 10, ttp: "T1530: Data from Cloud Storage", risk: "high", description: "Access cloud storage" }
        ]
      }]
    }
  };

  const nodeIcons = {
    internet: Globe,
    firewall: Shield,
    server: Server,
    database: Database,
    endpoint: Laptop,
    mobile: Smartphone,
    iot: Router,
    container: Container,
    kubernetes: Layers,
    'cloud-aws': Cloud,
    'cloud-azure': CloudLightning,
    'cloud-gcp': Zap,
    storage: HardDrive,
    'load-balancer': Settings,
    'api-gateway': Cpu,
    'identity-provider': Users,
    'key-vault': Key,
    network: Wifi
  };

  const handleLogin = (email, password) => {
    setCurrentUser({ name: email.split('@')[0], email });
    setIsAuthenticated(true);
    // Note: localStorage removed for Claude.ai compatibility
    setSavedDiagrams([]);
  };

  const createNewDiagram = () => {
    setNodes([]);
    setCurrentDiagramName('New Network');
    setSelectedNode(null);
    setSelectedBoundary(null);
  };

  const addNode = (nodeType, label) => {
    const newNode = {
      id: Date.now(),
      type: nodeType,
      x: 300 + Math.random() * 200,
      y: 150 + Math.random() * 100,
      label: label,
      controls: []
    };
    setNodes([...nodes, newNode]);
    setShowNodePalette(false);
  };

  const deleteNode = (nodeId) => {
    setNodes(nodes.filter(n => n.id !== nodeId));
    setSelectedNode(null);
  };

  const saveDiagram = (name) => {
    const diagram = {
      id: Date.now(),
      name,
      nodes,
      boundaries,
      threatActor: selectedThreatActor,
      createdAt: new Date().toISOString(),
      user: currentUser?.email
    };
    const updated = [...savedDiagrams, diagram];
    setSavedDiagrams(updated);
    setCurrentDiagramName(name);
    setShowSaveDialog(false);
  };

  const loadDiagram = (diagram) => {
    setNodes(diagram.nodes || []);
    setBoundaries(diagram.boundaries || boundaries);
    setSelectedThreatActor(diagram.threatActor || 'apt29');
    setCurrentDiagramName(diagram.name);
    setShowLoadDialog(false);
  };

  const getBorderColor = (color) => {
    const colors = {
      red: '#f87171',
      blue: '#60a5fa', 
      green: '#4ade80',
      purple: '#a855f7',
      yellow: '#fbbf24',
      orange: '#fb923c',
      pink: '#f472b6',
      gray: '#9ca3af'
    };
    return colors[color] || colors.red;
  };
  
  const getBackgroundColor = (color) => {
    const colors = {
      red: 'rgba(254, 226, 226, 0.3)',
      blue: 'rgba(219, 234, 254, 0.3)',
      green: 'rgba(220, 252, 231, 0.3)', 
      purple: 'rgba(243, 232, 255, 0.3)',
      yellow: 'rgba(254, 249, 195, 0.3)',
      orange: 'rgba(255, 237, 213, 0.3)',
      pink: 'rgba(252, 231, 243, 0.3)',
      gray: 'rgba(243, 244, 246, 0.3)'
    };
    return colors[color] || colors.red;
  };
  
  const getTextColor = (color) => {
    const colors = {
      red: '#dc2626',
      blue: '#2563eb',
      green: '#16a34a', 
      purple: '#9333ea',
      yellow: '#d97706',
      orange: '#ea580c',
      pink: '#db2777',
      gray: '#6b7280'
    };
    return colors[color] || colors.red;
  };

  const LoginForm = () => {
    const [email, setEmail] = useState('demo@threatpath.pro');
    const [password, setPassword] = useState('demo123');
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4 border border-gray-200">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-black rounded-lg p-4 mr-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-2xl font-bold text-black tracking-wide">
                  BLACK <span className="text-gray-700">SHIELD</span>
                </h1>
                <p className="text-sm text-orange-500 font-semibold tracking-wider">INTELLIGENCE & SECURITY</p>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <h2 className="text-xl font-bold text-gray-800 mb-2">ThreatPath Pro</h2>
              <p className="text-gray-600">Advanced threat modeling and attack path visualization</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            
            <button
              onClick={() => handleLogin(email, password)}
              className="w-full bg-black text-white p-3 rounded-lg font-medium hover:bg-gray-800 transition-all duration-200 shadow-lg"
            >
              Sign In
            </button>
          </div>
          
          <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
            <p className="text-sm text-orange-700">
              <strong>Demo:</strong> demo@threatpath.pro / demo123
            </p>
          </div>
        </div>
      </div>
    );
  };

  const NodePalette = () => {
    const nodeCategories = {
      'Core Infrastructure': [
        { type: 'server', label: 'Server', icon: Server },
        { type: 'firewall', label: 'Firewall', icon: Shield },
        { type: 'database', label: 'Database', icon: Database },
        { type: 'storage', label: 'Storage', icon: HardDrive },
        { type: 'load-balancer', label: 'Load Balancer', icon: Settings },
        { type: 'network', label: 'Network Segment', icon: Wifi }
      ],
      'Cloud Services': [
        { type: 'cloud-aws', label: 'AWS Cloud', icon: Cloud },
        { type: 'cloud-azure', label: 'Azure Cloud', icon: CloudLightning },
        { type: 'cloud-gcp', label: 'Google Cloud', icon: Zap },
        { type: 'kubernetes', label: 'Kubernetes', icon: Layers },
        { type: 'container', label: 'Container', icon: Container },
        { type: 'api-gateway', label: 'API Gateway', icon: Cpu }
      ],
      'Endpoints & Devices': [
        { type: 'endpoint', label: 'Workstation', icon: Laptop },
        { type: 'mobile', label: 'Mobile Device', icon: Smartphone },
        { type: 'iot', label: 'IoT Device', icon: Router }
      ],
      'Security & Identity': [
        { type: 'identity-provider', label: 'Identity Provider', icon: Users },
        { type: 'key-vault', label: 'Key Vault', icon: Key }
      ]
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-96 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Add Network Component</h3>
            <button onClick={() => setShowNodePalette(false)} className="text-gray-500 hover:text-gray-700 text-xl">×</button>
          </div>
          
          {Object.entries(nodeCategories).map(([category, nodeTypes]) => (
            <div key={category} className="mb-6">
              <h4 className="text-md font-medium text-gray-800 mb-3 border-b pb-1">{category}</h4>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {nodeTypes.map((nodeType) => {
                  const IconComponent = nodeType.icon;
                  return (
                    <button
                      key={nodeType.type}
                      onClick={() => addNode(nodeType.type, nodeType.label)}
                      className="p-3 border-2 border-gray-300 rounded-lg hover:border-orange-400 hover:bg-orange-50 text-center transition-all"
                    >
                      <IconComponent className="w-6 h-6 mx-auto mb-1 text-gray-700" />
                      <div className="text-xs font-medium">{nodeType.label}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          
          <button
            onClick={() => setShowNodePalette(false)}
            className="w-full mt-4 bg-gray-300 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  };

  const BoundaryComponent = ({ boundary }) => {
    const handleMouseDown = (e, action) => {
      e.preventDefault();
      e.stopPropagation();
      
      const startX = e.clientX;
      const startY = e.clientY;
      const startBoundary = { ...boundary };
      
      const handleMouseMove = (moveEvent) => {
        const deltaX = moveEvent.clientX - startX;
        const deltaY = moveEvent.clientY - startY;
        
        setBoundaries(prev => prev.map(b => {
          if (b.id !== boundary.id) return b;
          
          if (action === 'move') {
            return {
              ...b,
              x: Math.max(5, Math.min(1200 - b.width, startBoundary.x + deltaX)),
              y: Math.max(10, Math.min(1000 - b.height, startBoundary.y + deltaY))
            };
          } else if (action === 'resize') {
            return {
              ...b,
              width: Math.max(100, startBoundary.width + deltaX),
              height: Math.max(60, startBoundary.height + deltaY)
            };
          }
          return b;
        }));
      };
      
      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    };
    
    return (
      <div
        className={`absolute border-2 border-dashed rounded-lg ${
          selectedBoundary?.id === boundary.id ? 'ring-2 ring-yellow-400' : ''
        }`}
        style={{ 
          left: boundary.x, 
          top: boundary.y, 
          width: boundary.width, 
          height: boundary.height,
          borderColor: getBorderColor(boundary.color),
          backgroundColor: getBackgroundColor(boundary.color)
        }}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedBoundary(boundary);
        }}
      >
        <span 
          className="absolute -top-6 left-2 text-xs font-bold bg-white px-2 rounded cursor-move select-none"
          style={{ color: getTextColor(boundary.color) }}
          onMouseDown={(e) => handleMouseDown(e, 'move')}
        >
          {boundary.name}
        </span>
        
        <div 
          className="absolute bottom-0 right-0 w-4 h-4 rounded-tl cursor-se-resize opacity-50 hover:opacity-100"
          style={{ backgroundColor: getBorderColor(boundary.color) }}
          onMouseDown={(e) => handleMouseDown(e, 'resize')}
        >
          <div className="absolute bottom-0 right-0 w-2 h-2 bg-white rounded-tl"></div>
        </div>
        
        {selectedBoundary?.id === boundary.id && (
          <>
            <div 
              className="absolute -top-1 -left-1 w-3 h-3 rounded cursor-move"
              style={{ backgroundColor: getBorderColor(boundary.color) }}
              onMouseDown={(e) => handleMouseDown(e, 'move')}
            ></div>
            <div 
              className="absolute -top-1 -right-1 w-3 h-3 rounded cursor-move"
              style={{ backgroundColor: getBorderColor(boundary.color) }}
              onMouseDown={(e) => handleMouseDown(e, 'move')}
            ></div>
            <div 
              className="absolute -bottom-1 -left-1 w-3 h-3 rounded cursor-move"
              style={{ backgroundColor: getBorderColor(boundary.color) }}
              onMouseDown={(e) => handleMouseDown(e, 'move')}
            ></div>
          </>
        )}
      </div>
    );
  };

  const NodeComponent = ({ node }) => {
    const IconComponent = nodeIcons[node.type] || Server;
    
    const handleMouseDown = (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const startX = e.clientX;
      const startY = e.clientY;
      const startNodeX = node.x;
      const startNodeY = node.y;
      
      let hasMoved = false;
      
      const handleMouseMove = (moveEvent) => {
        hasMoved = true;
        const deltaX = moveEvent.clientX - startX;
        const deltaY = moveEvent.clientY - startY;
        
        const newX = startNodeX + deltaX;
        const newY = startNodeY + deltaY;
        
        setNodes(prevNodes => prevNodes.map(n => 
          n.id === node.id 
            ? { 
                ...n, 
                x: Math.max(5, Math.min(1200, newX)), 
                y: Math.max(25, Math.min(1000, newY)) 
              }
            : n
        ));
      };
      
      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        
        if (!hasMoved) {
          setSelectedNode(node);
          setSelectedBoundary(null);
        }
      };
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    };
    
    return (
      <div
        className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${
          selectedNode?.id === node.id ? 'ring-2 ring-orange-500' : ''
        }`}
        style={{ left: node.x, top: node.y }}
      >
        <div className="bg-white rounded-lg shadow-lg border-2 border-gray-300 hover:border-orange-400 min-w-20 text-center">
          <div 
            className="bg-gray-100 rounded-t-md px-2 py-1 text-xs text-gray-600 font-medium border-b select-none cursor-move"
            onMouseDown={handleMouseDown}
          >
            ⋮⋮ {node.label}
          </div>
          
          <div className="p-2">
            <IconComponent className="w-6 h-6 mx-auto mb-1 text-gray-700" />
            {node.controls?.length > 0 && (
              <div className="flex justify-center">
                <Lock className="w-3 h-3 text-green-600" />
                <span className="text-xs text-green-600 ml-1">{node.controls.length}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const BoundaryControlsPanel = ({ boundary, onClose }) => {
    const updateBoundary = (updates) => {
      setBoundaries(prev => prev.map(b => 
        b.id === boundary.id ? { ...b, ...updates } : b
      ));
      setSelectedBoundary({ ...boundary, ...updates });
    };

    const deleteBoundary = () => {
      setBoundaries(prev => prev.filter(b => b.id !== boundary.id));
      setSelectedBoundary(null);
    };

    const addNewBoundary = () => {
      const newBoundary = {
        id: Date.now().toString(),
        name: '🔧 Custom Zone',
        x: 300,
        y: 150,
        width: 200,
        height: 100,
        color: 'purple'
      };
      setBoundaries(prev => [...prev, newBoundary]);
      setSelectedBoundary(newBoundary);
    };

    return (
      <div className="bg-white rounded-lg shadow-xl p-6 border max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Trust Boundary Settings</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">×</button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Zone Name</label>
            <input
              type="text"
              value={boundary.name}
              onChange={(e) => updateBoundary({ name: e.target.value })}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">X Position</label>
              <input
                type="number"
                value={boundary.x}
                onChange={(e) => updateBoundary({ x: parseInt(e.target.value) || 0 })}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Y Position</label>
              <input
                type="number"
                value={boundary.y}
                onChange={(e) => updateBoundary({ y: parseInt(e.target.value) || 0 })}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Width</label>
              <input
                type="number"
                value={boundary.width}
                onChange={(e) => updateBoundary({ width: parseInt(e.target.value) || 100 })}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Height</label>
              <input
                type="number"
                value={boundary.height}
                onChange={(e) => updateBoundary({ height: parseInt(e.target.value) || 60 })}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Color</label>
            <select
              value={boundary.color}
              onChange={(e) => updateBoundary({ color: e.target.value })}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500"
            >
              <option value="red">Red</option>
              <option value="blue">Blue</option>
              <option value="green">Green</option>
              <option value="purple">Purple</option>
              <option value="yellow">Yellow</option>
              <option value="orange">Orange</option>
              <option value="pink">Pink</option>
              <option value="gray">Gray</option>
            </select>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={addNewBoundary}
              className="flex-1 bg-black text-white py-2 rounded hover:bg-gray-800"
            >
              Add New Zone
            </button>
            <button
              onClick={deleteBoundary}
              className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700"
            >
              Delete Zone
            </button>
          </div>
        </div>
      </div>
    );
  };

  const ControlsPanel = ({ node, onClose }) => {
    const securityControls = [
      'Firewall Rules', 'IPS/IDS', 'WAF', 'DPI', 'Network Segmentation', 'VPN',
      'Endpoint Protection', 'EDR/XDR', 'Antivirus', 'Device Encryption', 'Mobile Device Management (MDM)',
      'Multi-Factor Authentication (MFA)', 'Single Sign-On (SSO)', 'Privileged Access Management (PAM)', 
      'Identity and Access Management (IAM)', 'Role-Based Access Control (RBAC)', 'Zero Trust Architecture',
      'CloudTrail', 'GuardDuty', 'Azure Sentinel', 'Google Cloud Security Command Center',
      'Cloud Security Posture Management (CSPM)', 'Cloud Workload Protection (CWP)',
      'Pod Security Standards', 'Container Image Scanning', 'Service Mesh Security', 
      'Kubernetes Network Policies', 'Container Runtime Security',
      'Encryption at Rest', 'Encryption in Transit', 'Data Loss Prevention (DLP)',
      'Database Activity Monitoring (DAM)', 'Data Classification',
      'SIEM', 'SOAR', 'Security Orchestration', 'Threat Intelligence', 'Behavioral Analytics',
      'Log Management', 'Network Traffic Analysis', 'User Behavior Analytics (UBA)',
      'Static Application Security Testing (SAST)', 'Dynamic Application Security Testing (DAST)',
      'Interactive Application Security Testing (IAST)', 'Software Composition Analysis (SCA)',
      'IoT Device Management', 'OT Network Monitoring', 'Industrial Control System Security',
      'Backup and Recovery', 'Disaster Recovery', 'High Availability'
    ];

    const addControl = (control) => {
      const updatedNodes = nodes.map(n => 
        n.id === node.id ? { ...n, controls: [...(n.controls || []), control] } : n
      );
      setNodes(updatedNodes);
      
      const updatedNode = updatedNodes.find(n => n.id === node.id);
      setSelectedNode(updatedNode);
    };

    const removeControl = (control) => {
      const updatedNodes = nodes.map(n => 
        n.id === node.id ? { ...n, controls: (n.controls || []).filter(c => c !== control) } : n
      );
      setNodes(updatedNodes);
      
      const updatedNode = updatedNodes.find(n => n.id === node.id);
      setSelectedNode(updatedNode);
    };

    const currentNode = nodes.find(n => n.id === node.id) || node;

    return (
      <div className="bg-white rounded-lg shadow-xl p-6 border max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{currentNode.label}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">×</button>
        </div>
        
        <div className="mb-4">
          <h4 className="font-medium mb-2 flex items-center">
            <Lock className="w-4 h-4 mr-1 text-green-600" />
            Active Controls ({(currentNode.controls || []).length}):
          </h4>
          {(currentNode.controls || []).length === 0 ? (
            <p className="text-sm text-gray-500 italic bg-gray-50 p-3 rounded">No security controls configured</p>
          ) : (
            <div className="max-h-32 overflow-y-auto">
              {(currentNode.controls || []).map((control, idx) => (
                <div key={idx} className="flex justify-between items-center bg-green-50 p-2 rounded mb-1 border border-green-200">
                  <span className="text-sm font-medium text-green-800">{control}</span>
                  <button onClick={() => removeControl(control)} className="text-red-500 text-xs hover:text-red-700 px-2 py-1 rounded">
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mb-4">
          <h4 className="font-medium mb-2 flex items-center">
            <Plus className="w-4 h-4 mr-1 text-orange-600" />
            Available Controls ({securityControls.filter(c => !(currentNode.controls || []).includes(c)).length}):
          </h4>
          <div className="max-h-40 overflow-y-auto border rounded">
            {securityControls
              .filter(c => !(currentNode.controls || []).includes(c))
              .map((control, idx) => (
                <button
                  key={idx}
                  onClick={() => addControl(control)}
                  className="block w-full text-left text-sm p-2 hover:bg-orange-50 border-b border-gray-100 transition-colors"
                >
                  + {control}
                </button>
              ))}
          </div>
          {securityControls.filter(c => !(currentNode.controls || []).includes(c)).length === 0 && (
            <p className="text-sm text-gray-500 italic bg-gray-50 p-3 rounded">All available controls have been added</p>
          )}
        </div>

        <button
          onClick={() => deleteNode(currentNode.id)}
          className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 flex items-center justify-center"
        >
          <AlertTriangle className="w-4 h-4 mr-2" />
          Delete Node
        </button>
      </div>
    );
  };

  const AttackPathView = () => {
    const currentThreatActor = threatActors[selectedThreatActor];
    
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Attack Path Analysis</h2>
        
        <div className="mb-6 bg-white rounded-lg border p-4">
          <h3 className="font-semibold mb-3">Select Threat Actor</h3>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(threatActors).map(([key, actor]) => (
              <button
                key={key}
                onClick={() => setSelectedThreatActor(key)}
                className={`p-3 rounded border-2 text-left ${
                  selectedThreatActor === key ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
              >
                <div className="font-medium text-sm">{actor.name}</div>
                <div className="text-xs text-gray-600">{actor.description}</div>
              </button>
            ))}
          </div>
        </div>
        
        {currentThreatActor.attackPaths.map(path => (
          <div key={path.id} className="bg-white rounded-lg border p-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2 text-red-600" />
              {path.name}
            </h3>
            
            {path.steps.map((step, idx) => {
              const fromNode = nodes.find(n => n.id === step.from);
              const toNode = nodes.find(n => n.id === step.to);
              
              return (
                <div key={idx} className="mb-4 p-3 bg-gray-50 rounded border">
                  <div className="flex items-center mb-2">
                    <span className="font-medium">{fromNode?.label || 'Unknown'}</span>
                    <ArrowRight className="w-4 h-4 mx-2" />
                    <span className="font-medium">{toNode?.label || 'Unknown'}</span>
                    <span className={`ml-auto px-2 py-1 text-xs rounded ${
                      step.risk === 'high' ? 'bg-red-200 text-red-800' : 'bg-yellow-200 text-yellow-800'
                    }`}>
                      {step.risk.toUpperCase()} RISK
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mb-1">{step.ttp}</div>
                  <div className="text-sm text-gray-500">{step.description}</div>
                  
                  <div className="mt-2 text-xs">
                    <span className="font-medium">Mitigations: </span>
                    {toNode?.controls?.length > 0 ? (
                      <span className="text-green-600">{toNode.controls.join(', ')}</span>
                    ) : (
                      <span className="text-red-600">No controls detected</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-black shadow-lg border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="bg-white rounded-lg p-2 mr-4">
                <Shield className="w-6 h-6 text-black" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-wide">
                  BLACK <span className="text-gray-300">SHIELD</span>
                </h1>
                <p className="text-xs text-orange-400 font-semibold tracking-wider">INTELLIGENCE & SECURITY</p>
              </div>
              <div className="ml-6 pl-6 border-l border-gray-600">
                <h2 className="text-lg font-semibold text-white">ThreatPath Pro</h2>
                <p className="text-sm text-gray-400">{currentDiagramName} • {currentUser?.name}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button onClick={createNewDiagram} className="px-3 py-2 bg-gray-700 text-white rounded text-sm hover:bg-gray-600 transition-colors">
                New
              </button>
              <button onClick={() => setShowSaveDialog(true)} className="px-3 py-2 bg-green-700 text-white rounded text-sm hover:bg-green-600 transition-colors">
                Save
              </button>
              <button onClick={() => setShowLoadDialog(true)} className="px-3 py-2 bg-gray-600 text-white rounded text-sm hover:bg-gray-500 transition-colors">
                Load
              </button>
              <button
                onClick={() => setCurrentView('diagram')}
                className={`px-4 py-2 rounded transition-colors ${currentView === 'diagram' ? 'bg-orange-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              >
                Network
              </button>
              <button
                onClick={() => setCurrentView('attacks')}
                className={`px-4 py-2 rounded transition-colors ${currentView === 'attacks' ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              >
                Attacks
              </button>
              <button onClick={() => setIsAuthenticated(false)} className="px-3 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-none mx-auto p-6" style={{ maxWidth: '1400px' }}>
        {currentView === 'diagram' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b flex justify-between items-center" style={{ minWidth: '1400px' }}>
              <div>
                <h2 className="text-xl font-semibold">Advanced Network Architecture</h2>
                <p className="text-gray-600">Drag nodes/boundaries • Click to configure • Interactive trust zones</p>
              </div>
              <button
                onClick={() => setShowNodePalette(true)}
                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors font-medium"
              >
                Add Component
              </button>
            </div>
            
            <div className="relative h-[1000px] w-full bg-gray-50 diagram-area" style={{ minWidth: '1400px' }}
                 onClick={() => {
                   setSelectedNode(null);
                   setSelectedBoundary(null);
                 }}>
              
              {boundaries.map(boundary => (
                <BoundaryComponent key={boundary.id} boundary={boundary} />
              ))}
              
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 5 }}>
                <line x1="150" y1="100" x2="200" y2="100" stroke="#94a3b8" strokeWidth="2" />
                <line x1="300" y1="100" x2="350" y2="100" stroke="#94a3b8" strokeWidth="2" />
                <line x1="450" y1="100" x2="500" y2="100" stroke="#94a3b8" strokeWidth="2" />
                <line x1="450" y1="100" x2="650" y2="80" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5,5" />
                <line x1="280" y1="130" x2="280" y2="180" stroke="#94a3b8" strokeWidth="2" />
                <line x1="700" y1="80" x2="750" y2="130" stroke="#94a3b8" strokeWidth="2" />
                <line x1="700" y1="80" x2="650" y2="180" stroke="#94a3b8" strokeWidth="2" />
                <line x1="200" y1="230" x2="250" y2="180" stroke="#94a3b8" strokeWidth="2" strokeDasharray="3,3" />
              </svg>

              {nodes.map(node => (
                <NodeComponent key={node.id} node={node} />
              ))}
              
              {nodes.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Monitor className="w-16 h-16 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Components</h3>
                    <p className="text-sm mb-4">Add cloud services, containers, IoT devices and more</p>
                    <button
                      onClick={() => setShowNodePalette(true)}
                      className="px-4 py-2 bg-black text-white rounded"
                    >
                      Add Your First Component
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {currentView === 'attacks' && <AttackPathView />}
      </div>

      {showNodePalette && <NodePalette />}
      
      {selectedNode && currentView === 'diagram' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="max-w-lg w-full mx-4">
            <ControlsPanel node={selectedNode} onClose={() => setSelectedNode(null)} />
          </div>
        </div>
      )}

      {selectedBoundary && currentView === 'diagram' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="max-w-md w-full mx-4">
            <BoundaryControlsPanel boundary={selectedBoundary} onClose={() => setSelectedBoundary(null)} />
          </div>
        </div>
      )}

      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Save Diagram</h3>
            <input
              type="text"
              placeholder="Diagram name"
              className="w-full p-2 border rounded mb-4"
              onKeyPress={(e) => e.key === 'Enter' && saveDiagram(e.target.value)}
            />
            <div className="flex space-x-2">
              <button 
                onClick={(e) => {
                  const input = e.target.parentElement.previousElementSibling;
                  saveDiagram(input.value || 'Untitled Diagram');
                }}
                className="flex-1 bg-black text-white py-2 rounded"
              >
                Save
              </button>
              <button onClick={() => setShowSaveDialog(false)} className="flex-1 bg-gray-300 py-2 rounded">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showLoadDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Load Diagram</h3>
            {savedDiagrams.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No saved diagrams</p>
            ) : (
              savedDiagrams.map((diagram) => (
                <div key={diagram.id} className="flex justify-between items-center p-3 border rounded mb-2">
                  <div>
                    <div className="font-medium">{diagram.name}</div>
                    <div className="text-sm text-gray-500">{new Date(diagram.createdAt).toLocaleDateString()}</div>
                  </div>
                  <button
                    onClick={() => loadDiagram(diagram)}
                    className="bg-black text-white px-4 py-1 rounded text-sm"
                  >
                    Load
                  </button>
                </div>
              ))
            )}
            <button onClick={() => setShowLoadDialog(false)} className="w-full bg-gray-300 py-2 rounded mt-4">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
