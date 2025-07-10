import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import { Button, Paper, Tooltip } from "@mui/material";
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import CustomTable from "../../Components/CustomTable/CustomTable";
import Body from "../../Components/CustomTable/Body/Body";
import AssessmentIcon from '@mui/icons-material/Assessment';
import moment from 'moment';
import DateInputField from "../../Components/DateInputField/DateInputField";
import DownloadIcon from '@mui/icons-material/Download';
import exportToExcel from "../../Functions/exportToExcel";

const style2 = {
    position: 'absolute',
    top: '50%',
    left: '58%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    bgcolor: 'background.paper',
    p: 2,
    marginLeft: -13,
    border: 0,
    borderRadius: 2,
    outline: 'none'
};

const Report = () => {
    // loading state
    const [isLoading, setIsLoading] = useState(false);
    // error state
    const [error, setError] = useState("");
    // store state
    const [from, setFrom] = useState(() => {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), 1);
    });
    const [to, setTo] = useState(() => {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth() + 1, 0);
    });
    const [tableData, setTableData] = useState([]);
    const [footerData, setFooterData] = useState([]);
    // Modal state
    const [open5, setOpen5] = useState(false);
    const handleOpen5 = () => {
        setOpen5(true)
    };
    const handleClose5 = () => {
        setOpen5(false)
    }

    const fetchUploadedData = async () => {
        try {
            // console.log('fetch start');
            setIsLoading(true);
            // setQueryOfUploadedPulledData(query);
            const query = {
                ccdFrom: moment(from).startOf('day').toISOString(),
                ccdTo: moment(to).endOf('day').toISOString(),
                page: 0,
                perPage: 100000
            };
            let urlQueries = new URLSearchParams(query).toString();
            // const result = await getUploadedFileDataOfProcess(urlQueries);
            const result = await window.engine.Proxy("/process/PO/combine?" + urlQueries, 'get');
            // console.log(urlQueries, result);
            if (result?.status < 400) {
                return result.data;
            } else {
                setError(result?.statusText);
                console.log("error", result?.statusText);
            }
        } catch (error) {
            setError(error?.response?.data?.message);
            console.log('error', error?.response?.data?.message);
        } finally {
            setIsLoading(false);
        }
    }

    const getPSCFromItemName = (sentence) => {
        if (!sentence) return 0;
        const packMatch = sentence.match(/(\d+)\s*-\s*PACK/i); // Match "5- PACK" or similar
        if (packMatch) {
            return parseInt(packMatch[1], 10);
        }
        if (sentence.toLowerCase().includes('set')) {
            return 2;
        }
        return 1;
    }

    const convertData = (dataToConvert) => {
        // console.log("dataToConvert", dataToConvert);
        let TotalData = {};
        const totals = {
            "COUNT PO": 0,
            "TOTAL QTY IN PACK": 0,
            "TOTAL QTY IN PCS": 0,
            "TOTAL VALUE(USD)": 0,
            "VALUE(EUR)": 0,
            "TOTAL VALUE(GBP)": 0
        };
        dataToConvert?.forEach((dt) => {
            let row = dt;
            const PscPack = Number(getPSCFromItemName(row?.SN)) || 0;
            const finalQuantity = row['PN']?.[0]?.TP ? (Number(row['PN']?.[0]?.TP) || 0) : Number(row?.['QTY']);
            row['Total Amount'] = Number(finalQuantity * PscPack * (Number(row?.PPI) || 0)).toFixed(2);
            const data = {};
            const key = `${row.BN}_${row.TB}`;
            if (!TotalData) TotalData = {};
            if (!TotalData[key]) {
                totals['COUNT PO'] += 1;
                totals["TOTAL QTY IN PACK"] += Number(finalQuantity) || 0;
                totals["TOTAL QTY IN PCS"] += Number(finalQuantity * PscPack) || 0;
                totals["TOTAL VALUE(USD)"] += Number(finalQuantity * PscPack * (Number(row?.PPI) || 0)) || 0;
                totals["VALUE(EUR)"] += Number(finalQuantity * PscPack * (Number(row?.PPI) || 0)) / 1.5 || 0;
                totals["TOTAL VALUE(GBP)"] += Number(finalQuantity * PscPack * (Number(row?.PPI) || 0)) * 1.5 || 0;
                TotalData[key] = {
                    count: 1,
                    Brand: row.BN,
                    "MOOD OF SHIPMENT": row.TB,
                    "TOTAL QTY IN PACK": finalQuantity || 0,
                    "TOTAL QTY IN PCS": finalQuantity * PscPack || 0,
                    "TOTAL VALUE(USD)": Number(finalQuantity * PscPack * (Number(row?.PPI) || 0)) || 0,
                    "VALUE(EUR)": Number(finalQuantity * PscPack * (Number(row?.PPI) || 0)) / 1.5 || 0,
                    "TOTAL VALUE(GBP)": Number(finalQuantity * PscPack * (Number(row?.PPI) || 0)) * 1.5 || 0
                };
            } else {
                totals['COUNT PO'] += 1;
                totals["TOTAL QTY IN PACK"] += Number(finalQuantity) || 0;
                totals["TOTAL QTY IN PCS"] += Number(finalQuantity * PscPack) || 0;
                totals["TOTAL VALUE(USD)"] += Number(finalQuantity * PscPack * (Number(row?.PPI) || 0)) || 0;
                totals["VALUE(EUR)"] += Number(finalQuantity * PscPack * (Number(row?.PPI) || 0)) / 1.5 || 0;
                totals["TOTAL VALUE(GBP)"] += Number(finalQuantity * PscPack * (Number(row?.PPI) || 0)) * 1.5 || 0;
                TotalData[key]["count"] += 1;
                TotalData[key]["TOTAL QTY IN PACK"] += Number(finalQuantity) || 0;
                TotalData[key]["TOTAL QTY IN PCS"] += Number(finalQuantity * PscPack) || 0;
                TotalData[key]["TOTAL VALUE(USD)"] += Number(finalQuantity * PscPack * (Number(row?.PPI || 0) || 0)) || 0;
                TotalData[key]["VALUE(EUR)"] += Number(finalQuantity * PscPack * (Number(row?.PPI) || 0)) / 1.5 || 0;
                TotalData[key]["TOTAL VALUE(GBP)"] += Number(finalQuantity * PscPack * (Number(row?.PPI) || 0)) * 1.5 || 0;
            }
        });
        const convertedData = Object.values(TotalData).map((item, index) => {
            return {
                "Sl No": index + 1,
                // "PRODUCTION UNIT": "???",
                "BUYER": "BESTSELLER",
                "BRAND": item.Brand,
                "MOOD OF SHIPMENT": item["MOOD OF SHIPMENT"],
                "COUNT PO": item.count,
                "TOTAL QTY IN PACK": item["TOTAL QTY IN PACK"],
                "TOTAL QTY IN PCS": item["TOTAL QTY IN PCS"],
                "TOTAL VALUE(USD)": item["TOTAL VALUE(USD)"].toFixed(2),
                "VALUE(EUR)": item["VALUE(EUR)"].toFixed(2),
                "TOTAL VALUE(GBP)": item["TOTAL VALUE(GBP)"].toFixed(2)
            };
        });

        setFooterData([{
            "MOOD OF SHIPMENT": "TOTAL",
            "COUNT PO": totals['COUNT PO'],
            "TOTAL QTY IN PACK": totals["TOTAL QTY IN PACK"],
            "TOTAL QTY IN PCS": totals["TOTAL QTY IN PCS"],
            "TOTAL VALUE(USD)": totals["TOTAL VALUE(USD)"].toFixed(2),
            "VALUE(EUR)": totals["VALUE(EUR)"].toFixed(2),
            "TOTAL VALUE(GBP)": totals["TOTAL VALUE(GBP)"].toFixed(2)
        }])
        // console.log("totals", totals);
        return convertedData || [];
    }

    useEffect(() => {
        const initialFetchRequest = async () => {
            const data = await fetchUploadedData();
            // console.log("data", data);
            const convertedData = convertData(data?.items);
            // console.log("convertedData", convertedData);
            setTableData(convertedData)
            // handleError("");
        }
        initialFetchRequest();
    }, [from, to]);

    const handleSetFrom = (date) => {
        // console.log('from', date);
        setFrom(date);
    }
    const handleSetTo = (date) => {
        // console.log('To', date);
        setTo(date);
    }

    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = () => {
        exportToExcel(
            tableData,
            ["Sl No", "BUYER", "BRAND", "MOOD OF SHIPMENT", "COUNT PO", "TOTAL QTY IN PACK", "TOTAL QTY IN PCS", "TOTAL VALUE(USD)", "VALUE(EUR)", "TOTAL VALUE(GBP)"],
            `Report for ${moment(from).format("DD/MM/YYYY")} to ${moment(to).format("DD/MM/YYYY")}`,
            setIsDownloading,
            true,
            footerData,
            "A5",
            [['CONVERSION:', '', '', '', '', '', '', '', '', '', ''],
            ['EUR 1.00', '', 'USD 1.50', '', '', '', '', '', '', '', '', ''],
            ['USD 1.00', '', 'GBP 1.50', '', '', '', '', '', '', `P.DATE: ${moment().format("DD MMM YYYY")}`],
            []]
        )
    }

    return (
        <div className="flex justify-center">
            {/* Icon */}
            <Tooltip title={"Report"} arrow placement="right">
                <Paper
                    sx={{
                        overflow: "hidden",
                        py: 1,
                        px: 1,
                        width: 40,
                        height: 40,
                        // maxHeight: 40,
                        // minHeight: 40,
                        // transition: "width 1s,max-height 1s, min-height 1s",
                    }}
                    className="space-y-1"
                    onClick={handleOpen5}
                >
                    <AssessmentIcon
                        sx={{
                            color: "gray",
                            // rotate: "180deg",
                            cursor: "pointer",
                        }}
                    />
                </Paper>
            </Tooltip>
            {/* note tab */}
            <Modal
                open={open5}
                onClose={handleClose5}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style2}>
                    <div className="text-[14px]">
                        <h2 className="text-xl uppercase font-bold text-center">SHIPMENT SCHEDULE FOR THE MONTH OF {moment(from).format("DD/MM/YYYY")} TO {moment(to).format("DD/MM/YYYY")}</h2>
                        <div className="px-10 flex items-center justify-between gap-5 mt-3">
                            <div className="flex items-center gap-5">
                                <p><DateInputField
                                    formLength={120}
                                    formTitle={"CCD From"}
                                    value={from}
                                    setValue={handleSetFrom}
                                    isCompulsory={true}
                                // dateToRestrict={to}
                                /></p>
                                <p><DateInputField
                                    formLength={120}
                                    formTitle={"CCD To"}
                                    value={to}
                                    setValue={handleSetTo}
                                    isCompulsory={true}
                                /></p>
                            </div>
                            <Button
                                size="small"
                                variant="outlined"
                                startIcon={<DownloadIcon />}
                                sx={{ height: 25 }}
                                onClick={handleDownload}
                            // disabled={isDownloading}
                            >
                                Export
                            </Button>
                        </div>
                        <h4 className="font-semibold">CONVERSION:</h4>
                        <div className="px-10">
                            <p className="grid grid-cols-2">
                                <span className="grid grid-cols-2">
                                    <span className="w-20">EUR	1.00</span>
                                    <span className="w-20">USD	1.50</span>
                                </span>
                            </p>
                            <p className="grid grid-cols-2">
                                <span className="grid grid-cols-2">
                                    <span className="w-20">USD	1.00</span>
                                    <span className="w-20">GBP	1.50</span>
                                </span>
                                <span className="ms-auto">P.DATE:	{moment().format("DD MMM YYYY")}</span>
                            </p>
                        </div>
                        <CustomTable
                            body={<Body
                                headers={["Sl No", "BUYER", "BRAND", "MOOD OF SHIPMENT", "COUNT PO", "TOTAL QTY IN PACK", "TOTAL QTY IN PCS", "TOTAL VALUE(USD)", "VALUE(EUR)", "TOTAL VALUE(GBP)"]}
                                bodyData={tableData}
                                footer={footerData}
                            />}
                        />
                    </div>
                </Box>
            </Modal>
        </div>
    );
};

export default Report;


