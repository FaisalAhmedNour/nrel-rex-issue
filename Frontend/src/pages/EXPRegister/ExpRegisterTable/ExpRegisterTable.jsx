// Faisal Ahmed (C)
// Faisal Ahmed (M) - 02 Sep 2025

import { useState, useEffect, useRef } from "react";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
// import OEMSUpdate from "../../OEMSUpdate/OEMSUpdate";
// import LoaderPage from "../../../../Components/LoaderPage";
// import Body from "../../../../Components/CustomTable/Body/Body";
import { FilterButton, FilterComponent } from "../FillterComponent";
import { DetailsButton, DetailsComponent } from "../DetailsComponent";
import LoaderPage from "../../../Components/Loader/LoaderPage";
import Body from "../../../Components/CustomTable/Body/Body";
import CustomTable from "../../../Components/CustomTable/CustomTable";
import ExportExcelButton from "../../../Components/ExportExcelButton";
import Pagination from "../../../Components/CustomTable/Pagination/Pagination";
import { heightLightButton } from "../../../lib";
// import CustomTable from "../../../../Components/CustomTable/CustomTable";
// import ExportExcelButton from "../../../../Components/ExportExcelButton";
// import Pagination from "../../../../Components/CustomTable/Pagination/Pagination";

export default function ExpRegisterTable({
  handleOpen,
  handleStop,
  isProcessing,
  page,
  files,
  allFiles,
  totalRows,
  errorTable,
  reloadTable,
  rowsPerPage,
  isLoadingTable,
  getResisterData,
  handleChangePage,
  getResisterDataForCSV,
  handleChangeRowsPerPage,
  formData,
  setFormData,
  stats
}) {
  const [filesToShow, setFilesToShow] = useState([]);
  const [QuantityOfData, setQuantityOfData] = useState("this");
  const [headers, setHeaders] = useState({
    "Sl No": "Sl No",
    "Remarks On DUP": "Remarks On DUP",
    "Bank Name": "Bank Name",
    "AD Code": "AD Code",
    "Branch Name": "Branch Name",
    "EXP No": "Exp No",
    "EXP Serial": "Exp Serial",
    "EXP Year": "EXP Year",
    HSCODE: "HSCODE",
    "Country Code": "Country Code",
    "Currency Code": "Currency Code",
    Currency: "Currency",
    "Cmt Amount": "Cmt Amount",
    "Amount Inv": "Amount Inv",
    "Inv Confirmed": "Inv Confirmed",
    Freight: "Freight",
    Insurance: "Insurance",
    "Other Charges": "Other Charges",
    "CMT Customs": "CMT Customs",
    "Amount Customs": "Amount Customs",
    "Realized Date": "Realized Date",
    "Amount Realized": "Amount Realized",
    "Ship Port": "Ship Port",
    "Ship Date": "Ship Date",
    "ERC No": "ERC No",
    BIN: "BIN",
    Exporter: "Exporter",
    "Lc Contact": "Lc Contact",
    Importer: "Importer",
    "Dup Flag": "Dup Flag",
    "Dup Date": "Dup Date",
    "Dup AD": "Dup AD",
    "Trp Flag": "Trp Flag",
    "Unit Code": "Unit Code",
    "Unit ISO": "Unit ISO",
    Quantity: "Quantity",
    "Issue Officer": "Issue Officer",
    "Bank Bill No": "Bank Bill No",
    "Bank Bill Date": "Bank Bill Date",
    "Invoice No": "Invoice No",
    "Invoice Date": "Invoice Date",
    "Cancel Flag": "Cancel Flag",
    Remarks: "Remarks",
    "Entry Date": "Entry Date",
    "Entry User": "Entry User",
    Incoterm: "Incoterm",
    Carrier: "Carrier",
    "Trans Doc Type": "Trans Doc Type",
    Sector: "Sector",
    "Dest Port": "Dest Port",
    "Trans Doc No": "Trans Doc No",
    "Bank Ref No": "Bank Ref No",
    "Trans Doc Date": "Trans Doc Date",
    "Custom Code": "Custom Code",
    "Export Bill No": "Export Bill No",
    "Export Bill Date": "Export Bill Date",
    "Signatory Id": "Signatory Id",
    "PRC ID/Count": "PRC ID/Count"
  });
  const [openFilter, setOpenFilter] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);

  const getReadyForExcel = (data) => {
    const convertedData = data.map((order, i) => {
      const row = {};
      Object.keys(headers).forEach((headerKye, index) => {
        if (headerKye === 'Sl No') {
          row[headerKye] = i + 1;
        }
        else if (
          headerKye === "Quantity" ||
          headerKye === "EXP Year" ||
          headerKye === "Signatory Id" ||
          headerKye === "Cmt Amount" ||
          headerKye === "Inv Confirmed" ||
          headerKye === "Amount Inv" ||
          headerKye === "Freight" ||
          headerKye === "Insurance" ||
          headerKye === "Other Charges" ||
          headerKye === "CMT Customs" ||
          headerKye === "Amount Customs" ||
          headerKye === "Amount Realized" ||
          headerKye === "Invoice No"
        ) {
          row[headerKye] = Number(order?.[headerKye]) || 0;
        }
        else {
          row[headerKye] = order?.[headerKye] || "";
        }
      });
      return row;
    });
    setFilesToShow(convertedData);
  };

  useEffect(() => {
    getResisterData();
  }, [reloadTable]);

  useEffect(() => {
    getReadyForExcel(files);
  }, [files]);

  useEffect(() => {
    if (allFiles?.length > 0) getReadyForExcel(allFiles);
  }, [allFiles]);

  const setDataToExportType = (value) => {
    if (value === "all") getResisterDataForCSV();
    else getReadyForExcel(files);
    setQuantityOfData(value);
  };

  const handleCancel = () => {
    setFormData({});
    getResisterData(0, undefined, {});
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    getResisterData(0);
  }

  const handleSearchSubFunction = (type) => {
    setFormData(pre => ({ ...pre, subFunction: type }));
    getResisterData(0, undefined, { subFunction: type });
  }

  if (errorTable) {
    return (
      <Typography color="red" fontSize={"14px"} textAlign={"center"}>
        {errorTable}
      </Typography>
    );
  }

  return (
    <Paper>
      <LoaderPage open={isLoadingTable} />
      <CustomTable
        className={'mt-1'}
        headerButtons={[
          // <OEMSUpdate type="exp" />,
          <Button
            size="small"
            color="success"
            variant="contained"
            sx={heightLightButton}
            onClick={handleOpen}
          >
            Upload
          </Button>
        ]}
        headerTitle={'EXP Register Data'}
        pagination={<Pagination
          page={page}
          rowsPerPage={rowsPerPage}
          totalRows={totalRows}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 100, 500]}
          leftButtons={[
            <FilterButton setOpenFilter={setOpenFilter} />,
            <div className="flex gap-2 z-10">
              <FormControl fullWidth size="small">
                <Select
                  value={QuantityOfData}
                  sx={{
                    height: 25,
                    fontSize: 14,
                  }}
                  onChange={(e) => setDataToExportType(e.target.value)}
                  className="editableInput"
                >
                  <MenuItem
                    value="this"
                    sx={{
                      height: 25,
                      fontSize: 14,
                    }}
                  >
                    This Page
                  </MenuItem>
                  <MenuItem
                    value="all"
                    sx={{
                      height: 22,
                      fontSize: 14,
                    }}
                  >
                    All Data
                  </MenuItem>
                </Select>
              </FormControl>
              <ExportExcelButton
                data={filesToShow}
                headers={Object.keys(headers)}
                includeTable={true}
                filename={`EXP Register Data`}
              />
            </div>
          ]}
          rightButtons={[
            <DetailsButton setOpenFilter={setOpenDetails} />
          ]}
          needPagination={true}
        />}
        openLeft={openFilter}
        leftDrawer={<FilterComponent
          openFilter={openFilter}
          setOpenFilter={setOpenFilter}
          handleClear={handleCancel}
          handleSubmit={handleSubmit}
          formData={formData}
          setFormData={setFormData}
        />}
        openRight={openDetails}
        rightDrawer={<DetailsComponent
          openFilter={openDetails}
          setOpenFilter={setOpenDetails}
          stats={stats}
          handleSearchSubFunction={handleSearchSubFunction}
        />}
        body={< Body
          headers={Object.keys(headers)}
          bodyData={filesToShow}
        />}
      />
    </Paper >
  );
}
