// src/components/timetable.tsx
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  
  const timetableData = [
    { time: "09:00 - 10:00", mon: "Class 10 - Maths", tue: "Class 9 - Science", wed: "Class 10 - Maths", thu: "Free", fri: "Class 8 - Maths" },
    { time: "10:00 - 11:00", mon: "Class 9 - Science", tue: "Class 10 - Maths", wed: "Class 9 - Science", thu: "Class 8 - Maths", fri: "Free" },
    { time: "11:00 - 12:00", mon: "Free", tue: "Class 8 - Maths", wed: "Free", thu: "Class 10 - Maths", fri: "Class 9 - Science" },
    { time: "12:00 - 01:00", mon: "Lunch", tue: "Lunch", wed: "Lunch", thu: "Lunch", fri: "Lunch" },
    { time: "01:00 - 02:00", mon: "Class 7 - Science", tue: "Free", wed: "Class 6 - Maths", thu: "Class 7 - Science", fri: "Class 6 - Maths" },
    { time: "02:00 - 03:00", mon: "Class 6 - Maths", tue: "Class 7 - Science", fri: "Free", wed: "Class 7 - Science", thu: "Class 6 - Maths" },
  ];
  
  export function Timetable() {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">Time</TableHead>
            <TableHead>Monday</TableHead>
            <TableHead>Tuesday</TableHead>
            <TableHead>Wednesday</TableHead>
            <TableHead>Thursday</TableHead>
            <TableHead>Friday</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {timetableData.map((row) => (
            <TableRow key={row.time}>
              <TableCell className="font-medium">{row.time}</TableCell>
              <TableCell>{row.mon}</TableCell>
              <TableCell>{row.tue}</TableCell>
              <TableCell>{row.wed}</TableCell>
              <TableCell>{row.thu}</TableCell>
              <TableCell>{row.fri}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }
  