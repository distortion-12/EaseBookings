const {
  parse,
  addMinutes,
  isWithinInterval,
  areIntervalsOverlapping,
  format,
} = require('date-fns');
const { utcToZonedTime, zonedTimeToUtc } = require('date-fns-tz');

/**
 * Converts a local time string (e.g., "09:00") on a specific date and timezone
 * into a UTC Date object.
 * @param {string} dateStr - e.g., "2025-12-10"
 * @param {string} timeStr - e.g., "09:00"
 * @param {string} timeZone - e.g., "America/New_York"
 * @returns {Date} - The UTC Date object
 */
exports.convertLocalToUTC = (dateStr, timeStr, timeZone) => {
  const localDateTimeStr = `${dateStr}T${timeStr}`;
  const zonedDate = utcToZonedTime(
    parse(localDateTimeStr, "yyyy-MM-dd'T'HH:mm", new Date()),
    timeZone
  );
  return zonedTimeToUtc(zonedDate, timeZone);
};

/**
 * Generates all possible appointment slots for a given day's schedule.
 * @param {Date} dayStartUTC - The start of the day in UTC
 * @param {string} localStartTime - e.g., "09:00"
 * @param {string} localEndTime - e.g., "17:00"
 * @param {number} slotInterval - The interval in minutes (e.g., 15)
 * @param {string} timeZone - The business's timezone
 * @returns {Date[]} - An array of UTC Date objects for each potential slot start
 */
exports.generateTimeSlots = (
  dayStartUTC,
  localStartTime,
  localEndTime,
  slotInterval,
  timeZone
) => {
  const slots = [];
  const dateStr = format(dayStartUTC, 'yyyy-MM-dd');

  let currentSlotTime = this.convertLocalToUTC(
    dateStr,
    localStartTime,
    timeZone
  );
  const endDateTime = this.convertLocalToUTC(
    dateStr,
    localEndTime,
    timeZone
  );

  while (currentSlotTime < endDateTime) {
    slots.push(new Date(currentSlotTime)); // Push a copy
    currentSlotTime = addMinutes(currentSlotTime, slotInterval);
  }

  return slots;
};

/**
 * Checks if a proposed appointment slot overlaps with existing appointments or breaks.
 * @param {Date} slotStartTime - The proposed start time in UTC
 * @param {number} duration - The service duration (in minutes)
 * @param {number} bufferTime - The service buffer (in minutes)
 * @param {Array} existingAppointments - Array of existing { startTime, endTime } objects (in UTC)
 * @param {Array} breaks - Array of { startTime, endTime } objects (in *local* "HH:mm" format)
 * @param {string} dateStr - The local date string (e.g., "2025-12-10")
 * @param {string} timeZone - The business's timezone
 * @returns {boolean} - True if there is a conflict, false otherwise
 */
exports.isSlotBooked = (
  slotStartTime,
  duration,
  bufferTime,
  existingAppointments,
  breaks,
  dateStr,
  timeZone
) => {
  const totalDuration = duration + bufferTime;
  const slotEndTime = addMinutes(slotStartTime, totalDuration);

  // 1. Check against existing appointments
  for (const appt of existingAppointments) {
    if (
      areIntervalsOverlapping(
        { start: slotStartTime, end: slotEndTime },
        { start: appt.startTime, end: appt.endTime },
        { inclusive: false } // A 10:00 appt can't start if another ends at 10:00
      )
    ) {
      return true; // Overlaps with an appointment
    }
  }

  // 2. Check against breaks
  for (const br of breaks) {
    const breakStartUTC = this.convertLocalToUTC(
      dateStr,
      br.startTime,
      timeZone
    );
    const breakEndUTC = this.convertLocalToUTC(dateStr, br.endTime, timeZone);

    if (
      areIntervalsOverlapping(
        { start: slotStartTime, end: slotEndTime },
        { start: breakStartUTC, end: breakEndUTC }
      )
    ) {
      return true; // Overlaps with a break
    }
  }

  return false;
};