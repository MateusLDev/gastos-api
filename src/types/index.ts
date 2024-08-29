export interface Gastos {
  id?: string,
  title: string,
  category: string,
  price: string,
  description?: string | null
  createdAt?: Date
}