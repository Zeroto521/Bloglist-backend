import dotenv from 'dotenv'

dotenv.config()

const MONGODB_URL = process.env.MONGODB_URL
const PORT = process.env.PORT

export default {
  MONGODB_URL,
  PORT
}
