import React, { useState } from 'react';
import { Play, Info, Layers } from 'lucide-react';

interface DataStructure {
  id: string;
  name: string;
  description: string;
  operations: string[];
  timeComplexity: { [key: string]: string };
  useCase: string;
}

export const DataStructuresList: React.FC = () => {
  const [selectedStructure, setSelectedStructure] = useState<string>('');
  
  const dataStructures: DataStructure[] = [
    {
      id: 'array',
      name: 'Array',
      description: 'A collection of elements stored in contiguous memory locations.',
      operations: ['Access', 'Insert', 'Delete', 'Search'],
      timeComplexity: {
        'Access': 'O(1)',
        'Insert': 'O(n)',
        'Delete': 'O(n)',
        'Search': 'O(n)',
      },
      useCase: 'When you need fast random access to elements by index.',
    },
    {
      id: 'linked-list',
      name: 'Linked List',
      description: 'Linear data structure where elements point to the next element.',
      operations: ['Insert', 'Delete', 'Search', 'Traverse'],
      timeComplexity: {
        'Insert': 'O(1)',
        'Delete': 'O(1)',
        'Search': 'O(n)',
        'Traverse': 'O(n)',
      },
      useCase: 'When you need efficient insertion and deletion at any position.',
    },
    {
      id: 'stack',
      name: 'Stack',
      description: 'LIFO (Last In, First Out) data structure.',
      operations: ['Push', 'Pop', 'Peek', 'Empty'],
      timeComplexity: {
        'Push': 'O(1)',
        'Pop': 'O(1)',
        'Peek': 'O(1)',
        'Empty': 'O(1)',
      },
      useCase: 'Function calls, expression evaluation, undo operations.',
    },
    {
      id: 'queue',
      name: 'Queue',
      description: 'FIFO (First In, First Out) data structure.',
      operations: ['Enqueue', 'Dequeue', 'Front', 'Empty'],
      timeComplexity: {
        'Enqueue': 'O(1)',
        'Dequeue': 'O(1)',
        'Front': 'O(1)',
        'Empty': 'O(1)',
      },
      useCase: 'BFS traversal, task scheduling, buffer for data streams.',
    },
    {
      id: 'binary-tree',
      name: 'Binary Tree',
      description: 'Hierarchical structure where each node has at most two children.',
      operations: ['Insert', 'Delete', 'Search', 'Traverse'],
      timeComplexity: {
        'Insert': 'O(log n)',
        'Delete': 'O(log n)',
        'Search': 'O(log n)',
        'Traverse': 'O(n)',
      },
      useCase: 'Hierarchical data representation, decision trees.',
    },
    {
      id: 'hash-table',
      name: 'Hash Table',
      description: 'Data structure that maps keys to values using a hash function.',
      operations: ['Insert', 'Delete', 'Search', 'Update'],
      timeComplexity: {
        'Insert': 'O(1)',
        'Delete': 'O(1)',
        'Search': 'O(1)',
        'Update': 'O(1)',
      },
      useCase: 'Fast lookup, caching, database indexing.',
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Data Structures 🧱
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Interactive exploration of fundamental data structures
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Structure List */}
        <div className="lg:col-span-1 space-y-4">
          {dataStructures.map((structure) => (
            <div
              key={structure.id}
              onClick={() => setSelectedStructure(structure.id)}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                selectedStructure === structure.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                {structure.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {structure.description}
              </p>
            </div>
          ))}
        </div>

        {/* Visualization & Details */}
        <div className="lg:col-span-2">
          {selectedStructure ? (
            <DataStructureVisualization 
              structure={dataStructures.find(s => s.id === selectedStructure)!}
            />
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
              <Layers className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Select a Data Structure
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Choose a data structure from the list to see its visualization and operations
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const DataStructureVisualization: React.FC<{ structure: DataStructure }> = ({ structure }) => {
  const [elements, setElements] = useState<string[]>(['A', 'B', 'C']);
  const [newElement, setNewElement] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const [operation, setOperation] = useState<string>('');

  const handleInsert = () => {
    if (newElement) {
      const newElements = [...elements, newElement];
      setElements(newElements);
      setHighlightedIndex(newElements.length - 1);
      setOperation(`Inserted "${newElement}" at position ${newElements.length - 1}`);
      setNewElement('');
      setTimeout(() => setHighlightedIndex(-1), 2000);
    }
  };

  const handleDelete = (index: number) => {
    const deletedElement = elements[index];
    setElements(elements.filter((_, i) => i !== index));
    setOperation(`Deleted "${deletedElement}" from position ${index}`);
    setTimeout(() => setOperation(''), 3000);
  };

  const handleSearch = (element: string) => {
    const index = elements.indexOf(element);
    if (index !== -1) {
      setHighlightedIndex(index);
      setOperation(`Found "${element}" at position ${index}`);
      setTimeout(() => setHighlightedIndex(-1), 3000);
    } else {
      setOperation(`"${element}" not found in structure`);
      setTimeout(() => setOperation(''), 3000);
    }
  };

  const renderVisualization = () => {
    switch (structure.id) {
      case 'array':
        return (
          <div className="flex space-x-3 justify-center items-end">
            {elements.map((element, index) => (
              <div key={index} className="flex flex-col items-center">
                <span className="text-xs text-gray-500 mb-1">[{index}]</span>
                <div
                  className={`w-14 h-14 rounded-lg flex items-center justify-center font-mono cursor-pointer transition-all duration-300 ${
                    highlightedIndex === index
                      ? 'bg-yellow-500 text-white scale-110 shadow-lg'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                  onClick={() => handleDelete(index)}
                >
                  {element}
                </div>
              </div>
            ))}
          </div>
        );
        
      case 'linked-list':
        return (
          <div className="flex items-center justify-center space-x-6">
            {elements.map((element, index) => (
              <div key={index} className="flex items-center">
                <div className={`flex items-center rounded-lg p-4 transition-all duration-300 ${
                  highlightedIndex === index
                    ? 'bg-yellow-500 text-white scale-110 shadow-lg'
                    : 'bg-blue-500 text-white'
                }`}>
                  <span className="font-mono mr-3 text-lg">{element}</span>
                  <div className="w-8 h-8 border-2 border-white rounded-sm flex items-center justify-center">
                    →
                  </div>
                </div>
                {index < elements.length - 1 && (
                  <div className="w-12 h-1 bg-gray-400 mx-3 rounded"></div>
                )}
              </div>
            ))}
            <div className="text-gray-400 font-mono text-lg bg-gray-200 dark:bg-gray-700 px-3 py-2 rounded">
              NULL
            </div>
          </div>
        );
        
      case 'stack':
        return (
          <div className="flex flex-col-reverse items-center space-y-reverse space-y-2">
            {elements.map((element, index) => (
              <div
                key={index}
                className={`w-32 h-16 rounded-lg flex items-center justify-center font-mono border-2 cursor-pointer transition-all duration-300 ${
                  highlightedIndex === (elements.length - 1 - index)
                    ? 'bg-yellow-500 text-white border-yellow-600 scale-105 shadow-lg'
                    : index === 0
                    ? 'bg-green-500 text-white border-green-600 hover:bg-green-600'
                    : 'bg-blue-500 text-white border-blue-600 hover:bg-blue-600'
                }`}
                onClick={() => handleDelete(elements.length - 1 - index)}
              >
                <span className="text-lg">{element}</span>
              </div>
            ))}
            <div className="text-gray-500 text-sm mt-4 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded">
              ← Top (LIFO)
            </div>
          </div>
        );
        
      case 'queue':
        return (
          <div className="flex items-center justify-center space-x-4">
            <div className="text-gray-500 text-sm bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded">
              Front →
            </div>
            {elements.map((element, index) => (
              <div
                key={index}
                className={`w-16 h-16 rounded-lg flex items-center justify-center font-mono cursor-pointer transition-all duration-300 ${
                  highlightedIndex === index
                    ? 'bg-yellow-500 text-white scale-110 shadow-lg'
                    : index === 0
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
                onClick={() => handleDelete(0)}
              >
                <span className="text-lg">{element}</span>
              </div>
            ))}
            <div className="text-gray-500 text-sm bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded">
              ← Rear
            </div>
          </div>
        );
        
      case 'binary-tree':
        return (
          <div className="flex flex-col items-center space-y-8">
            {/* Root */}
            {elements.length > 0 && (
              <div className={`w-16 h-16 rounded-full flex items-center justify-center font-mono text-lg transition-all duration-300 ${
                highlightedIndex === 0
                  ? 'bg-yellow-500 text-white scale-110 shadow-lg'
                  : 'bg-blue-500 text-white'
              }`}>
                {elements[0]}
              </div>
            )}
            
            {/* Level 2 */}
            {elements.length > 1 && (
              <div className="flex space-x-24">
                {elements.slice(1, 3).map((element, index) => (
                  <div
                    key={index + 1}
                    className={`w-14 h-14 rounded-full flex items-center justify-center font-mono transition-all duration-300 ${
                      highlightedIndex === index + 1
                        ? 'bg-yellow-500 text-white scale-110 shadow-lg'
                        : 'bg-green-500 text-white'
                    }`}
                  >
                    {element}
                  </div>
                ))}
              </div>
            )}
            
            {/* Level 3 */}
            {elements.length > 3 && (
              <div className="flex space-x-8">
                {elements.slice(3, 7).map((element, index) => (
                  <div
                    key={index + 3}
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-mono text-sm transition-all duration-300 ${
                      highlightedIndex === index + 3
                        ? 'bg-yellow-500 text-white scale-110 shadow-lg'
                        : 'bg-purple-500 text-white'
                    }`}
                  >
                    {element}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
        
      case 'hash-table':
        return (
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 8 }, (_, index) => {
              const element = elements[index];
              return (
                <div key={index} className="flex flex-col items-center">
                  <span className="text-xs text-gray-500 mb-2">Bucket {index}</span>
                  <div className={`w-16 h-16 border-2 border-dashed rounded-lg flex items-center justify-center font-mono transition-all duration-300 ${
                    element
                      ? highlightedIndex === index
                        ? 'bg-yellow-500 text-white border-yellow-500 scale-110 shadow-lg'
                        : 'bg-blue-500 text-white border-blue-500'
                      : 'border-gray-300 dark:border-gray-600 text-gray-400'
                  }`}>
                    {element || '∅'}
                  </div>
                </div>
              );
            })}
          </div>
        );
        
      default:
        return (
          <div className="text-center py-8">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl mx-auto mb-6 flex items-center justify-center shadow-lg">
              <Layers className="w-12 h-12 text-white" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Interactive visualization for {structure.name}
            </p>
          </div>
        );
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {structure.name}
        </h3>
        <p className="text-gray-600 dark:text-gray-400">{structure.description}</p>
      </div>

      {/* Visualization Area */}
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 rounded-xl p-8 mb-6 min-h-64 flex items-center border border-gray-200 dark:border-gray-700">
        {renderVisualization()}
      </div>

      {/* Operation Status */}
      {operation && (
        <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-green-800 dark:text-green-400 text-sm font-medium">
            {operation}
          </p>
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          value={newElement}
          onChange={(e) => setNewElement(e.target.value)}
          placeholder="Enter element..."
          className="flex-1 min-w-40 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          onKeyPress={(e) => e.key === 'Enter' && handleInsert()}
        />
        <button
          onClick={handleInsert}
          disabled={!newElement.trim()}
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-lg transition-colors font-medium disabled:cursor-not-allowed"
        >
          Insert
        </button>
        <button
          onClick={() => handleSearch(newElement)}
          disabled={!newElement.trim()}
          className="px-6 py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-lg transition-colors font-medium disabled:cursor-not-allowed"
        >
          Search
        </button>
        <button
          onClick={() => setElements([])}
          className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium"
        >
          Clear
        </button>
        <button
          onClick={() => {
            const randomElements = ['X', 'Y', 'Z', 'W', 'V'].slice(0, Math.floor(Math.random() * 4) + 2);
            setElements(randomElements);
            setOperation('Generated random data');
            setTimeout(() => setOperation(''), 2000);
          }}
          className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors font-medium"
        >
          Random
        </button>
      </div>

      {/* Operations & Complexity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
            Operations
          </h4>
          <div className="space-y-2">
            {structure.operations.map((op) => (
              <div key={op} className="flex justify-between items-center py-1">
                <span className="text-sm text-gray-600 dark:text-gray-400">{op}:</span>
                <span className="text-sm font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  {structure.timeComplexity[op] || 'N/A'}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
            Use Case
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
            {structure.useCase}
          </p>
        </div>
      </div>
    </div>
  );
};