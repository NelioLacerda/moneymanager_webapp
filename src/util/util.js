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

export function prepareLineChartData(transactions = [], options = {}) {
    const { interval = 'monthly', includeExpenses = false, currency = 'INR', valueBy = 'income' } = options;

    const parseDate = (d) => {
        if (d instanceof Date && !isNaN(d)) return d;
        if (typeof d === 'number') {
            const dt = new Date(d);
            return isNaN(dt) ? null : dt;
        }
        if (typeof d === 'string') {
            // ISO YYYY-MM-DD
            const iso = /^(\d{4})-(\d{2})-(\d{2})$/;
            let m = d.match(iso);
            if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));

            // common DD-MM-YYYY or DD/MM/YYYY
            const dmy = /^(\d{2})[\/-](\d{2})[\/-](\d{4})$/;
            m = d.match(dmy);
            if (m) return new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]));

            // fallback to Date parser (still may fail in some locales)
            const dt = new Date(d);
            return isNaN(dt) ? null : dt;
        }
        return null;
    };

    const pad = (n) => String(n).padStart(2, '0');

    // ... periodKey, formatLabelFromDate remain the same as before ...
    function periodKey(date) {
        const y = date.getFullYear();
        const m = date.getMonth() + 1;
        const d = date.getDate();
        if (interval === 'daily') return `${y}-${pad(m)}-${pad(d)}`;
        if (interval === 'weekly') {
            const target = new Date(date.valueOf());
            const dayNr = (date.getUTCDay() + 6) % 7;
            target.setUTCDate(target.getUTCDate() - dayNr + 3);
            const firstThursday = new Date(Date.UTC(target.getUTCFullYear(), 0, 4));
            const diff = target - firstThursday;
            const week = 1 + Math.round(diff / (7 * 24 * 3600 * 1000));
            return `${target.getUTCFullYear()}-W${pad(week)}`;
        }
        return `${y}-${pad(m)}`;
    }

    function formatLabelFromDate(date) {
        return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: undefined });
    }

    // Normalize transactions and parse amounts robustly
    const normalized = transactions
        .map((tx, idx) => {
            const dt = parseDate(tx.date ?? tx.createdAt ?? tx.timestamp);
            let rawAmount = tx.amount ?? tx.value ?? 0;
            // robust parsing: remove currency symbols and thousands separators
            if (typeof rawAmount === 'string') {
                // remove all but digits, minus, dot, comma; then remove thousands commas
                const cleaned = rawAmount.replace(/[^\d\-,\.]/g, '');
                // if contains comma and dot, assume comma thousands (e.g. "1,234.56") -> remove commas
                // if only commas and no dots, treat commas as thousands sep -> remove commas
                const noThousands = cleaned.replace(/,/g, '');
                rawAmount = noThousands;
            }
            const amount = Number(rawAmount);
            return (dt && !Number.isNaN(amount)) ? { date: dt, amount, raw: tx, idx } : null;
        })
        .filter(Boolean);

    if (normalized.length === 0) return [];

    const formatter = new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency,
        maximumFractionDigits: 0,
    });

    if (interval === 'none') {
        normalized.sort((a, b) => a.date - b.date);
        return normalized.map((item) => {
            const income = item.amount >= 0 ? item.amount : 0;
            const expenses = item.amount < 0 ? Math.abs(item.amount) : 0;
            const net = income - expenses;
            return {
                label: formatLabelFromDate(item.date),
                value: item.amount,
                details: {
                    Total: formatter.format(net),
                    Income: formatter.format(income),
                    Expenses: formatter.format(expenses),
                },
                _meta: { raw: item.raw, dateISO: item.date.toISOString() }
            };
        });
    }

    // aggregate by period
    let minDate = normalized[0].date;
    let maxDate = normalized[0].date;
    normalized.forEach(({ date }) => {
        if (date < minDate) minDate = date;
        if (date > maxDate) maxDate = date;
    });

    const map = new Map();
    normalized.forEach(({ date, amount }) => {
        const key = periodKey(date);
        if (!map.has(key)) map.set(key, { income: 0, expenses: 0 });
        const bucket = map.get(key);
        if (amount >= 0) bucket.income += amount;
        else bucket.expenses += Math.abs(amount);
    });

    const addMonths = (date, n) => new Date(date.getFullYear(), date.getMonth() + n, 1);
    const addDays = (date, n) => { const d = new Date(date); d.setDate(d.getDate() + n); return d; };
    const addWeeks = (date, n) => addDays(date, n * 7);

    const periodKeys = [];
    if (interval === 'daily') {
        let cur = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate());
        const end = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate());
        while (cur <= end) {
            periodKeys.push(periodKey(cur));
            cur = addDays(cur, 1);
        }
    } else if (interval === 'weekly') {
        const start = new Date(minDate);
        const startDay = (start.getDay() + 6) % 7;
        start.setDate(start.getDate() - startDay);
        let cur = start;
        const end = new Date(maxDate);
        const endDay = (end.getDay() + 6) % 7;
        end.setDate(end.getDate() + (6 - endDay));
        while (cur <= end) {
            periodKeys.push(periodKey(cur));
            cur = addWeeks(cur, 1);
        }
    } else {
        let cur = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
        const end = new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);
        while (cur <= end) {
            periodKeys.push(periodKey(cur));
            cur = addMonths(cur, 1);
        }
    }

    function periodLabelFromKey(key) {
        if (interval === 'monthly') {
            const [y, m] = key.split('-');
            const jsDate = new Date(Number(y), Number(m) - 1, 1);
            return jsDate.toLocaleString(undefined, { month: 'short', year: 'numeric' });
        }
        if (interval === 'daily') {
            const [y, m, d] = key.split('-');
            const jsDate = new Date(Number(y), Number(m) - 1, Number(d));
            return jsDate.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
        }
        return key;
    }

    const result = periodKeys.map(key => {
        const sums = map.get(key) || { income: 0, expenses: 0 };
        const income = Number(Number(sums.income).toFixed(2));
        const expenses = includeExpenses ? Number(Number(sums.expenses).toFixed(2)) : 0;
        const net = Number((income - expenses).toFixed(2));
        const value = valueBy === 'income' ? income : valueBy === 'expenses' ? expenses : net;
        return {
            label: periodLabelFromKey(key),
            value,
            details: {
                Total: formatter.format(net),
                Income: formatter.format(income),
                Expenses: formatter.format(expenses),
            },
            _meta: { income, expenses, net, key }
        };
    });

    return result;
}
