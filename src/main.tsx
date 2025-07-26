import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Development logging
if (process.env.NODE_ENV === 'development') {
  console.log(`
    🎨 MIRI Portfolio
    Built with React + TypeScript + Framer Motion
    바이브코딩 방법론: "생각이 끝나기 전에 프로토타입이 돌아간다"
  `);
}

// Enable React strict mode for better development experience
const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)