import React, { useState, useCallback, useEffect } from 'react';
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
  Smartphone,
  CloudLightning,
  Globe,
  Laptop,
  Router,
  HardDrive,
  Cpu,
  Container
} from 'lucide-react';

export default function ThreatPathDemo() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [savedDiagrams, setSavedDiagrams] = useState([]);
  const [currentDiagramName, setCurrentDiagramName] = useState('Untitled Network');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showLoadDialog, setShowLoadDialog] = useState(false);
  const [currentView, setCurrentView] = useState('diagram');
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedThreatActor, setSelectedThreatActor] = useState('apt29');
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showNodePalette, setShowNodePalette] = useState(false);
  
  const [nodes, setNodes] = useState([
    { id: 1, type: 'internet', x: 50, y: 100, label: 'Internet', controls: [] },
    { id: 2, type: 'firewall', x: 200, y: 100, label: 'Perimeter Firewall', controls: ['DPI', 'IPS'] },
    { id: 3, type: 'dmz', x: 350, y: 100, label: 'DMZ Network', controls: ['Network Segmentation'] },
    { id: 4, type: 'server', x: 500, y: 50, label: 'Web Server', controls: ['WAF', 'Endpoint Protection'] },
    { id: 5, type: 'firewall', x: 200, y: 200, label: 'Internal Firewall', controls: ['Access Control Lists'] },
    { id: 6, type: 'network', x: 350, y: 200, label: 'Internal LAN', controls: ['Network Monitoring'] },
    { id: 7, type: 'server', x: 500, y: 200, label: 'Domain Controller', controls: ['MFA', 'Privileged Access Management'] },
    { id: 8, type: 'endpoint', x: 650, y: 200, label: 'Employee Workstation', controls: ['Endpoint Detection'] },
    { id: 9, type: 'cloud-aws', x: 700, y: 50, label: 'AWS Cloud', controls: ['CloudTrail', 'GuardDuty'] },
    { id: 10, type: 'database', x: 650, y: 120, label: 'Customer DB', controls: ['Encryption at Rest'] },
    { id: 11, type: 'mobile', x: 50, y: 200, label: 'Mobile Devices', controls: ['MDM'] },
    { id: 12, type: 'iot', x: 750, y: 200, label: 'IoT Sensors', controls: [] },
    { id: 13, type: 'container', x: 800, y: 100, label: 'Kubernetes', controls: ['Pod Security'] }
  ]);
  
  const [connections, setConnections] = useState([
    { from: 2, to: 3 },
    { from: 3, to: 4 },
    { from: 2, to: 5 },
    { from: 5, to: 6 },
    { from: 6, to: 7 },
    { from: 6, to: 8 },
    { from: 4, to: 9 },
    { from: 9, to: 10 },
    { from: 9, to: 13 },
    { from: 11, to: 5 },
    { from: 8, to: 12 }
  ]);
  
  const threatActors = {
    apt29: {
      name: "APT29 (Cozy Bear)",
      description: "Russian state-sponsored group known for sophisticated spear phishing and living-off-the-land techniques",
      color: "red",
      attackPaths: [
        {
          id: 1,
          name: "Mobile → Cloud → Container Compromise",
          steps: [
            { from: 11, to: 1, ttp: "T1566.002: Spearphishing Link", risk: "high", description: "Mobile phishing targeting employees" },
            { from: 1, to: 9, ttp: "T1078.004: Cloud Accounts", risk: "high", description: "Compromised cloud service accounts" },
            { from: 9, to: 10, ttp: "T1530: Data from Cloud Storage Object", risk: "high", description: "Access cloud-stored databases" },
            { from: 10, to: 13, ttp: "T1552.001: Credentials In Files", risk: "medium", description: "Container secrets exposure" }
          ]
        }
      ]
    },
    apt1: {
      name: "APT1 (Comment Crew)",
      description: "Chinese military unit known for long-term persistence and intellectual property theft",
      color: "orange",
      attackPaths: [
        {
          id: 2,
          name: "Web Shell Upload → Data Exfiltration",
          steps: [
            { from: 1, to: 4, ttp: "T1190: Exploit Public-Facing Application", risk: "high", description: "Exploit web application vulnerabilities" },
            { from: 4, to: 4, ttp: "T1505.003: Web Shell", risk: "high", description: "Deploy persistent web shell backdoor" },
            { from: 4, to: 6, ttp: "T1021.002: SMB/Windows Admin Shares", risk: "medium", description: "Move laterally via SMB shares" },
            { from: 6, to: 7, ttp: "T1041: Exfiltration Over C2 Channel", risk: "high", description: "Steal sensitive data over command channel" }
          ]
        }
      ]
    },
    lazarus: {
      name: "Lazarus Group",
      description: "North Korean state-sponsored group known for financial crimes and destructive attacks",
      color: "purple",
      attackPaths: [
        {
          id: 3,
          name: "Supply Chain → Financial System Compromise",
          steps: [
            { from: 1, to: 4, ttp: "T1195.002: Compromise Software Supply Chain", risk: "high", description: "Compromise software updates or downloads" },
            { from: 4, to: 6, ttp: "T1574.002: DLL Side-Loading", risk: "medium", description: "Load malicious DLLs via legitimate applications" },
            { from: 6, to: 7, ttp: "T1110.003: Password Spraying", risk: "medium", description: "Attempt common passwords across accounts" },
            { from: 7, to: 8, ttp: "T1485: Data Destruction", risk: "high", description: "Destroy data for disruption or cover tracks" }
          ]
        }
      ]
    },
    generic: {
      name: "Generic Threat Model",
      description: "Common attack patterns used by various threat actors",
      color: "gray",
      attackPaths: [
        {
          id: 4,
          name: "Multi-Vector Attack Scenario",
          steps: [
            { from: 1, to: 4, ttp: "T1190: Exploit Public-Facing Application", risk: "high", description: "Exploit web application vulnerabilities" },
            { from: 4, to: 6, ttp: "T1021: Remote Services", risk: "medium", description: "Use remote services for lateral movement" },
            { from: 6, to: 7, ttp: "T1078: Valid Accounts", risk: "high", description: "Abuse legitimate user accounts" },
            { from: 7, to: 8, ttp: "T1021.001: Remote Desktop Protocol", risk: "medium", description: "RDP for final access" }
          ]
        }
      ]
    }
  };

  const nodeIcons = {
    internet: Globe,
    firewall: Shield,
    server: Server,
    network: Wifi,
    dmz: Monitor,
    endpoint: Laptop,
    database: Database,
    'cloud-aws': Cloud,
    'cloud-azure': CloudLightning,
    mobile: Smartphone,
    iot: Router,
    container: Container,
    storage: HardDrive
  };

  // Handle mouse events globally
  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    const handleMouseMove = (e) => {
      if (isDragging) {
        e.preventDefault();
      }
    };

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isDragging]);

  const handleLogin = (email, password) => {
    try {
      setCurrentUser({ 
        name: email.split('@')[0], 
        email: email,
        company: 'Demo Corp'
      });
      setIsAuthenticated(true);
      
      if (typeof window !== 'undefined') {
        try {
          const saved = JSON.parse(localStorage.getItem('threatpath_diagrams') || '[]');
          setSavedDiagrams(saved);
        } catch (error) {
          console.warn('Could not load saved diagrams:', error);
          setSavedDiagrams([]);
        }
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };
  
  const createNewDiagram = () => {
    setNodes([]);
    setConnections([]);
    setCurrentDiagramName('New Network Diagram');
    setSelectedNode(null);
  };
  
  const addNode = (nodeType, label) => {
    const newNode = {
      id: Date.now(),
      type: nodeType,
      x: 400 + Math.random() * 200,
      y: 150 + Math.random() * 100,
      label: label,
      controls: []
    };
    setNodes(prev => [...prev, newNode]);
    setShowNodePalette(false);
  };
  
  const deleteNode = (nodeId) => {
    setNodes(prev => prev.filter(n => n.id !== nodeId));
    setConnections(prev => prev.filter(c => c.from !== nodeId && c.to !== nodeId));
    setSelectedNode(null);
  };
  
  const handleNodeDrag = useCallback((node, event) => {
    if (!isDragging) return;
    
    try {
      const rect = event.currentTarget.parentElement.getBoundingClientRect();
      const newX = event.clientX - rect.left - dragOffset.x;
      const newY = event.clientY - rect.top - dragOffset.y;
      
      setNodes(prev => prev.map(n => 
        n.id === node.id 
          ? { ...n, x: Math.max(50, Math.min(850, newX)), y: Math.max(50, Math.min(350, newY)) }
          : n
      ));
    } catch (error) {
      console.warn('Drag error:', error);
    }
  }, [isDragging, dragOffset]);
  
  const startDrag = (node, event) => {
    try {
      setIsDragging(true);
      const rect = event.currentTarget.parentElement.getBoundingClientRect();
      setDragOffset({
        x: event.clientX - rect.left - node.x,
        y: event.clientY - rect.top - node.y
      });
    } catch (error) {
      console.warn('Start drag error:', error);
    }
  };
  
  const saveDiagram = (name) => {
    try {
      const diagram = {
        id: Date.now(),
        name: name,
        nodes: nodes,
        connections: connections,
        threatActor: selectedThreatActor,
        createdAt: new Date().toISOString(),
        user: currentUser?.email || 'unknown'
      };
      
      const updated = [...savedDiagrams, diagram];
      setSavedDiagrams(updated);
      
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('threatpath_diagrams', JSON.stringify(updated));
        } catch (error) {
          console.warn('Could not save diagram:', error);
        }
      }
      
      setCurrentDiagramName(name);
      setShowSaveDialog(false);
    } catch (error) {
      console.error('Save diagram error:', error);
    }
  };
  
  const loadDiagram = (diagram) => {
    try {
      setNodes(diagram.nodes || []);
      setConnections(diagram.connections || []);
      setSelectedThreatActor(diagram.threatActor || 'apt29');
      setCurrentDiagramName(diagram.name || 'Untitled');
      setShowLoadDialog(false);
    } catch (error) {
      console.error('Load diagram error:', error);
    }
  };

  const LoginForm = () => {
    const [email, setEmail] = useState('demo@threatpath.pro');
    const [password, setPassword] = useState('demo123');
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">ThreatPath Pro</h1>
            <p className="text-gray-600 mt-2">Advanced Threat Modeling Platform</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
              />
            </div>
            
            <button
              onClick={() => handleLogin(email, password)}
              className="w-full bg-blue-600 text-white p-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Sign In
            </button>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Demo Account:</strong><br />
              Email: demo@threatpath.pro<br />
              Password: demo123
            </p>
          </div>
        </div>
      </div>
    );
  };

  const SaveDialog = () => {
    const [diagramName, setDiagramName] = useState(currentDiagramName);
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <h3 className="text-lg font-semibold mb-4">Save Network Diagram</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Diagram Name</label>
            <input
              type="text"
              value={diagramName}
              onChange={(e) => setDiagramName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              placeholder="Enter diagram name"
            />
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => saveDiagram(diagramName)}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Save
            </button>
            <button
              onClick={() => setShowSaveDialog(false)}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  const LoadDialog = () => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4">Load Saved Diagram</h3>
          
          {savedDiagrams.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No saved diagrams found</p>
          ) : (
            <div className="space-y-2">
              {savedDiagrams.map((diagram) => (
                <div key={diagram.id} className="flex justify-between items-center p-3 border rounded hover:bg-gray-50">
                  <div>
                    <div className="font-medium">{diagram.name}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(diagram.createdAt).toLocaleDateString()} • {diagram.threatActor}
                    </div>
                  </div>
                  <button
                    onClick={() => loadDiagram(diagram)}
                    className="bg-blue-600 text-white px-4 py-1 rounded text-sm hover:bg-blue-700"
                  >
                    Load
                  </button>
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-4">
            <button
              onClick={() => setShowLoadDialog(false)}
              className="w-full bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  const NodePalette = () => {
    const nodeTypes = [
      { type: 'server', label: 'Server', icon: Server },
      { type: 'firewall', label: 'Firewall', icon: Shield },
      { type: 'database', label: 'Database', icon: Database },
      { type: 'cloud-aws', label: 'AWS Cloud', icon: Cloud },
      { type: 'endpoint', label: 'Workstation', icon: Laptop },
      { type: 'mobile', label: 'Mobile Device', icon: Smartphone },
      { type: 'network', label: 'Network', icon: Wifi },
      { type: 'iot', label: 'IoT Device', icon: Router },
      { type: 'container', label: 'Container', icon: Container },
      { type: 'internet', label: 'Internet', icon: Globe }
    ];

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Add Network Component</h3>
            <button onClick={() => setShowNodePalette(false)} className="text-gray-500 hover:text-gray-700">×</button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {nodeTypes.map((nodeType) => {
              const IconComponent = nodeType.icon;
              return (
                <button
                  key={nodeType.type}
                  onClick={() => addNode(nodeType.type, nodeType.label)}
                  className="p-4 border-2 border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all text-center"
                >
                  <IconComponent className="w-8 h-8 mx-auto mb-2 text-gray-700" />
                  <div className="text-sm font-medium">{nodeType.label}</div>
                </button>
              );
            })}
          </div>
          
          <div className="mt-4">
            <button
              onClick={() => setShowNodePalette(false)}
              className="w-full bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  const NodeComponent = ({ node, isSelected, onClick }) => {
    const IconComponent = nodeIcons[node.type] || Server;
    
    const handleMouseDown = (e) => {
      e.preventDefault();
      startDrag(node, e);
    };
    
    const handleClick = (e) => {
      if (!isDragging) {
        onClick(node);
      }
    };
    
    return (
      <div
        className={`absolute cursor-move transform -translate-x-1/2 -translate-y-1/2 select-none ${
          isSelected ? 'ring-2 ring-blue-500' : ''
        }`}
        style={{ left: node.x, top: node.y }}
        onMouseDown={handleMouseDown}
        onClick={handleClick}
      >
        <div className="bg-white rounded-lg shadow-lg p-3 border-2 border-gray-300 hover:border-blue-400 min-w-24 text-center">
          <IconComponent className="w-6 h-6 mx-auto mb-1 text-gray-700" />
          <div className="text-xs font-medium text-gray-800">{node.label}</div>
          {node.controls && node.controls.length > 0 && (
            <div className="flex justify-center mt-1">
              <Lock className="w-3 h-3 text-green-600" />
            </div>
          )}
        </div>
      </div>
    );
  };

  const ControlsPanel = ({ node, onClose }) => {
    const securityControls = [
      'Firewall Rules', 'IDS/IPS', 'WAF', 'Endpoint Protection', 
      'MFA', 'Access Control Lists', 'Network Segmentation',
      'Privileged Access Management', 'Endpoint Detection', 'DPI',
      'CloudTrail', 'GuardDuty', 'Azure Sentinel', 'Encryption at Rest',
      'Encryption in Transit', 'MDM', 'Zero Trust Architecture',
      'Pod Security Standards', 'Service Mesh Security', 'API Gateway',
      'Container Image Scanning', 'Network Policies', 'RBAC',
      'Threat Intelligence', 'SIEM', 'SOAR', 'Honeypots'
    ];

    const addControl = (control) => {
      setNodes(prev => prev.map(n => 
        n.id === node.id 
          ? { ...n, controls: [...(n.controls || []), control] }
          : n
      ));
    };

    const removeControl = (control) => {
      setNodes(prev => prev.map(n => 
        n.id === node.id 
          ? { ...n, controls: (n.controls || []).filter(c => c !== control) }
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
            {(node.controls || []).map((control, idx) => (
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

        <div className="mb-4">
          <h4 className="font-medium mb-2">Available Controls:</h4>
          <div className="grid grid-cols-1 gap-1 max-h-32 overflow-y-auto">
            {securityControls
              .filter(control => !(node.controls || []).includes(control))
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

        <div className="border-t pt-4">
          <button
            onClick={() => deleteNode(node.id)}
            className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
          >
            Delete Node
          </button>
        </div>
      </div>
    );
  };

  const ThreatActorSelector = () => {
    return (
      <div className="mb-6 bg-white rounded-lg shadow-lg border p-4">
        <h3 className="text-lg font-semibold mb-3">Select Threat Actor</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {Object.entries(threatActors).map(([key, actor]) => (
            <button
              key={key}
              onClick={() => setSelectedThreatActor(key)}
              className={`p-3 rounded-lg border-2 text-left transition-all ${
                selectedThreatActor === key
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-300 bg-white hover:border-gray-400'
              }`}
            >
              <div className="font-medium text-sm">{actor.name}</div>
              <div className="text-xs text-gray-600 mt-1">{actor.description}</div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const AttackPathView = () => {
    const currentThreatActor = threatActors[selectedThreatActor];
    
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Attack Path Analysis</h2>
          <div className="bg-blue-100 px-3 py-1 rounded-full">
            <span className="text-sm font-medium text-blue-800">
              Analyzing: {currentThreatActor.name}
            </span>
          </div>
        </div>
        
        <ThreatActorSelector />
        
        {currentThreatActor.attackPaths.map(path => (
          <div key={path.id} className="mb-8 bg-white rounded-lg shadow-lg border">
            <div className="bg-red-50 p-4 border-b">
              <h3 className="text-lg font-semibold flex items-center text-red-800">
                <Target className="w-5 h-5 mr-2 text-red-600" />
                {path.name}
              </h3>
              <p className="text-sm text-gray-600 mt-1">{currentThreatActor.description}</p>
            </div>
            
            <div className="p-4">
              {path.steps.map((step, idx) => {
                const fromNode = nodes.find(n => n.id === step.from);
                const toNode = nodes.find(n => n.id === step.to);
                
                return (
                  <div key={idx} className="mb-4 p-4 bg-gray-50 rounded-lg border">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <span className="font-medium">{fromNode?.label || 'Unknown'}</span>
                        <ArrowRight className="w-4 h-4 mx-2" />
                        <span className="font-medium">{toNode?.label || 'Unknown'}</span>
                      </div>
                      <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                        step.risk === 'high' 
                          ? 'bg-red-200 text-red-800' 
                          : 'bg-yellow-200 text-yellow-800'
                      }`}>
                        {step.risk.toUpperCase()} RISK
                      </span>
                    </div>
                    
                    <div className="bg-white p-3 rounded border">
                      <div className="font-medium text-sm text-gray-900 mb-1">{step.ttp}</div>
                      <div className="text-sm text-gray-600 mb-2">{step.description}</div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs font-medium text-gray-500">Mitigations: </span>
                          {toNode?.controls?.length > 0 ? (
                            <span className="text-xs text-green-600 font-medium">{toNode.controls.join(', ')}</span>
                          ) : (
                            <span className="text-xs text-red-600 font-medium">No controls detected</span>
                          )}
                        </div>
                        <div className={`text-xs px-2 py-1 rounded ${
                          toNode?.controls?.length > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {toNode?.controls?.length > 0 ? 'Protected' : 'Vulnerable'}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">
            Recommendations against {currentThreatActor.name}:
          </h4>
          <ul className="text-sm text-blue-800 space-y-1">
            {selectedThreatActor === 'apt29' && (
              <>
                <li>• Implement advanced email security with attachment sandboxing</li>
                <li>• Deploy endpoint detection and response (EDR) with process injection detection</li>
                <li>• Enable privileged access management with just-in-time access</li>
                <li>• Implement network segmentation with zero-trust principles</li>
              </>
            )}
            {selectedThreatActor === 'apt1' && (
              <>
                <li>• Deploy Web Application Firewall (WAF) with file upload restrictions</li>
                <li>• Implement file integrity monitoring for web shells</li>
                <li>• Enable network monitoring for unusual SMB traffic</li>
                <li>• Deploy data loss prevention (DLP) for exfiltration detection</li>
              </>
            )}
            {selectedThreatActor === 'lazarus' && (
              <>
                <li>• Implement software supply chain security controls</li>
                <li>• Deploy application whitelisting and DLL monitoring</li>
                <li>• Enable account lockout policies to prevent password spraying</li>
                <li>• Implement backup and recovery systems with offline storage</li>
              </>
            )}
            {selectedThreatActor === 'generic' && (
              <>
                <li>• Implement Web Application Firewall (WAF) on web servers</li>
                <li>• Enable network micro-segmentation between DMZ and internal networks</li>
                <li>• Deploy endpoint detection and response (EDR) on all workstations</li>
                <li>• Implement privileged access management for domain controllers</li>
              </>
            )}
          </ul>
        </div>
      </div>
    );
  };

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">ThreatPath Pro</h1>
              <p className="text-sm text-gray-600">
                {currentDiagramName} • Welcome, {currentUser?.name || 'User'}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => createNewDiagram()}
                className="px-3 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 flex items-center"
              >
                <Plus className="w-4 h-4 mr-1" />
                New
              </button>
              <button
                onClick={() => setShowSaveDialog(true)}
                className="px-3 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 flex items-center"
              >
                <Plus className="w-4 h-4 mr-1" />
                Save
              </button>
              <button
                onClick={() => setShowLoadDialog(true)}
                className="px-3 py-2 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-700 flex items-center"
              >
                <Eye className="w-4 h-4 mr-1" />
                Load
              </button>
              <button
                onClick={() => setCurrentView('diagram')}
                className={`px-4 py-2 rounded-lg flex items-center ${
                  currentView === 'diagram' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <Monitor className="w-4 h-4 mr-2" />
                Network
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
                Attacks
              </button>
              <button
                onClick={() => {
                  setIsAuthenticated(false);
                  setCurrentUser(null);
                }}
                className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {currentView === 'diagram' && (
          <div className="bg-white rounded-lg shadow-lg">
            <div className="p-4 border-b flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">Network Architecture</h2>
                <p className="text-gray-600">Drag nodes to reposition • Click to configure controls</p>
              </div>
              <button
                onClick={() => setShowNodePalette(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Component
              </button>
            </div>
            
            <div 
              className="relative h-96 bg-gray-50 overflow-x-auto diagram-container"
            >
              <svg className="absolute inset-0 w-full h-full pointer-events-none min-w-[900px]">
                {connections.map((conn, idx) => {
                  const fromNode = nodes.find(n => n.id === conn.from);
                  const toNode = nodes.find(n => n.id === conn.to);
                  if (!fromNode || !toNode) return null;
                  
                  return (
                    <line
                      key={idx}
                      x1={fromNode.x}
                      y1={fromNode.y}
                      x2={toNode.x}
                      y2={toNode.y}
                      stroke="#94a3b8"
                      strokeWidth="2"
                    />
                  );
                })}
              </svg>
              
              {nodes.map(node => (
                <NodeComponent
                  key={node.id}
                  node={node}
                  isSelected={selectedNode?.id === node.id}
                  onClick={setSelectedNode}
                />
              ))}
              
              {nodes.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Monitor className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium mb-2">No Network Components</h3>
                    <p className="text-sm mb-4">Click "Add Component" to start building your network diagram</p>
                    <button
                      onClick={() => setShowNodePalette(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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

      {showSaveDialog && <SaveDialog />}
      {showLoadDialog && <LoadDialog />}
      {showNodePalette && <NodePalette />}

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
