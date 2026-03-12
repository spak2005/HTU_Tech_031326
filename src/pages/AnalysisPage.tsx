import { useAuth } from '../context/AuthContext'
import AIODashboard from '../components/AIODashboard'

const DEMO_BASELINE = {
  companyName: 'Dell',
  websiteUrl: 'dell.com',
}

export default function AnalysisPage() {
  const { user } = useAuth()

  const companyName = user?.companyName?.trim() || DEMO_BASELINE.companyName
  const websiteUrl = user?.websiteUrl?.trim() || DEMO_BASELINE.websiteUrl

  return (
    <div className="min-h-[calc(100vh-65px)] px-6 py-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-[1400px]">
        <AIODashboard companyName={companyName} websiteUrl={websiteUrl} />
      </div>
    </div>
  )
}
