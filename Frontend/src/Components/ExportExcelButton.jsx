import { useState } from 'react';
import Swal from 'sweetalert2';
import Button from '@mui/material/Button';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';

const ExportExcelButton = ({
    data = [],
    headers = [],
    filename = 'export',
    includeTable = false
}) => {
    const [isDownloading, setIsDownloading] = useState(false);

    const exportToExcel = async () => {
        setIsDownloading(true);
        try {
            Swal.fire({
                title: "Preparing Download...",
                html: "Fetching the file, please wait...",
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
            const { Workbook } = await import('exceljs');
            const workbook = new Workbook();
            const worksheet = workbook.addWorksheet('Sheet1');

            if (includeTable) {
                worksheet.addTable({
                    name: 'MyTable',
                    ref: `A1`,
                    headerRow: true,
                    style: {
                        theme: 'TableStyleMedium2',
                        showRowStripes: true,
                    },
                    columns: headers?.map(header => ({ name: header, filterButton: true })),
                    rows: data?.map(row => headers?.map(header => row[header])),
                });
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
            URL.revokeObjectURL(url);

            Swal.fire({
                icon: "success",
                title: "Download Ready!",
                text: "Your Excel file has been downloaded successfully.",
                timer: 2000,
                showConfirmButton: false
            });

        } catch (error) {
            console.error("Download failed:", error);

            let errorMessage = "An unknown error occurred.";
            if (error instanceof Error) {
                errorMessage = error.message;
            } else if (typeof error === "string") {
                errorMessage = error;
            }

            Swal.fire({
                icon: "error",
                title: "Download Failed",
                text: errorMessage
            });
        }
        finally {
            setIsDownloading(false);
        }
    };

    return (
        <Button
            size='small'
            variant='outlined'
            disabled={isDownloading}
            onClick={exportToExcel}
            startIcon={<DownloadOutlinedIcon />}
            sx={{ whiteSpace: 'nowrap', width: '100%', height: 25 }}
        >
            {isDownloading ? "Exporting..." : "Export to Excel"}
        </Button>
    );
};

export default ExportExcelButton;
