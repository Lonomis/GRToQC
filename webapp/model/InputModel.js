sap.ui.define([
    'sap/ui/base/Object',
    'sap/ui/model/json/JSONModel'
], function(Object, JSONModel) {
    'use strict';
    return Object.extend("zmmo071107.model.InputModel",{
        _oModel : {},

        constructor :   function(){

            this._oModel = new JSONModel(this.getInitialData());
            this._oModel.setDefaultBindingMode("TwoWay");
        },

        getInitialData : function(){
            return {
                ProductionOrder         :   "",
                Mode                    :   "",
                TransportationType      :   "",
                RackNo                  :   "",
                Material                :   "",
                MaterialName            :   "",
                Plant                   :   "",
                WBS                     :   "",
                ProductionVersion       :   "",
                RackID                  :   "",
                StorageLocation         :   "",
                Reject                  :   false,
                Count                   :   0,
                Barcode                 :   "",
                MainProductionOrder     :   "",
                MainStorageLocation     :   "",
                MaximumQty              :   0,
                ComponentList           :   []
            }
        },

        getInitialComponentList : function(){
            return {
                Count                   :   0,
                Material                :   "",
                Plant                   :   "",
                StorageLocation         :   "",
                Reject                  :   false
            }
        },

        setModel    :   function(oView, sModelName){
            oView.setModel(this._oModel, sModelName);
        },

        getData     :   function(){
            return this._oModel.getData();
        },
        
        setData     :   function(oInputdata){
            var oData = this.getInitialData();

            oData.ProductionOrder           =   oInputdata.ProductionOrder;
            oData.Mode                      =   oInputdata.Mode;
            oData.TransportationType        =   oInputdata.TransportationType;
            oData.RackNo                    =   oInputdata.RackNo;
            oData.Material                  =   oInputdata.Material;
            oData.MaterialName              =   oInputdata.MaterialName;
            oData.Plant                     =   oInputdata.Plant;
            oData.WBS                       =   oInputdata.WBS;
            oData.ProductionVersion         =   oInputdata.ProductionVersion;
            oData.RackID                    =   oInputdata.RackID;
            oData.StorageLocation           =   oInputdata.StorageLocation;
            oData.Reject                    =   oInputdata.Reject;
            oData.Count                     =   oInputdata.Count;
            oData.Barcode                   =   oInputdata.Barcode;
            oData.MainProductionOrder       =   oInputdata.MainProductionOrder;
            oData.MainStorageLocation       =   oInputdata.MainStorageLocation;
            oData.MaximumQty                =   oInputdata.MaximumQty;
            oData.ComponentList             =   oInputdata.ComponentList;

            this._oModel.setData(oData);
        },

        clearData : function(){
            this._oModel.setData(this.getInitialData());
        },
        
        setSlocFromBarcode : function(sResult) {
            var oInputData  =   this.getData();

            oInputData.StorageLocation      =   (sResult.length >= 1 ? sResult.substring(0,4) : sResult);
            this.setData(oInputData);
        },

        refresh :   function(bForceUpdate){
            this._oModel.refresh(bForceUpdate);
        },

        clearOrderDataQC: function(){
            var oData   =   this.getData();

            oData.ProductionOrder       =   "";
            oData.Mode                  =   "";
            oData.Material              =   "";
            oData.MaterialName          =   "";
            oData.WBS                   =   "";
            oData.ProductionVersion     =   "";
            oData.StorageLocation       =   "";
            oData.Count                 =   0;
            oData.Reject                =   false;
            oData.Barcode               =   "";

            this.setData(oData);
        },

        clearSlocData: function() {
            var oData = this.getData();

            oData.StorageLocation       =   "";

            this.setData(oData);
        },

       setOrderDataQC : function(oResultData){
            var oInputData = this.getData();

            oInputData.ProductionOrder          =   oResultData.OrderNo;
            oInputData.Mode                     =   oResultData.Mode;
            oInputData.Material			        =	oResultData.Material;
            oInputData.MaterialName             =   oResultData.MaterialName;
            oInputData.WBS				        =	oResultData.WBS;
            oInputData.Plant                    =   oResultData.Plant;
            oInputData.StorageLocation	        =	(!oInputData.StorageLocation? oResultData.StorageLocation: oInputData.StorageLocation);
            oInputData.ProductionVersion        =   oResultData.ProductionVersion;
            oInputData.RackID                   =   (!oInputData.RackID? oResultData.RackID: oInputData.RackID);
            oInputData.MainProductionOrder      =   oResultData.OrderNo;
            oInputData.MainStorageLocation      =   oResultData.StorageLocation; 
            oInputData.MaximumQty               =   oResultData.Qty;
       
            this.setData(oInputData);
        },

       setSubOrderData : function(oResultData){
            var oInputData = this.getData();

            oInputData.ProductionOrder          =   oResultData.OrderNo;
            oInputData.Material			        =	oResultData.Material;
            oInputData.MaterialName             =   oResultData.MaterialName;
            oInputData.WBS				        =	oResultData.WBS;
            oInputData.StorageLocation	        =	(!oInputData.StorageLocation? oResultData.StorageLocation: oInputData.StorageLocation);
       
            this.setData(oInputData);
        },

        toggleReject: function() {
            var oInputData = this.getData();

            oInputData.Reject                   =   (oInputData.Reject? false : true);
            
            this.setData(oInputData);
        },

        setOrderFromBarcode: function(sBarcodeText) {
            var oInputData  =   this.getData();

            oInputData.ProductionOrder  =   (sBarcodeText.length >= 12 ? sBarcodeText.substring(4,16) : sBarcodeText);
            oInputData.Barcode          =   sBarcodeText;

            this.setData(oInputData);
        },

        appendComponent: function() {
            var oInputData = this.getData();

            oInputData.ComponentList.push({
                Count                   :   oInputData.Count,
                Material                :   oInputData.Material,
                Plant                   :   oInputData.Plant,
                StorageLocation         :   oInputData.StorageLocation,
                Reject                  :   oInputData.Reject,
                Barcode                 :   oInputData.Barcode         
            });

            this.setData(oInputData);
            this.refresh(true);
            this.clearOrderDataQC();
        },

        findCount: function(iCount) {
            var oInputData = this.getData();

            var iCountFound = oInputData.ComponentList.find((component)=>{
                return component.Count === iCount;
            });

            if (iCountFound){
                return true;
            } else {
                return false;
            }
        }
        
    });
});