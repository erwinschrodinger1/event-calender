import { useRoutes } from 'react-router-dom'
import { routes } from './routes'

import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { Toaster } from 'react-hot-toast'

const darkTheme = createTheme({
	transitions: {
		duration: {
			enteringScreen: 1000,
			leavingScreen: 500,
		},
	},
	palette: {
		mode: 'dark',
	},
})

function App() {
	const routeElements = useRoutes(routes)
	return (
		<ThemeProvider theme={darkTheme}>
			<CssBaseline />
			<LocalizationProvider dateAdapter={AdapterDayjs}>
				{routeElements}
				<Toaster />
			</LocalizationProvider>
		</ThemeProvider>
	)
}

export default App
