import medicalEventsData from '../mockData/medicalEvents.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class MedicalEventService {
  constructor() {
    this.medicalEvents = [...medicalEventsData]
  }

  async getAll() {
    await delay(300)
    return [...this.medicalEvents]
  }

  async getById(id) {
    await delay(200)
    const event = this.medicalEvents.find(e => e.Id === parseInt(id, 10))
    if (!event) {
      throw new Error('Medical event not found')
    }
    return { ...event }
  }

  async create(event) {
    await delay(400)
    const maxId = this.medicalEvents.length > 0 ? Math.max(...this.medicalEvents.map(e => e.Id)) : 0
    const newEvent = {
      ...event,
      Id: maxId + 1
    }
    this.medicalEvents.push(newEvent)
    return { ...newEvent }
  }

  async update(id, eventData) {
    await delay(350)
    const index = this.medicalEvents.findIndex(e => e.Id === parseInt(id, 10))
    if (index === -1) {
      throw new Error('Medical event not found')
    }
    
    const updatedEvent = {
      ...this.medicalEvents[index],
      ...eventData,
      Id: parseInt(id, 10) // Prevent Id modification
    }
    
    this.medicalEvents[index] = updatedEvent
    return { ...updatedEvent }
  }

  async delete(id) {
    await delay(250)
    const index = this.medicalEvents.findIndex(e => e.Id === parseInt(id, 10))
    if (index === -1) {
      throw new Error('Medical event not found')
    }
    this.medicalEvents.splice(index, 1)
    return true
  }

  async getByType(type) {
    await delay(250)
    return this.medicalEvents
      .filter(e => e.type === type)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .map(e => ({ ...e }))
  }

  async getTimeline() {
    await delay(300)
    return this.medicalEvents
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .map(e => ({ ...e }))
  }
}

export default new MedicalEventService()