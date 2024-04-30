import { api, holidayApi } from "@/features/common/config/api"

export const getHolidays = async ({ countryCode, year, month }: { countryCode: string, year: number, month: number }) => {
    return holidayApi.get(`&country=${countryCode}&year=${year}&month=${month}`).then(res => {
        const response = res.data.holidays
        const holidays = response.map(val => {
            return {
                name: val.name,
                date: new Date(new Date(val.date).getFullYear(), new Date(val.date).getMonth(), new Date(val.date).getDay())
            }
        })
        console.log(holidays);
        return holidays;
    }).catch(err => {
        throw err
    })
}
