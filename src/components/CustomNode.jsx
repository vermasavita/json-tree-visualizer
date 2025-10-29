import { Handle, Position } from "reactflow";

const CustomNode = ({ data, selected }) => {
  const { label, backgroundColor, isContentNode } = data;
  
  const displayLabel = () => {
    if (label === null) return "null";
    if (label === undefined) return "undefined";
    if (typeof label === 'object') return JSON.stringify(label);
    return String(label);
  };
  
  return (
    <div className="relative">
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={false}
        className="w-2.5 h-2.5"
      />
      
      <div
        className={`rounded-lg text-white font-medium text-sm shadow-lg px-4 py-2 transition-all duration-200
          ${isContentNode 
            ? "whitespace-pre-line text-left min-w-[150px]" 
            : "text-center"
          } 
          ${selected ? 'ring-2 ring-blue-400' : ''}
          ${backgroundColor}`}
      >
        {displayLabel()}
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