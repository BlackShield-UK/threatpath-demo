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
  Container
} from 'lucide-react';

export default function ThreatPathDemo() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [savedDiagrams, setSavedDiagrams] = useState([]);
  const [currentDiagramName, setCurrentDiagramName] = useState('Demo Network');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showLoadDialog, setShowLoadDialog] = useState(false);
  const [currentView, setCurrentView] = useState('diagram');
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedThreatActor, setSelectedThreatActor] = useState('apt29');
  const [showNodePalette, setShowNodePalette] = useState(false);
  
  const [nodes, setNodes] = useState([
    { id: 1, type: 'internet', x: 100, y: 100, label: 'Internet', controls: [] },
    { id: 2, type: 'firewall', x: 250, y: 100, label: 'Firewall', controls: ['IPS'] },
    { id: 3, type: 'server', x: 400, y: 100, label: 'Web Server', controls: ['WAF'] },
    { id: 4, type: 'database', x: 550, y: 100, label: 'Database', controls: [] },
    { id: 5, type: 'endpoint', x: 250, y: 200, label: 'Workstation', controls: [] }
  ]);

  const threatActors = {
    apt29: {
      name: "APT29 (Cozy Bear)",
      description: "Russian state-sponsored group",
      attackPaths: [{
        id: 1,
        name: "Web Attack → Data Breach",
        steps: [
          { from: 1, to: 3, ttp: "T1190: Exploit Web App", risk: "high", description: "Attack web server" },
          { from: 3, to: 4, ttp: "T1005: Data from Local System", risk: "high", description: "Access database" }
        ]
      }]
    },
    apt1: {
      name: "APT1 (Comment Crew)", 
      description: "Chinese military unit",
      attackPaths: [{
        id: 2,
        name: "Phishing → Lateral Movement",
        steps: [
          { from: 1, to: 5, ttp: "T1566: Phishing", risk: "high", description: "Email attack" },
          { from: 5, to: 4, ttp: "T1021: Remote Services", risk: "medium", description: "Move to database" }
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
    container: Container
  };

  const handleLogin = (email, password) => {
    setCurrentUser({ name: email.split('@')[0], email });
    setIsAuthenticated(true);
    if (typeof window !== 'undefined') {
      try {
        const saved = JSON.parse(localStorage.getItem('threatpath_diagrams') || '[]');
        setSavedDiagrams(saved);
      } catch (e) {
        setSavedDiagrams([]);
      }
    }
  };

  const createNewDiagram = () => {
    setNodes([]);
    setCurrentDiagramName('New Network');
    setSelectedNode(null);
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
      threatActor: selectedThreatActor,
      createdAt: new Date().toISOString(),
      user: currentUser?.email
    };
    const updated = [...savedDiagrams, diagram];
    setSavedDiagrams(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('threatpath_diagrams', JSON.stringify(updated));
    }
    setCurrentDiagramName(name);
    setShowSaveDialog(false);
  };

  const loadDiagram = (diagram) => {
    setNodes(diagram.nodes || []);
    setSelectedThreatActor(diagram.threatActor || 'apt29');
    setCurrentDiagramName(diagram.name);
    setShowLoadDialog(false);
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
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <button
              onClick={() => handleLogin(email, password)}
              className="w-full bg-blue-600 text-white p-3 rounded-lg font-medium hover:bg-blue-700"
            >
              Sign In
            </button>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Demo:</strong> demo@threatpath.pro / demo123
            </p>
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
      { type: 'endpoint', label: 'Workstation', icon: Laptop },
      { type: 'mobile', label: 'Mobile', icon: Smartphone },
      { type: 'iot', label: 'IoT Device', icon: Router }
    ];

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
          <h3 className="text-lg font-semibold mb-4">Add Network Component</h3>
          
          <div className="grid grid-cols-3 gap-3">
            {nodeTypes.map((nodeType) => {
              const IconComponent = nodeType.icon;
              return (
                <button
                  key={nodeType.type}
                  onClick={() => addNode(nodeType.type, nodeType.label)}
                  className="p-4 border-2 border-gray-300 rounded-lg hover:border-blue-400 text-center"
                >
                  <IconComponent className="w-8 h-8 mx-auto mb-2" />
                  <div className="text-sm">{nodeType.label}</div>
                </button>
              );
            })}
          </div>
          
          <button
            onClick={() => setShowNodePalette(false)}
            className="w-full mt-4 bg-gray-300 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  };

  const NodeComponent = ({ node }) => {
    const IconComponent = nodeIcons[node.type] || Server;
    
    return (
      <div
        className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer ${
          selectedNode?.id === node.id ? 'ring-2 ring-blue-500' : ''
        }`}
        style={{ left: node.x, top: node.y }}
        onClick={() => setSelectedNode(node)}
      >
        <div className="bg-white rounded-lg shadow-lg p-3 border-2 border-gray-300 hover:border-blue-400 min-w-20 text-center">
          <IconComponent className="w-6 h-6 mx-auto mb-1 text-gray-700" />
          <div className="text-xs font-medium">{node.label}</div>
          {node.controls?.length > 0 && (
            <Lock className="w-3 h-3 mx-auto mt-1 text-green-600" />
          )}
        </div>
      </div>
    );
  };

  const ControlsPanel = ({ node, onClose }) => {
    const controls = ['Firewall Rules', 'IPS', 'WAF', 'Endpoint Protection', 'MFA', 'Encryption'];

    const addControl = (control) => {
      const updatedNodes = nodes.map(n => 
        n.id === node.id ? { ...n, controls: [...(n.controls || []), control] } : n
      );
      setNodes(updatedNodes);
      
      // Update the selected node immediately so the panel reflects changes
      const updatedNode = updatedNodes.find(n => n.id === node.id);
      setSelectedNode(updatedNode);
    };

    const removeControl = (control) => {
      const updatedNodes = nodes.map(n => 
        n.id === node.id ? { ...n, controls: (n.controls || []).filter(c => c !== control) } : n
      );
      setNodes(updatedNodes);
      
      // Update the selected node immediately so the panel reflects changes
      const updatedNode = updatedNodes.find(n => n.id === node.id);
      setSelectedNode(updatedNode);
    };

    // Use the current selectedNode to ensure we show the latest state
    const currentNode = nodes.find(n => n.id === node.id) || node;

    return (
      <div className="bg-white rounded-lg shadow-xl p-6 border">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{currentNode.label}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">×</button>
        </div>
        
        <div className="mb-4">
          <h4 className="font-medium mb-2">Active Controls:</h4>
          {(currentNode.controls || []).length === 0 ? (
            <p className="text-sm text-gray-500 italic">No controls added yet</p>
          ) : (
            (currentNode.controls || []).map((control, idx) => (
              <div key={idx} className="flex justify-between items-center bg-green-50 p-2 rounded mb-1">
                <span className="text-sm">{control}</span>
                <button onClick={() => removeControl(control)} className="text-red-500 text-xs hover:text-red-700">
                  Remove
                </button>
              </div>
            ))
          )}
        </div>

        <div className="mb-4">
          <h4 className="font-medium mb-2">Add Controls:</h4>
          {controls.filter(c => !(currentNode.controls || []).includes(c)).map((control, idx) => (
            <button
              key={idx}
              onClick={() => addControl(control)}
              className="block w-full text-left text-sm p-2 hover:bg-gray-100 rounded mb-1 border border-gray-200"
            >
              + {control}
            </button>
          ))}
          {controls.filter(c => !(currentNode.controls || []).includes(c)).length === 0 && (
            <p className="text-sm text-gray-500 italic">All available controls have been added</p>
          )}
        </div>

        <button
          onClick={() => deleteNode(currentNode.id)}
          className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
        >
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
                    <span className="ml-auto px-2 py-1 text-xs bg-red-200 text-red-800 rounded">
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
      <div className="bg-white shadow border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">ThreatPath Pro</h1>
              <p className="text-sm text-gray-600">{currentDiagramName} • {currentUser?.name}</p>
            </div>
            <div className="flex space-x-2">
              <button onClick={createNewDiagram} className="px-3 py-2 bg-purple-600 text-white rounded text-sm">
                New
              </button>
              <button onClick={() => setShowSaveDialog(true)} className="px-3 py-2 bg-green-600 text-white rounded text-sm">
                Save
              </button>
              <button onClick={() => setShowLoadDialog(true)} className="px-3 py-2 bg-gray-600 text-white rounded text-sm">
                Load
              </button>
              <button
                onClick={() => setCurrentView('diagram')}
                className={`px-4 py-2 rounded ${currentView === 'diagram' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              >
                Network
              </button>
              <button
                onClick={() => setCurrentView('attacks')}
                className={`px-4 py-2 rounded ${currentView === 'attacks' ? 'bg-red-600 text-white' : 'bg-gray-200'}`}
              >
                Attacks
              </button>
              <button onClick={() => setIsAuthenticated(false)} className="px-3 py-2 bg-red-600 text-white rounded text-sm">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {currentView === 'diagram' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">Network Architecture</h2>
                <p className="text-gray-600">Click nodes to configure security controls</p>
              </div>
              <button
                onClick={() => setShowNodePalette(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Add Component
              </button>
            </div>
            
            <div className="relative h-96 bg-gray-50">
              {nodes.map(node => (
                <NodeComponent key={node.id} node={node} />
              ))}
              
              {nodes.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Monitor className="w-16 h-16 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Components</h3>
                    <button
                      onClick={() => setShowNodePalette(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded"
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
          <div className="max-w-md w-full mx-4">
            <ControlsPanel node={selectedNode} onClose={() => setSelectedNode(null)} />
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
                onClick={(e) => saveDiagram(e.target.previousElementSibling.value)}
                className="flex-1 bg-blue-600 text-white py-2 rounded"
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
                    className="bg-blue-600 text-white px-4 py-1 rounded text-sm"
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
