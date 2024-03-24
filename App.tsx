import { useCallback, useEffect, useState } from 'react';
import ReactFlow, { addEdge, applyEdgeChanges, applyNodeChanges } from 'reactflow';
import ELK from 'elkjs/lib/elk.bundled.js';
import 'reactflow/dist/style.css';
import './components/Node/text-updater-node.css';
import sampleJson from './assets/sample.json'
import sampleJson2 from './assets/sample2.json'
import { Handle, Position } from 'reactflow';

const handleStyle = { left: 10 };

function generateNodesAndEdgesFromJSON(jsonData) {
  let nodes = [...initialNodes];
  let edges = [...initialEdges];
  let nodeId = 1;

  jsonData.forEach((item, index) => {
    let lastNodeId = nodeId;
    nodeId++;

    // Adding nodes and edges for each response
    item.responses.forEach((response) => {
      const responseNode = {
        id: String(nodeId),
        type: 'default', // change this to the appropriate type for responses
        position: { x: index * 100 + 100 + nodeId * 10, y: index * 100 + 100 }, // Adjust position calculation as needed
        data: { label: response.prompt }
      };
      nodes.push(responseNode);

      const edge = {
        id: `edge-${lastNodeId}-${nodeId}`,
        source: String(lastNodeId),
        target: String(nodeId),
      };
      edges.push(edge);
      nodeId++;
    });
  });
  return { nodes, edges }
}

function TextUpdaterNode({ data, isConnectable }) {
  const [prompt, setPrompt] = useState('')

  const onChange = useCallback((evt) => {
    setPrompt(evt.target.value)
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    console.log(prompt);
    generateNodesAndEdgesFromJSON(sampleJson)

    // set state


  }

  return (
    <div className="text-updater-node">
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      <div>
        <label htmlFor="text">Text:</label>
        <input id="text" name="text" onChange={onChange} className="nodrag" />
        <button onClick={handleSubmit}>Submit</button>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        id="a"
        style={handleStyle}
        isConnectable={isConnectable}
      />
      <Handle type="source" position={Position.Bottom} id="b" isConnectable={isConnectable} />
    </div>
  );
};

const rfStyle = {
  backgroundColor: '#B8CEFF',
};

const initialNodes = [
  { id: '1', type: 'textUpdater', position: { x: 0, y: 0 }, data: { label: 123 } },
  // {
  //   id: '2',
  //   type: 'output',
  //   targetPosition: 'top',
  //   position: { x: 0, y: 200 },
  //   data: { label:  },
  // },
  // {
  //   id: '3',
  //   type: 'output',
  //   targetPosition: 'top',
  //   position: { x: 200, y: 200 },
  //   data: { label: 'node 3' },
  // },
];

const initialEdges = [
  // { id: 'edge-1', source: '1', target: '2', sourceHandle: 'a' },
  // { id: 'edge-2', source: '1', target: '3', sourceHandle: 'b' },
];

// we define the nodeTypes outside of the component to prevent re-renderings
// you could also use useMemo inside the component
const nodeTypes = { textUpdater: TextUpdaterNode };

function Flow() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [prompts, setPrompts] = useState('')

  useEffect(() => {
    const { nodes: newNodes, edges: newEdges } = generateNodesAndEdgesFromJSON(sampleJson);
    setNodes(newNodes);
    setEdges(newEdges);
  }, []);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );
  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  // function onNodeClick(event: MouseEvent<Element, MouseEvent>, node: Node<any, string>): void {
  //   generateNodesAndEdgesFromJSON(sampleJson)
  // }

  const { nodes: newNodes, edges: newEdges } = generateNodesAndEdgesFromJSON(sampleJson);
  // setNodes(newNodes);
  // setEdges(newEdges);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      // onNodeClick={onNodeClick}
      nodeTypes={nodeTypes}
      fitView
      style={rfStyle}
    />
  );
}

export default Flow;
