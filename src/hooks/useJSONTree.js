import { useState, useCallback } from "react";
import { createGraphFromJSON } from "../helpers/jsonToGraphConverter";
import { SAMPLE_JSON } from "../constant";
import { useEdgesState, useNodesState } from "reactflow";

export const useJSONTree = () => {
  const [jsonInput, setJsonInput] = useState("");
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(0);
  const [hoveredNode, setHoveredNode] = useState(null);

  const loadSampleJSON = useCallback(() => {
    setJsonInput(SAMPLE_JSON);
  }, []);

  const formatJSON = useCallback(() => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonInput(JSON.stringify(parsed, null, 2));
      setError("");
    } catch (err) {
      console.log("🚀 ~ useJSONTree ~ err:", err);
      setError("Cannot format invalid JSON");
    }
  }, [jsonInput]);

  const clearAll = useCallback(() => {
    setJsonInput("");
    setNodes([]);
    setEdges([]);
    setError("");
    setSearchQuery("");
    setSearchResults([]);
    setCurrentSearchIndex(0);
  }, []);

  const handleVisualize = useCallback(() => {
    try {
      const parsed = JSON.parse(jsonInput);
      const { nodes: newNodes, edges: newEdges } = createGraphFromJSON(parsed);
      setNodes(newNodes);
      setEdges(newEdges);
      setError("");
      setSearchResults([]);
      setCurrentSearchIndex(0);
    } catch (err) {
      console.log("🚀 ~ useJSONTree ~ err:", err);
      setError("Invalid JSON");
    }
  }, [jsonInput]);

  const handleSearch = useCallback(
    (query) => {
      setSearchQuery(query);

      if (!query.trim()) {
        setSearchResults([]);
        setCurrentSearchIndex(0);
        setNodes((nodes) =>
          nodes.map((node) => ({
            ...node,
            style: { ...node.style, backgroundColor: undefined }
          }))
        );
        return;
      }

      try {
        const results = [];
        const updatedNodes = nodes.map((node) => {
          const nodePath = node.data?.path || "";
          const nodeValue = node.data?.value || node.data?.label || "";

          const matches =
            nodePath.includes(query) ||
            nodeValue.toString().toLowerCase().includes(query.toLowerCase());

          if (matches) {
            results.push(node.id);
          }

          return {
            ...node,
            style: {
              ...node.style,
              backgroundColor: matches ? "#ffeb3b" : undefined
            }
          };
        });

        setNodes(updatedNodes);
        setSearchResults(results);
        setCurrentSearchIndex(results.length > 0 ? 0 : -1);
      } catch (err) {
        console.error("Search error:", err);
        setSearchResults([]);
        setCurrentSearchIndex(-1);
      }
    },
    [nodes]
  );

  const navigateSearch = useCallback(
    (direction) => {
      if (searchResults.length === 0) return;

      let newIndex;
      if (direction === "next") {
        newIndex = (currentSearchIndex + 1) % searchResults.length;
      } else {
        newIndex =
          (currentSearchIndex - 1 + searchResults.length) %
          searchResults.length;
      }

      setCurrentSearchIndex(newIndex);
    },
    [searchResults, currentSearchIndex]
  );

  const clearSearch = useCallback(() => {
    setSearchQuery("");
    setSearchResults([]);
    setCurrentSearchIndex(0);
    setNodes((nodes) =>
      nodes.map((node) => ({
        ...node,
        style: { ...node.style, backgroundColor: undefined }
      }))
    );
  }, []);

  return {
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
    navigateSearch,
    clearSearch,
    onNodesChange,
    onEdgesChange
  };
};
