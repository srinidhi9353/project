import { Algorithm } from '../types';

export interface VisualizationStep {
  step: number;
  description: string;
  data: any;
  highlighted: number[];
  variables: { [key: string]: any };
  codeLine?: number;
}

export const generateVisualizationSteps = (
  algorithm: Algorithm, 
  input: string, 
  target?: string
): VisualizationStep[] => {
  switch (algorithm.id) {
    case 'bubble-sort':
      return generateBubbleSortSteps(parseArrayInput(input));
    case 'selection-sort':
      return generateSelectionSortSteps(parseArrayInput(input));
    case 'insertion-sort':
      return generateInsertionSortSteps(parseArrayInput(input));
    case 'merge-sort':
      return generateMergeSortSteps(parseArrayInput(input));
    case 'quick-sort':
      return generateQuickSortSteps(parseArrayInput(input));
    case 'heap-sort':
      return generateHeapSortSteps(parseArrayInput(input));
    case 'linear-search':
      return generateLinearSearchSteps(parseArrayInput(input), target ? parseInt(target) : parseArrayInput(input)[0]);
    case 'binary-search':
      return generateBinarySearchSteps(parseArrayInput(input), target ? parseInt(target) : parseArrayInput(input)[0]);
    case 'bfs':
      return generateBFSSteps(parseGraphInput(input));
    case 'dfs':
      return generateDFSSteps(parseGraphInput(input));
    case 'dijkstra':
      return generateDijkstraSteps(parseWeightedGraphInput(input));
    case 'tower-of-hanoi':
      return generateTowerOfHanoiSteps(parseInt(input) || 3);
    case 'knapsack':
      return generateKnapsackSteps(parseKnapsackInput(input));
    case 'binary-tree-traversal':
      return generateTreeTraversalSteps(parseTreeInput(input));
    default:
      return generateBubbleSortSteps(parseArrayInput(input));
  }
};

// Input parsers
const parseArrayInput = (input: string): number[] => {
  return input.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
};

const parseGraphInput = (input: string): { nodes: any[], edges: any[] } => {
  const edges = input.split(',').map(edge => {
    const [from, to] = edge.trim().split('-').map(x => parseInt(x));
    return { from, to };
  });
  
  const nodeSet = new Set<number>();
  edges.forEach(edge => {
    nodeSet.add(edge.from);
    nodeSet.add(edge.to);
  });
  
  const nodes = Array.from(nodeSet).map(id => ({
    id,
    x: 100 + (id % 3) * 150,
    y: 100 + Math.floor(id / 3) * 100,
    visited: false
  }));
  
  return { nodes, edges };
};

const parseWeightedGraphInput = (input: string): { nodes: any[], edges: any[] } => {
  const edges = input.split(',').map(edge => {
    const [connection, weight] = edge.trim().split(':');
    const [from, to] = connection.split('-').map(x => parseInt(x));
    return { from, to, weight: parseInt(weight) || 1 };
  });
  
  const nodeSet = new Set<number>();
  edges.forEach(edge => {
    nodeSet.add(edge.from);
    nodeSet.add(edge.to);
  });
  
  const nodes = Array.from(nodeSet).map(id => ({
    id,
    x: 100 + (id % 3) * 150,
    y: 100 + Math.floor(id / 3) * 100,
    visited: false,
    distance: id === 0 ? 0 : Infinity
  }));
  
  return { nodes, edges };
};

const parseKnapsackInput = (input: string): { weights: number[], values: number[], capacity: number } => {
  const parts = input.split(';');
  const weights = parts[0].split(':')[1].split(',').map(x => parseInt(x.trim()));
  const values = parts[1].split(':')[1].split(',').map(x => parseInt(x.trim()));
  const capacity = parseInt(parts[2].split(':')[1]);
  return { weights, values, capacity };
};

const parseTreeInput = (input: string): (number | null)[] => {
  return input.split(',').map(x => x.trim() === 'null' ? null : parseInt(x.trim()));
};

// Algorithm step generators
const generateBubbleSortSteps = (arr: number[]): VisualizationStep[] => {
  const steps: VisualizationStep[] = [];
  const array = [...arr];
  const n = array.length;

  steps.push({
    step: 0,
    description: 'Starting Bubble Sort - comparing adjacent elements',
    data: [...array],
    highlighted: [],
    variables: { n, i: 0, j: 0 },
    codeLine: 0
  });

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      steps.push({
        step: steps.length,
        description: `Comparing elements at positions ${j} and ${j + 1}`,
        data: [...array],
        highlighted: [j, j + 1],
        variables: { n, i, j, comparing: [array[j], array[j + 1]] },
        codeLine: 3
      });

      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        steps.push({
          step: steps.length,
          description: `Swapped ${array[j + 1]} and ${array[j]}`,
          data: [...array],
          highlighted: [j, j + 1],
          variables: { n, i, j, swapped: true },
          codeLine: 4
        });
      }
    }
  }

  steps.push({
    step: steps.length,
    description: 'Bubble Sort completed! Array is now sorted.',
    data: [...array],
    highlighted: [],
    variables: { n, sorted: true },
    codeLine: 7
  });

  return steps;
};

