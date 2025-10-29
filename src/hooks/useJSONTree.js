import { useState, useCallback } from "react";
import { createGraphFromJSON } from "../helpers/jsonToGraphConverter";
import { SAMPLE_JSON } from "../constant";
import { useEdgesState, useNodesState } from "reactflow";

export const useJSONTree = () => {
  const [jsonInput, setJsonInput] = useState("");
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const [error, setError] = useState("");

  const loadSampleJSON = useCallback(() => {
    setJsonInput(SAMPLE_JSON);
  }, []);

  const formatJSON = useCallback(() => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonInput(JSON.stringify(parsed, null, 2));
      setError("");
    } catch (err) {
      console.log("🚀 ~ useJSONTree ~ err:", err)
      setError("Cannot format invalid JSON");
    }
  }, [jsonInput]);

  const clearAll = useCallback(() => {
    setJsonInput("");
    setNodes([]);
    setEdges([]);
    setError("");
  }, []);

  const handleVisualize = useCallback(() => {
    try {
      const parsed = JSON.parse(jsonInput);
      const { nodes: newNodes, edges: newEdges } = createGraphFromJSON(parsed);

      setNodes(newNodes);
      setEdges(newEdges);
      setError("");
    } catch (err) {
      console.log("🚀 ~ useJSONTree ~ err:", err);
      setError("Invalid JSON");
    }
  }, [jsonInput]);

  return {
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
  };
};
