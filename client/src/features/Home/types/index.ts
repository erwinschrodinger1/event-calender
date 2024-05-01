export interface CountryType {
	code: string
	label: string
	phone: string
	suggested?: boolean
}

export interface EventResponse {
	id: number
	participants_email: string[]
	title: string
	content: string
	start_date: Date
	end_date: Date
	created_at: Date
}
