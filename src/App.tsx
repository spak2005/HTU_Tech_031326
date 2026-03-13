import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import LandingPage from './pages/LandingPage'
import SignupPage from './pages/SignupPage'
import OnboardingPage from './pages/OnboardingPage'
import AnalysisPage from './pages/AnalysisPage'
import Improve from './pages/Improve'
import Launch from './pages/Launch'
import ProductsPage from './pages/ProductsPage'
import { ErrorBoundary } from './components/ErrorBoundary'

export default function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/analysis" element={<AnalysisPage />} />
          <Route path="/improve" element={<Improve />} />
          <Route path="/launch" element={<Launch />} />
          <Route path="/products" element={<ProductsPage />} />
          {/* Redirect old routes */}
          <Route path="/login" element={<Navigate to="/signup" replace />} />
          <Route path="/track" element={<Navigate to="/analysis" replace />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  )
}
