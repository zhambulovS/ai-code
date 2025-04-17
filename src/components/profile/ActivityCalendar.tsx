
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { ActivityLog } from "@/services/profileService";

interface ActivityCalendarProps {
  activityLog: ActivityLog[];
}

export function ActivityCalendar({ activityLog }: ActivityCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  
  // Transform activity data for the calendar
  const activityMap = new Map<string, number>();
  activityLog.forEach(log => {
    activityMap.set(log.date, log.problems_solved);
  });

  // Function to determine the CSS class based on activity level
  const getActivityClass = (date: Date): string => {
    const dateString = format(date, 'yyyy-MM-dd');
    const problemsSolved = activityMap.get(dateString) || 0;
    
    if (problemsSolved === 0) return "bg-gray-100";
    if (problemsSolved <= 1) return "bg-green-100";
    if (problemsSolved <= 3) return "bg-green-300";
    return "bg-green-500";
  };

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle>Activity Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <Calendar
            mode="single"
            onMonthChange={setCurrentMonth}
            className="rounded-md border"
            modifiers={{
              booked: (date) => {
                const dateStr = format(date, 'yyyy-MM-dd');
                return activityMap.has(dateStr) && activityMap.get(dateStr)! > 0;
              }
            }}
            modifiersStyles={{
              booked: { backgroundColor: 'var(--green-500)' }
            }}
            components={{
              Day: (props) => {
                const date = props.date;
                const dateStr = format(date, 'yyyy-MM-dd');
                const problemsSolved = activityMap.get(dateStr) || 0;
                
                return (
                  <div
                    {...props}
                    className={`h-9 w-9 p-0 font-normal flex items-center justify-center rounded-md ${
                      getActivityClass(date)
                    }`}
                    title={`${problemsSolved} problems solved on ${format(date, 'PP')}`}
                  >
                    {date.getDate()}
                  </div>
                );
              }
            }}
          />
          <div className="flex justify-center space-x-2 text-sm">
            <div className="flex items-center">
              <div className="mr-1 h-3 w-3 rounded bg-gray-100"></div>
              <span>No activity</span>
            </div>
            <div className="flex items-center">
              <div className="mr-1 h-3 w-3 rounded bg-green-100"></div>
              <span>1 problem</span>
            </div>
            <div className="flex items-center">
              <div className="mr-1 h-3 w-3 rounded bg-green-300"></div>
              <span>2-3 problems</span>
            </div>
            <div className="flex items-center">
              <div className="mr-1 h-3 w-3 rounded bg-green-500"></div>
              <span>4+ problems</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
