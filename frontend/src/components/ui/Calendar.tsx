import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Lock, Plus } from "lucide-react";
import { useColorScheme } from "@mui/joy/styles";
import Typography from "./Typography";
import IconButton from "./IconButton";
import Container from "../Container";
import { getColors } from "@/utils/Colors";
import { Tooltip } from "@mui/joy";

export interface CalendarEvent {
  date: Date;
  status: "Available" | "Reserved" | "Occupied" | "Maintenance" | "Blocked";
  label?: string;
  bookingId?: string;
  blockId?: string;
}

interface CalendarProps {
  events?: CalendarEvent[];
  onDateClick?: (date: Date, event?: CalendarEvent) => void;
  onBlockClick?: (date: Date) => void;
  selectedDate?: Date;
  minDate?: Date;
  maxDate?: Date;
  showBlockButton?: boolean;
  interactive?: boolean;
}

const Calendar: React.FC<CalendarProps> = ({
  events = [],
  onDateClick,
  onBlockClick,
  selectedDate,
  minDate,
  maxDate,
  showBlockButton = false,
  interactive = true,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const { mode } = useColorScheme();
  const colors = getColors(mode as "light" | "dark");

  const monthNames = [
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

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Get first day of the month
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1,
  );

  // Get last day of the month
  const lastDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0,
  );

  // Get the day of week for the first day (0 = Sunday, 6 = Saturday)
  const firstDayOfWeek = firstDayOfMonth.getDay();

  // Get total days in month
  const totalDays = lastDayOfMonth.getDate();

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const days: (Date | null)[] = [];

    // Add empty cells for days before the first day of month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }

    // Add actual days of the month
    for (let day = 1; day <= totalDays; day++) {
      days.push(
        new Date(currentDate.getFullYear(), currentDate.getMonth(), day),
      );
    }

    return days;
  }, [currentDate, firstDayOfWeek, totalDays]);

  // Navigate to previous month
  const handlePreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
    );
  };

  // Navigate to next month
  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
    );
  };

  // Check if date is today
  const isToday = (date: Date | null): boolean => {
    if (!date) return false;
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Check if date is selected
  const isSelected = (date: Date | null): boolean => {
    if (!date || !selectedDate) return false;
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  // Get event status for a date
  const getEventStatus = (date: Date | null): CalendarEvent | undefined => {
    if (!date) return undefined;

    const found = events.find((event) => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });

    return found;
  };

  // Get background color based on status
  const getStatusColor = (status: string): string => {
    switch (status) {
      case "Available":
        return "transparent";
      case "Reserved":
        return colors.secondary;
      case "Occupied":
        return colors.warning;
      case "Maintenance":
        return colors.error;
      case "Blocked":
        return colors.info;
      default:
        return "transparent";
    }
  };

  // Check if date is disabled
  const isDisabled = (date: Date | null): boolean => {
    if (!date) return true;
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  const handleDateClick = (date: Date | null, event?: CalendarEvent) => {
    if (!date || isDisabled(date) || !interactive) return;
    if (onDateClick) {
      onDateClick(date, event);
    }
  };

  const handleBlockClick = (date: Date | null, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!date || !onBlockClick) return;
    onBlockClick(date);
  };

  return (
    <Container
      padding="clamp(8px, 2vw, 16px)"
      gap="clamp(8px, 1.5vw, 12px)"
      style={{
        width: "100%",
        minWidth: 0,
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      <style>
        {`
          .calendar-day:hover .block-button {
            opacity: 1 !important;
          }
        `}
      </style>
      {/* Calendar Header */}
      <Container
        direction="row"
        align="center"
        justify="space-between"
        padding="0"
        gap="8px"
      >
        <IconButton
          size="sm"
          variant="outlined"
          colorScheme="primary"
          onClick={handlePreviousMonth}
          hoverEffect="scale"
        >
          <ChevronLeft size={18} />
        </IconButton>

        <Typography.CardTitle size="sm">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </Typography.CardTitle>

        <IconButton
          size="sm"
          variant="outlined"
          colorScheme="primary"
          onClick={handleNextMonth}
          hoverEffect="scale"
        >
          <ChevronRight size={18} />
        </IconButton>
      </Container>

      {/* Calendar Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "clamp(2px, 0.5vw, 4px)",
          width: "100%",
          minWidth: 0,
          marginBottom: 8,
        }}
      >
        {/* Day Names */}
        {dayNames.map((day) => (
          <div
            key={day}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "clamp(2px, 1vw, 6px)",
              fontWeight: 600,
              fontSize: "clamp(0.6rem, 1.5vw, 0.72rem)",
              color: colors.secondary,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {day}
          </div>
        ))}

        {/* Calendar Days */}
        {calendarDays.map((date, index) => {
          const event = getEventStatus(date);
          const disabled = isDisabled(date);
          const today = isToday(date);
          const selected = isSelected(date);
          const isBlocked = event?.status === "Blocked";
          const canBlock = showBlockButton && date && !disabled && !event;

          const dayContent = (
            <Container
              className="calendar-day"
              hover={interactive && !disabled}
              hoverEffect="highlight"
              hoverBackground={colors.primary}
              key={index}
              onClick={() => handleDateClick(date, event)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                aspectRatio: "1",
                padding: "clamp(2px, 0.5vw, 4px)",
                borderRadius: "6px",
                cursor:
                  date && !disabled && interactive ? "pointer" : "default",
                backgroundColor: event
                  ? getStatusColor(event.status)
                  : "transparent",
                border: today
                  ? `2px solid ${colors.primary}`
                  : selected
                    ? `2px solid ${colors.info}`
                    : "1px solid transparent",
                opacity: disabled ? 0.3 : date ? 1 : 0,
                transition: "all 0.2s ease-in-out",
                fontSize: "clamp(0.65rem, 1.5vw, 0.8rem)",
                fontWeight: event ? 600 : 400,
                position: "relative",
                minWidth: 0,
                overflow: "hidden",
              }}
            >
              {isBlocked && (
                <Lock
                  size={10}
                  style={{
                    position: "absolute",
                    top: 2,
                    right: 2,
                    opacity: 0.7,
                  }}
                />
              )}
              {canBlock && (
                <div
                  onClick={(e) => handleBlockClick(date, e)}
                  style={{
                    position: "absolute",
                    top: 2,
                    right: 2,
                    opacity: 0,
                    transition: "opacity 0.2s",
                    cursor: "pointer",
                  }}
                  className="block-button"
                >
                  <Plus size={10} />
                </div>
              )}
              <Typography.Body size="sm">{date?.getDate()}</Typography.Body>
            </Container>
          );

          if (event?.label) {
            return (
              <Tooltip key={index} title={event.label} placement="top">
                {dayContent}
              </Tooltip>
            );
          }

          return dayContent;
        })}
      </div>

      {/* Legend */}
      <Container padding="0" gap="clamp(4px, 1vw, 6px)">
        <Typography.Label size="xs">Status Legend</Typography.Label>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "6px 12px",
            width: "100%",
          }}
        >
          {[
            { color: colors.secondary, label: "Reserved" },
            { color: colors.warning, label: "Occupied" },
            { color: colors.error, label: "Maintenance" },
            { color: colors.info, label: "Blocked" },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                minWidth: 0,
              }}
            >
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "3px",
                  backgroundColor: item.color,
                  flexShrink: 0,
                }}
              />
              <Typography.Body size="xs">{item.label}</Typography.Body>
            </div>
          ))}
        </div>
      </Container>
    </Container>
  );
};

export default Calendar;
