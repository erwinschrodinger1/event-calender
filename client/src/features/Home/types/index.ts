export interface CountryType {
	code: string
	label: string
	phone: string
	suggested?: boolean
}

export interface EventResponse {
	title: string
	content: string
	event_date: Date
	created_at: Date
}