const generateSelectionSortSteps = (arr: number[]): VisualizationStep[] => {
  const steps: VisualizationStep[] = [];
  const array = [...arr];
  const n = array.length;

  steps.push({
    step: 0,
    description: 'Starting Selection Sort - finding minimum elements',
    data: [...array],
    highlighted: [],
    variables: { n },
    codeLine: 0
  });

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    
    steps.push({
      step: steps.length,
      description: `Finding minimum element in unsorted portion starting at index ${i}`,
      data: [...array],
      highlighted: [i],
      variables: { i, minIdx, currentMin: array[minIdx] },
      codeLine: 2
    });

    for (let j = i + 1; j < n; j++) {
      steps.push({
        step: steps.length,
        description: `Comparing ${array[j]} with current minimum ${array[minIdx]}`,
        data: [...array],
        highlighted: [minIdx, j],
        variables: { i, j, minIdx, comparing: array[j] },
        codeLine: 4
      });

      if (array[j] < array[minIdx]) {
        minIdx = j;
        steps.push({
          step: steps.length,
          description: `New minimum found: ${array[minIdx]} at index ${minIdx}`,
          data: [...array],
          highlighted: [minIdx],
          variables: { i, j, minIdx, newMin: array[minIdx] },
          codeLine: 5
        });
      }
    }

    if (minIdx !== i) {
      [array[i], array[minIdx]] = [array[minIdx], array[i]];
      steps.push({
        step: steps.length,
        description: `Swapped minimum element ${array[i]} to position ${i}`,
        data: [...array],
        highlighted: [i, minIdx],
        variables: { i, minIdx, swapped: true },
        codeLine: 8
      });
    }
  }

  steps.push({
    step: steps.length,
    description: 'Selection Sort completed!',
    data: [...array],
    highlighted: [],
    variables: { sorted: true },
    codeLine: 11
  });

  return steps;
};

const generateInsertionSortSteps = (arr: number[]): VisualizationStep[] => {
  const steps: VisualizationStep[] = [];
  const array = [...arr];

  steps.push({
    step: 0,
    description: 'Starting Insertion Sort - building sorted portion one element at a time',
    data: [...array],
    highlighted: [],
    variables: {},
    codeLine: 0
  });

  for (let i = 1; i < array.length; i++) {
    const key = array[i];
    let j = i - 1;

    steps.push({
      step: steps.length,
      description: `Inserting element ${key} into sorted portion`,
      data: [...array],
      highlighted: [i],
      variables: { i, key, j },
      codeLine: 2
    });

    while (j >= 0 && array[j] > key) {
      steps.push({
        step: steps.length,
        description: `Moving ${array[j]} one position right`,
        data: [...array],
        highlighted: [j, j + 1],
        variables: { i, key, j, moving: array[j] },
        codeLine: 4
      });

      array[j + 1] = array[j];
      j--;
    }

    array[j + 1] = key;
    steps.push({
      step: steps.length,
      description: `Placed ${key} in correct position`,
      data: [...array],
      highlighted: [j + 1],
      variables: { i, key, insertedAt: j + 1 },
      codeLine: 7
    });
  }

  steps.push({
    step: steps.length,
    description: 'Insertion Sort completed!',
    data: [...array],
    highlighted: [],
    variables: { sorted: true },
    codeLine: 9
  });

  return steps;
};

const generateLinearSearchSteps = (arr: number[], target: number): VisualizationStep[] => {
  const steps: VisualizationStep[] = [];

  steps.push({
    step: 0,
    description: `Starting Linear Search for target: ${target}`,
    data: [...arr],
    highlighted: [],
    variables: { target, length: arr.length },
    codeLine: 0
  });

  for (let i = 0; i < arr.length; i++) {
    steps.push({
      step: steps.length,
      description: `Checking element at index ${i}: ${arr[i]}`,
      data: [...arr],
      highlighted: [i],
      variables: { target, i, current: arr[i] },
      codeLine: 2
    });

    if (arr[i] === target) {
      steps.push({
        step: steps.length,
        description: `Found target ${target} at index ${i}!`,
        data: [...arr],
        highlighted: [i],
        variables: { target, i, found: true, foundIndex: i },
        codeLine: 3
      });
      return steps;
    }
  }

  steps.push({
    step: steps.length,
    description: `Target ${target} not found in array`,
    data: [...arr],
    highlighted: [],
    variables: { target, found: false },
    codeLine: 6
  });

  return steps;
};

