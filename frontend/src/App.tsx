import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ChatbotPage from './pages/ChatbotPage'
import AuthPage from './pages/AuthPage'
import PersonalInfoPage from './pages/PersonalInfoPage'
import HealthMonitor from './pages/HealthMonitor'
import VitalLogsPage from './pages/VitalLogsPage'
import LifestyleTrackerPage from './pages/LifestyleTrackerPage'
import ConversationhistoryPage from './pages/ConversationhistoryPage'
import './index.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/personal-info" element={<PersonalInfoPage />} />
        <Route path="/chatbot" element={<ChatbotPage />} />
        <Route path="/vital-logs" element={<VitalLogsPage />} />
        <Route path="/health-monitor" element={<HealthMonitor />} />
        <Route path="/lifestyle" element={<LifestyleTrackerPage />} />
        <Route path="/conversation-history" element={<ConversationhistoryPage />} />
        {/* Fallbacks for other uncreated pages */}
        <Route path="*" element={<Navigate to="/chatbot" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
