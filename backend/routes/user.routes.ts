import { Router } from 'express'
import { createUser, getUsers, getUserById, updateUser, deleteUser } from '@/controllers/user.controller'

const router = Router()

// Basic CRUD routes
router.post('/', createUser)  // Create a user
router.get('/', getUsers)     // Get all users
router.get('/:id', getUserById) // Get user by ID
router.put('/:id', updateUser)  // Update user by ID
router.delete('/:id', deleteUser) // Delete user by ID

export default router
