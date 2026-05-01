import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ChatbotPage from './pages/ChatbotPage'
import WomenHealthPage from './pages/WomenHealthPage'
import AuthPage from './pages/AuthPage'
import PersonalInfoPage from './pages/PersonalInfoPage'
import HealthMonitor from './pages/HealthMonitor'
import HealthHistory from './pages/HealthHistory'
import './index.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/personal-info" element={<PersonalInfoPage />} />
        <Route path="/chatbot" element={<ChatbotPage />} />
        <Route path="/women-health" element={<WomenHealthPage />} />
        <Route path="/health-monitor" element={<HealthMonitor />} />
        <Route path="/history" element={<HealthHistory />} />
        <Route path="/sanctuary" element={<HealthMonitor />} />
        {/* Fallbacks for other uncreated pages */}
        <Route path="*" element={<Navigate to="/chatbot" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
