export const addThousandsSeparator = (number) => {
    if (number === null || isNaN(number)) return "";

    const numberString = number.toString();
    const parts = numberString.split(".");

    let integerPart = parts[0];
    let decimalPart = parts[1];

    const lastThree = integerPart.substring(integerPart.length - 3);
    const otherNumbers = integerPart.substring(0, integerPart.length - 3);

    if (otherNumbers !== "") {
        const formattedOtherNumbers = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
        integerPart = formattedOtherNumbers + ',' + lastThree;
    } else {
        integerPart = lastThree;
    }

    return decimalPart ? `${integerPart}.${decimalPart}` : integerPart;
}

export function prepareIncomeLineChartData(transactions = [], options = {}) {
    const { interval = 'monthly', includeExpenses = true } = options;

    // Parse date to a Date object (returns null if invalid)
    const parseDate = (d) => {
        if (d instanceof Date && !isNaN(d)) return d;
        if (typeof d === 'number') {
            const dt = new Date(d);
            return isNaN(dt) ? null : dt;
        }
        if (typeof d === 'string') {
            const dt = new Date(d);
            return isNaN(dt) ? null : dt;
        }
        return null;
    };

    // Helpers to produce period keys and human labels
    const pad = (n) => String(n).padStart(2, '0');

    function periodKey(date) {
        const y = date.getFullYear();
        const m = date.getMonth() + 1;
        const d = date.getDate();

        if (interval === 'daily') {
            return `${y}-${pad(m)}-${pad(d)}`; // ISO-like day
        }
        if (interval === 'weekly') {
            // ISO week year-weekNumber (approximation using first day of week Monday)
            // We'll compute ISO week number:
            const target = new Date(date.valueOf());
            const dayNr = (date.getUTCDay() + 6) % 7; // Monday=0..Sunday=6
            target.setUTCDate(target.getUTCDate() - dayNr + 3);
            const firstThursday = new Date(Date.UTC(target.getUTCFullYear(),0,4));
            const diff = target - firstThursday;
            const week = 1 + Math.round(diff / (7 * 24 * 3600 * 1000));
            return `${target.getUTCFullYear()}-W${pad(week)}`;
        }
        // default monthly
        return `${y}-${pad(m)}`; // YYYY-MM
    }

    function periodLabelFromKey(key) {
        // For display on chart (keeps it simple)
        return key;
    }

    // Filter and normalize transactions (ignore invalid)
    const normalized = transactions
        .map(tx => {
            const dt = parseDate(tx.date ?? tx.createdAt ?? tx.timestamp);
            const amount = Number(tx.amount ?? tx.value ?? 0);
            return (dt && !Number.isNaN(amount)) ? { date: dt, amount } : null;
        })
        .filter(Boolean);

    if (normalized.length === 0) return [];

    // determine range (min/max date)
    let minDate = normalized[0].date;
    let maxDate = normalized[0].date;
    normalized.forEach(({ date }) => {
        if (date < minDate) minDate = date;
        if (date > maxDate) maxDate = date;
    });

    // Build map of periodKey -> sums
    const map = new Map();
    normalized.forEach(({ date, amount }) => {
        const key = periodKey(date);
        if (!map.has(key)) map.set(key, { income: 0, expenses: 0 });
        const bucket = map.get(key);
        if (amount >= 0) bucket.income += amount;
        else bucket.expenses += Math.abs(amount);
    });

    // Fill missing periods between minDate and maxDate
    const addMonths = (date, n) => {
        const d = new Date(date.getFullYear(), date.getMonth() + n, 1);
        return d;
    };
    const addDays = (date, n) => {
        const d = new Date(date);
        d.setDate(d.getDate() + n);
        return d;
    };
    const addWeeks = (date, n) => addDays(date, n * 7);

    // Create ordered list of period keys across the range
    const periodKeys = [];
    if (interval === 'daily') {
        let cur = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate());
        const end = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate());
        while (cur <= end) {
            periodKeys.push(periodKey(cur));
            cur = addDays(cur, 1);
        }
    } else if (interval === 'weekly') {
        // start from Monday of week containing minDate
        const start = new Date(minDate);
        const startDay = (start.getDay() + 6) % 7; // Monday = 0
        start.setDate(start.getDate() - startDay);
        let cur = start;
        const end = new Date(maxDate);
        const endDay = (end.getDay() + 6) % 7;
        end.setDate(end.getDate() + (6 - endDay)); // end of that week (Sunday)
        while (cur <= end) {
            periodKeys.push(periodKey(cur));
            cur = addWeeks(cur, 1);
        }
    } else { // monthly
        let cur = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
        const end = new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);
        while (cur <= end) {
            periodKeys.push(periodKey(cur));
            cur = addMonths(cur, 1);
        }
    }

    // Build final array
    const result = periodKeys.map(key => {
        const sums = map.get(key) || { income: 0, expenses: 0 };
        const income = Number(Number(sums.income).toFixed(2));
        const expenses = includeExpenses ? Number(Number(sums.expenses).toFixed(2)) : 0;
        const net = Number((income - expenses).toFixed(2));
        return {
            label: periodLabelFromKey(key),
            income,
            expenses,
            net,
        };
    });

    return result;
}