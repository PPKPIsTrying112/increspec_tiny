export type Panel = 'chat' | 'notes' | 'requirements' | 'files'

export interface Message {
  role: 'user' | 'assistant'
  content: string
}