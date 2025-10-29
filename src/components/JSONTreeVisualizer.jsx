import "reactflow/dist/style.css";
import JSONEditor from "./JSONEditor";
import ReactFlow, { Controls, Background, BezierEdge } from "reactflow";
import CustomNode from "./CustomNode";
import { useJSONTree } from "../hooks/useJSONTree";
import { useReactFlow } from "reactflow";
import { useCallback, useEffect, useRef } from "react";
import SearchBar from "./Searchbar";
import NodeInfoPanel from "./NodeInfoPanel";
import { toPng } from "html-to-image";
import Button from "./widgets/Button";

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
    searchQuery,
    searchResults,
    currentSearchIndex,
    hoveredNode,
    setHoveredNode,
    loadSampleJSON,
    formatJSON,
    clearAll,
    handleVisualize,
    handleSearch,
    clearSearch,
    onNodesChange,
    onEdgesChange
  } = useJSONTree();

  const { fitView, getNode } = useReactFlow();
  const flowRef = useRef(null);

  useEffect(() => {
    if (searchResults.length > 0 && currentSearchIndex >= 0) {
      const nodeId = searchResults[currentSearchIndex];
      const node = getNode(nodeId);
      if (node) {
        setTimeout(() => {
          fitView({
            nodes: [{ id: nodeId }],
            duration: 500,
            padding: 0.3
          });
        }, 100);
      }
    }
  }, [searchResults, currentSearchIndex, fitView, getNode]);

  const handleNodeMouseEnter = useCallback((event, node) => {
    setHoveredNode(node);
  }, []);

  const handleNodeMouseLeave = useCallback(() => {
    setHoveredNode(null);
  }, []);

  const handleDownloadImage = useCallback(async () => {
    if (flowRef.current === null) {
      return;
    }

    try {
      const dataUrl = await toPng(flowRef.current, {
        backgroundColor: "#ffffff",
        quality: 1.0,
        filter: (node) => {
          // Filter out the ReactFlow controls and background
          if (
            node?.classList?.contains("react-flow__controls") ||
            node?.classList?.contains("react-flow__background")
          ) {
            return false;
          }
          return true;
        }
      });

      const link = document.createElement("a");
      link.download = "json-tree.png";
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Error downloading image:", error);
      alert("Error downloading image. Please try again.");
    }
  }, []);

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-screen max-h-[calc(100vh-56px)] overflow-hidden p-3 lg:p-4 ">
      <div className="w-full lg:w-2/5 xl:w-1/3 flex flex-col min-h-[300px] lg:min-h-0 lg:h-full">
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

      <div className="flex-1 flex flex-col lg:h-full relative min-h-[400px] lg:min-h-0">
        <div className="flex gap-2 items-center">
          <div className="flex-1">
            <SearchBar
              searchQuery={searchQuery}
              onSearch={handleSearch}
              onClear={clearSearch}
              searchResults={searchResults}
              currentIndex={currentSearchIndex}
            />
          </div>
          <Button onClick={handleDownloadImage} disabled={nodes.length === 0}>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Download Image
          </Button>
        </div>
        <div
          className="flex-1 rounded-xl shadow-xl border border-[var(--border)] mt-2 lg:mt-4"
          ref={flowRef}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeMouseEnter={handleNodeMouseEnter}
            onNodeMouseLeave={handleNodeMouseLeave}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            className="w-full h-full"
            fitView
            minZoom={0.1}
            maxZoom={2}
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

        <NodeInfoPanel node={hoveredNode} />
      </div>
    </div>
  );
};

export default JSONTreeVisualizer;
