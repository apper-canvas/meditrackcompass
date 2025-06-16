import { toast } from 'react-toastify'

class MedicationService {
  constructor() {
    this.apperClient = null
    this.initializeClient()
  }

  initializeClient() {
    if (typeof window !== 'undefined' && window.ApperSDK) {
      const { ApperClient } = window.ApperSDK
      this.apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
    }
  }

  async getAll() {
    try {
      if (!this.apperClient) this.initializeClient()
      
      const params = {
        Fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'dosage', 'frequency', 'start_date', 'end_date', 'refill_date', 'prescribed_by', 'notes', 'taken']
      }
      
      const response = await this.apperClient.fetchRecords('medication', params)
      
      if (!response.success) {
        toast.error(response.message)
        throw new Error(response.message)
      }
      
      return response.data || []
    } catch (error) {
      console.error('Error fetching medications:', error)
      toast.error('Failed to load medications')
      throw error
    }
  }

  async getById(id) {
    try {
      if (!this.apperClient) this.initializeClient()
      
      const params = {
        fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'dosage', 'frequency', 'start_date', 'end_date', 'refill_date', 'prescribed_by', 'notes', 'taken']
      }
      
      const response = await this.apperClient.getRecordById('medication', parseInt(id), params)
      
      if (!response.success) {
        toast.error(response.message)
        throw new Error(response.message)
      }
      
      return response.data
    } catch (error) {
      console.error(`Error fetching medication with ID ${id}:`, error)
      toast.error('Failed to load medication')
      throw error
    }
  }

  async create(medication) {
    try {
      if (!this.apperClient) this.initializeClient()
      
      const params = {
        records: [{
          Name: medication.Name || medication.name,
          Tags: medication.Tags || medication.tags || '',
          dosage: medication.dosage,
          frequency: medication.frequency,
          start_date: medication.start_date || medication.startDate,
          end_date: medication.end_date || medication.endDate,
          refill_date: medication.refill_date || medication.refillDate,
          prescribed_by: medication.prescribed_by || medication.prescribedBy,
          notes: medication.notes || '',
          taken: medication.taken || ''
        }]
      }
      
      const response = await this.apperClient.createRecord('medication', params)
      
      if (!response.success) {
        toast.error(response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`)
            })
            if (record.message) toast.error(record.message)
          })
        }
        
        const successfulRecords = response.results.filter(result => result.success)
        if (successfulRecords.length > 0) {
          toast.success('Medication created successfully')
          return successfulRecords[0].data
        }
      }
    } catch (error) {
      console.error('Error creating medication:', error)
      toast.error('Failed to create medication')
      throw error
    }
  }

  async update(id, medicationData) {
    try {
      if (!this.apperClient) this.initializeClient()
      
      const params = {
        records: [{
          Id: parseInt(id),
          Name: medicationData.Name || medicationData.name,
          Tags: medicationData.Tags || medicationData.tags || '',
          dosage: medicationData.dosage,
          frequency: medicationData.frequency,
          start_date: medicationData.start_date || medicationData.startDate,
          end_date: medicationData.end_date || medicationData.endDate,
          refill_date: medicationData.refill_date || medicationData.refillDate,
          prescribed_by: medicationData.prescribed_by || medicationData.prescribedBy,
          notes: medicationData.notes || '',
          taken: medicationData.taken || ''
        }]
      }
      
      const response = await this.apperClient.updateRecord('medication', params)
      
      if (!response.success) {
        toast.error(response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`)
            })
            if (record.message) toast.error(record.message)
          })
        }
        
        const successfulRecords = response.results.filter(result => result.success)
        if (successfulRecords.length > 0) {
          toast.success('Medication updated successfully')
          return successfulRecords[0].data
        }
      }
    } catch (error) {
      console.error('Error updating medication:', error)
      toast.error('Failed to update medication')
      throw error
    }
  }

  async delete(id) {
    try {
      if (!this.apperClient) this.initializeClient()
      
      const params = {
        RecordIds: [parseInt(id)]
      }
      
      const response = await this.apperClient.deleteRecord('medication', params)
      
      if (!response.success) {
        toast.error(response.message)
        return false
      }

      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success)
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`)
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        
        const successfulDeletions = response.results.filter(result => result.success)
        if (successfulDeletions.length > 0) {
          toast.success('Medication deleted successfully')
          return true
        }
      }
    } catch (error) {
      console.error('Error deleting medication:', error)
      toast.error('Failed to delete medication')
      throw error
    }
  }

  async markAsTaken(id, date, time) {
    try {
      // For now, we'll handle this as a simple update operation
      // In a real implementation, you might want a separate table for medication logs
      const medication = await this.getById(id)
      if (!medication) {
        throw new Error('Medication not found')
      }
      
      // Update the taken field with new entry
      let takenEntries = []
      if (medication.taken) {
        try {
          takenEntries = typeof medication.taken === 'string' ? JSON.parse(medication.taken) : medication.taken
        } catch (e) {
          takenEntries = []
        }
      }
      
      takenEntries.push({ date, time, taken: true })
      
      await this.update(id, { taken: JSON.stringify(takenEntries) })
      toast.success('Medication marked as taken')
      return medication
    } catch (error) {
      console.error('Error marking medication as taken:', error)
      toast.error('Failed to mark medication as taken')
      throw error
    }
  }

  async getTodaysMedications() {
    try {
      const allMedications = await this.getAll()
      const today = new Date().toISOString().split('T')[0]
      
      return allMedications.filter(med => {
        const startDate = med.start_date || med.startDate
        const endDate = med.end_date || med.endDate
        
        if (!startDate) return false
        
        const start = new Date(startDate).toISOString().split('T')[0]
        const end = endDate ? new Date(endDate).toISOString().split('T')[0] : null
        
        return start <= today && (!end || end >= today)
      })
    } catch (error) {
      console.error('Error fetching today\'s medications:', error)
      toast.error('Failed to load today\'s medications')
      throw error
    }
  }
}

export default new MedicationService()