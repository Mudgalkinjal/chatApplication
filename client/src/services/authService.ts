import axios from 'axios'

const API_URL = process.env.REACT_APP_API_URL

export const signup = async (name: string, email: string, password: string) => {
  return axios.post(`${API_URL}/auth/signup`, { name, email, password })
}

export const signin = async (email: string, password: string) => {
  return axios.post(`${API_URL}/auth/signin`, { email, password })
}
