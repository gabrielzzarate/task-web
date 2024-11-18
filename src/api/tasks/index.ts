export async function getTasks(userId?: string) {
  if (!userId) {
    return []
  }
  try {
    const api = process.env.NEXT_PUBLIC_API_URL as string

    const requestUrl = `${api}/tasks/${userId}`
    const response = await fetch(requestUrl)
    const json = await response.json()

    return json.tasks
  } catch (error) {
    console.error('error', error)
  }
}
