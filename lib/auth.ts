// Mock authentication interface for easy swap later

export interface IAuth {
  getCurrentUser(): Promise<User | null>
  signIn(email: string): Promise<User>
  signOut(): Promise<void>
  isAuthenticated(): Promise<boolean>
}

import type { User } from "@/types"
import { storage } from "./storage"

class MockAuth implements IAuth {
  private CURRENT_USER_KEY = "developlogy_current_user"

  async getCurrentUser(): Promise<User | null> {
    if (typeof window === "undefined") return null

    const userId = localStorage.getItem(this.CURRENT_USER_KEY)
    if (!userId) return null

    return await storage.getUser(userId)
  }

  async signIn(email: string): Promise<User> {
    if (typeof window === "undefined") throw new Error("Cannot sign in on server")

    // Mock: create or find user by email
    const users = JSON.parse(localStorage.getItem("developlogy_users") || "[]")
    let user = users.find((u: User) => u.email === email)

    if (!user) {
      user = await storage.createUser({ email })
    } else {
      localStorage.setItem(this.CURRENT_USER_KEY, user.id)
    }

    return user
  }

  async signOut(): Promise<void> {
    if (typeof window === "undefined") return
    localStorage.removeItem(this.CURRENT_USER_KEY)
  }

  async isAuthenticated(): Promise<boolean> {
    const user = await this.getCurrentUser()
    return !!user
  }
}

// Export singleton instance
export const auth: IAuth = new MockAuth()
