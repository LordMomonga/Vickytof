import dayjs from "dayjs";
export const buildSlots = (start, end, stepMinutes = 30) => {
    const slots = [];
    let cursor = dayjs(`2000-01-01 ${start}`);
    const endLimit = dayjs(`2000-01-01 ${end}`);
    while (cursor.isBefore(endLimit)) {
        slots.push(cursor.format("HH:mm"));
        cursor = cursor.add(stepMinutes, "minute");
    }
    return slots;
};
export const overlaps = (requestedStart, requestedEnd, existingStart, existingEnd) => {
    const requestStart = dayjs(`2000-01-01 ${requestedStart}`);
    const requestEnd = dayjs(`2000-01-01 ${requestedEnd}`);
    const bookedStart = dayjs(`2000-01-01 ${existingStart}`);
    const bookedEnd = dayjs(`2000-01-01 ${existingEnd}`);
    return requestStart.isBefore(bookedEnd) && requestEnd.isAfter(bookedStart);
};
