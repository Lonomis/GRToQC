sap.ui.define([
    'sap/ui/base/Object',
    'zmmo071107/control/BarcodeScannerControl'
], function(Object, BarcodeScannerControl) {
    'use strict';
    
    return Object.extend("zmmo071107.barcodeScanner.BarcodeScanner", {
        _sDialogTitle           :   "Enter Barcode Manually",
        SuccessStatus           :   "Success",
        ErrorStatus             :   "Error",
        CancelStatus            :   "Cancel",
        _StatusModelName        :   "barcode",

        constructor : function(){
            
        },

        setStatusModel : function(oView){
            oView.setModel(BarcodeScannerControl.getStatusModel(), this._StatusModelName);
        },
        
        scanOrder : function(oInputModel){
            var that  = this;
            oInputModel.clearOrderDataQC();

            return new Promise(function(resolve, reject){
                BarcodeScannerControl.scan(
                    //Scan Successfully
                    function(oResult) {
                        if (oResult.text){
                            oInputModel.setOrderFromBarcode(oResult.text);

                            resolve({
                                status  :   that.SuccessStatus
                            });
                        } else {
                            resolve({
                                status  :   that.CancelStatus
                            })
                        }
                    }, 
                    //Scan Failure
                    function(sError) {
                        reject({
                            status  :   that.ErrorStatus,
                            details :   sError
                        });
                    }, 
                    //Live Update
                    function(oParams) {
                        //Do Nothing
                    },
                    that._sDialogTitle
                );
            });
        },

        scanSloc : function(oInputModel){
            var that  = this;
            oInputModel.clearSlocData();
            
            return new Promise(function(resolve, reject){
                BarcodeScannerControl.scan(
                    //Scan Successfully
                    function(oResult) {
                        if (oResult.text){
                            oInputModel.setSlocFromBarcode(oResult.text);

                            resolve({
                                status  :   that.SuccessStatus
                            });
                        } else {
                            resolve({
                                status  :   that.CancelStatus
                            })
                        }
                    }, 
                    //Scan Failure
                    function(sError) {
                        reject({
                            status  :   that.ErrorStatus,
                            details :   sError
                        });
                    }, 
                    //Live Update
                    function(oParams) {
                        //Do Nothing
                    },
                    that._sDialogTitle
                );
            });
        }
    });
});