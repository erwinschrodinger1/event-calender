import { useEffect, useState } from 'react'
import { createEvent, getEventDates, getEventDetail, getHolidays } from '../api'
import { EventResponse } from '../types'

export const useHome = () => {
	const [selected, setSelected] = useState<Date>()
	const [month, setMonth] = useState<Date>(new Date(2023, 5))
	const [loading, setLoading] = useState<boolean>(false)
	const [value, setValue] = useState('')
	const [emails, setEmails] = useState([])
	const [timeError, setTimeError] = useState(false)
	const [eventDates, setEventDates] = useState<Date[]>([])
	const [events, setEvents] = useState<EventResponse[]>([])
	const [holidays, setHolidays] = useState<
		{
			date: Date
			name: string
		}[]
	>([])

	const [countryCode, setCountryCode] = useState('NP')

	useEffect(() => {
		setLoading(true)
		async function updateHolidays() {
			const resHolidays = await getHolidays({
				countryCode: countryCode,
				month: month.getMonth() + 1,
				year: month.getFullYear(),
			})
			console.log(resHolidays)
			setHolidays(resHolidays)
		}
		async function updateEvents() {
			const resEvents = await getEventDates({
				year: month.getFullYear(),
				month: month.getMonth() + 1,
			})
			console.log(resEvents)

			setEventDates(resEvents)
		}
		try {
			updateEvents()
			// updateHolidays()
		} catch (err) {
			console.log(err)
		}
		setLoading(false)
	}, [countryCode, month])

	useEffect(() => {
		setLoading(true)

		async function updateEventDetails() {
			if (selected) {
				const resEvents = await getEventDetail({
					year: selected.getFullYear(),
					month: selected.getMonth() + 1,
					day: selected.getDate(),
				})
				console.log(resEvents)
				setEvents(resEvents)
			}
		}
		try {
			updateEventDetails()
		} catch (err) {
			console.log(err)
		}
		setLoading(false)
	}, [selected])

	const onSubmit = async data => {
		console.log(data)
		if (emails.length < 0) {
			return setError(true)
		}
		if (
			parseInt(data.endTime.split(':')[0]) <=
				parseInt(data.startTime.split(':')[0]) &&
			parseInt(data.endTime.split(':')[1]) <=
				parseInt(data.startTime.split(':')[1])
		) {
			return setTimeError(true)
		}
		try {
			const startTime = new Date(
				selected.setHours(
					parseInt(data.startTime.split(':')[0]),
					parseInt(data.startTime.split(':')[1]),
				),
			)

			const endTime = new Date(
				selected.setHours(
					parseInt(data.endTime.split(':')[0]),
					parseInt(data.endTime.split(':')[1]),
				),
			)

			console.log(startTime, endTime)

			const response = await createEvent({
				title: data.title,
				content: data.content,
				participantEmail: emails,
				startTime: startTime,
				endTime: endTime,
			})
			setEventDates(prev => [...prev, selected])
			setEvents(events => [...events, response])
		} catch (err) {
			console.log(err)
		}
	}

	const [inputValue, setInputValue] = useState('')
	const regex =
		/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

	const [error, setError] = useState(false)

	function onChange(e, value) {
		// error
		const errorEmail = value.find(email => !regex.test(email))
		if (errorEmail) {
			// set value displayed in the textbox
			setInputValue(errorEmail)
			setError(true)
		} else {
			setError(false)
		}
		// Update state
		setEmails(value.filter(email => regex.test(email)))
	}

	function onDelete(value) {
		setEmails(emails.filter(e => e !== value))
	}

	function onInputChange(e, newValue) {
		setInputValue(newValue)
	}

	return {
		onSubmit,
		loading,
		selected,
		setSelected,
		setCountryCode,
		holidays,
		eventDates,
		events,
		month,
		setMonth,
		emails,
		inputValue,
		error,
		onChange,
		onDelete,
		onInputChange,
		timeError,
		setTimeError,
		setEventDates,
		setEvents,
	}
}
