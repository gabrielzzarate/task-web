import { getTasks } from '@/api/tasks'
import { getUser } from '@/api/auth'
import { Task } from '@/types/tasks'

import { authStoreAtom } from '@/lib/store'
import { atom } from 'jotai'

export default async function TaskList() {
  // const authStore = atom((get) => get(authStoreAtom))
  const user = await getUser('1')

  const tasks = await getTasks(user?.id)

  console.log('user', user, tasks)
  return (
    <div>
      {tasks?.map((task: Task) => (
        <div key={task.id}>{task.name}</div>
      ))}
    </div>
  )
}
