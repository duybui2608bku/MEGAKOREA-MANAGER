import mongoose from 'mongoose'
import { countConnect } from '~/helpers/check.connect'
import { config } from 'dotenv'
import configMongodb from '~/config/congif.mongodb'
config()

const connectString = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@megakorae-call.rrq1b.mongodb.net/${configMongodb.db.name}?retryWrites=true&w=majority&appName=MEGAKORAE-CALL&tls=true`
console.log(connectString)
class Database {
  private static instance: Database
  constructor() {
    this.connect()
  }
  connect(type: string = 'mongodb') {
    if (configMongodb.name) {
      mongoose.set('debug', true)
      mongoose.set('debug', { color: true })
    }

    mongoose.connection.on('connected', () => {
      console.log('✅ MongoDB connected successfully!')
    })

    mongoose
      .connect(connectString)
      .then(() => console.log('Connected to mongoDB', countConnect()))
      .catch((_) => {
        console.log('Error connect to DB')
      })
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new Database()
    }
    return this.instance
  }
}

const instanceMongodb = Database.getInstance()

export default instanceMongodb
