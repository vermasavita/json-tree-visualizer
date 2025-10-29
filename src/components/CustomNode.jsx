import { Handle, Position } from "reactflow";

const CustomNode = ({ data }) => {
  const { label, backgroundColor, isContentNode } = data;
  
  return (
    <div className="relative">
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={false}
        className="w-2.5 h-2.5"
      />
      
      <div
        className={`rounded-lg text-white font-medium text-sm shadow-lg px-4 py-2
          ${isContentNode 
            ? "whitespace-pre-line text-left min-w-[150px]" 
            : "text-center"
          } 
          ${backgroundColor}`}
      >
        {label}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        isConnectable={false}
        className="w-2.5 h-2.5"
      />
    </div>
  );
};

export default CustomNode;