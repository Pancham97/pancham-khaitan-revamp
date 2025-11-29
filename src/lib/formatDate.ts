export function parseDateInput(
    dateInput: string | Date | null | undefined,
): Date | null {
    if (!dateInput) {
        return null;
    }

    if (dateInput instanceof Date) {
        return isNaN(dateInput.getTime()) ? null : dateInput;
    }

    if (typeof dateInput === "string") {
        const trimmed = dateInput.trim();
        if (!trimmed) {
            return null;
        }

        if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
            const [year, month, day] = trimmed.split("-").map(Number);
            const parsed = new Date(Date.UTC(year, month - 1, day));
            return isNaN(parsed.getTime()) ? null : parsed;
        }

        const parsed = new Date(trimmed);
        return isNaN(parsed.getTime()) ? null : parsed;
    }

    return null;
}

function getOrdinalSuffix(day: number): string {
    if (day % 100 >= 11 && day % 100 <= 13) {
        return "th";
    }

    switch (day % 10) {
        case 1:
            return "st";
        case 2:
            return "nd";
        case 3:
            return "rd";
        default:
            return "th";
    }
}

const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

export function getFormattedDate(
    dateInput: string | Date | null | undefined,
): string {
    const date = parseDateInput(dateInput);
    if (!date) {
        return "";
    }

    const day = date.getUTCDate();
    const month = MONTHS[date.getUTCMonth()];
    const year = date.getUTCFullYear();

    return `${day}${getOrdinalSuffix(day)} ${month}, ${year}`;
}
