import mongoose from 'mongoose'
import os from 'os'
const _SECONDS = 255000
export const countConnect = () => {
  const numConnection = mongoose.connections.length
  console.log('Number of connections:', numConnection)
}

export const checkOverload = () => {
  setInterval(() => {
    const numConnection = mongoose.connections.length
    const numCores = os.cpus().length
    const memoryUsage = process.memoryUsage().rss
    const maxConnection = numCores * 5
    console.log('Active connections:', numConnection)
    console.log('Memory usage:', memoryUsage / 1024 / 1024, 'MB')
    numConnection > maxConnection && console.log('Overload')
  }, _SECONDS)
}
