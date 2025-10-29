export class JSONToGraphConverter {
  constructor(xSpacing = 320, ySpacing = 150) {
    this.xSpacing = xSpacing;
    this.ySpacing = ySpacing;
    this.nodeId = 0;
  }

  generateId = () => `node-${this.nodeId++}`;

  isPrimitive = (value) => {
    return value === null || typeof value !== "object";
  };

  formatPrimitiveContent = (primitives) => {
    return primitives
      .map(({ key, value }) => {
        const formattedValue =
          typeof value === "string" ? `"${value}"` : String(value);
        return `${key}: ${formattedValue}`;
      })
      .join("\n");
  };

  createNode = (id, position, data) => ({
    id,
    type: "custom",
    position,
    data: {
      label: data.label,
      backgroundColor: data.backgroundColor,
      isContentNode: data.isContentNode,
      path: data.path || "",
      value: data.value
    }
  });

  createEdge = (sourceId, targetId) => ({
    id: `edge-${sourceId}-${targetId}`,
    source: sourceId,
    target: targetId,
    type: "default",
    style: {
      stroke: "#4B5563",
      strokeWidth: 3
    }
  });

  getNodeConfig = (obj, key, parentId, primitives, nested) => {
    const hasOnlyPrimitives = nested.length === 0 && primitives.length > 0;
    const isRoot = parentId === null;

    if (isRoot) {
      return {
        label: "root {}",
        backgroundColor: "bg-purple-500",
        isContentNode: false
      };
    }

    if (Array.isArray(obj)) {
      return {
        label: `${key} [${obj.length}]`,
        backgroundColor: "bg-green-500",
        isContentNode: false
      };
    }

    if (hasOnlyPrimitives) {
      return {
        label: this.formatPrimitiveContent(primitives),
        backgroundColor: "bg-gray-700",
        isContentNode: true
      };
    }

    const keyCount = Object.keys(obj).length;
    return {
      label: key ? `${key} {${keyCount}}` : `{${keyCount}}`,
      backgroundColor: "bg-blue-500",
      isContentNode: false
    };
  };

  processObject = (obj, key, parentId, depth, yOffset, parentPath = '$') => {
    const currentNodeId = this.generateId();
    const nodes = [];
    const edges = [];

    const primitives = [];
    const nested = [];

    Object.entries(obj).forEach(([childKey, value]) => {
      if (this.isPrimitive(value)) {
        primitives.push({ key: childKey, value });
      } else {
        nested.push({ key: childKey, value });
      }
    });

    const { label, backgroundColor, isContentNode } = this.getNodeConfig(
      obj,
      key,
      parentId,
      primitives,
      nested
    );

    let currentPath = parentPath;
    if (key !== null) {
      currentPath = Array.isArray(obj) 
        ? `${parentPath}[${key}]`
        : `${parentPath}.${key}`;
    }

    const position = { x: depth * this.xSpacing, y: yOffset };

    nodes.push(
      this.createNode(currentNodeId, position, {
        label,
        backgroundColor,
        isContentNode,
        path: currentPath,
        value: isContentNode ? obj : undefined
      })
    );

    if (parentId) {
      edges.push(this.createEdge(parentId, currentNodeId));
    }

    if (!isContentNode) {
      const childrenResult = this.processChildren(
        obj,
        currentNodeId,
        depth,
        yOffset,
        primitives,
        nested,
        currentPath
      );
      nodes.push(...childrenResult.nodes);
      edges.push(...childrenResult.edges);
    }

    return { currentNodeId, nodes, edges };
  };

  processChildren = (obj, parentId, depth, yOffset, primitives, nested, parentPath) => {
    const nodes = [];
    const edges = [];
    let children = [];

    if (Array.isArray(obj)) {
      children = obj.map((value, index) => ({
        key: index,
        value,
        isNested: !this.isPrimitive(value)
      }));
    } else {
      if (primitives.length > 0) {
        children.push({ isPrimitiveGroup: true, primitives });
      }
      children = children.concat(
        nested.map((item) => ({ ...item, isNested: true }))
      );
    }

    const totalChildren = children.length;

    if (totalChildren > 0) {
      const totalHeight = (totalChildren - 1) * this.ySpacing;
      const startY = yOffset - totalHeight / 2;

      children.forEach((child, index) => {
        const childY = startY + index * this.ySpacing;

        if (child.isPrimitiveGroup) {
          const primitiveNodeId = this.generateId();
          const primitiveLabel = this.formatPrimitiveContent(child.primitives);

          nodes.push(
            this.createNode(
              primitiveNodeId,
              { x: (depth + 1) * this.xSpacing, y: childY },
              {
                label: primitiveLabel,
                backgroundColor: "bg-orange-500",
                isContentNode: true,
                path: parentPath, 
                value: Object.fromEntries(child.primitives.map(p => [p.key, p.value]))
              }
            )
          );

          edges.push(this.createEdge(parentId, primitiveNodeId));
        } else {
          const childResult = this.processObject(
            child.value,
            child.key,
            parentId,
            depth + 1,
            childY,
            parentPath
          );
          nodes.push(...childResult.nodes);
          edges.push(...childResult.edges);
        }
      });
    }

    return { nodes, edges };
  };

  convert = (data) => {
    this.nodeId = 0;
    const result = this.processObject(data, null, null, 0, 0, '$');
    return { nodes: result.nodes, edges: result.edges };
  };
}

export const createGraphFromJSON = (data) => {
  const converter = new JSONToGraphConverter();
  return converter.convert(data);
};