import React from 'react';

interface GraphVisualizerProps {
  data: any;
  highlighted: number[];
  algorithm?: string;
  currentStep?: number;
}

export const GraphVisualizer: React.FC<GraphVisualizerProps> = ({ 
  data, 
  highlighted, 
  algorithm = 'bfs',
  currentStep = 0 
}) => {
  if (!data || !data.nodes) {
    // Default graph for demonstration
    const defaultNodes = [
      { id: 0, x: 150, y: 100, visited: false },
      { id: 1, x: 300, y: 80, visited: false },
      { id: 2, x: 100, y: 200, visited: false },
      { id: 3, x: 350, y: 180, visited: false },
      { id: 4, x: 450, y: 120, visited: false },
      { id: 5, x: 400, y: 250, visited: false },
    ];
    
    const defaultEdges = [
      { from: 0, to: 1 },
      { from: 0, to: 2 },
      { from: 1, to: 3 },
      { from: 2, to: 4 },
      { from: 3, to: 5 },
      { from: 4, to: 5 },
    ];

    data = { nodes: defaultNodes, edges: defaultEdges };
  }

  const { nodes, edges, queue } = data;
  
  // Get metaphor-based styling
  const getNodeStyle = (node: any, isHighlighted: boolean) => {
    if (algorithm === 'bfs') {
      // Ripple effect metaphor
      if (isHighlighted) return { fill: '#3B82F6', stroke: '#1E40AF', strokeWidth: 4, r: 30 };
      if (node.visited) return { fill: '#10B981', stroke: '#059669', strokeWidth: 3, r: 25 };
      return { fill: '#E5E7EB', stroke: '#9CA3AF', strokeWidth: 2, r: 25 };
    } else if (algorithm === 'dfs') {
      // Cave exploration metaphor
      if (isHighlighted) return { fill: '#F59E0B', stroke: '#D97706', strokeWidth: 4, r: 30 };
      if (node.visited) return { fill: '#8B5CF6', stroke: '#7C3AED', strokeWidth: 3, r: 25 };
      return { fill: '#F3F4F6', stroke: '#6B7280', strokeWidth: 2, r: 25 };
    } else if (algorithm === 'dijkstra') {
      // GPS route optimization metaphor
      if (isHighlighted) return { fill: '#EF4444', stroke: '#DC2626', strokeWidth: 4, r: 30 };
      if (node.visited) return { fill: '#06B6D4', stroke: '#0891B2', strokeWidth: 3, r: 25 };
      return { fill: '#F9FAFB', stroke: '#4B5563', strokeWidth: 2, r: 25 };
    }
    
    // Default styling
    if (isHighlighted) return { fill: '#EF4444', stroke: '#DC2626', strokeWidth: 4, r: 30 };
    if (node.visited) return { fill: '#10B981', stroke: '#059669', strokeWidth: 3, r: 25 };
    return { fill: '#3B82F6', stroke: '#1E40AF', strokeWidth: 2, r: 25 };
  };

  return (
    <div className="h-full flex flex-col">
      {/* Algorithm Metaphor Header */}
      <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">
              {algorithm === 'bfs' ? '🌊' : 
               algorithm === 'dfs' ? '🕳️' :
               algorithm === 'dijkstra' ? '🗺️' : '🔍'}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {algorithm === 'bfs' ? 'Ripples Expanding in Pond' :
               algorithm === 'dfs' ? 'Exploring Cave Tunnels' :
               algorithm === 'dijkstra' ? 'GPS Route Optimization' : 'Graph Exploration'}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Step {currentStep + 1}: {
                algorithm === 'bfs' ? 'Waves spread to all neighbors at current level' :
                algorithm === 'dfs' ? 'Dive deep into unexplored tunnels' :
                algorithm === 'dijkstra' ? 'Always visit the closest unvisited location' : 'Exploring nodes systematically'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Main Graph Visualization */}
      <div className="flex-1 flex items-center justify-center">
        <svg width="600" height="400" className="border border-gray-300 dark:border-gray-600 rounded-lg bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 shadow-inner">
          {/* Background effects for metaphors */}
          <defs>
            <radialGradient id="rippleGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.1"/>
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0"/>
            </radialGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Ripple effects for BFS */}
          {algorithm === 'bfs' && highlighted.map((nodeId, index) => (
            <circle
              key={`ripple-${nodeId}`}
              cx={nodes[nodeId]?.x || 0}
              cy={nodes[nodeId]?.y || 0}
              r="50"
              fill="url(#rippleGradient)"
              className="animate-ping"
              style={{ animationDelay: `${index * 0.2}s` }}
            />
          ))}
          
        {/* Edges */}
        {edges.map((edge: any, index: number) => {
          const fromNode = nodes[edge.from];
          const toNode = nodes[edge.to];
          const isActive = highlighted.includes(edge.from) || highlighted.includes(edge.to);
          
          return (
            <line
              key={index}
              x1={fromNode.x}
              y1={fromNode.y}
              x2={toNode.x}
              y2={toNode.y}
              stroke={isActive ? "#3B82F6" : "#9CA3AF"}
              strokeWidth={isActive ? "3" : "2"}
              strokeDasharray={algorithm === 'dfs' && isActive ? "5,5" : "none"}
              className="transition-all duration-300"
              filter={isActive ? "url(#glow)" : "none"}
              opacity={isActive ? 1 : 0.6}
            />
          );
        })}
        
        {/* Nodes */}
        {nodes.map((node: any) => {
          const isHighlighted = highlighted.includes(node.id);
          const nodeStyle = getNodeStyle(node, isHighlighted);
          
          return (
            <g key={node.id}>
              {/* Node shadow */}
              <circle
                cx={node.x + 2}
                cy={node.y + 2}
                r={nodeStyle.r}
                fill="rgba(0,0,0,0.1)"
              />
              
              {/* Main node */}
              <circle
                cx={node.x}
                cy={node.y}
                r={nodeStyle.r}
                fill={nodeStyle.fill}
                stroke={nodeStyle.stroke}
                strokeWidth={nodeStyle.strokeWidth}
                className="transition-all duration-500"
                filter={isHighlighted ? "url(#glow)" : "none"}
              />
              
              {/* Node label */}
              <text
                x={node.x}
                y={node.y + 5}
                textAnchor="middle"
                fill="white"
                fontSize="14"
                fontWeight="bold"
                className="pointer-events-none"
              >
                {node.id}
              </text>
              
              {/* Distance label for Dijkstra */}
              {node.distance !== undefined && node.distance !== Infinity && (
                <text
                  x={node.x}
                  y={node.y - 40}
                  textAnchor="middle"
                  fill="#1F2937"
                  fontSize="12"
                  fontWeight="bold"
                  className="bg-white rounded px-1"
                >
                  d: {node.distance}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      </div>
      
      {/* Algorithm State Display */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {queue && queue.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {algorithm === 'bfs' ? 'Wave Front:' : algorithm === 'dfs' ? 'Exploration Stack:' : 'Queue:'}
              </span>
            </div>
            <div className="text-blue-600 dark:text-blue-400 font-mono text-sm bg-blue-50 dark:bg-blue-900/20 rounded px-3 py-2">
            [{queue.join(', ')}]
            </div>
          </div>
        )}
        
        {/* Visited nodes */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {algorithm === 'bfs' ? 'Ripple Reached:' : 
               algorithm === 'dfs' ? 'Tunnels Explored:' : 
               'Visited Nodes:'}
            </span>
          </div>
          <div className="text-green-600 dark:text-green-400 font-mono text-sm bg-green-50 dark:bg-green-900/20 rounded px-3 py-2">
            [{nodes.filter((n: any) => n.visited).map((n: any) => n.id).join(', ')}]
          </div>
        </div>
      </div>
    </div>
  );
};