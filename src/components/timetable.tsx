// src/components/timetable.tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const timeSlots = [
  "09:00 - 10:00",
  "10:00 - 11:00",
  "11:00 - 12:00",
  "12:00 - 01:00",
  "01:00 - 02:00",
  "02:00 - 03:00",
];

const scheduleData: { [key: string]: { [key: string]: string } } = {
  "09:00 - 10:00": {
    Monday: "Class 10 - Maths",
    Tuesday: "Class 9 - Science",
    Wednesday: "Class 10 - Maths",
    Thursday: "Free",
    Friday: "Class 8 - Maths",
  },
  "10:00 - 11:00": {
    Monday: "Class 9 - Science",
    Tuesday: "Class 10 - Maths",
    Wednesday: "Class 9 - Science",
    Thursday: "Class 8 - Maths",
    Friday: "Free",
  },
  "11:00 - 12:00": {
    Monday: "Free",
    Tuesday: "Class 8 - Maths",
    Wednesday: "Free",
    Thursday: "Class 10 - Maths",
    Friday: "Class 9 - Science",
  },
  "12:00 - 01:00": {
    Monday: "Lunch",
    Tuesday: "Lunch",
    Wednesday: "Lunch",
    Thursday: "Lunch",
    Friday: "Lunch",
  },
  "01:00 - 02:00": {
    Monday: "Class 7 - Science",
    Tuesday: "Free",
    Wednesday: "Class 6 - Maths",
    Thursday: "Class 7 - Science",
    Friday: "Class 6 - Maths",
  },
  "02:00 - 03:00": {
    Monday: "Class 6 - Maths",
    Tuesday: "Class 7 - Science",
    Wednesday: "Class 7 - Science",
    Thursday: "Class 6 - Maths",
    Friday: "Free",
  },
};

export function Timetable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[150px]">Day</TableHead>
          {timeSlots.map((time) => (
            <TableHead key={time}>{time}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {days.map((day) => (
          <TableRow key={day}>
            <TableCell className="font-medium">{day}</TableCell>
            {timeSlots.map((time) => (
              <TableCell key={time}>{scheduleData[time]?.[day] || 'Free'}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}