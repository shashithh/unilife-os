function startOfDay(d = new Date()) {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
}

function isPastDate(date) {
    return new Date(date) < startOfDay(new Date());
}

module.exports = { startOfDay, isPastDate };