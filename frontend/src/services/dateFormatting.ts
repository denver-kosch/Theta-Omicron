interface DateFormattingOptions {
	includeTime?: boolean;
}

interface DateOptionsWithTime extends Intl.DateTimeFormatOptions {
	month: "numeric";
	day: "numeric";
	year: "numeric";
	hour: "numeric";
	minute: "numeric";
	hour12: true;
	timeZone: "UTC";
}

interface DateOptionsWithoutTime extends Intl.DateTimeFormatOptions {
	month: "short";
	day: "numeric";
	year: "numeric";
	timeZone: "UTC";
}

export const fDate = (date: string | number | Date, { includeTime = true }: DateFormattingOptions = {}): string => {
	const options: DateOptionsWithTime | DateOptionsWithoutTime = includeTime ? {
		month: "numeric",
		day: "numeric",
		year: "numeric",
		hour: "numeric",
		minute: "numeric",
		hour12: true,
		timeZone: "UTC"
	} : {
		month: "short",
		day: "numeric",
		year: "numeric",
		timeZone: "UTC"
	};
	return new Date(date).toLocaleString('en-US', options);
};