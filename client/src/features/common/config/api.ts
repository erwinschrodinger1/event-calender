import axios from 'axios'

const apiUrl = import.meta.env.API_URL
const holidayApiKey = import.meta.env.VITE_HOLIDAY_API_KEY

export const api = axios.create({
	baseURL: `${apiUrl}/api`,
})

export const holidayApi = axios.create({
	baseURL: `https://holidayapi.com/v1/holidays?pretty`,
	params: {
		key: holidayApiKey,
	},
})
