/*
 * This file contains utility functions for date and time manipulation.
 * It handles timezone conversions, slot generation, and conflict detection for scheduling.
 */

const { parse, format, addMinutes, isAfter, isBefore, isSameDay, setHours, setMinutes, setSeconds, setMilliseconds } = require('date-fns');
const { utcToZonedTime, zonedTimeToUtc } = require('date-fns-tz');

// Normalizes a date object to a specific time in a given timezone, converting it to UTC for consistent storage.
const setTimeOnDate = (date, timeString, timeZone) => {
    const zonedDate = utcToZonedTime(date, timeZone);
    const [hours, minutes] = timeString.split(':').map(Number);
    
    const dateWithTime = setHours(
        setMinutes(setSeconds(setMilliseconds(zonedDate, 0), 0), minutes),
        hours
    );

    return zonedTimeToUtc(dateWithTime, timeZone);
};

// Creates a list of available time slots for a specific day based on working hours and slot intervals.
exports.generateTimeSlots = (targetDayStartUTC, startTime, endTime, interval, timeZone) => {
    const slots = [];
    
    let currentTime = setTimeOnDate(targetDayStartUTC, startTime, timeZone);
    const dayEnd = setTimeOnDate(targetDayStartUTC, endTime, timeZone);

    while (isBefore(currentTime, dayEnd) || isSameDay(currentTime, dayEnd)) {
        slots.push(currentTime);
        currentTime = addMinutes(currentTime, interval);
        
        if (slots.length > 200) break;
    }

    return slots;
};

// Determines if a proposed time slot overlaps with any existing appointments or scheduled breaks.
exports.isSlotBooked = (slotStartUTC, duration, bufferTime, existingAppointments, breaks, dateString, timeZone) => {
    const totalTimeNeeded = duration + bufferTime;
    const slotEndUTC = addMinutes(slotStartUTC, duration);
    const slotEndWithBufferUTC = addMinutes(slotStartUTC, totalTimeNeeded);

    const appointmentConflict = existingAppointments.some(appt => {
        const apptStart = appt.startTime;
        const apptEnd = appt.endTime;
        
        return isBefore(slotStartUTC, apptEnd) && isAfter(slotEndWithBufferUTC, apptStart);
    });

    if (appointmentConflict) return true;

    const breakConflict = breaks.some(breakTime => {
        const breakStartUTC = setTimeOnDate(slotStartUTC, breakTime.startTime, timeZone);
        const breakEndUTC = setTimeOnDate(slotStartUTC, breakTime.endTime, timeZone);

        const overlapsBreak = isBefore(slotStartUTC, breakEndUTC) && isAfter(slotEndWithBufferUTC, breakStartUTC);
        const serviceCrossesBreak = isBefore(slotStartUTC, breakEndUTC) && isAfter(slotEndUTC, breakStartUTC);
        
        return overlapsBreak || serviceCrossesBreak;
    });

    if (breakConflict) return true;

    return false;
};