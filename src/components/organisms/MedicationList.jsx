import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import MedicationCard from '@/components/molecules/MedicationCard'
import SkeletonLoader from '@/components/molecules/SkeletonLoader'
import ErrorState from '@/components/molecules/ErrorState'
import EmptyState from '@/components/molecules/EmptyState'
import { medicationService } from '@/services'

const MedicationList = () => {
  const [medications, setMedications] = useState([])
  const [filteredMedications, setFilteredMedications] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    loadMedications()
  }, [])

  useEffect(() => {
    filterMedications()
  }, [medications, searchTerm, filterStatus])

  const loadMedications = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const data = await medicationService.getAll()
      setMedications(data)
    } catch (err) {
      setError(err.message || 'Failed to load medications')
      toast.error('Failed to load medications')
    } finally {
      setLoading(false)
    }
  }

  const filterMedications = () => {
    let filtered = [...medications]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(med =>
        med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        med.prescribedBy.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (filterStatus !== 'all') {
      const today = new Date().toISOString().split('T')[0]
      
      filtered = filtered.filter(med => {
        const todaysTaken = med.taken?.filter(t => t.date === today) || []
        const isTaken = todaysTaken.length > 0
        
        if (filterStatus === 'taken') return isTaken
        if (filterStatus === 'pending') return !isTaken
        return true
      })
    }

    setFilteredMedications(filtered)
  }

  const handleAddMedication = () => {
    toast.info('Add medication feature coming soon')
  }

  if (loading) {
    return <SkeletonLoader type="card" count={3} />
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadMedications} />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Medications</h1>
          <p className="text-gray-600">Manage your medication schedule and track adherence</p>
        </div>
        <Button
          variant="primary"
          icon="Plus"
          onClick={handleAddMedication}
        >
          Add Medication
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            icon="Search"
            placeholder="Search medications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none bg-white"
        >
          <option value="all">All Medications</option>
          <option value="pending">Pending Today</option>
          <option value="taken">Taken Today</option>
        </select>
      </div>

      {/* Medications Grid */}
      {filteredMedications.length === 0 ? (
        searchTerm || filterStatus !== 'all' ? (
          <EmptyState
            title="No medications found"
            description="Try adjusting your search or filter criteria"
            icon="Search"
            actionLabel="Clear Filters"
            onAction={() => {
              setSearchTerm('')
              setFilterStatus('all')
            }}
          />
        ) : (
          <EmptyState
            title="No medications added"
            description="Add your first medication to start tracking your medication schedule"
            icon="Pill"
            actionLabel="Add Medication"
            onAction={handleAddMedication}
          />
        )
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredMedications.map((medication, index) => (
            <motion.div
              key={medication.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <MedicationCard 
                medication={medication}
                onUpdate={loadMedications}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MedicationList