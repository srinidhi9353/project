import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Code as CodeIcon, Terminal, Activity } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { algorithms } from '../../data/algorithms';
import toast from 'react-hot-toast';

const languageTemplates = {
  python: (algorithmCode: string) => algorithmCode,
  javascript: (algorithmCode: string) => algorithmCode.replace('def ', 'function ').replace(':', ' {').replace(/\n    /g, '\n  ') + '\n}',
  java: (algorithmCode: string) => `public class Solution {\n  ${algorithmCode.replace(/def /g, 'public static ')}\n}`,
  c: (algorithmCode: string) => `#include <stdio.h>\n\n${algorithmCode}`,
  cpp: (algorithmCode: string) => `#include <iostream>\nusing namespace std;\n\n${algorithmCode}`,
};

export const CodeVisualizer: React.FC = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('bubble-sort');
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [currentLine, setCurrentLine] = useState(-1);
  const [variables, setVariables] = useState<{ [key: string]: any }>({});
  const [output, setOutput] = useState<string[]>([]);
  const [executionSpeed, setExecutionSpeed] = useState(1);

  useEffect(() => {
    const algo = algorithms.find(a => a.id === selectedAlgorithm);
    if (algo) {
      setCode(algo.code);
    }
  }, [selectedAlgorithm, language]);

  const simulateExecution = async () => {
    setIsRunning(true);
    setOutput([]);
    setVariables({});

    const algo = algorithms.find(a => a.id === selectedAlgorithm);
    if (!algo) return;

    const lines = code.split('\n');
    const delay = 1000 / executionSpeed;

    // Simulate execution for bubble sort
    if (selectedAlgorithm === 'bubble-sort') {
      const arr = [64, 34, 25, 12, 22, 11, 90];
      setVariables({ arr: [...arr], n: arr.length });

      for (let i = 0; i < arr.length - 1; i++) {
        setVariables(prev => ({ ...prev, i, outerLoop: i }));
        setCurrentLine(2);
        await new Promise(resolve => setTimeout(resolve, delay));

        for (let j = 0; j < arr.length - i - 1; j++) {
          setVariables(prev => ({ ...prev, j, comparing: [arr[j], arr[j + 1]] }));
          setCurrentLine(3);
          await new Promise(resolve => setTimeout(resolve, delay));

          if (arr[j] > arr[j + 1]) {
            setCurrentLine(4);
            await new Promise(resolve => setTimeout(resolve, delay));

            [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            setVariables(prev => ({ ...prev, arr: [...arr], swapped: true }));
            setOutput(prev => [...prev, `Swapped ${arr[j + 1]} and ${arr[j]}`]);
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        }
      }

      setOutput(prev => [...prev, `Final sorted array: [${arr.join(', ')}]`]);
    }

    setCurrentLine(-1);
    setIsRunning(false);
    toast.success('Execution completed!');
  };

  const handleReset = () => {
    setIsRunning(false);
    setCurrentLine(-1);
    setVariables({});
    setOutput([]);
  };

  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      {/* Top Controls */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center space-x-4">
          {/* Algorithm Selector */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Select Algorithm
            </label>
            <select
              value={selectedAlgorithm}
              onChange={(e) => setSelectedAlgorithm(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {algorithms.map(algo => (
                <option key={algo.id} value={algo.id}>
                  {algo.name} - {algo.category}
                </option>
              ))}
            </select>
          </div>

          {/* Language Selector */}
          <div className="w-48">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
              <option value="java">Java</option>
              <option value="c">C</option>
              <option value="cpp">C++</option>
            </select>
          </div>

          {/* Speed Control */}
          <div className="w-48">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Speed: {executionSpeed}x
            </label>
            <input
              type="range"
              min="0.25"
              max="3"
              step="0.25"
              value={executionSpeed}
              onChange={(e) => setExecutionSpeed(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <button
              onClick={simulateExecution}
              disabled={isRunning}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
            >
              <Play className="w-4 h-4" />
              <span>Run & Visualize</span>
            </button>

            <button
              onClick={handleReset}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - Side by Side */}
      <div className="flex-1 flex">
        {/* Left Pane - Code Editor */}
        <div className="w-1/2 border-r border-gray-700 flex flex-col">
          <div className="bg-gray-800 border-b border-gray-700 px-4 py-2 flex items-center space-x-2">
            <CodeIcon className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-gray-300">Code Editor</span>
          </div>

          <div className="flex-1 overflow-auto bg-gray-900">
            <div className="font-mono text-sm">
              {code.split('\n').map((line, index) => (
                <div
                  key={index}
                  className={`px-4 py-1 ${
                    currentLine === index
                      ? 'bg-yellow-900/30 border-l-4 border-yellow-500'
                      : 'hover:bg-gray-800/50'
                  }`}
                >
                  <span className="text-gray-500 select-none mr-4 inline-block w-8 text-right">
                    {index + 1}
                  </span>
                  <span className={currentLine === index ? 'text-yellow-200' : 'text-gray-300'}>
                    {line || ' '}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Pane - Visualization & Variables */}
        <div className="w-1/2 flex flex-col">
          {/* Variables Section */}
          <div className="bg-gray-800 border-b border-gray-700 p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Activity className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-gray-300">Variables & State</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {Object.entries(variables).map(([key, value]) => (
                <div key={key} className="bg-gray-700 rounded-lg p-3">
                  <div className="text-xs text-gray-400 mb-1">{key}</div>
                  <div className="font-mono text-sm text-white">
                    {Array.isArray(value) ? `[${value.join(', ')}]` : String(value)}
                  </div>
                </div>
              ))}
            </div>

            {Object.keys(variables).length === 0 && (
              <div className="text-center text-gray-500 text-sm py-4">
                No variables to display. Run the code to see execution state.
              </div>
            )}
          </div>

          {/* Output Console */}
          <div className="flex-1 flex flex-col">
            <div className="bg-gray-800 border-b border-gray-700 px-4 py-2 flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-green-400" />
              <span className="text-sm font-medium text-gray-300">Output Console</span>
            </div>

            <div className="flex-1 overflow-auto bg-gray-900 p-4 font-mono text-sm">
              {output.map((line, index) => (
                <div key={index} className="text-green-400 mb-1">
                  {line}
                </div>
              ))}

              {output.length === 0 && (
                <div className="text-gray-500">
                  Console output will appear here...
                </div>
              )}
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-gray-800 border-t border-gray-700 p-4">
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-xs text-gray-400 mb-1">Time Complexity</div>
                <div className="text-sm font-bold text-red-400">
                  {algorithms.find(a => a.id === selectedAlgorithm)?.timeComplexity}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">Space Complexity</div>
                <div className="text-sm font-bold text-blue-400">
                  {algorithms.find(a => a.id === selectedAlgorithm)?.spaceComplexity}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">Execution Time</div>
                <div className="text-sm font-bold text-green-400">
                  {isRunning ? 'Running...' : '0.003ms'}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">Memory Usage</div>
                <div className="text-sm font-bold text-purple-400">1.2KB</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
