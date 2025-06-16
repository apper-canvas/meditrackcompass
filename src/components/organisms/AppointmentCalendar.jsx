import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from 'date-fns'
import Button from '@/components/atoms/Button'
import AppointmentCard from '@/components/molecules/AppointmentCard'
import SkeletonLoader from '@/components/molecules/SkeletonLoader'
import ErrorState from '@/components/molecules/ErrorState'
import EmptyState from '@/components/molecules/EmptyState'
import ApperIcon from '@/components/ApperIcon'
import { appointmentService } from '@/services'

const AppointmentCalendar = () => {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [view, setView] = useState('list') // 'calendar' or 'list'

  useEffect(() => {
    loadAppointments()
  }, [])

  const loadAppointments = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const data = await appointmentService.getAll()
      setAppointments(data)
    } catch (err) {
      setError(err.message || 'Failed to load appointments')
      toast.error('Failed to load appointments')
    } finally {
      setLoading(false)
    }
  }

  const getAppointmentsForDate = (date) => {
    const dateString = format(date, 'yyyy-MM-dd')
    return appointments.filter(apt => apt.date === dateString)
  }

  const getSelectedDateAppointments = () => {
    return getAppointmentsForDate(selectedDate)
  }

  const handleAddAppointment = () => {
    toast.info('Add appointment feature coming soon')
  }

  const CalendarView = () => {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        {/* Calendar Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
              className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-lg"
            >
              <ApperIcon name="ChevronLeft" size={20} />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg"
            >
              Today
            </button>
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
              className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-lg"
            >
              <ApperIcon name="ChevronRight" size={20} />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="p-6">
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {days.map(day => {
              const dayAppointments = getAppointmentsForDate(day)
              const isSelected = isSameDay(day, selectedDate)
              const isTodayDate = isToday(day)

              return (
                <motion.button
                  key={day.toString()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedDate(day)}
                  className={`
                    relative p-3 text-sm font-medium rounded-lg transition-all
                    ${isSelected
                      ? 'bg-primary text-white'
                      : isTodayDate
                      ? 'bg-primary/10 text-primary'
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <span>{format(day, 'd')}</span>
                  {dayAppointments.length > 0 && (
                    <div className={`
                      absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full
                      ${isSelected ? 'bg-white' : 'bg-primary'}
                    `} />
                  )}
                </motion.button>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return <SkeletonLoader type="card" count={3} />
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadAppointments} />
  }

  const selectedDateAppointments = getSelectedDateAppointments()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-600">Manage your medical appointments and schedule</p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant={view === 'calendar' ? 'primary' : 'outline'}
            icon="Calendar"
            onClick={() => setView('calendar')}
          >
            Calendar
          </Button>
          <Button
            variant={view === 'list' ? 'primary' : 'outline'}
            icon="List"
            onClick={() => setView('list')}
          >
            List
          </Button>
          <Button
            variant="primary"
            icon="Plus"
            onClick={handleAddAppointment}
          >
            Add Appointment
          </Button>
        </div>
      </div>

      {/* Content */}
      {view === 'calendar' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CalendarView />
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {format(selectedDate, 'EEEE, MMMM d')}
            </h3>
            
            {selectedDateAppointments.length === 0 ? (
              <div className="text-center py-8">
                <ApperIcon name="Calendar" size={48} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No appointments scheduled</p>
              </div>
            ) : (
              <div className="space-y-4">
                {selectedDateAppointments.map(appointment => (
                  <AppointmentCard
                    key={appointment.Id}
                    appointment={appointment}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        // List View
        <div>
          {appointments.length === 0 ? (
            <EmptyState
              title="No appointments scheduled"
              description="Schedule your first appointment to start managing your healthcare"
              icon="Calendar"
              actionLabel="Add Appointment"
              onAction={handleAddAppointment}
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {appointments
                .sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`))
                .map((appointment, index) => (
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
      )}
    </div>
  )
}

export default AppointmentCalendar