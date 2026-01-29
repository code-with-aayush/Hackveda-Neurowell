import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generateSessionReport = (session, patientName = "Unknown Patient") => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;

    // --- Header ---
    doc.setFillColor(79, 70, 229); // Indigo-600
    doc.rect(0, 0, pageWidth, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("Neurowell Medical Report", 14, 20);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);
    doc.text("Dr. Aayush (Neurowell Clinic)", pageWidth - 14, 20, { align: 'right' });

    // --- Patient Info ---
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Patient Information", 14, 55);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Patient: ${patientName}`, 14, 62);
    doc.text(`Session ID: ${session.id}`, 14, 68);
    doc.text(`Date: ${session.date} | Time: ${session.startTime}`, 14, 74);

    // --- Session Stats Table ---
    doc.setFont("helvetica", "bold");
    doc.text("Vital Statistics", 14, 90);

    const stats = session.stats || {};

    doc.autoTable({
        startY: 95,
        head: [['Metric', 'Value', 'Status']],
        body: [
            ['Duration', stats.duration || '0s', '-'],
            ['Avg Heart Rate', `${stats.hr || 0} BPM`, stats.hr > 100 ? 'High' : 'Normal'],
            ['Avg HRV', `${stats.hrv || 0} ms`, stats.hrv < 20 ? 'Stressed' : 'Normal'],
            ['Peak Stress (0-10)', stats.stress || 0, stats.stress > 7 ? 'Critical' : stats.stress > 4 ? 'Moderate' : 'Low'],
            ['Avg SpO2', `${stats.spo2 || 98} %`, stats.spo2 < 95 ? 'Low' : 'Normal'],
            ['GSR Response', stats.gsr || 0, 'Raw']
        ],
        theme: 'striped',
        headStyles: { fillColor: [79, 70, 229] }
    });





    // --- Footer ---
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("This report is generated automatically by Neurowell v2.", 14, 280);
    doc.text("Not a replacement for professional medical diagnosis.", 14, 285);

    doc.save(`Neurowell_Report_${session.date}_${session.id.slice(-4)}.pdf`);
};
