import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Card from '@/components/atoms/Card'
import MetricCard from '@/components/molecules/MetricCard'
import SkeletonLoader from '@/components/molecules/SkeletonLoader'
import ErrorState from '@/components/molecules/ErrorState'
import EmptyState from '@/components/molecules/EmptyState'
import ApperIcon from '@/components/ApperIcon'
import { healthMetricService } from '@/services'

const HealthMetricsDashboard = () => {
  const [metrics, setMetrics] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    type: '',
    value: '',
    unit: '',
    notes: ''
  })

  const metricTypes = [
    { type: 'Blood Pressure', unit: 'mmHg', icon: 'Heart' },
    { type: 'Weight', unit: 'lbs', icon: 'Scale' },
    { type: 'Blood Glucose', unit: 'mg/dL', icon: 'Droplet' },
    { type: 'Heart Rate', unit: 'bpm', icon: 'Activity' },
    { type: 'Temperature', unit: '°F', icon: 'Thermometer' }
  ]

  useEffect(() => {
    loadMetrics()
  }, [])

  const loadMetrics = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const data = await healthMetricService.getAll()
      setMetrics(data)
    } catch (err) {
      setError(err.message || 'Failed to load health metrics')
      toast.error('Failed to load health metrics')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.type || !formData.value) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      const now = new Date()
      const newMetric = {
        ...formData,
        value: formData.type === 'Blood Pressure' ? formData.value : parseFloat(formData.value),
        date: now.toISOString().split('T')[0],
        time: now.toTimeString().slice(0, 5),
        unit: formData.unit || metricTypes.find(t => t.type === formData.type)?.unit || ''
      }

      await healthMetricService.create(newMetric)
      toast.success('Health metric logged successfully')
      
      setFormData({ type: '', value: '', unit: '', notes: '' })
      setShowAddForm(false)
      loadMetrics()
    } catch (error) {
      toast.error('Failed to log health metric')
    }
  }

  const getMetricIcon = (type) => {
    const metricType = metricTypes.find(m => m.type === type)
    return metricType?.icon || 'Activity'
  }

  const getRecentByType = (type) => {
    return metrics
      .filter(m => m.type === type)
      .sort((a, b) => new Date(`${b.date}T${b.time}`) - new Date(`${a.date}T${a.time}`))
      .slice(0, 1)[0]
  }

  if (loading) {
    return <SkeletonLoader type="metric" count={4} />
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadMetrics} />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Health Metrics</h1>
          <p className="text-gray-600">Track and monitor your vital health measurements</p>
        </div>
        <Button
          variant="primary"
          icon="Plus"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Cancel' : 'Log Metric'}
        </Button>
      </div>

      {/* Add Metric Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Log New Metric</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Metric Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => {
                      const selectedType = metricTypes.find(t => t.type === e.target.value)
                      setFormData({
                        ...formData,
                        type: e.target.value,
                        unit: selectedType?.unit || ''
                      })
                    }}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
                    required
                  >
                    <option value="">Select metric type</option>
                    {metricTypes.map(type => (
                      <option key={type.type} value={type.type}>{type.type}</option>
                    ))}
                  </select>
                </div>

                <Input
                  label="Value"
                  type={formData.type === 'Blood Pressure' ? 'text' : 'number'}
                  placeholder={formData.type === 'Blood Pressure' ? '120/80' : 'Enter value'}
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  required
                />
              </div>

              <Input
                label="Notes (optional)"
                type="text"
                placeholder="Any additional notes..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />

              <div className="flex space-x-3">
                <Button type="submit" variant="primary" className="flex-1">
                  Log Metric
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      )}

      {/* Current Metrics Overview */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Readings</h2>
        {metrics.length === 0 ? (
          <EmptyState
            title="No metrics logged"
            description="Start tracking your health metrics to monitor your progress over time"
            icon="Activity"
            actionLabel="Log First Metric"
            onAction={() => setShowAddForm(true)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {metricTypes.map((type, index) => {
              const recentMetric = getRecentByType(type.type)
              
              if (!recentMetric) return null

              return (
                <motion.div
                  key={type.type}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <MetricCard
                    metric={recentMetric}
                    trend="stable"
                    icon={type.icon}
                    color="primary"
                  />
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      {/* Recent Metrics History */}
      {metrics.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent History</h2>
          <Card padding="none">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-surface">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Metric
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Notes
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {metrics
                    .sort((a, b) => new Date(`${b.date}T${b.time}`) - new Date(`${a.date}T${a.time}`))
                    .slice(0, 10)
                    .map((metric, index) => (
                      <motion.tr
                        key={metric.Id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                              <ApperIcon name={getMetricIcon(metric.type)} size={16} className="text-primary" />
                            </div>
                            <span className="text-sm font-medium text-gray-900">{metric.type}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900 font-semibold">
                            {metric.value} {metric.unit}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {new Date(`${metric.date}T${metric.time}`).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                          {metric.notes || '-'}
                        </td>
                      </motion.tr>
                    ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

export default HealthMetricsDashboard