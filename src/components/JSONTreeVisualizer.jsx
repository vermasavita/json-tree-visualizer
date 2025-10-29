import "reactflow/dist/style.css";
import JSONEditor from "./JSONEditor";
import ReactFlow, { Controls, Background, BezierEdge } from "reactflow";
import CustomNode from "./CustomNode";
import { useJSONTree } from "../hooks/useJSONTree";

const edgeTypes = {
  default: BezierEdge
};

const nodeTypes = {
  custom: CustomNode
};

const JSONTreeVisualizer = () => {
  const {
    jsonInput,
    setJsonInput,
    nodes,
    edges,
    error,
    loadSampleJSON,
    formatJSON,
    clearAll,
    handleVisualize,
    onNodesChange,
    onEdgesChange
  } = useJSONTree();

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-56px)] overflow-hidden p-4">
      <div className="w-full lg:w-2/5 xl:w-1/3 flex flex-col h-full overflow-hidden">
        <div className="flex-1 flex flex-col border border-[var(--border)] rounded-xl shadow-xl overflow-hidden">
          <JSONEditor
            value={jsonInput}
            onChange={setJsonInput}
            onVisualize={handleVisualize}
            error={error}
            onLoadSample={loadSampleJSON}
            onFormat={formatJSON}
            onClear={clearAll}
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          className=" rounded-xl shadow-xl border border-[var(--border)] flex-1"
          fitView
          minZoom={0.2}
          maxZoom={1.5}
          connectionLineComponent={null}
          nodesConnectable={false}
          edgesFocusable={false}
          elementsSelectable={true}
          defaultEdgeOptions={{
            type: "default",
            style: {
              stroke: "#374151",
              strokeWidth: 2
            }
          }}
        >
          <Controls />

          <Background gap={12} size={1} />
        </ReactFlow>
      </div>
    </div>
  );
};

export default JSONTreeVisualizer;