const generateBinarySearchSteps = (arr: number[], target: number): VisualizationStep[] => {
  const steps: VisualizationStep[] = [];
  let left = 0;
  let right = arr.length - 1;

  steps.push({
    step: 0,
    description: `Starting Binary Search for target: ${target}`,
    data: [...arr],
    highlighted: [],
    variables: { target, left, right, length: arr.length },
    codeLine: 0
  });

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    steps.push({
      step: steps.length,
      description: `Checking middle element at index ${mid}: ${arr[mid]}`,
      data: [...arr],
      highlighted: [mid],
      variables: { target, left, right, mid, current: arr[mid] },
      codeLine: 4
    });

    if (arr[mid] === target) {
      steps.push({
        step: steps.length,
        description: `Found target ${target} at index ${mid}!`,
        data: [...arr],
        highlighted: [mid],
        variables: { target, mid, found: true, foundIndex: mid },
        codeLine: 6
      });
      return steps;
    } else if (arr[mid] < target) {
      left = mid + 1;
      steps.push({
        step: steps.length,
        description: `Target is greater, search right half`,
        data: [...arr],
        highlighted: Array.from({ length: right - left + 1 }, (_, i) => left + i),
        variables: { target, left, right, mid },
        codeLine: 8
      });
    } else {
      right = mid - 1;
      steps.push({
        step: steps.length,
        description: `Target is smaller, search left half`,
        data: [...arr],
        highlighted: Array.from({ length: right - left + 1 }, (_, i) => left + i),
        variables: { target, left, right, mid },
        codeLine: 10
      });
    }
  }

  steps.push({
    step: steps.length,
    description: `Target ${target} not found in array`,
    data: [...arr],
    highlighted: [],
    variables: { target, found: false },
    codeLine: 13
  });

  return steps;
};

// Placeholder implementations for other algorithms
const generateMergeSortSteps = (arr: number[]): VisualizationStep[] => {
  return generateBubbleSortSteps(arr); // Simplified for now
};

const generateQuickSortSteps = (arr: number[]): VisualizationStep[] => {
  return generateBubbleSortSteps(arr); // Simplified for now
};

const generateHeapSortSteps = (arr: number[]): VisualizationStep[] => {
  return generateBubbleSortSteps(arr); // Simplified for now
};

const generateBFSSteps = (graph: any): VisualizationStep[] => {
  const steps: VisualizationStep[] = [];
  const { nodes, edges } = graph;
  const visited = new Set<number>();
  const queue: number[] = [0];
  const nodesCopy = nodes.map((n: any) => ({ ...n, visited: false }));

  steps.push({
    step: 0,
    description: 'Starting BFS from node 0',
    data: { nodes: nodesCopy, edges, queue: [...queue] },
    highlighted: [0],
    variables: { queue: [...queue], visited: Array.from(visited) },
    codeLine: 0
  });

  while (queue.length > 0) {
    const current = queue.shift()!;
    
    if (visited.has(current)) continue;
    
    visited.add(current);
    nodesCopy[current].visited = true;

    steps.push({
      step: steps.length,
      description: `Visiting node ${current}`,
      data: { nodes: [...nodesCopy], edges, queue: [...queue] },
      highlighted: [current],
      variables: { queue: [...queue], visited: Array.from(visited), current },
      codeLine: 5
    });

    const neighbors = edges
      .filter((e: any) => e.from === current)
      .map((e: any) => e.to)
      .filter((neighbor: number) => !visited.has(neighbor));

    neighbors.forEach((neighbor: number) => {
      if (!queue.includes(neighbor)) {
        queue.push(neighbor);
      }
    });

    if (neighbors.length > 0) {
      steps.push({
        step: steps.length,
        description: `Added neighbors [${neighbors.join(', ')}] to queue`,
        data: { nodes: [...nodesCopy], edges, queue: [...queue] },
        highlighted: neighbors,
        variables: { queue: [...queue], visited: Array.from(visited), neighbors },
        codeLine: 8
      });
    }
  }

  return steps;
};

