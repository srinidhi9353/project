import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { ChatMessage } from '../../types';

export const ChatInterface: React.FC = () => {
  const { chatMessages, addChatMessage } = useStore();
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    addChatMessage(userMessage);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputMessage);
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date(),
      };
      
      addChatMessage(aiMessage);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickQuestions = [
    "Explain time complexity",
    "What's the difference between BFS and DFS?",
    "How does Quick Sort work?",
    "When should I use dynamic programming?",
  ];

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              AI Algorithm Assistant
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Ask me anything about algorithms, data structures, or code!
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatMessages.length === 0 && (
          <div className="text-center py-8">
            <Sparkles className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Welcome to your AI Assistant!
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              I'm here to help you understand algorithms and solve coding problems.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-w-2xl mx-auto">
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => setInputMessage(question)}
                  className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {chatMessages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-3xl flex space-x-3 ${
                message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.type === 'user'
                    ? 'bg-blue-500'
                    : 'bg-purple-500'
                }`}
              >
                {message.type === 'user' ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Bot className="w-4 h-4 text-white" />
                )}
              </div>
              
              <div
                className={`p-3 rounded-2xl ${
                  message.type === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <p className={`text-xs mt-2 opacity-70`}>
                  {new Date(message.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="flex space-x-3">
              <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-2xl">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="flex space-x-3">
          <div className="flex-1">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about algorithms, data structures, or get code help..."
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={1}
              style={{ minHeight: '44px' }}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim()}
            className="px-4 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

function generateAIResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase();
  
  // Enhanced AI responses with more comprehensive explanations
  if (lowerMessage.includes('time complexity') || lowerMessage.includes('big o')) {
    return `🕒 **Time Complexity Analysis**

Time complexity describes how an algorithm's runtime grows as the input size increases. It's crucial for predicting performance at scale!

**📊 Common Time Complexities (Best to Worst):**

• O(1) - Constant: Same time regardless of input size
  Example: Array access, hash table lookup
  
• O(log n) - Logarithmic: Very efficient, like binary search
  Example: Binary search, balanced tree operations
  
• O(n) - Linear: Time grows proportionally with input
  Example: Linear search, single loop through array
  
• O(n log n) - Linearithmic: Common in efficient sorting algorithms
  Example: Merge sort, heap sort, quick sort (average)
  
• O(n²) - Quadratic: Time grows quadratically, like bubble sort
  Example: Bubble sort, selection sort, nested loops
  
• O(2ⁿ) - Exponential: Very slow, avoid when possible
  Example: Recursive Fibonacci, subset generation

**🎯 Pro Tips:**
- Always consider worst-case scenarios
- Look for nested loops (often indicates O(n²))
- Divide-and-conquer usually gives O(n log n)
- Dynamic programming can reduce exponential to polynomial

**🔍 Want to dive deeper?** Ask me about specific algorithms or complexity analysis techniques!`;
  }
  
  if (lowerMessage.includes('bfs') && lowerMessage.includes('dfs')) {
    return `🌳 **BFS vs DFS: The Ultimate Comparison**

Both are fundamental graph traversal algorithms, but they explore differently!

**BFS (Breadth-First Search):**
🔄 **Strategy**: Explores level by level (like ripples in water)
📦 **Data Structure**: Queue (FIFO - First In, First Out)
🎯 **Best For**: Shortest path in unweighted graphs
⚡ **Space**: O(V) - can use more memory
🏆 **Advantages**: Finds minimum distance, good for "closest" problems

**DFS (Depth-First Search):**
🔄 **Strategy**: Goes as deep as possible first (like exploring a maze)
📦 **Data Structure**: Stack (LIFO) or recursion
🎯 **Best For**: Exploring all paths, detecting cycles
⚡ **Space**: O(h) where h is height - more memory efficient
🏆 **Advantages**: Less memory, good for "existence" problems

**🎮 Real-World Applications:**

**BFS Perfect For:**
- Social media "degrees of separation"
- GPS navigation (shortest route)
- Web crawling (level-by-level)
- Puzzle solving (minimum moves)

**DFS Perfect For:**
- Maze solving
- Topological sorting
- Detecting cycles in graphs
- Backtracking problems

**💡 Memory Tip:** BFS uses more memory but finds shortest paths. DFS uses less memory but goes deep first.

**🚀 Want to see them in action?** Try our graph visualizer to watch both algorithms explore step-by-step!`;
  }
  
  if (lowerMessage.includes('quick sort') || lowerMessage.includes('quicksort')) {
    return `⚡ **Quick Sort: The Speed Demon of Sorting!**

Quick Sort is the Ferrari of sorting algorithms - fast, elegant, and widely used!

**🔧 How It Works:**
1. **Choose a Pivot**: Select an element (usually middle, first, or random)
2. **Partition**: Rearrange so smaller elements go left, larger go right
3. **Conquer**: Recursively sort the left and right subarrays
4. **Combine**: No work needed - array is sorted in place!

**📊 Performance Analysis:**
• **Best Case**: O(n log n) - Perfect pivot splits
• **Average Case**: O(n log n) - Random pivot selection
• **Worst Case**: O(n²) - Already sorted with poor pivot choice
• **Space**: O(log n) - Recursion stack

**🏆 Why It's Amazing:**
✅ **In-Place**: Sorts without extra arrays
✅ **Cache-Friendly**: Good memory locality
✅ **Practical**: Used in most standard libraries
✅ **Parallelizable**: Can split work across cores

**🎯 Optimization Tricks:**
- **Random Pivot**: Avoids worst-case on sorted data
- **3-Way Partitioning**: Handles duplicates efficiently
- **Hybrid Approach**: Switch to insertion sort for small arrays
- **Tail Recursion**: Optimize recursive calls

**🚀 Real-World Usage:**
- C++ std::sort()
- Java Arrays.sort() (for primitives)
- Database query optimization
- Big data processing frameworks

**💡 Pro Tip:** Quick Sort is usually the best choice for general-purpose sorting, but use Merge Sort when you need stability or guaranteed O(n log n) performance!

**🎮 Want to see the magic?** Try our Quick Sort visualizer to watch the partitioning in action!`;
  }

  if (lowerMessage.includes('dynamic programming') || lowerMessage.includes('dp')) {
    return `🧠 **Dynamic Programming: The Art of Smart Problem Solving!**

DP is like having a perfect memory - solve once, remember forever!

**🎯 When to Use DP:**
✅ **Optimal Substructure**: Optimal solution contains optimal solutions to subproblems
✅ **Overlapping Subproblems**: Same subproblems solved multiple times
✅ **Optimization**: Finding maximum, minimum, or counting problems

**🔄 Two Main Approaches:**

**1. Memoization (Top-Down):**
- Start with original problem
- Break into subproblems recursively
- Cache results to avoid recomputation
- More intuitive, easier to code

**2. Tabulation (Bottom-Up):**
- Start with smallest subproblems
- Build up to original problem
- Fill table systematically
- Often more space-efficient

**🏆 Classic DP Problems:**

**🔢 Fibonacci Sequence:**
- Naive: O(2ⁿ) → DP: O(n)
- Perfect example of overlapping subproblems

**🎒 0/1 Knapsack:**
- Choose items to maximize value within weight limit
- 2D table: items × weight capacity

**📝 Longest Common Subsequence:**
- Find longest sequence common to two strings
- Used in DNA analysis, diff tools

**✏️ Edit Distance:**
- Minimum operations to transform one string to another
- Used in spell checkers, DNA alignment

**💰 Coin Change:**
- Minimum coins needed for a target amount
- Classic optimization problem

**🎯 DP Problem-Solving Steps:**
1. **Identify**: Does it have optimal substructure?
2. **Define**: What's the recurrence relation?
3. **Choose**: Memoization or tabulation?
4. **Implement**: Code the solution
5. **Optimize**: Can we reduce space complexity?

**💡 Pro Tips:**
- Draw the recursion tree first
- Look for repeated subproblems
- Start with recursive solution, then optimize
- Consider space optimization (rolling arrays)

**🚀 Advanced Applications:**
- Game theory (minimax with memoization)
- Bioinformatics (sequence alignment)
- Economics (optimal resource allocation)
- Machine learning (Viterbi algorithm)

**🎮 Ready to practice?** Try our DP visualizer to see how subproblems build up to the final solution!`;
  }
  
  if (lowerMessage.includes('machine learning') || lowerMessage.includes('ml') || lowerMessage.includes('ai')) {
    return `🤖 **Machine Learning: Teaching Computers to Learn!**

ML is the art of making computers learn patterns from data without explicit programming!

**🎯 Three Main Types:**

**1. Supervised Learning** 📚
- **What**: Learn from labeled examples
- **Goal**: Predict labels for new data
- **Examples**: Email spam detection, medical diagnosis
- **Algorithms**: Linear regression, decision trees, neural networks

**2. Unsupervised Learning** 🔍
- **What**: Find hidden patterns in unlabeled data
- **Goal**: Discover structure and relationships
- **Examples**: Customer segmentation, anomaly detection
- **Algorithms**: K-means clustering, PCA, autoencoders

**3. Reinforcement Learning** 🎮
- **What**: Learn through trial and error with rewards
- **Goal**: Maximize cumulative reward
- **Examples**: Game playing, robotics, autonomous driving
- **Algorithms**: Q-learning, policy gradients, actor-critic

**🔧 Essential Algorithms to Know:**

**📈 Linear Regression:**
- Predicts continuous values
- Finds best line through data points
- Foundation for more complex models

**🌳 Decision Trees:**
- Easy to interpret and visualize
- Handles both numerical and categorical data
- Can overfit without proper pruning

**🧠 Neural Networks:**
- Inspired by human brain structure
- Excellent for complex pattern recognition
- Requires large amounts of data

**📊 K-Means Clustering:**
- Groups similar data points together
- Need to specify number of clusters
- Great for customer segmentation

**🎯 ML Workflow:**
1. **Data Collection**: Gather relevant, quality data
2. **Data Preprocessing**: Clean, normalize, feature engineering
3. **Model Selection**: Choose appropriate algorithm
4. **Training**: Fit model to training data
5. **Evaluation**: Test on unseen data
6. **Deployment**: Put model into production
7. **Monitoring**: Track performance over time

**💡 Key Concepts:**
- **Overfitting**: Model memorizes training data but fails on new data
- **Underfitting**: Model is too simple to capture patterns
- **Cross-Validation**: Technique to assess model generalization
- **Feature Engineering**: Creating meaningful input variables
- **Bias-Variance Tradeoff**: Balance between simplicity and complexity

**🚀 Real-World Applications:**
- **Healthcare**: Drug discovery, medical imaging
- **Finance**: Fraud detection, algorithmic trading
- **Technology**: Recommendation systems, search engines
- **Transportation**: Autonomous vehicles, route optimization
- **Entertainment**: Content recommendation, game AI

**🎮 Want to explore?** Try our ML algorithm visualizers to see how different algorithms learn from data!`;
  }

  if (lowerMessage.includes('recursion') || lowerMessage.includes('recursive')) {
    return `🔄 **Recursion: The Art of Self-Reference!**

Recursion is like looking into two mirrors facing each other - functions calling themselves!

**🎯 Core Concept:**
A function that calls itself with a smaller version of the original problem.

**🏗️ Anatomy of Recursion:**

**1. Base Case** 🛑
- The stopping condition
- Prevents infinite recursion
- Usually the simplest version of the problem

**2. Recursive Case** 🔄
- Function calls itself
- With a smaller/simpler input
- Must progress toward the base case

**📚 Classic Examples:**

**🔢 Factorial:**
\`\`\`
factorial(n) = n × factorial(n-1)
factorial(0) = 1  // base case
\`\`\`

**🌿 Fibonacci:**
\`\`\`
fib(n) = fib(n-1) + fib(n-2)
fib(0) = 0, fib(1) = 1  // base cases
\`\`\`

**🌳 Tree Traversal:**
\`\`\`
traverse(node):
  if node is null: return  // base case
  process(node)
  traverse(node.left)
  traverse(node.right)
\`\`\`

**💡 When to Use Recursion:**
✅ **Tree/Graph Problems**: Natural recursive structure
✅ **Divide & Conquer**: Break problem into similar subproblems
✅ **Mathematical Sequences**: Fibonacci, factorials
✅ **Backtracking**: Exploring all possibilities
✅ **Parsing**: Nested structures like JSON, XML

**⚠️ Recursion Pitfalls:**
❌ **Stack Overflow**: Too many recursive calls
❌ **Inefficiency**: Repeated calculations (like naive Fibonacci)
❌ **Memory Usage**: Each call uses stack space
❌ **Debugging**: Can be harder to trace execution

**🚀 Optimization Techniques:**

**1. Memoization:**
- Cache results of expensive function calls
- Turns O(2ⁿ) Fibonacci into O(n)

**2. Tail Recursion:**
- Recursive call is the last operation
- Can be optimized to iteration by compiler

**3. Iterative Conversion:**
- Sometimes iteration is more efficient
- Use explicit stack to simulate recursion

**🎯 Recursion vs Iteration:**

**Recursion Wins:**
- More elegant and readable
- Natural for tree/graph problems
- Easier to prove correctness

**Iteration Wins:**
- More memory efficient
- Faster execution (no function call overhead)
- No stack overflow risk

**🧠 Thinking Recursively:**
1. **Identify the pattern**: What repeats?
2. **Find the base case**: When does it stop?
3. **Define the recursive relation**: How does f(n) relate to f(n-1)?
4. **Trust the recursion**: Assume smaller cases work

**🎮 Want to see recursion in action?** Try our recursive algorithm visualizers to watch the call stack grow and shrink!`;
  }

  // Enhanced default responses with more personality and depth
  const responses = [
    `🤔 **Interesting Question!** 

I'd love to dive deeper into that topic! Could you be more specific about which aspect you'd like me to explain? 

For example:
- Are you looking for algorithm recommendations?
- Need help with implementation details?
- Want to understand time/space complexity?
- Curious about real-world applications?

The more context you provide, the better I can tailor my explanation to your needs!`,

    `🎯 **Great Topic Choice!** 

This touches on some fascinating areas of computer science! Let me break this down systematically:

**🔍 Key Concepts to Consider:**
- Algorithm efficiency and optimization
- Data structure selection
- Problem-solving approaches
- Implementation trade-offs

**💡 What would be most helpful?**
- Step-by-step algorithm explanation?
- Code examples in your preferred language?
- Visualization of the process?
- Comparison with alternative approaches?

Feel free to ask follow-up questions - I'm here to help you master these concepts!`,

    `🚀 **Excellent Question!** 

You've touched on a fundamental concept that's crucial for any programmer or computer scientist!

**🎓 Learning Path Suggestion:**
1. **Understand the Theory**: Core principles and mathematical foundations
2. **See It in Action**: Visual demonstrations and step-by-step walkthroughs  
3. **Practice Implementation**: Code it yourself in your preferred language
4. **Apply to Real Problems**: Use it to solve actual challenges
5. **Optimize and Analyze**: Understand trade-offs and improvements

**🔧 Tools at Your Disposal:**
- Interactive visualizations in our platform
- Step-by-step algorithm breakdowns
- Code examples and templates
- Performance analysis and comparisons

What aspect would you like to explore first?`,
  ];
  
  const randomResponse = responses[Math.floor(Math.random() * responses.length)];
  
  return randomResponse + `\n\n**🎮 Pro Tip:** Try our interactive visualizers to see algorithms in action, or use our AI recommender to get personalized algorithm suggestions based on your problem description!

**🔥 Popular Topics:**
- Sorting algorithms (Quick Sort, Merge Sort, Heap Sort)
- Graph algorithms (BFS, DFS, Dijkstra's)
- Dynamic programming techniques
- Machine learning fundamentals
- Data structure operations

What would you like to explore next?`;
}