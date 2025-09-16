'use client';

import { useState, ChangeEvent, useRef } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Papa from 'papaparse';
import { Upload, Download, Edit, Save, XCircle } from 'lucide-react';

const initialDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const initialTimeSlots = [
  '09:00 - 10:00',
  '10:00 - 11:00',
  '11:00 - 12:00',
  '12:00 - 01:00',
  '01:00 - 02:00',
  '02:00 - 03:00',
];

const initialScheduleData: { [key: string]: { [key: string]: string } } = {
  Monday: {
    '09:00 - 10:00': 'Class 10 - Maths',
    '10:00 - 11:00': 'Class 9 - Science',
    '11:00 - 12:00': 'Free',
    '12:00 - 01:00': 'Lunch',
    '01:00 - 02:00': 'Class 7 - Science',
    '02:00 - 03:00': 'Class 6 - Maths',
  },
  Tuesday: {
    '09:00 - 10:00': 'Class 9 - Science',
    '10:00 - 11:00': 'Class 10 - Maths',
    '11:00 - 12:00': 'Class 8 - Maths',
    '12:00 - 01:00': 'Lunch',
    '01:00 - 02:00': 'Free',
    '02:00 - 03:00': 'Class 7 - Science',
  },
  Wednesday: {
    '09:00 - 10:00': 'Class 10 - Maths',
    '10:00 - 11:00': 'Class 9 - Science',
    '11:00 - 12:00': 'Free',
    '12:00 - 01:00': 'Lunch',
    '01:00 - 02:00': 'Class 6 - Maths',
    '02:00 - 03:00': 'Class 7 - Science',
  },
  Thursday: {
    '09:00 - 10:00': 'Free',
    '10:00 - 11:00': 'Class 8 - Maths',
    '11:00 - 12:00': 'Class 10 - Maths',
    '12:00 - 01:00': 'Lunch',
    '01:00 - 02:00': 'Class 7 - Science',
    '02:00 - 03:00': 'Class 6 - Maths',
  },
  Friday: {
    '09:00 - 10:00': 'Class 8 - Maths',
    '10:00 - 11:00': 'Free',
    '11:00 - 12:00': 'Class 9 - Science',
    '12:00 - 01:00': 'Lunch',
    '01:00 - 02:00': 'Class 6 - Maths',
    '02:00 - 03:00': 'Free',
  },
};

export function Timetable() {
  const [scheduleData, setScheduleData] = useState(initialScheduleData);
  const [draftData, setDraftData] = useState(initialScheduleData);
  const [days, setDays] = useState(initialDays);
  const [timeSlots, setTimeSlots] = useState(initialTimeSlots);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleScheduleChange = (day: string, time: string, value: string) => {
    setDraftData((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [time]: value,
      },
    }));
  };

  const handleEdit = () => {
    setDraftData(scheduleData);
    setIsEditing(true);
  };

  const handleSave = () => {
    setScheduleData(draftData);
    setIsEditing(false);
    toast({ title: 'Success', description: 'Timetable saved successfully.' });
  };

  const handleCancel = () => {
    setDraftData(scheduleData);
    setIsEditing(false);
  };


  const downloadCSV = () => {
    const csvData = [
      ['Day', ...timeSlots],
      ...days.map((day) => [day, ...timeSlots.map((time) => scheduleData[day]?.[time] || '')]),
    ];

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'timetable.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    toast({ title: 'Success', description: 'Timetable downloaded as CSV.' });
  };

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        complete: (result) => {
          const parsedData = result.data as string[][];
          if (parsedData.length < 2) {
            toast({ variant: 'destructive', title: 'Error', description: 'Invalid CSV format.' });
            return;
          }

          const newTimeSlots = parsedData[0].slice(1);
          const newDays = parsedData.slice(1).map(row => row[0]);
          const newScheduleData: { [key: string]: { [key: string]: string } } = {};

          parsedData.slice(1).forEach((row) => {
            const day = row[0];
            newScheduleData[day] = {};
            newTimeSlots.forEach((time, index) => {
              newScheduleData[day][time] = row[index + 1] || '';
            });
          });

          setTimeSlots(newTimeSlots);
          setDays(newDays);
          setScheduleData(newScheduleData);
          setDraftData(newScheduleData);
          toast({ title: 'Success', description: 'Timetable uploaded successfully.' });
        },
        error: (error) => {
          toast({ variant: 'destructive', title: 'Error', description: `CSV parsing error: ${error.message}` });
        },
      });
      // Reset file input
      if(fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <div className="flex justify-end gap-2 mb-4">
        {isEditing ? (
          <>
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Save
            </Button>
            <Button variant="outline" onClick={handleCancel}>
              <XCircle className="mr-2 h-4 w-4" />
              Cancel
            </Button>
          </>
        ) : (
          <Button onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Timetable
          </Button>
        )}
        <Button variant="outline" onClick={downloadCSV}>
          <Download className="mr-2 h-4 w-4" />
          Download CSV
        </Button>
        <Button onClick={triggerFileUpload}>
          <Upload className="mr-2 h-4 w-4" />
          Upload CSV
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileUpload}
          accept=".csv"
        />
      </div>
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
                <TableCell key={time}>
                  {isEditing ? (
                    <Input
                      value={draftData[day]?.[time] || ''}
                      onChange={(e) => handleScheduleChange(day, time, e.target.value)}
                      className="min-w-[120px]"
                    />
                  ) : (
                    <span>{scheduleData[day]?.[time] || ''}</span>
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