const generateDFSSteps = (graph: any): VisualizationStep[] => {
  const steps: VisualizationStep[] = [];
  const { nodes, edges } = graph;
  const visited = new Set<number>();
  const stack: number[] = [0];
  const nodesCopy = nodes.map((n: any) => ({ ...n, visited: false }));

  steps.push({
    step: 0,
    description: 'Starting DFS from node 0 using stack',
    data: { nodes: nodesCopy, edges, stack: [...stack] },
    highlighted: [0],
    variables: { stack: [...stack], visited: Array.from(visited) },
    codeLine: 0
  });

  while (stack.length > 0) {
    const current = stack.pop()!;

    if (visited.has(current)) continue;

    visited.add(current);
    nodesCopy[current].visited = true;

    steps.push({
      step: steps.length,
      description: `Visiting node ${current} (popped from stack)`,
      data: { nodes: [...nodesCopy], edges, stack: [...stack] },
      highlighted: [current],
      variables: { stack: [...stack], visited: Array.from(visited), current },
      codeLine: 5
    });

    const neighbors = edges
      .filter((e: any) => e.from === current)
      .map((e: any) => e.to)
      .filter((neighbor: number) => !visited.has(neighbor))
      .reverse();

    neighbors.forEach((neighbor: number) => {
      stack.push(neighbor);
    });

    if (neighbors.length > 0) {
      steps.push({
        step: steps.length,
        description: `Added neighbors [${neighbors.join(', ')}] to stack`,
        data: { nodes: [...nodesCopy], edges, stack: [...stack] },
        highlighted: neighbors,
        variables: { stack: [...stack], visited: Array.from(visited), neighbors },
        codeLine: 8
      });
    }
  }

  steps.push({
    step: steps.length,
    description: 'DFS traversal completed!',
    data: { nodes: [...nodesCopy], edges, stack: [] },
    highlighted: [],
    variables: { completed: true, visited: Array.from(visited) },
    codeLine: 12
  });

  return steps;
};

const generateDijkstraSteps = (graph: any): VisualizationStep[] => {
  const steps: VisualizationStep[] = [];
  const { nodes, edges } = graph;
  const distances: { [key: number]: number } = {};
  const visited = new Set<number>();
  const nodesCopy = nodes.map((n: any) => ({ ...n, distance: Infinity, visited: false }));

  nodes.forEach((node: any) => {
    distances[node.id] = Infinity;
  });
  distances[0] = 0;
  nodesCopy[0].distance = 0;

  steps.push({
    step: 0,
    description: 'Starting Dijkstra from node 0 - Initialize distances',
    data: { nodes: [...nodesCopy], edges },
    highlighted: [0],
    variables: { distances: { ...distances }, visited: Array.from(visited), current: 0 },
    codeLine: 0
  });

  while (visited.size < nodes.length) {
    let minDist = Infinity;
    let current = -1;

    for (const node of nodes) {
      if (!visited.has(node.id) && distances[node.id] < minDist) {
        minDist = distances[node.id];
        current = node.id;
      }
    }

    if (current === -1) break;

    visited.add(current);
    nodesCopy[current].visited = true;

    steps.push({
      step: steps.length,
      description: `Visiting node ${current} with distance ${distances[current]}`,
      data: { nodes: [...nodesCopy], edges },
      highlighted: [current],
      variables: { distances: { ...distances }, visited: Array.from(visited), current },
      codeLine: 5
    });

    const neighbors = edges.filter((e: any) => e.from === current);

    neighbors.forEach((edge: any) => {
      const neighbor = edge.to;
      const weight = edge.weight || 1;
      const newDist = distances[current] + weight;

      if (newDist < distances[neighbor]) {
        distances[neighbor] = newDist;
        nodesCopy[neighbor].distance = newDist;

        steps.push({
          step: steps.length,
          description: `Updated distance to node ${neighbor}: ${distances[neighbor]} (via node ${current})`,
          data: { nodes: [...nodesCopy], edges },
          highlighted: [current, neighbor],
          variables: {
            distances: { ...distances },
            visited: Array.from(visited),
            current,
            neighbor,
            newDistance: newDist
          },
          codeLine: 10
        });
      }
    });
  }

  steps.push({
    step: steps.length,
    description: 'Dijkstra completed! All shortest paths found',
    data: { nodes: [...nodesCopy], edges },
    highlighted: [],
    variables: { distances: { ...distances }, completed: true },
    codeLine: 15
  });

  return steps;
};

