import { format } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import "./Home.css"
import { CountrySelect } from './components/CountrySelect';
import { CountryType } from './types';
import { useHome } from './hooks';
import { Box, Button, Card, CardContent, CircularProgress, FormControl, Paper, Slide, TextField, Typography } from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers';

export function Home() {
    const { loading, month, setMonth, setCountryCode, events, holidays, selected, setSelected } = useHome()

    let footer = <p>Please pick a day.</p>;
    if (selected) {
        footer = <p>You picked {format(selected, 'PP')}.</p>;
    }
    return (
        <Box sx={{
            minHeight: "100vh",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: 'row',
            flexWrap: "wrap",
            gap: "10px",
            padding: "30px 30px"
        }}>
            {loading ?
                <Box sx={{ display: 'flex' }}>
                    <CircularProgress />
                </Box> :
                <>
                    <Box sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center"
                    }}>
                        <CountrySelect onChange={(e: unknown, val: CountryType) => {
                            setCountryCode(val.code)
                        }} />

                        <DayPicker
                            onMonthChange={(month: Date) => setMonth(month)}
                            month={month}
                            mode="single"
                            selected={selected}
                            onSelect={setSelected}
                            footer={footer}
                            modifiers={{
                                eventDate: events.map(el => el.event_date),
                                holidays: holidays.map(el => el.date)
                            }}
                            toYear={2023}
                            modifiersClassNames={
                                {
                                    holidays: 'holidays',
                                    eventDate: 'eventDate',
                                    today: 'today'
                                }
                            }
                        />
                    </Box>
                    {selected ?
                        <Slide direction="left" in={selected != undefined} mountOnEnter unmountOnExit >
                            <Card sx={{
                                flex: 1
                            }} >
                                <CardContent sx={{
                                    display: "grid",
                                    gap: "10px"
                                }}>


                                    <FormControl sx={{
                                        display: "grid",
                                        gap: "20px"
                                    }}>
                                        <TextField variant="outlined" type='text' label='Event Title' required />
                                        <TextField variant="outlined" type="text" label='Event Content' required />
                                        <TimePicker label="Event Time" />
                                        <Button type='submit' variant="contained">
                                            Submit
                                        </Button>
                                    </FormControl>


                                    {events.length == 0 ?
                                        <Typography>
                                            No Events Listes Yet
                                        </Typography> :
                                        <>
                                            <Typography variant="h5">
                                                List of Events:
                                            </Typography>
                                            {events.map(el => (
                                                <Paper elevation={3}>
                                                    <Typography variant="h6">
                                                        {el.title}
                                                    </Typography>
                                                    <Typography variant='body2'>
                                                        {el.content}
                                                    </Typography>
                                                </Paper>
                                            ))}
                                        </>
                                    }
                                    {holidays.filter(el => el.date.getDate() == selected.getDate()).length > 0 ?
                                        <>
                                            <Typography variant="h6">
                                                Holiday:
                                            </Typography>
                                            {holidays.filter(el => el.date.getDate() == selected.getDate()).map(val => (
                                                <Paper elevation={3} sx={{
                                                    padding: "10px 20px"
                                                }}>
                                                    <Typography variant='h6'>{val.name}</Typography>
                                                </Paper>
                                            ))}
                                        </>
                                        : null}
                                </CardContent>
                            </Card>
                        </Slide> : null}
                </>

            }
        </Box >
    );
}