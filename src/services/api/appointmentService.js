import { toast } from 'react-toastify'

class AppointmentService {
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
        Fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'title', 'provider', 'specialty', 'date', 'time', 'location', 'reason', 'notes', 'status']
      }
      
      const response = await this.apperClient.fetchRecords('appointment', params)
      
      if (!response.success) {
        toast.error(response.message)
        throw new Error(response.message)
      }
      
      return response.data || []
    } catch (error) {
      console.error('Error fetching appointments:', error)
      toast.error('Failed to load appointments')
      throw error
    }
  }

  async getById(id) {
    try {
      if (!this.apperClient) this.initializeClient()
      
      const params = {
        fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'title', 'provider', 'specialty', 'date', 'time', 'location', 'reason', 'notes', 'status']
      }
      
      const response = await this.apperClient.getRecordById('appointment', parseInt(id), params)
      
      if (!response.success) {
        toast.error(response.message)
        throw new Error(response.message)
      }
      
      return response.data
    } catch (error) {
      console.error(`Error fetching appointment with ID ${id}:`, error)
      toast.error('Failed to load appointment')
      throw error
    }
  }

  async create(appointment) {
    try {
      if (!this.apperClient) this.initializeClient()
      
      const params = {
        records: [{
          Name: appointment.Name || appointment.title,
          Tags: appointment.Tags || appointment.tags || '',
          title: appointment.title,
          provider: appointment.provider,
          specialty: appointment.specialty || '',
          date: appointment.date,
          time: appointment.time,
          location: appointment.location || '',
          reason: appointment.reason || '',
          notes: appointment.notes || '',
          status: appointment.status || 'scheduled'
        }]
      }
      
      const response = await this.apperClient.createRecord('appointment', params)
      
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
          toast.success('Appointment created successfully')
          return successfulRecords[0].data
        }
      }
    } catch (error) {
      console.error('Error creating appointment:', error)
      toast.error('Failed to create appointment')
      throw error
    }
  }

  async update(id, appointmentData) {
    try {
      if (!this.apperClient) this.initializeClient()
      
      const params = {
        records: [{
          Id: parseInt(id),
          Name: appointmentData.Name || appointmentData.title,
          Tags: appointmentData.Tags || appointmentData.tags || '',
          title: appointmentData.title,
          provider: appointmentData.provider,
          specialty: appointmentData.specialty || '',
          date: appointmentData.date,
          time: appointmentData.time,
          location: appointmentData.location || '',
          reason: appointmentData.reason || '',
          notes: appointmentData.notes || '',
          status: appointmentData.status || 'scheduled'
        }]
      }
      
      const response = await this.apperClient.updateRecord('appointment', params)
      
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
          toast.success('Appointment updated successfully')
          return successfulRecords[0].data
        }
      }
    } catch (error) {
      console.error('Error updating appointment:', error)
      toast.error('Failed to update appointment')
      throw error
    }
  }

  async delete(id) {
    try {
      if (!this.apperClient) this.initializeClient()
      
      const params = {
        RecordIds: [parseInt(id)]
      }
      
      const response = await this.apperClient.deleteRecord('appointment', params)
      
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
          toast.success('Appointment deleted successfully')
          return true
        }
      }
    } catch (error) {
      console.error('Error deleting appointment:', error)
      toast.error('Failed to delete appointment')
      throw error
    }
  }

  async getUpcoming() {
    try {
      const allAppointments = await this.getAll()
      const now = new Date()
      
      return allAppointments
        .filter(apt => {
          const aptDate = new Date(`${apt.date}T${apt.time}`)
          return aptDate >= now && apt.status === 'scheduled'
        })
        .sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`))
    } catch (error) {
      console.error('Error fetching upcoming appointments:', error)
      toast.error('Failed to load upcoming appointments')
      throw error
    }
  }

  async getToday() {
    try {
      const allAppointments = await this.getAll()
      const today = new Date().toISOString().split('T')[0]
      
      return allAppointments.filter(apt => apt.date === today)
    } catch (error) {
      console.error('Error fetching today\'s appointments:', error)
      toast.error('Failed to load today\'s appointments')
      throw error
    }
  }
}

export default new AppointmentService()