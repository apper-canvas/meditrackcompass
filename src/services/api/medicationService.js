import medicationsData from '../mockData/medications.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class MedicationService {
  constructor() {
    this.medications = [...medicationsData]
  }

  async getAll() {
    await delay(300)
    return [...this.medications]
  }

  async getById(id) {
    await delay(200)
    const medication = this.medications.find(m => m.Id === parseInt(id, 10))
    if (!medication) {
      throw new Error('Medication not found')
    }
    return { ...medication }
  }

  async create(medication) {
    await delay(400)
    const maxId = this.medications.length > 0 ? Math.max(...this.medications.map(m => m.Id)) : 0
    const newMedication = {
      ...medication,
      Id: maxId + 1,
      taken: medication.taken || []
    }
    this.medications.push(newMedication)
    return { ...newMedication }
  }

  async update(id, medicationData) {
    await delay(350)
    const index = this.medications.findIndex(m => m.Id === parseInt(id, 10))
    if (index === -1) {
      throw new Error('Medication not found')
    }
    
    const updatedMedication = {
      ...this.medications[index],
      ...medicationData,
      Id: parseInt(id, 10) // Prevent Id modification
    }
    
    this.medications[index] = updatedMedication
    return { ...updatedMedication }
  }

  async delete(id) {
    await delay(250)
    const index = this.medications.findIndex(m => m.Id === parseInt(id, 10))
    if (index === -1) {
      throw new Error('Medication not found')
    }
    this.medications.splice(index, 1)
    return true
  }

  async markAsTaken(id, date, time) {
    await delay(200)
    const medication = this.medications.find(m => m.Id === parseInt(id, 10))
    if (!medication) {
      throw new Error('Medication not found')
    }
    
    if (!medication.taken) {
      medication.taken = []
    }
    
    const takenEntry = {
      date,
      time,
      taken: true
    }
    
    medication.taken.push(takenEntry)
    return { ...medication }
  }

  async getTodaysMedications() {
    await delay(250)
    const today = new Date().toISOString().split('T')[0]
    return this.medications.filter(med => {
      const startDate = new Date(med.startDate).toISOString().split('T')[0]
      const endDate = med.endDate ? new Date(med.endDate).toISOString().split('T')[0] : null
      return startDate <= today && (!endDate || endDate >= today)
    }).map(med => ({ ...med }))
  }
}

export default new MedicationService()