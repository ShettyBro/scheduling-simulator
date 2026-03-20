# CPU Scheduling Simulator

<div align="center">

[![React](https://img.shields.io/badge/React-18.2.0-61dafb?logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5.0.12-646cff?logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.1-38b2ac?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-green)]()
[![Status](https://img.shields.io/badge/Status-Active-brightgreen)]()

A comprehensive, interactive **CPU Scheduling Algorithm Simulator** that visualizes and compares different process scheduling algorithms used in operating systems. Designed for educational purposes and algorithm comparison.

[Live Demo](#) • [Features](#features) • [Getting Started](#getting-started) • [Algorithms](#supported-algorithms)

</div>

---

## 📋 Overview

The **CPU Scheduling Simulator** is an interactive educational tool that demonstrates how different CPU scheduling algorithms work by simulating process execution and visualizing their behavior through Gantt charts and performance metrics. This simulator helps students and developers understand the trade-offs between various scheduling strategies used in modern operating systems.

### 🎯 Key Highlights

- **Interactive Simulation**: Run multiple scheduling algorithms on custom or default process sets
- **Real-time Visualization**: Gantt charts showing process execution timeline
- **Comparative Metrics**: View average waiting time, turnaround time, and other key performance indicators
- **Customizable Processes**: Add, edit, and remove processes with different arrival times, burst times, and priorities
- **Dark Mode Support**: Built with a sleek, modern UI with dark mode capability
- **Responsive Design**: Works seamlessly across different screen sizes

---

## ✨ Features

### Core Features
- ✅ **4 Scheduling Algorithms**: FCFS, SJF, Priority Scheduling, and Round Robin
- ✅ **Gantt Chart Visualization**: Visual timeline representation of process scheduling
- ✅ **Performance Metrics**: Calculate and display:
  - Waiting Time (WT)
  - Turnaround Time (TAT)
  - Average Waiting Time
  - Average Turnaround Time
  - CPU Utilization

### User Interface
- ✅ **Process Management**: Easily add, edit, and remove processes
- ✅ **Algorithm Selector**: Switch between different scheduling algorithms instantly
- ✅ **Time Quantum Control**: Adjustable quantum for Round Robin algorithm
- ✅ **Real-time Results**: Immediate calculation and display of scheduling results
- ✅ **Detailed Algorithm Insights**: Learn about each algorithm's characteristics and use cases
- ✅ **Responsive & Accessible**: Mobile-friendly interface with accessibility considerations

---

## 🚀 Supported Algorithms

### 1. **First Come First Served (FCFS)**
- **Complexity**: O(n log n)
- **Type**: Non-preemptive
- **Description**: Processes are executed in the exact order of their arrival. Once a process starts, it runs to completion without interruption.
- **Characteristics**:
  - Simple to understand and implement
  - Susceptible to the "convoy effect"
  - Can lead to high average waiting times
  - No starvation risk

**Use Case**: Batch processing, simple scenarios where fairness is not critical

---

### 2. **Shortest Job First (SJF)**
- **Complexity**: O(n²)
- **Type**: Non-preemptive
- **Description**: The process with the shortest burst time is selected from the ready queue. Provably optimal for minimizing average waiting time among non-preemptive algorithms.
- **Characteristics**:
  - Optimal average waiting time for non-preemptive scheduling
  - Requires prior knowledge of burst times (impractical in reality)
  - Can lead to starvation of longer processes (though rare)
  - Better fairness compared to FCFS

**Use Case**: Systems where burst times are known, internal scheduling

---

### 3. **Priority Scheduling**
- **Complexity**: O(n²)
- **Type**: Non-preemptive (with preemptive variant available)
- **Description**: Each process has an assigned priority number (lower value = higher priority). The CPU is always allocated to the highest-priority process in the ready queue.
- **Characteristics**:
  - Flexible for different process requirements
  - **Risk of Starvation**: Low-priority processes may never execute
  - Mitigation: Aging (gradually increase priority of waiting processes)
  - Common in real-time systems

**Use Case**: Real-time systems, priority-based processes, mixed criticality systems

---

### 4. **Round Robin (RR)**
- **Complexity**: O(n)
- **Type**: Preemptive
- **Description**: Each process is assigned a fixed time quantum. When the quantum expires, the process is preempted and moved to the back of the ready queue.
- **Characteristics**:
  - Fair and equal resource allocation
  - Performance heavily depends on quantum size:
    - Small quantum: High fairness but excessive context switching
    - Large quantum: Approaches FCFS behavior
  - No starvation
  - Commonly used in time-sharing systems

**Use Case**: Time-sharing systems, modern operating systems (Linux, Windows), interactive systems

---

## 🛠️ Getting Started

### Prerequisites

- **Node.js** 14.0 or higher
- **npm** 6.0 or higher (or **yarn**, **pnpm**)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/scheduling-simulator.git
   cd scheduling-simulator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The optimized build will be generated in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

---

## 💻 Usage Guide

### 1. **Adding Processes**
- Use the Process Table to add new processes
- Specify each process's:
  - **Arrival Time**: When the process arrives in the ready queue
  - **Burst Time**: How long the process needs to execute
  - **Priority**: Priority level (used in Priority Scheduling)

### 2. **Selecting an Algorithm**
- Choose from FCFS, SJF, Priority Scheduling, or Round Robin
- Read the algorithm description to understand its behavior
- For Round Robin, adjust the Time Quantum as needed

### 3. **Running the Simulation**
- Click "Execute" or "Run Simulation"
- The simulator will calculate the schedule and display:
  - **Gantt Chart**: Visual timeline of process execution
  - **Results Table**: Detailed metrics for each process
  - **Summary Statistics**: Average waiting time, turnaround time, etc.

### 4. **Interpreting Results**
- **Waiting Time (WT)**: How long a process waited before execution
- **Turnaround Time (TAT)**: Total time from arrival to completion (Arrival Time + WT + Burst Time - Arrival Time)
- **Average Metrics**: Compare algorithm performance

---

## 🏗️ Project Structure

```
scheduling-simulator/
├── src/
│   ├── components/
│   │   ├── AlgorithmSelector.jsx    # Algorithm selection UI
│   │   ├── GanttChart.jsx           # Gantt chart visualization
│   │   ├── ProcessTable.jsx         # Process input & management
│   │   └── ResultsTable.jsx         # Results display
│   ├── algorithms/
│   │   ├── fcfs.js                  # FCFS implementation
│   │   ├── sjf.js                   # SJF implementation
│   │   ├── priority.js              # Priority Scheduling implementation
│   │   └── roundRobin.js            # Round Robin implementation
│   ├── App.jsx                      # Main application component
│   ├── main.jsx                     # React entry point
│   └── index.css                    # Global styles
├── index.html                       # HTML entry point
├── vite.config.js                   # Vite configuration
├── tailwind.config.js               # Tailwind CSS configuration
├── postcss.config.js                # PostCSS configuration
└── package.json                     # Project dependencies
```

---

## 🔧 Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend Framework** | React 18.2.0 | UI component library |
| **Build Tool** | Vite 5.0.12 | Fast build and dev server |
| **Styling** | Tailwind CSS 3.4.1 | Utility-first CSS framework |
| **CSS Processing** | PostCSS & Autoprefixer | CSS transformations and vendor prefixes |
| **Package Manager** | npm | Dependency management |

---

## 📊 Algorithm Comparison

| Algorithm | Avg WT | Avg TAT | Preemptive | Context Switches | Starvation Risk | Best For |
|-----------|--------|--------|------------|------------------|-----------------|----------|
| **FCFS** | High | High | ❌ | Low | ✅ Very Low | Batch systems |
| **SJF** | Low | Low | ❌ | Low | ✅ Very Low | Known burst times |
| **Priority** | Medium | Medium | ⚠️ | Medium | ⚠️ Possible | Real-time systems |
| **Round Robin** | Medium | Medium | ✅ | High | ✅ None | Time-sharing systems |

---

## 🎓 Educational Value

This simulator is designed for:
- **Computer Science Students**: Understanding OS scheduling algorithms
- **Educators**: Teaching CPU scheduling concepts
- **Developers**: Learning algorithm trade-offs and performance characteristics
- **Researchers**: Comparing scheduling algorithm behavior

---

## 📝 Example Scenarios

### Scenario 1: Convoy Effect
1. Add processes with varying burst times (e.g., 1, 10, 1, 1)
2. Run FCFS - observe waiting time increase
3. Compare with SJF - notice significant improvement

### Scenario 2: Priority Starvation
1. Add high-priority processes arriving frequently
2. Add low-priority processes
3. Run Priority Scheduling - see how low-priority process starves

### Scenario 3: Round Robin Quantum Impact
1. Set up identical processes
2. Run RR with small quantum (e.g., 1)
3. Run RR with large quantum (e.g., 10)
4. Compare context switches and metrics

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes** and commit them
   ```bash
   git commit -m "feat: add your feature description"
   ```
4. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Open a Pull Request**

### Development Guidelines
- Follow the existing code style
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed

---

## 📄 License

This project is licensed under the **MIT License** - see the LICENSE file for details.

---

## 🙋 Support

Have questions or found a bug? Please open an issue on GitHub with:
- Clear description of the issue
- Steps to reproduce
- Expected vs. actual behavior
- Screenshots (if applicable)

---

## 📚 References

- [Operating System Concepts](https://www.os-book.com/) - Silberschatz, Galvin, Gagne
- [Computer Architecture](https://en.wikipedia.org/wiki/CPU_scheduling)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)

---

## 👨‍💻 Author

**Your Name** - [@YourTwitter](https://twitter.com)

---

<div align="center">

**Give this project a ⭐ if it helped you!**

Made with ❤️ for the OS education community

</div>