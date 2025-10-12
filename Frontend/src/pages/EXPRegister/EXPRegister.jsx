// Faisal Ahmed (C)

import { useContext, useEffect, useRef, useState } from "react";
import Paper from "@mui/material/Paper";
import Tooltip from "@mui/material/Tooltip";
import ClearIcon from "@mui/icons-material/Clear";
import TimerOutlinedIcon from "@mui/icons-material/TimerOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
// import Controller from "./Controller/Controller";
// import MessageTable from "../Validation/MessegeTable";
// import LoaderPage from "../../../Components/LoaderPage";
// import TimerSection from "../../../Components/TimerSection";
import ExpRegisterTable from "./ExpRegisterTable/ExpRegisterTable";
import StickyInstructions from "../../Components/StickyInstructions/StickyInstructions";
import TimerSection from "../../Components/TimerSection";
import MessageTable from "../../Components/MessageTable";
import Controller from "./Controller/Controller";
import LoaderPage from "../../Components/Loader/LoaderPage";
// import ExpRegisterSearchForm from "./ExpRegisterTable/ExpRegisterSearchForm";
// import StickyInstructions from "../../../Components/StickyInstructions/StickyInstructions";
// import { EXPDataContext } from "../../../providers/EXPDataProvider";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 450,
  bgcolor: "background.paper",
  // border: '2px solid #000',
  borderRadius: "8px",
  boxShadow: 24,
  p: 4,
};

const style2 = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 1200,
  bgcolor: "background.paper",
  borderRadius: "8px",
  boxShadow: 24,
  p: 4,
};