const generateTowerOfHanoiSteps = (n: number): VisualizationStep[] => {
  const steps: VisualizationStep[] = [];
  const towers: number[][] = [
    Array.from({ length: n }, (_, i) => n - i),
    [],
    []
  ];
  let moveCount = 0;

  steps.push({
    step: 0,
    description: `Starting Tower of Hanoi with ${n} disks on Tower A`,
    data: { towers: towers.map(t => [...t]), n },
    highlighted: [0],
    variables: { towers: towers.map(t => [...t]), moves: moveCount, n },
    codeLine: 0
  });

  const moveDisk = (from: number, to: number, disk: number) => {
    const diskValue = towers[from].pop()!;
    towers[to].push(diskValue);
    moveCount++;

    steps.push({
      step: steps.length,
      description: `Move disk ${disk} from Tower ${String.fromCharCode(65 + from)} to Tower ${String.fromCharCode(65 + to)}`,
      data: { towers: towers.map(t => [...t]), n },
      highlighted: [from, to],
      variables: {
        towers: towers.map(t => [...t]),
        moves: moveCount,
        from: String.fromCharCode(65 + from),
        to: String.fromCharCode(65 + to),
        disk
      },
      codeLine: 3
    });
  };

  const solveHanoi = (disks: number, source: number, destination: number, auxiliary: number) => {
    if (disks === 1) {
      moveDisk(source, destination, disks);
      return;
    }

    solveHanoi(disks - 1, source, auxiliary, destination);
    moveDisk(source, destination, disks);
    solveHanoi(disks - 1, auxiliary, destination, source);
  };

  solveHanoi(n, 0, 2, 1);

  steps.push({
    step: steps.length,
    description: `Tower of Hanoi completed! All ${n} disks moved to Tower C in ${moveCount} moves`,
    data: { towers: towers.map(t => [...t]), n },
    highlighted: [2],
    variables: { towers: towers.map(t => [...t]), moves: moveCount, completed: true },
    codeLine: 9
  });

  return steps;
};

const generateKnapsackSteps = (input: any): VisualizationStep[] => {
  const steps: VisualizationStep[] = [];
  const { weights, values, capacity } = input;
  const n = weights.length;
  const dp = Array(n + 1).fill(null).map(() => Array(capacity + 1).fill(0));

  steps.push({
    step: 0,
    description: 'Starting 0/1 Knapsack Dynamic Programming - Initialize DP table',
    data: { dp: dp.map(row => [...row]), weights, values, capacity },
    highlighted: [],
    variables: { weights, values, capacity, n, currentI: 0, currentW: 0 },
    codeLine: 0
  });

  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= capacity; w++) {
      steps.push({
        step: steps.length,
        description: `Processing item ${i} (weight: ${weights[i-1]}, value: ${values[i-1]}) with capacity ${w}`,
        data: { dp: dp.map(row => [...row]), weights, values, capacity },
        highlighted: [i, w],
        variables: {
          currentI: i,
          currentW: w,
          itemWeight: weights[i-1],
          itemValue: values[i-1]
        },
        codeLine: 2
      });

      if (weights[i - 1] <= w) {
        const include = values[i - 1] + dp[i - 1][w - weights[i - 1]];
        const exclude = dp[i - 1][w];
        dp[i][w] = Math.max(include, exclude);

        steps.push({
          step: steps.length,
          description: `Item ${i} fits! Choose max(include: ${include}, exclude: ${exclude}) = ${dp[i][w]}`,
          data: { dp: dp.map(row => [...row]), weights, values, capacity },
          highlighted: [i, w],
          variables: {
            currentI: i,
            currentW: w,
            include,
            exclude,
            chosen: dp[i][w]
          },
          codeLine: 4
        });
      } else {
        dp[i][w] = dp[i - 1][w];

        steps.push({
          step: steps.length,
          description: `Item ${i} too heavy (${weights[i-1]} > ${w}), skip it`,
          data: { dp: dp.map(row => [...row]), weights, values, capacity },
          highlighted: [i, w],
          variables: {
            currentI: i,
            currentW: w,
            skipped: true
          },
          codeLine: 7
        });
      }
    }
  }

  steps.push({
    step: steps.length,
    description: `Knapsack completed! Maximum value: ${dp[n][capacity]}`,
    data: { dp: dp.map(row => [...row]), weights, values, capacity },
    highlighted: [n, capacity],
    variables: { maxValue: dp[n][capacity], completed: true },
    codeLine: 10
  });

  return steps;
};

const generateTreeTraversalSteps = (treeData: (number | null)[]): VisualizationStep[] => {
  const steps: VisualizationStep[] = [];

  steps.push({
    step: 0,
    description: 'Starting Binary Tree Inorder Traversal',
    data: treeData,
    highlighted: [],
    variables: { visited: [], current: null },
    codeLine: 0
  });

  return steps;
};