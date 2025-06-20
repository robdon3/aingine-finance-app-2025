import { Redis } from '@upstash/redis'

// Initialize Redis from environment variables with fallback
let redis: Redis | null = null

try {
  redis = Redis.fromEnv()
} catch (error) {
  console.warn('Failed to initialize Redis from environment variables:', error)
  console.warn('Cloud storage will be disabled. Check your UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN environment variables.')
}

const USER_DATA_PREFIX = 'aegis_user_data:'
const USERS_KEY = 'aegis_users'

export async function getUserData(userId: string) {
  if (!redis) {
    console.warn('Redis not available, returning null for getUserData')
    return null
  }
  
  try {
    const data = await redis.get(`${USER_DATA_PREFIX}${userId}`)
    return data ? JSON.parse(data as string) : null
  } catch (error) {
    console.error('Error getting user data from Redis:', error)
    return null
  }
}

export async function setUserData(userId: string, data: any) {
  if (!redis) {
    console.warn('Redis not available, skipping setUserData')
    return
  }
  
  try {
    await redis.set(`${USER_DATA_PREFIX}${userId}`, JSON.stringify(data))
  } catch (error) {
    console.error('Error setting user data in Redis:', error)
    throw error
  }
}

export async function removeUserData(userId: string) {
  if (!redis) {
    console.warn('Redis not available, skipping removeUserData')
    return
  }
  
  try {
    await redis.del(`${USER_DATA_PREFIX}${userId}`)
  } catch (error) {
    console.error('Error removing user data from Redis:', error)
    throw error
  }
}

export async function getUsers() {
  if (!redis) {
    console.warn('Redis not available, returning empty array for getUsers')
    return []
  }
  
  try {
    const users = await redis.get(USERS_KEY)
    return users ? JSON.parse(users as string) : []
  } catch (error) {
    console.error('Error getting users from Redis:', error)
    return []
  }
}

export async function setUsers(users: any[]) {
  if (!redis) {
    console.warn('Redis not available, skipping setUsers')
    return
  }
  
  try {
    await redis.set(USERS_KEY, JSON.stringify(users))
  } catch (error) {
    console.error('Error setting users in Redis:', error)
    throw error
  }
}

// Optionally, add more helpers as needed (e.g., list all users, etc.) 