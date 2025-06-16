import React from 'react'
import { motion } from 'framer-motion'
import Card from '@/components/atoms/Card'
import ApperIcon from '@/components/ApperIcon'

const MetricCard = ({ metric, trend, icon, color = 'primary' }) => {
  const getTrendIcon = () => {
    if (trend === 'up') return 'TrendingUp'
    if (trend === 'down') return 'TrendingDown'
    return 'Minus'
  }

  const getTrendColor = () => {
    if (trend === 'up') return 'text-success'
    if (trend === 'down') return 'text-error'
    return 'text-gray-400'
  }

  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary/10 text-secondary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    error: 'bg-error/10 text-error'
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2 }}
    >
      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
              <ApperIcon name={icon} size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{metric.type}</h3>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-gray-900">
                  {metric.value}
                </span>
                <span className="text-sm text-gray-600">{metric.unit}</span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className={`flex items-center ${getTrendColor()}`}>
              <ApperIcon name={getTrendIcon()} size={16} className="mr-1" />
              <span className="text-sm font-medium">
                {trend === 'up' ? '+' : trend === 'down' ? '-' : ''}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(metric.date).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        {metric.notes && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-sm text-gray-600">{metric.notes}</p>
          </div>
        )}
      </Card>
    </motion.div>
  )
}

export default MetricCard