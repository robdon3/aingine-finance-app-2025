import { Redis } from '@upstash/redis'

// Initialize Redis from environment variables
const redis = Redis.fromEnv()

const USER_DATA_PREFIX = 'aegis_user_data:'
const USERS_KEY = 'aegis_users'

export async function getUserData(userId: string) {
  const data = await redis.get(`${USER_DATA_PREFIX}${userId}`)
  return data ? JSON.parse(data as string) : null
}

export async function setUserData(userId: string, data: any) {
  await redis.set(`${USER_DATA_PREFIX}${userId}`, JSON.stringify(data))
}

export async function removeUserData(userId: string) {
  await redis.del(`${USER_DATA_PREFIX}${userId}`)
}

export async function getUsers() {
  const users = await redis.get(USERS_KEY)
  return users ? JSON.parse(users as string) : []
}

export async function setUsers(users: any[]) {
  await redis.set(USERS_KEY, JSON.stringify(users))
}

// Optionally, add more helpers as needed (e.g., list all users, etc.) 