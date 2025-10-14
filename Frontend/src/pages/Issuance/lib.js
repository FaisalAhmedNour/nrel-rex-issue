// export const headers = {
//     "SL_NO": "Sl No",
//     "SoO_NO": "SoO No",
//     "AD Code": "AD Code",
//     "Exp Serial": "EXP Serial",
//     "EXP Year": "EXP Year",
//     "COUNTRY OF DESTINATION": "Country Of Destination",
//     "Select Importer": "Select Importer",
//     "No. & Kind of Packages": "No. & Kind of Packages",
//     "HS Codes": "HS Codes",
//     "Quantities": "Quantities",
//     "Loading Port and Route": "Loading Port and Route",
//     "Bill of Lading (B/L) No": "Bill of Lading (B/L) No",
//     "Bill of Lading (B/L) Date": "Bill of Lading (B/L) Date",
//     "Vessel": "Vessel",
//     "Container": "Container",
//     "Item No.": "Item No",
//     "Marks & No. of Packages": "Marks & No. of Packages",
//     "EXP Date": "EXP Date",
//     "LC No./Sales Contract": "LC No./Sales Contract",
//     "LC/SC Date": "LC/SC Date",
//     "UD No.": "UD No",
//     "UD Date": "UD Date",
//     "Bill of Export (Shipping Bill) No.": "Bill of Export (Shipping Bill) No",
//     "Bill of Export Date": "Bill of Export Date",
//     "Origin": "Origin",
//     "Unit Types": "Unit Types",
//     "Invoice No.": "Invoice No",
//     "Invoice Date": "Invoice Date",
//     "Currency": "Currency",
//     "Invoice Value": "Invoice Value",
//     "Status": "Status",
//     "Comment": "Comment",
//     "Error Column": "Error Column",
// }

export const headers = {
    "SL": 'Sl No',
    "EXP No": "EXP No",
    "ADc": "AD Code",
    "EXPs": "Exp Serial",
    "EXPy": "EXP Year",
    "NoPac": "No. & Kind of Packages",
    "buyer": "Buyer",
    "destination": "Country Of Destination",
    "importer": "Select Importer",
    "HScode": "HS Codes",
    "Quantities": "Quantities",
    "DoGoods": "Description of Goods",
    "port_LoRa": "Loading Port and Route",
    "BLno": "Bill of Lading (B/L) No",
    "BLdate": "Bill of Lading (B/L) Date",
    "vessel": "Vessel",
    "container": "Container",
    "itemNo": "Item No",
    "marksAndNo": "Marks & No. of Packages",
    "EXPd": "EXPd",
    "LCno": "LC No./Sales Contract",
    "LCdate": "LC/SC Date",
    "UDno": "UD No",
    "UDdate": "UD Date",
    "billOfExpNo": "Bill of Export (Shipping Bill) No",
    "billOfExpDate": "Bill of Export Date",
    "origin": "Origin",
    "unitType": "Unit Types",
    "invNo": "Invoice No",
    "invDate": "Invoice Date",
    "currency": "Currency",
    "invValue": "Invoice Value",
    "payslip": "Payslip Barcode",
    "validated": "Validation Status",
}

export const headers_verify = {
    "comments": "Comments"
}

export const headers_payslip = {
    "message": "Message",
    "success": "Success"
}

export const fullHeaders = Object.values(headers);
export const headerKeys = Object.keys(headers);
export const fullHeaders_verify = Object.values(headers_verify);
export const headerKeys_verify = Object.keys(headers_verify);
export const fullHeaders_payslip = Object.values(headers_payslip);
export const headerKeys_payslip = Object.keys(headers_payslip);