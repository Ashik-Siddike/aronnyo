import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initPerformanceMonitor } from './utils/performanceMonitor'

// Initialize performance monitoring
initPerformanceMonitor();

createRoot(document.getElementById("root")!).render(<App />);
