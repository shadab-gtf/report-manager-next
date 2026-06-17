interface EmailTemplateData {
  managerEmail?: string;
  employeeName: string;
  reportDate: string;
  day?: string;
  department: string;
  designation: string;
  managerName: string; // Used for "Reporting To" and Signature
  totalHours: number;
  tasks: {
    description?: string;
    category?: string;
    priority?: string;
    status?: string;
    timeSpent?: number | string;
    completion?: number | string;
    plannedBy?: string;
    notes?: string;
  }[];
  meetings: {
    subject?: string;
    withWhom?: string;
    time?: string;
    duration?: number | string;
    type?: string;
    outcome?: string;
  }[];
  pending: string;
  blockers: string;
  tomorrowPlan: string;
  keyAccomplishments?: string;
  overallScore?: string | number;
}

export function escapeHtml(str: string | undefined | null): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function escapeHtmlMultiline(str: string | undefined | null): string {
  if (!str) return "";
  return escapeHtml(str).replace(/\r?\n/g, "<br/>");
}

export function generateHtmlEmail(data: EmailTemplateData): string {
  const validMeetings = data.meetings?.filter(m => 
    (m.subject && m.subject.trim()) || 
    (m.withWhom && m.withWhom.trim()) || 
    (m.outcome && m.outcome.trim())
  ) || [];

  const hasKeyAcc = data.keyAccomplishments && data.keyAccomplishments.trim().length > 0;
  const hasPending = data.pending && data.pending.trim().length > 0;
  const hasBlockers = data.blockers && data.blockers.trim().length > 0;
  const hasTomorrow = data.tomorrowPlan && data.tomorrowPlan.trim().length > 0;
  const hasAnyNotes = hasKeyAcc || hasPending || hasBlockers || hasTomorrow;
  const tasksHtml = data.tasks.map((task, i) => `
    <tr style="background-color: ${i % 2 === 0 ? '#ffffff' : '#e8f4f8'};">
      <td style="border: 1px solid #23304c; padding: 4px; text-align: center; font-weight: bold; color: #333333; width: 20px;">${i + 1}</td>
      <td style="border: 1px solid #23304c; padding: 4px 6px; text-align: left; color: #1a73e8;">${task.description ? escapeHtml(task.description) : "&nbsp;"}</td>
      <td style="border: 1px solid #23304c; padding: 4px; text-align: center; color: #1a73e8; width: 60px;">${task.category ? escapeHtml(task.category) : "&nbsp;"}</td>
      <td style="border: 1px solid #23304c; padding: 4px; text-align: center; color: #333333; width: 60px;">${task.priority ? escapeHtml(task.priority) : "&nbsp;"}</td>
      <td style="border: 1px solid #23304c; padding: 4px; text-align: center; color: #333333; width: 60px;">${task.status ? escapeHtml(task.status) : "&nbsp;"}</td>
      <td style="border: 1px solid #23304c; padding: 4px; text-align: center; color: #1a73e8; width: 40px;">${task.timeSpent !== undefined && task.timeSpent !== "" ? Number(task.timeSpent).toFixed(1) : "0.0"}</td>
      <td style="border: 1px solid #23304c; padding: 4px; text-align: center; color: #1a73e8; width: 60px;">${task.plannedBy ? escapeHtml(task.plannedBy) : "&nbsp;"}</td>
      <td style="border: 1px solid #23304c; padding: 4px 6px; text-align: left; color: #1a73e8;">${task.notes ? escapeHtml(task.notes) : "&nbsp;"}</td>
    </tr>
  `).join("");

  const meetingsHtml = validMeetings.map((meeting, i) => `
    <tr style="background-color: ${i % 2 === 0 ? '#ffffff' : '#e8f4f8'};">
      <td style="border: 1px solid #23304c; padding: 4px; text-align: center; font-weight: bold; color: #333333; width: 20px;">${i + 1}</td>
      <td style="border: 1px solid #23304c; padding: 4px 6px; text-align: left; color: #1a73e8;">${meeting.subject ? escapeHtml(meeting.subject) : "&nbsp;"}</td>
      <td style="border: 1px solid #23304c; padding: 4px; text-align: center; color: #1a73e8;">${meeting.withWhom ? escapeHtml(meeting.withWhom) : "&nbsp;"}</td>
      <td style="border: 1px solid #23304c; padding: 4px; text-align: center; color: #1a73e8; width: 60px;">${meeting.time ? escapeHtml(meeting.time) : "&nbsp;"}</td>
      <td style="border: 1px solid #23304c; padding: 4px; text-align: center; color: #1a73e8; width: 50px;">${meeting.duration !== undefined && meeting.duration !== "" ? meeting.duration : "0"}</td>
      <td style="border: 1px solid #23304c; padding: 4px; text-align: center; color: #1a73e8; width: 60px;">${meeting.type ? escapeHtml(meeting.type) : "&nbsp;"}</td>
      <td style="border: 1px solid #23304c; padding: 4px 6px; text-align: left; color: #1a73e8;">${meeting.outcome ? escapeHtml(meeting.outcome) : "&nbsp;"}</td>
    </tr>
  `).join("");

  const tasksCompleted = data.tasks.filter(t => t.status === "Done" || t.status === "Completed").length;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Daily Report</title>
</head>
<body style="margin: 0; padding: 20px; font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333333;">
  <div style="background-color: #ffffff; max-width: 700px; margin: 0 auto; font-size: 11px; line-height: 1.4; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    
    <!-- Top Header -->
    <div style="background-color: #23304c; color: #ffffff; padding: 16px; text-align: center; border-bottom: 4px solid #d8a036;">
      <h1 style="font-size: 18px; font-weight: bold; margin: 0; letter-spacing: 0.5px;">📋 EMPLOYEE DAILY WORK REPORT</h1>
      <div style="margin-top: 8px; font-size: 10px; color: #d8a036; font-style: italic;">
        Office: 9:30 AM – 7:00 PM &nbsp;|&nbsp; Lunch: 2:00 PM – 2:30 PM &nbsp;|&nbsp; Net Working Hours: 9 Hrs / Day
      </div>
    </div>

    <!-- Employee Info -->
    <table width="100%" style="border-collapse: collapse; font-size: 11px; margin: 12px 0;">
      <tr>
        <td style="padding: 6px 8px; font-weight: bold; width: 14%; color: #333;">Employee Name</td>
        <td style="width: 20%; padding: 2px 4px;"><div style="border: 1px solid #23304c; background-color: #e8f4f8; padding: 4px 6px; color: #333; font-weight: bold; min-height: 14px;">${escapeHtml(data.employeeName)}</div></td>
        <td style="padding: 6px 8px; font-weight: bold; width: 8%; color: #333;">Date</td>
        <td style="width: 20%; padding: 2px 4px;"><div style="border: 1px solid #23304c; background-color: #e8f4f8; padding: 4px 6px; color: #333; font-weight: bold; min-height: 14px;">${escapeHtml(data.reportDate)}</div></td>
        <td style="padding: 6px 8px; font-weight: bold; width: 8%; color: #333;">Day</td>
        <td style="width: 20%; padding: 2px 4px;"><div style="border: 1px solid #23304c; background-color: #e8f4f8; padding: 4px 6px; color: #333; font-weight: bold; min-height: 14px;">${escapeHtml(data.day || new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date()))}</div></td>
      </tr>
      <tr>
        <td style="padding: 6px 8px; font-weight: bold; color: #333;">Department</td>
        <td style="padding: 2px 4px;"><div style="border: 1px solid #23304c; background-color: #e8f4f8; padding: 4px 6px; color: #333; font-weight: bold; min-height: 14px;">${escapeHtml(data.department)}</div></td>
        <td style="padding: 6px 8px; font-weight: bold; color: #333;">Designation</td>
        <td style="padding: 2px 4px;"><div style="border: 1px solid #23304c; background-color: #e8f4f8; padding: 4px 6px; color: #333; font-weight: bold; min-height: 14px;">${escapeHtml(data.designation)}</div></td>
        <td style="padding: 6px 8px; font-weight: bold; color: #333;">Reporting To</td>
        <td style="padding: 2px 4px;"><div style="border: 1px solid #23304c; background-color: #e8f4f8; padding: 4px 6px; color: #333; font-weight: bold; min-height: 14px;">${escapeHtml(data.managerName)}</div></td>
      </tr>
    </table>

    <div style="padding: 0;">
      <!-- Task Log -->
      <div style="background-color: #23304c; color: #ffffff; padding: 8px 12px; font-size: 13px; font-weight: bold;">
        📋 TASK LOG
      </div>
      <table width="100%" style="border-collapse: collapse; border: 1px solid #23304c; font-size: 10px; text-align: center;">
        <thead style="background-color: #157262; color: #ffffff; font-weight: bold;">
          <tr>
            <th style="border: 1px solid #157262; border-right: 1px solid #23304c; padding: 6px 4px;">#</th>
            <th style="border: 1px solid #157262; border-right: 1px solid #23304c; padding: 6px 4px;">Task / Activity Description</th>
            <th style="border: 1px solid #157262; border-right: 1px solid #23304c; padding: 6px 4px;">Category</th>
            <th style="border: 1px solid #157262; border-right: 1px solid #23304c; padding: 6px 4px;">Priority</th>
            <th style="border: 1px solid #157262; border-right: 1px solid #23304c; padding: 6px 4px;">Status</th>
            <th style="border: 1px solid #157262; border-right: 1px solid #23304c; padding: 6px 4px;">Time<br/>Spent</th>
            <th style="border: 1px solid #157262; border-right: 1px solid #23304c; padding: 6px 4px;">Planned<br/>by</th>
            <th style="border: 1px solid #157262; padding: 6px 4px;">Notes / Blockers</th>
          </tr>
        </thead>
        <tbody>
          ${tasksHtml}
        </tbody>
        <tfoot>
          <tr style="background-color: #23304c; color: #ffffff; font-weight: bold; font-size: 11px;">
            <td colspan="5" style="border: 1px solid #23304c; padding: 6px; text-align: center; letter-spacing: 0.5px;">TOTALS</td>
            <td style="border: 1px solid #23304c; padding: 6px;">${data.totalHours.toFixed(1)}</td>
            <td colspan="2" style="border: 1px solid #23304c; padding: 6px; text-align: center;">${tasksCompleted} tasks done today</td>
          </tr>
        </tfoot>
      </table>

      ${validMeetings.length > 0 ? `
      <!-- Meetings & Calls Log -->
      <div style="background-color: #6b2288; color: #ffffff; padding: 8px 12px; font-size: 13px; font-weight: bold; margin-top: 2px;">
        📞 MEETINGS & CALLS LOG
      </div>
      <table width="100%" style="border-collapse: collapse; border: 1px solid #23304c; font-size: 10px; text-align: center;">
        <thead style="background-color: #6b2288; color: #ffffff; font-weight: bold;">
          <tr>
            <th style="border: 1px solid #6b2288; border-right: 1px solid #23304c; padding: 6px 4px;">#</th>
            <th style="border: 1px solid #6b2288; border-right: 1px solid #23304c; padding: 6px 4px;">Subject / Meeting Name</th>
            <th style="border: 1px solid #6b2288; border-right: 1px solid #23304c; padding: 6px 4px;">With Whom</th>
            <th style="border: 1px solid #6b2288; border-right: 1px solid #23304c; padding: 6px 4px;">Time</th>
            <th style="border: 1px solid #6b2288; border-right: 1px solid #23304c; padding: 6px 4px;">Duration<br/>(min)</th>
            <th style="border: 1px solid #6b2288; border-right: 1px solid #23304c; padding: 6px 4px;">Type</th>
            <th style="border: 1px solid #6b2288; padding: 6px 4px;">Outcome / Next Steps</th>
          </tr>
        </thead>
        <tbody>
          ${meetingsHtml}
        </tbody>
      </table>
      ` : ""}

      ${hasAnyNotes ? `
      <!-- End of Day Notes -->
      <div style="background-color: #df7622; color: #ffffff; padding: 8px 12px; font-size: 13px; font-weight: bold; margin-top: 2px;">
        📝 END OF DAY NOTES
      </div>
      
      <table width="100%" style="border-collapse: collapse; font-size: 11px;">
        ${hasKeyAcc ? `
        <tr>
          <td style="background-color: #df7622; color: #ffffff; padding: 4px 10px; font-weight: bold; border: 1px solid #df7622;">
            Key Accomplishments Today:
          </td>
        </tr>
        <tr>
          <td style="border: 1px solid #23304c; border-top: 0; background-color: #e8f4f8; padding: 8px 10px; min-height: 24px; color: #333;">
            ${escapeHtmlMultiline(data.keyAccomplishments)}
          </td>
        </tr>
        <tr><td style="height: 4px;"></td></tr>
        ` : ""}
        
        ${hasPending ? `
        <tr>
          <td style="background-color: #df7622; color: #ffffff; padding: 4px 10px; font-weight: bold; border: 1px solid #df7622;">
            Pending / Carry Forward:
          </td>
        </tr>
        <tr>
          <td style="border: 1px solid #23304c; border-top: 0; background-color: #e8f4f8; padding: 8px 10px; min-height: 24px; color: #333;">
            ${escapeHtmlMultiline(data.pending)}
          </td>
        </tr>
        <tr><td style="height: 4px;"></td></tr>
        ` : ""}
        
        ${hasBlockers ? `
        <tr>
          <td style="background-color: #df7622; color: #ffffff; padding: 4px 10px; font-weight: bold; border: 1px solid #df7622;">
            Blockers / Challenges Faced:
          </td>
        </tr>
        <tr>
          <td style="border: 1px solid #23304c; border-top: 0; background-color: #e8f4f8; padding: 8px 10px; min-height: 24px; color: #333;">
            ${escapeHtmlMultiline(data.blockers)}
          </td>
        </tr>
        <tr><td style="height: 4px;"></td></tr>
        ` : ""}
        
        ${hasTomorrow ? `
        <tr>
          <td style="background-color: #df7622; color: #ffffff; padding: 4px 10px; font-weight: bold; border: 1px solid #df7622;">
            Plan for Tomorrow:
          </td>
        </tr>
        <tr>
          <td style="border: 1px solid #23304c; border-top: 0; background-color: #e8f4f8; padding: 8px 10px; min-height: 24px; color: #333;">
            ${escapeHtmlMultiline(data.tomorrowPlan)}
          </td>
        </tr>
        ` : ""}
      </table>
      ` : ""}

      <!-- Productivity Scores -->
      <div style="background-color: #157262; color: #ffffff; padding: 8px 12px; font-size: 13px; font-weight: bold; margin-top: 2px;">
        📊 TODAY'S PRODUCTIVITY SCORE
      </div>
      <table width="100%" style="border-collapse: collapse; border: 1px solid #23304c; font-size: 11px;">
        <tr>
          <td style="padding: 8px 12px; font-weight: bold; border: 1px solid #23304c; width: 40%; color: #333;">Tasks Completed</td>
          <td style="padding: 8px 12px; border: 1px solid #23304c; background-color: #e8f4f8; color: #157262; font-weight: bold; text-align: center;">${tasksCompleted} / ${data.tasks.length || 0}</td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; font-weight: bold; border: 1px solid #23304c; color: #333;">Total Hrs Logged</td>
          <td style="padding: 8px 12px; border: 1px solid #23304c; background-color: #e8f4f8; color: #157262; font-weight: bold; text-align: center;">${data.totalHours.toFixed(1)} hrs</td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; font-weight: bold; border: 1px solid #23304c; color: #333;">Meetings Today</td>
          <td style="padding: 8px 12px; border: 1px solid #23304c; background-color: #e8f4f8; color: #157262; font-weight: bold; text-align: center;">${validMeetings.length} meetings</td>
        </tr>
        <!-- <tr>
          <td style="background-color: #23304c; color: #ffffff; padding: 10px 12px; font-size: 10px; font-weight: bold; border: 1px solid #23304c;">⭐ OVERALL PRODUCTIVITY SCORE</td>
          <td style="padding: 10px 12px; border: 1px solid #23304c; background-color: #fff9c4; color: #333; font-weight: bold; text-align: center; font-size: 13px;">${data.overallScore || '—'}</td>
        </tr> -->
      </table>

      <!-- Footer Signatures -->
     <table width="100%" style="text-align: center; font-style: italic; font-size: 10px; color: #333; margin-top: 16px; padding: 16px 0;">
        <tr>
          <td width="13%" style="text-align: right; padding-right: 8px;">Employee Signature:</td>
          <td width="13%" style="border-bottom: 1px solid #666; font-size:8px">${escapeHtml(data.employeeName)}</td>
          <td width="13%" style="text-align: right; padding-right: 8px;">Date:</td>
          <td width="13%" style="border-bottom: 1px solid #666; font-size:8px">${escapeHtml(data.reportDate)}</td>
          <td width="13%" style="text-align: right; padding-right: 8px;">Manager Sign:</td>
          <td width="13%" style="border-bottom: 1px solid #666; font-size:8px">${escapeHtml(data.managerName)}</td>
        </tr>
      </table>
      <div style="height: 12px;"></div>

    </div>
  </div>
</body>
</html>
  `;
}
