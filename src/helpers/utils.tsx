import moment from 'moment'

export const formatTime = (
	time: string | number | Date,
	type_time?: 'ago' | 'short' | undefined
) => {
	if (type_time === 'ago') {
		return moment(time).fromNow()
	}
	if (type_time === 'short') {
		return new Date(time).toLocaleString(undefined, {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			hour12: true,
			minute: '2-digit',
		})
	}
	return new Date(time).toLocaleString(undefined, {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		hour12: true,
		minute: '2-digit',
		second: '2-digit',
	})
}

export const formatTimeHMS = (
	time: string | number | Date,
) => {

	return new Date(time).toLocaleString(undefined, {
		hour: '2-digit',
		hour12: false,
		minute: '2-digit',
		second: '2-digit',
	})
}

export const percentBetweenTwoValue = (oldValue: number, newValue: number) => {
	const old_value = oldValue || 0
	const new_value = newValue || 0

	if (!new_value && !old_value) {
		return { value: '--', increase: true, value_number: 0.0 }
	}

	if (!old_value) {
		return { value: '∞%', increase: true, value_number: 100000.0 }
	}

	if (!new_value) {
		return { value: '100%', increase: false, value_number: -100.0 }
	}

	const value = (((new_value - old_value) / old_value) * 100).toFixed(2)
	if (new_value >= old_value) {
		return { value: `${value}%`, increase: true, value_number: value }
	}

	return { value: `${value}%`, increase: false, value_number: value }
}

export const popupCenter = (url: string, title: string) => {
	const dualScreenLeft = window.screenLeft ?? window.screenX;
	const dualScreenTop = window.screenTop ?? window.screenY;

	const width =
		window.innerWidth ?? document.documentElement.clientWidth ?? screen.width;

	const height =
		window.innerHeight ??
		document.documentElement.clientHeight ??
		screen.height;

	const systemZoom = width / window.screen.availWidth;

	const left = (width - 500) / 2 / systemZoom + dualScreenLeft;
	const top = (height - 550) / 2 / systemZoom + dualScreenTop;

	const newWindow = window.open(
		url,
		title,
		`width=${500 / systemZoom},height=${550 / systemZoom
		},top=${top},left=${left}`
	);

	newWindow?.focus();
};

export function shortString(str: string, cutStart: number, cutEnd: number) {
	if (!str) return ''
	return str.substring(0, cutStart) + '...' + str.substring(str.length - cutEnd);
}

export const secondsToTime = (data: number): { [key: string]: number } => {
	//initial seconds 
	let seconds = data / 1000;

	//days 
	let days = Math.floor(seconds / (24 * 3600));
	seconds -= days * 24 * 3600;

	//hours 
	let hours = Math.floor(seconds / 3600);
	seconds -= hours * 3600;

	//minutes 
	let minutes = Math.floor(seconds / 60);
	seconds -= minutes * 60;

	//output 
	return {
		days: days,
		hours: hours,
		minutes: minutes,
		seconds: Math.floor(seconds)
	}
}
