import React from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'
import { medicationService } from '@/services'

const MedicationCard = ({ medication, onUpdate }) => {
  const handleMarkAsTaken = async () => {
    try {
      const now = new Date()
      const date = now.toISOString().split('T')[0]
      const time = now.toTimeString().slice(0, 5)
      
      await medicationService.markAsTaken(medication.Id, date, time)
      toast.success(`Marked ${medication.name} as taken`)
      if (onUpdate) {
        onUpdate()
      }
    } catch (error) {
      toast.error('Failed to mark medication as taken')
    }
  }

  const getStatusBadge = () => {
    const today = new Date().toISOString().split('T')[0]
    const todaysTaken = medication.taken?.filter(t => t.date === today) || []
    
    if (todaysTaken.length > 0) {
      return <Badge variant="success">Taken Today</Badge>
    }
    
    const now = new Date()
    const currentHour = now.getHours()
    
    // Simple logic: if it's past 10 AM and not taken, mark as overdue
    if (currentHour >= 10) {
      return <Badge variant="warning">Overdue</Badge>
    }
    
    return <Badge variant="info">Pending</Badge>
  }

  const isNearRefill = () => {
    if (!medication.refillDate) return false
    const refillDate = new Date(medication.refillDate)
    const today = new Date()
    const daysUntilRefill = Math.ceil((refillDate - today) / (1000 * 60 * 60 * 24))
    return daysUntilRefill <= 7
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2 }}
    >
      <Card className="relative overflow-hidden">
        {isNearRefill() && (
          <div className="absolute top-0 right-0 bg-warning text-white px-2 py-1 text-xs rounded-bl-lg">
            Refill Soon
          </div>
        )}
        
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="Pill" className="text-primary" size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-900">{medication.name}</h3>
              <p className="text-gray-600">{medication.dosage} • {medication.frequency}</p>
            </div>
          </div>
          {getStatusBadge()}
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Prescribed by:</span>
            <span className="font-medium">{medication.prescribedBy}</span>
          </div>
          
          {medication.refillDate && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Refill Date:</span>
              <span className="font-medium">
                {new Date(medication.refillDate).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>

        {medication.notes && (
          <div className="mb-4 p-3 bg-surface rounded-lg">
            <p className="text-sm text-gray-700">{medication.notes}</p>
          </div>
        )}

        <div className="flex space-x-2">
          <Button
            variant="primary"
            size="sm"
            icon="Check"
            onClick={handleMarkAsTaken}
            className="flex-1"
          >
            Mark as Taken
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon="Edit"
            className="px-3"
          >
            Edit
          </Button>
        </div>
      </Card>
    </motion.div>
  )
}

export default MedicationCard