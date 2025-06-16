import appointmentsData from '../mockData/appointments.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class AppointmentService {
  constructor() {
    this.appointments = [...appointmentsData]
  }

  async getAll() {
    await delay(300)
    return [...this.appointments]
  }

  async getById(id) {
    await delay(200)
    const appointment = this.appointments.find(a => a.Id === parseInt(id, 10))
    if (!appointment) {
      throw new Error('Appointment not found')
    }
    return { ...appointment }
  }

  async create(appointment) {
    await delay(400)
    const maxId = this.appointments.length > 0 ? Math.max(...this.appointments.map(a => a.Id)) : 0
    const newAppointment = {
      ...appointment,
      Id: maxId + 1,
      status: appointment.status || 'scheduled'
    }
    this.appointments.push(newAppointment)
    return { ...newAppointment }
  }

  async update(id, appointmentData) {
    await delay(350)
    const index = this.appointments.findIndex(a => a.Id === parseInt(id, 10))
    if (index === -1) {
      throw new Error('Appointment not found')
    }
    
    const updatedAppointment = {
      ...this.appointments[index],
      ...appointmentData,
      Id: parseInt(id, 10) // Prevent Id modification
    }
    
    this.appointments[index] = updatedAppointment
    return { ...updatedAppointment }
  }

  async delete(id) {
    await delay(250)
    const index = this.appointments.findIndex(a => a.Id === parseInt(id, 10))
    if (index === -1) {
      throw new Error('Appointment not found')
    }
    this.appointments.splice(index, 1)
    return true
  }

  async getUpcoming() {
    await delay(250)
    const now = new Date()
    return this.appointments
      .filter(apt => {
        const aptDate = new Date(`${apt.date}T${apt.time}`)
        return aptDate >= now && apt.status === 'scheduled'
      })
      .sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`))
      .map(apt => ({ ...apt }))
  }

  async getToday() {
    await delay(200)
    const today = new Date().toISOString().split('T')[0]
    return this.appointments
      .filter(apt => apt.date === today)
      .map(apt => ({ ...apt }))
  }
}

export default new AppointmentService()