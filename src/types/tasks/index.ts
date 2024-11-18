import type { Base } from '@/types/base'

export interface Task extends Base {
  name: string
  description: string
  userId: string
  // dueDate: string
}
