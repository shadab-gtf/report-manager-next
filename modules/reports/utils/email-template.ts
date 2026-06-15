interface EmailTemplateData {
  managerEmail?: string;
  employeeName: string;
  department: string;
  designation: string;
  managerName: string;
  reportDate: string;
  totalHours: number;
  tasks: any[];
  meetings: any[];
  pending: string;
  blockers: string;
  tomorrowPlan: string;
}

export function generateHtmlEmail(data: EmailTemplateData): string {
  const tasksHtml = data.tasks.map((task, i) => `
    <tr style="background-color: ${i % 2 === 0 ? '#e4eff6' : '#ffffff'};">
      <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; font-weight: 600; color: #1e293b;">${i + 1}</td>
      <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: left; color: #0056b3;">${task.description || ""}</td>
      <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; color: #0056b3;">${task.category || ""}</td>
      <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; color: #1e293b;">${task.priority || ""}</td>
      <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; color: #1e293b;">${task.status || ""}</td>
      <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; color: #0056b3;">${task.timeSpent !== undefined ? Number(task.timeSpent).toFixed(1) : "0.0"}</td>
      <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; color: #0056b3;">${task.completion !== undefined ? task.completion + "%" : "0%"}</td>
    </tr>
  `).join("");

  const meetingsHtml = data.meetings.map((meeting, i) => `
    <tr style="background-color: ${i % 2 === 0 ? '#e4eff6' : '#ffffff'};">
      <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; font-weight: 600; color: #1e293b;">${i + 1}</td>
      <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: left; color: #0056b3;">${meeting.subject || ""}</td>
      <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; color: #0056b3;">${meeting.withWhom || ""}</td>
      <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; color: #0056b3;">${meeting.time || ""}</td>
      <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; color: #0056b3;">${meeting.duration || "0"}</td>
      <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; color: #0056b3;">${meeting.type || ""}</td>
    </tr>
  `).join("");

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Daily Report</title>
</head>
<body style="margin: 0; padding: 20px; font-family: Arial, sans-serif; background-color: #f1f5f9; color: #0f172a;">
  <div style="max-w-4xl mx-auto background-color: #ffffff; max-width: 900px; margin: 0 auto; border: 1px solid #e2e8f0; font-size: 13px; line-height: 1.5;">
    
    <!-- Top Header -->
    <div style="background-color: #212E4A; color: #ffffff; padding: 16px; padding-bottom: 8px; border-bottom: 4px solid #D8A036; text-align: center;">
      <h1 style="font-size: 20px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase; margin: 0;">Employee Daily Work Report</h1>
      <div style="margin-top: 12px; font-size: 11px; color: #D8A036; font-weight: 500; font-style: italic;">
        Office: 9:30 AM – 7:00 PM &nbsp;|&nbsp; Lunch: 2:00 PM – 2:30 PM &nbsp;|&nbsp; Net Working Hours: 9 Hrs / Day
      </div>
    </div>

    <div style="padding: 24px;">
      
      <!-- Info Block -->
      <table width="80%" align="center" style="border-collapse: collapse; font-size: 12px; margin-bottom: 24px;">
        <tr>
          <td style="border: 1px solid #cbd5e1; background-color: #f8f9fa; padding: 8px 16px; font-weight: 600; width: 25%; text-align: center;">Employee Name</td>
          <td style="border: 1px solid #cbd5e1; background-color: #e4eff6; padding: 8px 16px; width: 25%; text-align: center; color: #0056b3;">${data.employeeName}</td>
          <td style="border: 1px solid #cbd5e1; background-color: #f8f9fa; padding: 8px 16px; font-weight: 600; width: 25%; text-align: center;">Date</td>
          <td style="border: 1px solid #cbd5e1; background-color: #e4eff6; padding: 8px 16px; width: 25%; text-align: center; color: #0056b3;">${data.reportDate}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #cbd5e1; background-color: #f8f9fa; padding: 8px 16px; font-weight: 600; text-align: center;">Department</td>
          <td style="border: 1px solid #cbd5e1; background-color: #e4eff6; padding: 8px 16px; text-align: center; color: #0056b3;">${data.department}</td>
          <td style="border: 1px solid #cbd5e1; background-color: #f8f9fa; padding: 8px 16px; font-weight: 600; text-align: center;">Designation</td>
          <td style="border: 1px solid #cbd5e1; background-color: #e4eff6; padding: 8px 16px; text-align: center; color: #0056b3;">${data.designation}</td>
        </tr>
      </table>

      <!-- Task Log -->
      <div style="margin-bottom: 24px;">
        <div style="background-color: #212E4A; color: #ffffff; padding: 8px 12px; font-size: 13px; font-weight: 600; text-transform: uppercase;">
          Task Log
        </div>
        <table width="100%" style="border-collapse: collapse; border: 1px solid #212E4A; font-size: 12px; text-align: center;">
          <thead style="background-color: #1A8377; color: #ffffff; font-weight: 600;">
            <tr>
              <th style="border: 1px solid #1A8377; border-right: 1px solid #cbd5e1; padding: 8px; width: 40px;">#</th>
              <th style="border: 1px solid #1A8377; border-right: 1px solid #cbd5e1; padding: 8px;">Task / Activity<br/>Description</th>
              <th style="border: 1px solid #1A8377; border-right: 1px solid #cbd5e1; padding: 8px;">Category</th>
              <th style="border: 1px solid #1A8377; border-right: 1px solid #cbd5e1; padding: 8px;">Priority</th>
              <th style="border: 1px solid #1A8377; border-right: 1px solid #cbd5e1; padding: 8px;">Status</th>
              <th style="border: 1px solid #1A8377; border-right: 1px solid #cbd5e1; padding: 8px;">Time<br/>Spent (hrs)</th>
              <th style="border: 1px solid #1A8377; padding: 8px;">% Done</th>
            </tr>
          </thead>
          <tbody>
            ${tasksHtml}
          </tbody>
          <tfoot>
            <tr style="background-color: #212E4A; color: #ffffff; font-weight: bold; font-size: 13px;">
              <td colspan="5" style="border: 1px solid #212E4A; padding: 10px 16px; text-align: center; letter-spacing: 1px;">TOTALS</td>
              <td style="border: 1px solid #212E4A; padding: 10px 8px;">${data.totalHours.toFixed(1)}</td>
              <td style="border: 1px solid #212E4A; padding: 10px 8px;">—</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <!-- Meetings & Calls Log -->
      <div style="margin-bottom: 24px;">
        <div style="background-color: #7A298F; color: #ffffff; padding: 8px 12px; font-size: 13px; font-weight: 600; text-transform: uppercase;">
          Meetings & Calls Log
        </div>
        <table width="100%" style="border-collapse: collapse; border: 1px solid #7A298F; font-size: 12px; text-align: center;">
          <thead style="background-color: #7A298F; color: #ffffff; font-weight: 600;">
            <tr>
              <th style="border: 1px solid #7A298F; border-right: 1px solid #cbd5e1; padding: 8px; width: 40px;">#</th>
              <th style="border: 1px solid #7A298F; border-right: 1px solid #cbd5e1; padding: 8px;">Subject / Meeting<br/>Name</th>
              <th style="border: 1px solid #7A298F; border-right: 1px solid #cbd5e1; padding: 8px;">With Whom</th>
              <th style="border: 1px solid #7A298F; border-right: 1px solid #cbd5e1; padding: 8px;">Time</th>
              <th style="border: 1px solid #7A298F; border-right: 1px solid #cbd5e1; padding: 8px;">Duration<br/>(min)</th>
              <th style="border: 1px solid #7A298F; padding: 8px;">Type</th>
            </tr>
          </thead>
          <tbody>
            ${meetingsHtml}
          </tbody>
        </table>
      </div>

      <!-- End of Day Notes -->
      <div style="margin-bottom: 40px;">
        <div style="background-color: #E27A23; color: #ffffff; padding: 8px 12px; font-size: 13px; font-weight: 600; text-transform: uppercase; margin-bottom: 16px;">
          End of Day Notes
        </div>
        
        <div style="margin-bottom: 16px;">
          <div style="background-color: #E27A23; color: #ffffff; padding: 6px 12px; font-size: 12px; font-weight: 600; border: 1px solid #E27A23;">
            Pending / Carry Forward:
          </div>
          <div style="border: 1px solid #212E4A; border-top: 0; background-color: #e4eff6; padding: 12px; min-height: 60px; color: #0056b3;">
            ${data.pending || "N/A"}
          </div>
        </div>

        <div style="margin-bottom: 16px;">
          <div style="background-color: #E27A23; color: #ffffff; padding: 6px 12px; font-size: 12px; font-weight: 600; border: 1px solid #E27A23;">
            Blockers / Challenges Faced:
          </div>
          <div style="border: 1px solid #212E4A; border-top: 0; background-color: #e4eff6; padding: 12px; min-height: 60px; color: #0056b3;">
            ${data.blockers || "N/A"}
          </div>
        </div>

        <div style="margin-bottom: 16px;">
          <div style="background-color: #E27A23; color: #ffffff; padding: 6px 12px; font-size: 12px; font-weight: 600; border: 1px solid #E27A23;">
            Plan for Tomorrow:
          </div>
          <div style="border: 1px solid #212E4A; border-top: 0; background-color: #e4eff6; padding: 12px; min-height: 60px; color: #0056b3;">
            ${data.tomorrowPlan || "N/A"}
          </div>
        </div>
      </div>

    </div>
    
    <!-- Footer Signatures -->
    <div style="margin-top: 32px; background-color: #e4eff6; padding: 16px; font-size: 13px; color: #334155; border-top: 1px solid #212E4A; border-bottom: 1px solid #212E4A;">
      <table width="100%" style="text-align: center;">
        <tr>
          <td width="33%">
            <div style="font-weight: 600; color: #1e293b; margin-bottom: 8px;">Employee Signature:</div>
            <div style="border-bottom: 1px solid #ef4444; width: 150px; margin: 0 auto; padding-bottom: 4px;">
              <span style="font-size: 24px; color: #212E4A; font-family: 'Give You Glory', cursive;">${data.employeeName}</span>
            </div>
          </td>
          <td width="33%">
            <div style="font-weight: 600; color: #1e293b; margin-bottom: 8px;">Date:</div>
            <div style="border-bottom: 1px solid #ef4444; width: 120px; margin: 0 auto; padding-bottom: 4px;">
              <span style="font-size: 14px; font-weight: bold; color: #212E4A;">${data.reportDate}</span>
            </div>
          </td>
          <td width="33%">
            <div style="font-weight: 600; color: #1e293b; margin-bottom: 8px;">Manager Sign:</div>
            <div style="border-bottom: 1px solid #ef4444; width: 150px; margin: 0 auto; padding-bottom: 4px;">
              <span style="font-size: 24px; color: #212E4A; font-family: 'Give You Glory', cursive;">${data.managerName}</span>
            </div>
          </td>
        </tr>
      </table>
    </div>

  </div>
  <!-- Google Font import for Give You Glory -->
  <link href="https://fonts.googleapis.com/css2?family=Give+You+Glory&display=swap" rel="stylesheet">
</body>
</html>
  `;
}
