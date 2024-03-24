import { useCallback, useEffect, useState, useRef } from "react";
import ReactFlow, {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
} from "reactflow";
import ELK from "elkjs/lib/elk.bundled.js";
import "reactflow/dist/style.css";
import "./components/Node/text-updater-node.css";

import "./components/Node/knowledge-node.css";

import sampleJson from "./assets/sample.json";
import sampleJson2 from "./assets/sample2.json";
import { Handle, Position } from "reactflow";

const handleStyle = { left: 10 };

function KnowledgeNode({ data, isConnectable }) {
  function handleSubmit(e) {
    e.preventDefault();
    //generateNodesAndEdgesFromJSON(sampleJson);

    // set state

    console.log(isConnectable);

    data.onChange(e, data.prompt, data.id);
  }

  return (
    <div className="knowledge-node">
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      <div>
        <label htmlFor="text" onClick={handleSubmit}>
          {" "}
          {data.label}{" "}
        </label>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        id="a"
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="b"
        isConnectable={isConnectable}
      />
    </div>
  );
}

function TextUpdaterNode({ data, isConnectable }) {
  const [prompt, setPrompt] = useState("");

  const onChange = useCallback((evt) => {
    setPrompt(evt.target.value);
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    //generateNodesAndEdgesFromJSON(sampleJson);

    // set state

    data.onChange(e, prompt, data.id);
  }

  return (
    <div className="text-updater-node">
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
    </div>
  );
}

const rfStyle = {
  backgroundColor: "#B8CEFF",
};

// const currentNodes = [];

// const currentEdges = [];

// we define the nodeTypes outside of the component to prevent re-renderings
// you could also use useMemo inside the component
const nodeTypes = {
  textUpdater: TextUpdaterNode,
  knowledgeNode: KnowledgeNode,
};

var json = {};

function Flow() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [prompts, setPrompts] = useState("");

  const nodesStateRef = useRef();

  nodesStateRef.current = nodes;

  const edgesStateRef = useRef();

  edgesStateRef.current = edges;

  useEffect(() => {
    function generateNodesAndEdgesFromJSON(
      jsonData,
      parentId,
      currentPrompt,
      level
    ) {
      let nodeId = 1;

      // console.log(nodesStateRef.current);

      let nodes = [...nodesStateRef.current];
      let edges = [...edgesStateRef.current];

      jsonData.responses.forEach((response, index) => {
        const responseNode = {
          id: `${parentId}+${nodeId}`,
          type: "knowledgeNode", // change this to the appropriate type for responses
          position: {
            x: index * 100 + 100 + nodeId * 10,
            y: index * 100 + 100,
          }, // Adjust position calculation as needed
          data: {
            label: response.prompt,
            prompt: currentPrompt + " " + response.prompt,
            id: `${parentId}+${nodeId}`,
            level: level + 1,
            onChange: onChange,
          },
        };
        nodes.push(responseNode);

        // currentNodes.push(responseNode);

        const edge = {
          id: `edge-${parentId}*${parentId}+${nodeId}`,
          source: parentId,
          target: `${parentId}+${nodeId}`,
        };

        edges.push(edge);

        // currentEdges.push(edge);

        nodeId++;
      });

      return { nodes, edges };
    }

    const onChange = (event, prompt, id) => {
      getChildrenForPrompt(prompt, id);
    };

    const getChildrenForPrompt = (prompt, id) => {
      var myHeaders = new Headers();
      myHeaders.append("ngrok-skip-browser-warning", "true");

      var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      fetch("http://127.0.0.1:8080/claude?query=" + prompt, requestOptions)
        .then((response) => response.text())
        .then((result) => {
          const { nodes: newNodes, edges: newEdges } =
            generateNodesAndEdgesFromJSON(JSON.parse(result), id, prompt, 1);

          console.log(newNodes);
          console.log(newEdges);

          setNodes(newNodes);
          setEdges(newEdges);
        })
        .catch((error) => console.log("error", error));
    };

    // currentNodes.push({
    //   id: `1`,
    //   type: "textUpdater",
    //   position: { x: 0, y: 0 },
    //   data: { onChange: onChange, id: `1`, level: 1 },
    // });

    setNodes([
      {
        id: `1`,
        type: "textUpdater",
        position: { x: 0, y: 0 },
        data: { onChange: onChange, id: `1`, level: 1 },
      },
    ]);
    setEdges([]);
  }, []);

  // setNodes(initialNodes);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange = useCallback(
    (changes) =>
      setEdges((eds) => {
        console.log("on edges change");
        applyEdgeChanges(changes, eds);
      }),
    [setEdges]
  );
  const onConnect = useCallback(
    (connection) =>
      setEdges((eds) => {
        console.log("on connect");

        addEdge(connection, eds);
      }),
    [setEdges]
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      fitView
      style={rfStyle}
    />
  );
}

export default Flow;
