
export const headers = {
    BN: "Brand Name",
    // CCO: "Can Confirm Order",
    // CCP: "Can Create PN",
    CCD: "Cargo Closing Date",
    CD: "Created Date",
    // H: "Is Hanging",
    D: "Is Deleted",
    KA: "Is Key Account",
    ON: "Order No",
    OS: "Order State",
    PN: "Packing Note No",
    PLN: "Product Line Name",
    SN: "Style Name",
    SNU: "Style No",
    QTY: "Total Quantity",
}

export const headersForPulling = {
    'SL NO': "Sl No",
    'FCR': "FCR No",
    Success: 'Success',
    'Message': 'Message',
}

export const fullHeaders = Object.values(headers);
export const headerKeys = Object.keys(headers);
export const fullHeadersForPulling = Object.values(headersForPulling);
export const headerKeysForPulling = Object.keys(headersForPulling);