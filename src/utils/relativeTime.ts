
const sPerMinute = 60;
const sPerHour = sPerMinute * 60;
const sPerDay = sPerHour * 24;
const sPerMonth = sPerDay * 30;
const sPerYear = sPerDay * 365;

export function timeDifference(timestamp: number) {
    const current = Math.floor(Date.now() / 1000)
    const difference = Math.abs(current - timestamp)
    const isFuture = current < timestamp

    if (difference < sPerMinute) {
        const seconds = Math.round(difference / 1000)
        return isFuture ? ('In ' + seconds + ' seconds') : (seconds + ' seconds ago')
    }

    else if (difference < sPerHour) {
        const minutes = Math.round(difference / sPerMinute)
        return isFuture ? ('In ' + minutes + ' minute' + ((minutes > 1) ? 's' : '')) : (minutes + ' minute' + ((minutes > 1) ? 's' : '') + ' ago')
    }

    else if (difference < sPerDay) {
        const hours = Math.round(difference / sPerHour)
        return isFuture ? ('In ' + hours + ' hour' + ((hours > 1) ? 's' : '')) : (hours + ' hour' + ((hours > 1) ? 's' : '') + ' ago')
    }

    else if (difference < sPerMonth) {
        const days = Math.round(difference / sPerDay)
        return isFuture ? ('In ' + days + ' day' + ((days > 1) ? 's' : '')) : (days + ' day' + ((days > 1) ? 's' : '') + ' ago')
    }

    else if (difference < sPerYear) {
        const months = Math.round(difference / sPerMonth)
        return isFuture ? ('In ' + months + ' month' + ((months > 1) ? 's' : '')) : (months + ' month' + ((months > 1) ? 's' : '') + ' ago')
    }

    else {
        const years = Math.round(difference / sPerYear)
        return isFuture ? ('In ' + years + ' year' + ((years > 1) ? 's' : '')) : (years + ' year' + ((years > 1) ? 's' : '') + ' ago')
    }
}