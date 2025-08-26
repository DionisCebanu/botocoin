
import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { format, addDays, setHours, setMinutes, isSameDay, isPast } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

const generateTimeSlots = (selectedDate) => {
  const slots = [];
  const now = new Date();
  const isToday = isSameDay(selectedDate, now);

  for (let hour = 10; hour < 18; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const slotTime = setMinutes(setHours(new Date(selectedDate), hour), minute);
      if (!isToday || (isToday && !isPast(slotTime))) {
        slots.push(format(slotTime, 'HH:mm'));
      }
    }
  }
  return slots;
};

const PickupTimePicker = ({ value, onChange, errors }) => {
  const { t } = useTranslation();
  const { date, time } = value;

  const timeSlots = useMemo(() => generateTimeSlots(date || new Date()), [date]);

  const handleDateChange = (newDate) => {
    onChange({ date: newDate, time: '' }); // Reset time when date changes
  };

  const handleTimeChange = (newTime) => {
    onChange({ ...value, time: newTime });
  };

  return (
    <div className="grid sm:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium mb-1">{t('checkout_pickup_date')}*</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateChange}
              initialFocus
              fromDate={new Date()}
              toDate={addDays(new Date(), 7)}
            />
          </PopoverContent>
        </Popover>
        {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">{t('checkout_pickup_time_slot')}*</label>
        <Select value={time} onValueChange={handleTimeChange} disabled={!date || timeSlots.length === 0}>
          <SelectTrigger>
            <SelectValue placeholder="Select a time" />
          </SelectTrigger>
          <SelectContent>
            {timeSlots.map(slot => (
              <SelectItem key={slot} value={slot}>{slot}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
      </div>
    </div>
  );
};

export default PickupTimePicker;
