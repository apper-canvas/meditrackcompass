import { toast } from 'react-toastify'

class HealthMetricService {
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
        Fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'type', 'value', 'unit', 'date', 'time', 'notes']
      }
      
      const response = await this.apperClient.fetchRecords('health_metric', params)
      
      if (!response.success) {
        toast.error(response.message)
        throw new Error(response.message)
      }
      
      return response.data || []
    } catch (error) {
      console.error('Error fetching health metrics:', error)
      toast.error('Failed to load health metrics')
      throw error
    }
  }

  async getById(id) {
    try {
      if (!this.apperClient) this.initializeClient()
      
      const params = {
        fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'type', 'value', 'unit', 'date', 'time', 'notes']
      }
      
      const response = await this.apperClient.getRecordById('health_metric', parseInt(id), params)
      
      if (!response.success) {
        toast.error(response.message)
        throw new Error(response.message)
      }
      
      return response.data
    } catch (error) {
      console.error(`Error fetching health metric with ID ${id}:`, error)
      toast.error('Failed to load health metric')
      throw error
    }
  }

  async create(metric) {
    try {
      if (!this.apperClient) this.initializeClient()
      
      const params = {
        records: [{
          Name: metric.Name || metric.type,
          Tags: metric.Tags || metric.tags || '',
          type: metric.type,
          value: metric.value.toString(),
          unit: metric.unit || '',
          date: metric.date,
          time: metric.time || '',
          notes: metric.notes || ''
        }]
      }
      
      const response = await this.apperClient.createRecord('health_metric', params)
      
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
          toast.success('Health metric logged successfully')
          return successfulRecords[0].data
        }
      }
    } catch (error) {
      console.error('Error creating health metric:', error)
      toast.error('Failed to log health metric')
      throw error
    }
  }

  async update(id, metricData) {
    try {
      if (!this.apperClient) this.initializeClient()
      
      const params = {
        records: [{
          Id: parseInt(id),
          Name: metricData.Name || metricData.type,
          Tags: metricData.Tags || metricData.tags || '',
          type: metricData.type,
          value: metricData.value.toString(),
          unit: metricData.unit || '',
          date: metricData.date,
          time: metricData.time || '',
          notes: metricData.notes || ''
        }]
      }
      
      const response = await this.apperClient.updateRecord('health_metric', params)
      
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
          toast.success('Health metric updated successfully')
          return successfulRecords[0].data
        }
      }
    } catch (error) {
      console.error('Error updating health metric:', error)
      toast.error('Failed to update health metric')
      throw error
    }
  }

  async delete(id) {
    try {
      if (!this.apperClient) this.initializeClient()
      
      const params = {
        RecordIds: [parseInt(id)]
      }
      
      const response = await this.apperClient.deleteRecord('health_metric', params)
      
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
          toast.success('Health metric deleted successfully')
          return true
        }
      }
    } catch (error) {
      console.error('Error deleting health metric:', error)
      toast.error('Failed to delete health metric')
      throw error
    }
  }

  async getByType(type) {
    try {
      const allMetrics = await this.getAll()
      return allMetrics
        .filter(m => m.type === type)
        .sort((a, b) => new Date(`${b.date}T${b.time}`) - new Date(`${a.date}T${a.time}`))
    } catch (error) {
      console.error('Error fetching metrics by type:', error)
      toast.error('Failed to load metrics by type')
      throw error
    }
  }

  async getRecent(limit = 5) {
    try {
      const allMetrics = await this.getAll()
      return allMetrics
        .sort((a, b) => new Date(`${b.date}T${b.time}`) - new Date(`${a.date}T${a.time}`))
        .slice(0, limit)
    } catch (error) {
      console.error('Error fetching recent metrics:', error)
      toast.error('Failed to load recent metrics')
      throw error
    }
  }
}

export default new HealthMetricService()