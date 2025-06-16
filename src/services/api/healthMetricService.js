import healthMetricsData from '../mockData/healthMetrics.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class HealthMetricService {
  constructor() {
    this.healthMetrics = [...healthMetricsData]
  }

  async getAll() {
    await delay(300)
    return [...this.healthMetrics]
  }

  async getById(id) {
    await delay(200)
    const metric = this.healthMetrics.find(m => m.Id === parseInt(id, 10))
    if (!metric) {
      throw new Error('Health metric not found')
    }
    return { ...metric }
  }

  async create(metric) {
    await delay(400)
    const maxId = this.healthMetrics.length > 0 ? Math.max(...this.healthMetrics.map(m => m.Id)) : 0
    const newMetric = {
      ...metric,
      Id: maxId + 1
    }
    this.healthMetrics.push(newMetric)
    return { ...newMetric }
  }

  async update(id, metricData) {
    await delay(350)
    const index = this.healthMetrics.findIndex(m => m.Id === parseInt(id, 10))
    if (index === -1) {
      throw new Error('Health metric not found')
    }
    
    const updatedMetric = {
      ...this.healthMetrics[index],
      ...metricData,
      Id: parseInt(id, 10) // Prevent Id modification
    }
    
    this.healthMetrics[index] = updatedMetric
    return { ...updatedMetric }
  }

  async delete(id) {
    await delay(250)
    const index = this.healthMetrics.findIndex(m => m.Id === parseInt(id, 10))
    if (index === -1) {
      throw new Error('Health metric not found')
    }
    this.healthMetrics.splice(index, 1)
    return true
  }

  async getByType(type) {
    await delay(250)
    return this.healthMetrics
      .filter(m => m.type === type)
      .sort((a, b) => new Date(`${b.date}T${b.time}`) - new Date(`${a.date}T${a.time}`))
      .map(m => ({ ...m }))
  }

  async getRecent(limit = 5) {
    await delay(200)
    return this.healthMetrics
      .sort((a, b) => new Date(`${b.date}T${b.time}`) - new Date(`${a.date}T${a.time}`))
      .slice(0, limit)
      .map(m => ({ ...m }))
  }
}

export default new HealthMetricService()