import { toast } from 'react-toastify'

class MedicalEventService {
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
        Fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'type', 'title', 'date', 'provider', 'description', 'results']
      }
      
      const response = await this.apperClient.fetchRecords('medical_event', params)
      
      if (!response.success) {
        toast.error(response.message)
        throw new Error(response.message)
      }
      
      return response.data || []
    } catch (error) {
      console.error('Error fetching medical events:', error)
      toast.error('Failed to load medical events')
      throw error
    }
  }

  async getById(id) {
    try {
      if (!this.apperClient) this.initializeClient()
      
      const params = {
        fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'type', 'title', 'date', 'provider', 'description', 'results']
      }
      
      const response = await this.apperClient.getRecordById('medical_event', parseInt(id), params)
      
      if (!response.success) {
        toast.error(response.message)
        throw new Error(response.message)
      }
      
      return response.data
    } catch (error) {
      console.error(`Error fetching medical event with ID ${id}:`, error)
      toast.error('Failed to load medical event')
      throw error
    }
  }

  async create(event) {
    try {
      if (!this.apperClient) this.initializeClient()
      
      const params = {
        records: [{
          Name: event.Name || event.title,
          Tags: event.Tags || event.tags || '',
          type: event.type,
          title: event.title,
          date: event.date,
          provider: event.provider,
          description: event.description || '',
          results: event.results || ''
        }]
      }
      
      const response = await this.apperClient.createRecord('medical_event', params)
      
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
          toast.success('Medical event created successfully')
          return successfulRecords[0].data
        }
      }
    } catch (error) {
      console.error('Error creating medical event:', error)
      toast.error('Failed to create medical event')
      throw error
    }
  }

  async update(id, eventData) {
    try {
      if (!this.apperClient) this.initializeClient()
      
      const params = {
        records: [{
          Id: parseInt(id),
          Name: eventData.Name || eventData.title,
          Tags: eventData.Tags || eventData.tags || '',
          type: eventData.type,
          title: eventData.title,
          date: eventData.date,
          provider: eventData.provider,
          description: eventData.description || '',
          results: eventData.results || ''
        }]
      }
      
      const response = await this.apperClient.updateRecord('medical_event', params)
      
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
          toast.success('Medical event updated successfully')
          return successfulRecords[0].data
        }
      }
    } catch (error) {
      console.error('Error updating medical event:', error)
      toast.error('Failed to update medical event')
      throw error
    }
  }

  async delete(id) {
    try {
      if (!this.apperClient) this.initializeClient()
      
      const params = {
        RecordIds: [parseInt(id)]
      }
      
      const response = await this.apperClient.deleteRecord('medical_event', params)
      
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
          toast.success('Medical event deleted successfully')
          return true
        }
      }
    } catch (error) {
      console.error('Error deleting medical event:', error)
      toast.error('Failed to delete medical event')
      throw error
    }
  }

  async getByType(type) {
    try {
      const allEvents = await this.getAll()
      return allEvents
        .filter(e => e.type === type)
        .sort((a, b) => new Date(b.date) - new Date(a.date))
    } catch (error) {
      console.error('Error fetching events by type:', error)
      toast.error('Failed to load events by type')
      throw error
    }
  }

  async getTimeline() {
    try {
      const allEvents = await this.getAll()
      return allEvents.sort((a, b) => new Date(b.date) - new Date(a.date))
    } catch (error) {
      console.error('Error fetching timeline:', error)
      toast.error('Failed to load medical timeline')
      throw error
    }
  }
}

export default new MedicalEventService()