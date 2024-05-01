import { useEffect, useState } from 'react'
import { getHolidays } from '../api/getHolidays'
import { EventResponse } from '../types'

export const useHome = () => {
	const [selected, setSelected] = useState<Date>()
	const [month, setMonth] = useState<Date>(new Date(2023, 5))
	const [loading, setLoading] = useState<boolean>(false)
	const [value, setValue] = useState('')
	const [events, setEvents] = useState<EventResponse[]>([])
	const [holidays, setHolidays] = useState<
		{
			date: Date
			name: string
		}[]
	>([])

	const [countryCode, setCountryCode] = useState('NP')

	useEffect(() => {
		// setLoading(true)
		// async function updateHolidays() {
		//     const resHolidays = await getHolidays({ countryCode: countryCode, month: month.getMonth() + 1, year: month.getFullYear() })
		//     console.log(resHolidays);
		//     setHolidays(resHolidays)
		// }
		// try {
		//     updateHolidays()
		// }
		// catch (err) {
		//     console.log(err);
		// }
		// setLoading(false)
	}, [countryCode, month])

	return {
		loading,
		selected,
		setSelected,
		setCountryCode,
		holidays,
		events,
		month,
		setMonth,
	}
}
