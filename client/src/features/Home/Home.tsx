import { format } from 'date-fns'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import './Home.css'
import { CountrySelect } from './components/CountrySelect'
import { CountryType } from './types'
import { useHome } from './hooks'
import {
	Autocomplete,
	Box,
	Button,
	Card,
	CardContent,
	Chip,
	CircularProgress,
	FormControl,
	Paper,
	Slide,
	TextField,
	Typography,
} from '@mui/material'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import moment from 'moment'
import { IconButton } from '@mui/material'
import { DeleteOutlineRounded } from '@mui/icons-material'
import { deleteEvent } from './api'
import toast from 'react-hot-toast'

export function Home() {
	const {
		loading,
		month,
		setMonth,
		setCountryCode,
		events,
		holidays,
		selected,
		setSelected,
		onSubmit,
		eventDates,
		setEvents,
		setEventDates,
		emails,
		inputValue,
		error,
		onChange,
		onDelete,
		onInputChange,
		timeError,
		setTimeError,
	} = useHome()

	const { register, handleSubmit } = useForm()
	let footer = <p>Please pick a day.</p>
	if (selected) {
		footer = <p>You picked {format(selected, 'PP')}.</p>
	}

	return (
		<Box
			sx={{
				minHeight: '100vh',
				widfalseth: '100%',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				flexDirection: 'row',
				flexWrap: 'wrap',
				gap: '10px',
				padding: '30px 30px',
			}}
		>
			{loading ? (
				<Box sx={{ display: 'flex' }}>
					<CircularProgress />
				</Box>
			) : (
				<>
					<Box
						sx={{
							flex: 1,
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<CountrySelect
							onChange={(e: unknown, val: CountryType) => {
								setCountryCode(val.code)
							}}
						/>

						<DayPicker
							onMonthChange={(month: Date) => setMonth(month)}
							month={month}
							mode='single'
							selected={selected}
							onSelect={setSelected}
							footer={footer}
							modifiers={{
								eventDate: eventDates,
								holidays: holidays.map(el => el.date),
							}}
							toYear={2023}
							modifiersClassNames={{
								holidays: 'holidays',
								eventDate: 'eventDate',
								today: 'today',
							}}
						/>
					</Box>
					{selected ? (
						<Slide
							direction='left'
							in={selected != undefined}
							mountOnEnter
							unmountOnExit
						>
							<Card
								sx={{
									flex: 1,
									maxHeight: '80vh',
									minWidth: '350px',
									overflow: 'scroll',
								}}
							>
								<CardContent
									sx={{
										display: 'grid',
										gap: '10px',
									}}
								>
									<form
										onSubmit={handleSubmit(onSubmit)}
										style={{
											display: 'grid',
											gap: '20px',
										}}
									>
										<TextField
											variant='outlined'
											type='text'
											label='Event Title'
											required
											{...register('title')}
										/>
										<TextField
											variant='outlined'
											type='text'
											label='Event Content'
											required
											{...register('content')}
										/>
										<TextField
											type='time'
											required
											variant='outlined'
											label='Start Time'
											{...register('startTime')}
										/>
										<TextField
											type='time'
											required
											variant='outlined'
											label='End Time'
											{...register('endTime')}
											error={timeError}
											onChange={() => setTimeError(false)}
											helperText={
												timeError && 'End time cannot less than start time'
											}
										/>

										<Autocomplete
											multiple
											onChange={onChange}
											id='tags-filled'
											options={[]}
											freeSolo
											value={emails}
											inputValue={inputValue}
											onInputChange={onInputChange}
											renderTags={(value, getTagProps) =>
												value.map((option, index) => (
													<Chip
														variant='outlined'
														label={option}
														{...getTagProps({ index })}
														onDelete={() => onDelete(option)}
													/>
												))
											}
											renderInput={params => (
												<TextField
													type='email'
													{...params}
													label='Participant Emails'
													error={error}
													helperText={
														error && 'Please enter a valid email address'
													}
													// required
												/>
											)}
										/>
										<Button type='submit' variant='contained'>
											Submit
										</Button>
									</form>

									{events.length == 0 ? (
										<Typography>No Events Listes Yet</Typography>
									) : (
										<>
											<Typography variant='h5'>List of Events:</Typography>
											{events.map(el => (
												<Paper
													elevation={3}
													sx={{
														padding: '10px 20px',
													}}
												>
													<Box sx={{ position: 'relative' }}>
														<IconButton
															sx={{
																position: 'absolute',
																right: '0px',
																top: '0px',
															}}
															onClick={async () => {
																try {
																	await deleteEvent({ id: el.id })
																	setEvents(prev =>
																		prev.filter(val => val.id != el.id),
																	)
																	setEventDates(prev =>
																		prev.filter(
																			val =>
																				val.getTime() !=
																				new Date(el.start_date).getTime(),
																		),
																	)
																	return toast.success(
																		'Event Sucessfully Removed',
																	)
																} catch (e) {
																	return toast.error(e.response.data.message)
																}
															}}
														>
															<DeleteOutlineRounded />
														</IconButton>
														<Typography variant='h6'>{el.title}</Typography>
														<Typography variant='body2'>
															{el.content}
														</Typography>
														<Typography variant='body2'>
															Time:{' '}
															{moment(el.start_date).format('hh:mm A') +
																' - ' +
																moment(el.end_date).format('hh:mm A')}
														</Typography>

														{el.participants_email.map(val => (
															<Typography variant='body2'>{val}</Typography>
														))}
													</Box>
												</Paper>
											))}
										</>
									)}
									{holidays.filter(
										el => el.date.getDate() == selected.getDate(),
									).length > 0 ? (
										<>
											<Typography variant='h6'>Holiday:</Typography>
											{holidays
												.filter(el => el.date.getDate() == selected.getDate())
												.map(val => (
													<Paper
														elevation={3}
														sx={{
															padding: '10px 20px',
														}}
													>
														<Typography variant='body2'>{val.name}</Typography>
													</Paper>
												))}
										</>
									) : null}
								</CardContent>
							</Card>
						</Slide>
					) : null}
				</>
			)}
		</Box>
	)
}
