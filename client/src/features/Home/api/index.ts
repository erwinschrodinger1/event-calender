import { api, holidayApi } from '@/features/common/config/api'

export const getHolidays = async ({
	countryCode,
	year,
	month,
}: {
	countryCode: string
	year: number
	month: number
}) => {
	return holidayApi
		.get(`&country=${countryCode}&year=${year}&month=${month}`)
		.then(res => {
			const response = res.data.holidays
			const holidays = response.map(val => {
				return {
					name: val.name,
					date: new Date(
						new Date(val.date).getFullYear(),
						new Date(val.date).getMonth(),
						new Date(val.date).getDay(),
					),
				}
			})
			console.log(holidays)
			return holidays
		})
		.catch(err => {
			throw err
		})
}

export const createEvent = async ({
	title,
	content,
	startTime,
	endTime,
	participantEmail,
}: {
	title: string
	content: string
	startTime: Date
	endTime: Date
	participantEmail: string[]
}) => {
	return api
		.post(`v1/event/create`, {
			title,
			content,
			start_date: startTime,
			end_date: endTime,
			participants_email: participantEmail,
		})
		.then(res => {
			return res.data
		})
		.catch(err => {
			throw err
		})
}

export const getEventDates = async ({
	year,
	month,
}: {
	year: number
	month: number
}) => {
	return api
		.get(`v1/event?year=${year}&month=${month}`)
		.then(res => {
			return res.data.map(el => new Date(el))
		})
		.catch(err => {
			throw err
		})
}

export const getEventDetail = async ({
	year,
	month,
	day,
}: {
	year: number
	month: number
	day: number
}) => {
	return api
		.get(`/v1/event/detail?year=${year}&month=${month}&day=${day}`)
		.then(res => {
			return res.data
		})
		.catch(err => {
			throw err
		})
}

export const deleteEvent = async ({ id }: { id: number }) => {
	return api
		.delete(`/v1/event/${id}`)
		.then(res => {
			return res.data
		})
		.catch(err => {
			throw err
		})
}
