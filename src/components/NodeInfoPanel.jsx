import Typography from "./widgets/Typography";

const NodeInfoPanel = ({ node }) => {
  if (!node) return null;

  return (
    <div className="absolute bottom-4 left-4 right-4 bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg shadow-lg p-4 z-10 max-w-md">
      <Typography>Node Information</Typography>
      <div className="space-y-2 text-sm">
        <div>
          <Typography>Path: {node.data?.path || "N/A"}</Typography>
        </div>
        <div>
          <Typography>Value:</Typography>
          <div className="font-mono bg-[var(--bg-subtle)] p-2 rounded mt-1 text-xs break-all">
            {node.data?.value !== undefined
              ? JSON.stringify(node.data.value)
              : node.data?.label || "N/A"}
          </div>
        </div>
        <div>
          <Typography>Type:</Typography>
          <Typography className="ml-2 capitalize">
            {node.data?.isContentNode ? "Value" : "Key"}
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default NodeInfoPanel;
