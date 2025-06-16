import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Card from '@/components/atoms/Card'
import ApperIcon from '@/components/ApperIcon'
import MedicationCard from '@/components/molecules/MedicationCard'
import AppointmentCard from '@/components/molecules/AppointmentCard'
import MetricCard from '@/components/molecules/MetricCard'
import SkeletonLoader from '@/components/molecules/SkeletonLoader'
import ErrorState from '@/components/molecules/ErrorState'
import EmptyState from '@/components/molecules/EmptyState'
import { medicationService, appointmentService, healthMetricService } from '@/services'

const DashboardOverview = () => {
  const [todaysMeds, setTodaysMeds] = useState([])
  const [upcomingAppointments, setUpcomingAppointments] = useState([])
  const [recentMetrics, setRecentMetrics] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const [medsData, appointmentsData, metricsData] = await Promise.all([
        medicationService.getTodaysMedications(),
        appointmentService.getUpcoming(),
        healthMetricService.getRecent(3)
      ])
      
      setTodaysMeds(medsData)
      setUpcomingAppointments(appointmentsData.slice(0, 2))
      setRecentMetrics(metricsData)
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data')
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const getCompletionStats = () => {
    const totalMeds = todaysMeds.length
    const today = new Date().toISOString().split('T')[0]
    const takenMeds = todaysMeds.filter(med => 
      med.taken?.some(t => t.date === today)
    ).length
    
    return {
      total: totalMeds,
      completed: takenMeds,
      percentage: totalMeds > 0 ? Math.round((takenMeds / totalMeds) * 100) : 0
    }
  }

  if (loading) {
    return <SkeletonLoader type="card" count={4} />
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadDashboardData} />
  }

  const stats = getCompletionStats()

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary to-secondary text-white rounded-xl p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Good morning!</h1>
            <p className="text-primary-100">Here's your health overview for today</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{stats.percentage}%</div>
            <div className="text-sm text-primary-100">Daily Tasks Completed</div>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <ApperIcon name="Pill" className="text-primary" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Medications</h3>
                <p className="text-2xl font-bold text-primary">
                  {stats.completed}/{stats.total}
                </p>
                <p className="text-sm text-gray-600">Taken today</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                <ApperIcon name="Calendar" className="text-secondary" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Appointments</h3>
                <p className="text-2xl font-bold text-secondary">
                  {upcomingAppointments.length}
                </p>
                <p className="text-sm text-gray-600">Upcoming</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                <ApperIcon name="Activity" className="text-success" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Metrics Logged</h3>
                <p className="text-2xl font-bold text-success">
                  {recentMetrics.length}
                </p>
                <p className="text-sm text-gray-600">This week</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Today's Medications */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Today's Medications</h2>
        {todaysMeds.length === 0 ? (
          <EmptyState
            title="No medications scheduled"
            description="All medications are up to date for today"
            icon="CheckCircle"
            onAction={null}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {todaysMeds.slice(0, 4).map((med, index) => (
              <motion.div
                key={med.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <MedicationCard 
                  medication={med} 
                  onUpdate={loadDashboardData}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Upcoming Appointments */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Appointments</h2>
        {upcomingAppointments.length === 0 ? (
          <EmptyState
            title="No upcoming appointments"
            description="Schedule your next appointment to stay on top of your health"
            icon="Calendar"
            actionLabel="Schedule Appointment"
            onAction={() => toast.info('Appointment scheduling coming soon')}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {upcomingAppointments.map((appointment, index) => (
              <motion.div
                key={appointment.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <AppointmentCard appointment={appointment} />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Health Metrics */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Health Metrics</h2>
        {recentMetrics.length === 0 ? (
          <EmptyState
            title="No recent metrics"
            description="Start tracking your health metrics to monitor your progress"
            icon="Activity"
            actionLabel="Log Metric"
            onAction={() => toast.info('Metric logging coming soon')}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentMetrics.map((metric, index) => (
              <motion.div
                key={metric.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <MetricCard 
                  metric={metric}
                  trend="stable"
                  icon="Activity"
                  color="success"
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default DashboardOverview