// FIXME
const EXPRegister = ({loading, setLoading}) => {
  // const { loading, setLoading, chanel, setChanel, channel } = useContext(EXPDataContext);

  const [page, setPage] = useState(0);
  const [files, setFiles] = useState([]);
  const searchParams = useRef(undefined);
  const [totalRows, setTotalRows] = useState(0);
  const [errorTable, setErrorTable] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [reloadTable, setReloadTable] = useState(false);
  const [isLoadingTable, setIsLoadingTable] = useState(false);
  const [stats, setStats] = useState(null);
  const [allFiles, setAllFiles] = useState([]);

  // FIXME: make them global
  const [isExpandTimer, setIsExpandTimer] = useState(false);
  const [isExpandMiniTimer, setIsExpandMiniTimer] = useState(false);
  const [isExpandMessage, setIsExpandMessage] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [succeed, setSucceed] = useState(0);

  const [formData, setFormData] = useState({
    selectedYear: new Date().getFullYear(),
  });

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChangePage = (newPage) => {
    setPage(newPage);
    // console.log(newPage, rowsPerPage);
    getResisterData(newPage, rowsPerPage);
  };

  function getDatesBetween(startDateStr, endDateStr) {
    let startDate = new Date(startDateStr);
    let endDate = new Date(endDateStr);
    let dates = [];

    while (startDate <= endDate) {
      dates.push(startDate.toISOString().slice(0, 10));
      startDate.setDate(startDate.getDate() + 1);
    }

    return dates;
  }

  const handleChangeRowsPerPage = (n) => {
    // console.log(+event.target.value);
    setPage(0);
    setRowsPerPage(n);
    getResisterData(0, n);
  };

  const getResisterData = async (pageNo = page, perPage = rowsPerPage, query = formData) => {
    setIsLoadingTable(true);
    const data = {
      subFunc: query.subFunction || undefined,
      query: {
        "Invoice No": query?.invoice_no ? query.invoice_no.split(',').map(data => data?.trim()) : undefined,
        "EXP Serial": query?.exp_serial ? query.exp_serial.split(',').map(data => data?.trim()) : undefined,
        "EXP Year": [
          query.selectedYear
            ? query.selectedYear.toString()
            : new Date().getFullYear().toString(),
        ],
        "_Entry Date":
          getDatesBetween(query.from, query.to) || undefined,
      },
    };
    try {
      const result = await window?.engine?.Proxy("/exp/getexp?perPage=" + perPage + "&page=" + pageNo + "&from=" + searchParams.from + "&to=" + searchParams.to, 'post', data);
      console.log("payload", data, "get register data result", result);
      if (result?.status) {
        setStats(result?.data?.stats);
        setTotalRows(result?.data?.stats?.total);
        setFiles(result?.data?.list);
        setIsLoadingTable(false);
      } else {
        console.log(result);
        setErrorTable(
          "Something went wrong! Please check your internet connection and try again later."
        );
      }
      // console.log(result);
    } catch (error) {
      console.error(error);
      setErrorTable(
        "Something went wrong! Please check your internet connection and try again later."
      );
    } finally {
      setIsLoadingTable(false);
    }
  };

  const getResisterDataForCSV = async (pageNo = 0, perPage = totalRows) => {
    setLoading(true);
    const data = {
      subFunc: searchParams.subFunction || undefined,
      query: {
        "Invoice No": searchParams.invoiceNo || undefined,
        "EXP Serial": searchParams.expSerial || undefined,
        "EXP Year": [
          searchParams.year
            ? searchParams.year.toString()
            : new Date().getFullYear().toString(),
        ],
        "_Entry Date":
          getDatesBetween(searchParams.from, searchParams.to) || undefined,
      },
    };
    try {
      const result = await window?.engine?.Proxy("/exp/getexp?perPage=" + perPage + "&page=" + pageNo + "&from=" + searchParams.from + "&to=" + searchParams.to, 'post', data);
      // console.log("get register data result2", result);
      if (result?.status) {
        setAllFiles(result?.data?.list);
      } else {
        console.log(result);
        setErrorTable(
          "Something went wrong! Please check your internet connection and try again later."
        );
      }
    } catch (error) {
      console.error(error);
      setErrorTable(
        "Something went wrong! Please check your internet connection and try again later."
      );
    } finally {
      // console.log("yes closed");
      setLoading(false);
    }
  };

  const getEngineOnSignal = () => {
    window?.engine?.onProcessStart(function (message) {
      setIsExpandMiniTimer(true)
    });
  }

  const getEngineOffSignal = () => {
    window?.engine?.onProcessStop(function (message) {
      setReloadTable(e => !e)
    });
  }

  useEffect(() => {
    getEngineOnSignal();
    getEngineOffSignal();
  }, []);

  return (
    <div className="relative mb-5 mt-1">
      <LoaderPage open={loading} />
      <div className="absolute flex justify-between w-full px-1">
        <div className="flex items-center gap-2">
          <StickyInstructions
            title={"Exp Register"}
          />
          <Tooltip title={"Timer Details"} arrow placement="right" disableInteractive>
            <Paper
              sx={{
                px: 1,
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {isExpandTimer ?
                <ClearIcon
                  sx={{
                    color: "red",
                    cursor: "pointer",
                    fontSize: 20
                  }}
                  onClick={() => setIsExpandTimer(false)}
                /> :
                <div className="flex items-center justify-between gap-1" onClick={() => setIsExpandTimer(true)}>
                  <TimerOutlinedIcon
                    sx={{
                      color: "#707070",
                      cursor: "pointer"
                    }}
                  />
                  {isExpandMiniTimer && <div className="flex flex-col items-center cursor-pointer">
                    <p className="font-bold tracking-wide font-roboto text-sm text-[#1976d2]"><span className="flex">
                      {String(Math.floor(seconds / 3600)).padStart(2, "0")} :{" "}
                      {String(Math.floor((seconds % 3600) / 60)).padStart(2, "0")} :{" "}
                      {String(seconds % 60).padStart(2, "0")}
                    </span></p>
                    <p className="font-bold tracking-wide font-roboto text-sm">Pulled: {succeed}</p>
                  </div>}
                </div>}
            </Paper>
          </Tooltip>
        </div>
        <div className="flex items-center gap-2">
          <Tooltip title={"Message Table"} arrow placement="left" disableInteractive>
            <Paper
              sx={{
                width: 40,
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {isExpandMessage ?
                <ClearIcon
                  sx={{
                    color: "gray",
                    cursor: "pointer",
                    fontSize: 20
                  }}
                  onClick={() => setIsExpandMessage(false)}
                /> :
                <EmailOutlinedIcon
                  sx={{
                    color: "gray",
                    cursor: "pointer"
                  }}
                  onClick={() => setIsExpandMessage(true)}
                />}
            </Paper>
          </Tooltip>
        </div>
      </div>
      <div
        className={`flex ${(isExpandTimer && isExpandMessage) ? "gap-2" : "gap-0"} w-full overflow-hidden pt-12 px-2`}
        style={{
          height: (isExpandTimer || isExpandMessage) ? 230 : 0,
          transition: "height 1s",
        }}
      >
        <TimerSection
          isDataToRun={false}
          dataToRunText={'EXP To Issue'}
          isSuccess={true}
          successText={'Updated'}
          isFaild={true}
          // engineStatus={engineStatus}
          isExpand={isExpandTimer}
          setIsExpand={setIsExpandTimer}
          setSucceed={setSucceed}
          seconds={seconds}
          setSeconds={setSeconds}
          chnl={'coll'}
        />
        <MessageTable
          isExpandMessage={isExpandMessage}
          setIsExpandMessage={setIsExpandMessage}
          chnl={'coll'}
        />
      </div>
      <Controller
        open={open}
        setOpen={setOpen}
        handleOpen={handleOpen}
        handleClose={handleClose}
        setReloadTable={setReloadTable}
      />
      <ExpRegisterTable
        handleOpen={handleOpen}
        page={page}
        files={files}
        allFiles={allFiles}
        totalRows={totalRows}
        errorTable={errorTable}
        reloadTable={reloadTable}
        rowsPerPage={rowsPerPage}
        isLoadingTable={isLoadingTable}
        stats={stats}
        searchParams={searchParams}
        getResisterData={getResisterData}
        handleChangePage={handleChangePage}
        getResisterDataForCSV={getResisterDataForCSV}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        formData={formData}
        setFormData={setFormData}
      />
    </div>
  );
};

export default EXPRegister;
