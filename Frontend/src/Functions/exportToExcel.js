const exportToExcel = async (
    data = [],
    headers = [],
    filename = 'export',
    setIsDownloading,
    includeTable = false,
    totals = [],
    ref = 'A1',
    others = []
) => {
    setIsDownloading(true);
    const { Workbook } = await import('exceljs');
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

    others.forEach(other => {
        if (Array.isArray(other)) {
            worksheet.addRow(other);
        } else if (typeof other === 'object') {
            Object.entries(other).forEach(([key, value]) => {
                worksheet.addRow([key, value]);
            });
        } else {
            worksheet.addRow([other]);
        }
    });

    if (includeTable) {
        worksheet.addTable({
            name: 'MyTable',
            ref: ref,
            // totalsRow: true,
            headerRow: true,
            showLastRow: true,
            style: {
                theme: 'TableStyleMedium15',
                showRowStripes: true,
            },
            columns: headers?.map(header => ({ name: header, filterButton: true })),
            rows: data?.map(row => headers?.map(header => row[header]))
        });

        // Make the last row bold
        // const lastRowNumber = worksheet.lastRow.number;
        // worksheet.getRow(lastRowNumber).font = { bold: true };
    }
    else {
        worksheet.addRow(headers);

        data.forEach(row => {
            worksheet.addRow([row?.id, row?.title, row?.completed]);
        });
    }

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const randomFourDigitNumber = Math.floor(1000 + Math.random() * 9000);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}_${randomFourDigitNumber}.${includeTable ? 'xlsx' : 'csv'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setIsDownloading(false);
    URL.revokeObjectURL(url);
};

export default exportToExcel;