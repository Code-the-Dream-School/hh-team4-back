import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  lastName: {
    type: String,
    default: 'lastName',
  },
  store: {
    type: String,
  },
  role: {
    type: String,
    enum: ['admin', 'inventory manager', 'clerk'],
    default: 'clerk',
  },
})

export default mongoose.model('User', UserSchema)
