/*
 * This file contains default configuration constants used throughout the application.
 * It defines standard values like timezones and slot intervals to ensure consistency.
 */

// Sets the default time zone for businesses.
const DEFAULT_TIMEZONE = 'America/New_York';

// Defines the standard duration for a single booking slot.
const DEFAULT_SLOT_INTERVAL_MINUTES = 15;

// Groups these defaults into a single configuration object for easy access.
const DEFAULT_BUSINESS_CONFIG = {
  timezone: DEFAULT_TIMEZONE,
  slotInterval: DEFAULT_SLOT_INTERVAL_MINUTES,
};

module.exports = {
  DEFAULT_TIMEZONE,
  DEFAULT_SLOT_INTERVAL_MINUTES,
  DEFAULT_BUSINESS_CONFIG,
};
