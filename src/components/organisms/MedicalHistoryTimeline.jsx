import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import Badge from '@/components/atoms/Badge'
import Input from '@/components/atoms/Input'
import SkeletonLoader from '@/components/molecules/SkeletonLoader'
import ErrorState from '@/components/molecules/ErrorState'
import EmptyState from '@/components/molecules/EmptyState'
import ApperIcon from '@/components/ApperIcon'
import { medicalEventService } from '@/services'

const MedicalHistoryTimeline = () => {
  const [events, setEvents] = useState([])
  const [filteredEvents, setFilteredEvents] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [filterType, setFilterType] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const eventTypes = [
    { value: 'all', label: 'All Events', icon: 'FileText' },
    { value: 'diagnosis', label: 'Diagnoses', icon: 'Search' },
    { value: 'procedure', label: 'Procedures', icon: 'Scissors' },
    { value: 'test', label: 'Tests', icon: 'TestTube' },
    { value: 'vaccination', label: 'Vaccinations', icon: 'Shield' }
  ]

  useEffect(() => {
    loadEvents()
  }, [])

  useEffect(() => {
    filterEvents()
  }, [events, filterType, searchTerm])

  const loadEvents = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const data = await medicalEventService.getTimeline()
      setEvents(data)
    } catch (err) {
      setError(err.message || 'Failed to load medical history')
      toast.error('Failed to load medical history')
    } finally {
      setLoading(false)
    }
  }

  const filterEvents = () => {
    let filtered = [...events]

    // Type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(event => event.type === filterType)
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredEvents(filtered)
  }

  const getEventIcon = (type) => {
    const eventType = eventTypes.find(t => t.value === type)
    return eventType?.icon || 'FileText'
  }

  const getEventColor = (type) => {
    switch (type) {
      case 'diagnosis': return 'error'
      case 'procedure': return 'warning'
      case 'test': return 'info'
      case 'vaccination': return 'success'
      default: return 'default'
    }
  }

  const handleAddEvent = () => {
    toast.info('Add medical event feature coming soon')
  }

  if (loading) {
    return <SkeletonLoader type="list" count={1} />
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadEvents} />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Medical History</h1>
          <p className="text-gray-600">Complete timeline of your medical events and records</p>
        </div>
        <Button
          variant="primary"
          icon="Plus"
          onClick={handleAddEvent}
        >
          Add Event
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <Input
            icon="Search"
            placeholder="Search medical history..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          {eventTypes.map(type => (
            <Button
              key={type.value}
              variant={filterType === type.value ? 'primary' : 'outline'}
              size="sm"
              icon={type.icon}
              onClick={() => setFilterType(type.value)}
            >
              {type.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Timeline */}
      {filteredEvents.length === 0 ? (
        searchTerm || filterType !== 'all' ? (
          <EmptyState
            title="No events found"
            description="Try adjusting your search or filter criteria"
            icon="Search"
            actionLabel="Clear Filters"
            onAction={() => {
              setSearchTerm('')
              setFilterType('all')
            }}
          />
        ) : (
          <EmptyState
            title="No medical history recorded"
            description="Add your first medical event to start building your health timeline"
            icon="FileText"
            actionLabel="Add Event"
            onAction={handleAddEvent}
          />
        )
      ) : (
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
          
          <div className="space-y-8">
            {filteredEvents.map((event, index) => (
              <motion.div
                key={event.Id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative flex items-start space-x-6"
              >
                {/* Timeline Dot */}
                <div className={`
                  relative z-10 w-16 h-16 rounded-full flex items-center justify-center
                  ${event.type === 'diagnosis' ? 'bg-error/10' : 
                    event.type === 'procedure' ? 'bg-warning/10' :
                    event.type === 'test' ? 'bg-info/10' :
                    event.type === 'vaccination' ? 'bg-success/10' :
                    'bg-gray-100'
                  }
                `}>
                  <ApperIcon 
                    name={getEventIcon(event.type)} 
                    size={24} 
                    className={`
                      ${event.type === 'diagnosis' ? 'text-error' : 
                        event.type === 'procedure' ? 'text-warning' :
                        event.type === 'test' ? 'text-info' :
                        event.type === 'vaccination' ? 'text-success' :
                        'text-gray-500'
                      }
                    `}
                  />
                </div>

                {/* Event Card */}
                <div className="flex-1">
                  <Card>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                          <Badge variant={getEventColor(event.type)}>
                            {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                          </Badge>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 space-x-4">
                          <div className="flex items-center">
                            <ApperIcon name="Calendar" size={16} className="mr-1" />
                            {new Date(event.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <ApperIcon name="User" size={16} className="mr-1" />
                            {event.provider}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-1">Description</h4>
                        <p className="text-sm text-gray-600">{event.description}</p>
                      </div>

                      {event.results && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-1">Results</h4>
                          <p className="text-sm text-gray-600">{event.results}</p>
                        </div>
                      )}
                    </div>
                  </Card>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default MedicalHistoryTimeline