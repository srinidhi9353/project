import React, { useState } from 'react';
import { Search, Filter, ChevronRight, Clock, Activity } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { algorithms } from '../../data/algorithms';

export const AlgorithmList: React.FC = () => {
  const { setSelectedAlgorithm, setCurrentView } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...new Set(algorithms.map(a => a.category))];

  const filteredAlgorithms = algorithms.filter(algo => {
    const matchesSearch = algo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         algo.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || algo.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSelectAlgorithm = (algo: any) => {
    setSelectedAlgorithm(algo);
    setCurrentView('visualizer');
  };

  const difficultyColors = {
    Easy: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400',
    Medium: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
    Hard: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Algorithm Library
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Explore and visualize {algorithms.length} algorithms across multiple categories
        </p>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search algorithms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Category Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Algorithms</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{filteredAlgorithms.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">Categories</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{categories.length - 1}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">Easy</p>
          <p className="text-2xl font-bold text-emerald-600">{filteredAlgorithms.filter(a => a.difficulty === 'Easy').length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">Hard</p>
          <p className="text-2xl font-bold text-red-600">{filteredAlgorithms.filter(a => a.difficulty === 'Hard').length}</p>
        </div>
      </div>

      {/* Algorithm Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAlgorithms.map((algo) => (
          <div
            key={algo.id}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all cursor-pointer group"
            onClick={() => handleSelectAlgorithm(algo)}
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {algo.name}
              </h3>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
              {algo.description}
            </p>

            <div className="flex items-center justify-between mb-4">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${difficultyColors[algo.difficulty]}`}>
                {algo.difficulty}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-500">{algo.category}</span>
            </div>

            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Clock className="w-4 h-4 mr-1" />
                <span className="text-xs">{algo.timeComplexity}</span>
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Activity className="w-4 h-4 mr-1" />
                <span className="text-xs">{algo.spaceComplexity}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAlgorithms.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No algorithms found matching your criteria</p>
        </div>
      )}
    </div>
  );
};
