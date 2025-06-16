import React from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import Card from '@/components/atoms/Card'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'

const AppointmentCard = ({ appointment }) => {
  const getStatusBadge = () => {
    const variants = {
      scheduled: 'info',
      completed: 'success',
      cancelled: 'error'
    }
    
    return (
      <Badge variant={variants[appointment.status] || 'default'}>
        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
      </Badge>
    )
  }

  const appointmentDate = new Date(`${appointment.date}T${appointment.time}`)
  const isToday = new Date().toDateString() === appointmentDate.toDateString()
  const isPast = appointmentDate < new Date()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2 }}
    >
      <Card className={`relative ${isToday ? 'ring-2 ring-primary' : ''}`}>
        {isToday && (
          <div className="absolute top-0 right-0 bg-primary text-white px-2 py-1 text-xs rounded-bl-lg">
            Today
          </div>
        )}
        
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="Calendar" className="text-secondary" size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-900">{appointment.title}</h3>
              <p className="text-gray-600">{appointment.provider}</p>
            </div>
          </div>
          {getStatusBadge()}
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <ApperIcon name="Clock" size={16} className="mr-2" />
            <span>
              {format(appointmentDate, 'EEEE, MMMM d, yyyy')} at {appointment.time}
            </span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <ApperIcon name="MapPin" size={16} className="mr-2" />
            <span>{appointment.location}</span>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <ApperIcon name="Stethoscope" size={16} className="mr-2" />
            <span>{appointment.specialty}</span>
          </div>
        </div>

        <div className="mb-4 p-3 bg-surface rounded-lg">
          <p className="text-sm text-gray-700 font-medium mb-1">Reason for visit:</p>
          <p className="text-sm text-gray-600">{appointment.reason}</p>
        </div>

        {appointment.notes && (
          <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
            <p className="text-sm text-gray-700 font-medium mb-1">Notes:</p>
            <p className="text-sm text-gray-600">{appointment.notes}</p>
          </div>
        )}

        {appointment.status === 'scheduled' && !isPast && (
          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:brightness-110 transition-all"
            >
              Reschedule
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 border-2 border-error text-error rounded-lg hover:bg-error hover:text-white transition-all"
            >
              Cancel
            </motion.button>
          </div>
        )}
      </Card>
    </motion.div>
  )
}

export default AppointmentCard