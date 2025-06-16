import Dashboard from '@/components/pages/Dashboard'
import Medications from '@/components/pages/Medications'
import Appointments from '@/components/pages/Appointments'
import HealthMetrics from '@/components/pages/HealthMetrics'
import MedicalHistory from '@/components/pages/MedicalHistory'

export const routes = {
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'LayoutDashboard',
    component: Dashboard
  },
  medications: {
    id: 'medications',
    label: 'Medications',
    path: '/medications',
    icon: 'Pill',
    component: Medications
  },
  appointments: {
    id: 'appointments',
    label: 'Appointments',
    path: '/appointments',
    icon: 'Calendar',
    component: Appointments
  },
  healthMetrics: {
    id: 'healthMetrics',
    label: 'Health Metrics',
    path: '/health-metrics',
    icon: 'Activity',
    component: HealthMetrics
  },
  medicalHistory: {
    id: 'medicalHistory',
    label: 'Medical History',
    path: '/medical-history',
    icon: 'FileText',
    component: MedicalHistory
  }
}

export const routeArray = Object.values(routes)
export default routes