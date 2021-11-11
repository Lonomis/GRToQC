sap.ui.define([
    'sap/ui/base/Object',
    'sap/ui/model/json/JSONModel'
], function(Object, JSONModel) {
    'use strict';
    return Object.extend("zmmo071101.model.InputModel",{
        _oModel : {},

        constructor :   function(){

            this._oModel = new JSONModel(this.getInitialData());
            this._oModel.setDefaultBindingMode("TwoWay");
        },

        getInitialData : function(){
            return {
                ProductionOrder         :   "",
                TransportationType      :   "",
                RackNo                  :   "",
                Material                :   "",
                Plant                   :   "",
                WBS                     :   "",
                ProductionVersion       :   "",
                RackID                  :   "",
                StorageLocation         :   "",
                Reject                  :   false,
                Vendor                  :   "",
                VendorName              :   "",
                ItemNo                  :   "",
                Component               :   "",
                ComponentName           :   "",
                Count                   :   "",
                RejectStorageLocation   :   "",
                Barcode                 :   "",
                StandardPacking         :   [],
                ComponentList           :   []
            }
        },

        getInitialStandardPacking   :   function(){
            return {
                Material                :   "",
                Component               :   "",
                Number                  :   "",
                TransportationType      :   "",
                NetWeight               :   "",
                RackNo                  :   "",
                Item                    :   "",
                Pallet                  :   "",
                House                   :   "",
                DeliveryDate            :   "",
                Sequence                :   "",
            }
        },

        getInitialComponent         :   function(){
            return {
                ItemNo                  :   "",
                Item                    :   "",
                Count                   :   0,
                Sloc                    :   "",
                RejectStatus            :   false,
                Plant                   :   "",
                Vendor                  :   "",
                Barcode                 :   ""
            }  
        },

        checkWithStandardPacking    :   function(){
            var oData               =   this.getData();
            var oStandardPacking    =   this.getStandardPackingLine(oData.Component, oData.StandardPacking);

            if (oStandardPacking){
                oData.ItemNo    =   oStandardPacking.ItemNo;
                this.setData(oData);                
            } else {
                throw "Component not found in standard packing";
            }
        },

        getStandardPackingLine      :   function(sComponent, aStandardPacking) {
            var iCounter            =   0;

            while(aStandardPacking[iCounter]){
                if (aStandardPacking[iCounter].Component === sComponent){
                    return aStandardPacking[iCounter];
                }else{
                    iCounter++;
                }
            }
        },

        validateComponent           :   function(){
            var oData       =   this.getData();

            if ((oData.ComponentList.length + 1) > oData.StandardPacking.length){
                throw "Component more than Standard Packing";
            } else {
                oData.ItemNo     =   this.getItemNumber(oData);
                this.setData(oData);
            }
        },

        getItemNumber               :   function(oData){
            var aStdItemNumber      =   this.findStandardPackingInList(oData);
            var oComponent          =   {};
            var sErrorFlag          =   true;

            for (let iStdItemNumberCounter in aStdItemNumber){
                oComponent          =   this.findComponentInList(aStdItemNumber[iStdItemNumberCounter],
                                                                 oData.ComponentList);
                if (!oComponent){
                    sErrorFlag      =   false;
                    return aStdItemNumber[iStdItemNumberCounter].ItemNo;         
                }
            }

            if (aStdItemNumber.length === 0){
                throw "Component not found in standard packing";
            } else if(sErrorFlag) {
                throw "Component already scanned";
            }
        },
        
        findComponentInList         :   function(oStdItemNumber, aComponentList){
            for (let iComponentListCounter in aComponentList){
                if (aComponentList[iComponentListCounter].ItemNo === oStdItemNumber.ItemNo &&
                    aComponentList[iComponentListCounter].Item   === oStdItemNumber.Component) {
                    return aComponentList[iComponentListCounter];
                }
            }
        },

        findStandardPackingInList   :   function(oData){
            var aStandardPacking    =   [];

            for (let iStandardPackingCounter in oData.StandardPacking){
                if (oData.StandardPacking[iStandardPackingCounter].Component === oData.Component){
                    aStandardPacking.push({
                        Component   :   oData.StandardPacking[iStandardPackingCounter].Component,
                        ItemNo      :   oData.StandardPacking[iStandardPackingCounter].Number
                    });
                }
            }

            return aStandardPacking;
        },
        
        appendComponentData         :   function(){
            var oData = this.getData();

            oData.ComponentList.push({
                ItemNo                  :   oData.ItemNo,
                Sloc                    :   (oData.Reject? oData.RejectStorageLocation : oData.StorageLocation),
                RejectStatus            :   oData.Reject,
                Item                    :   oData.Component,
                Count                   :   oData.Count,
                Plant                   :   oData.Plant,
                Vendor                  :   oData.Vendor,
                Barcode                 :   oData.Barcode
            });

            oData.Component             =   "";
            oData.ComponentName         =   "";
            oData.Count                 =   0;
            oData.Reject                =   false;
            oData.RejectStorageLocation =   "";

            this.setData(oData);
            this.refresh(true);
        },

        setModel    :   function(oView, sModelName){
            oView.setModel(this._oModel, sModelName);
        },

        getData     :   function(){
            return this._oModel.getData();
        },
        
        setData     :   function(oInputdata){
            var oData = this.getInitialData();

            oData.ProductionOrder       =   oInputdata.ProductionOrder;
            oData.TransportationType    =   oInputdata.TransportationType;
            oData.RackNo                =   oInputdata.RackNo;
            oData.Material              =   oInputdata.Material;
            oData.Plant                 =   oInputdata.Plant;
            oData.WBS                   =   oInputdata.WBS;
            oData.ProductionVersion     =   oInputdata.ProductionVersion;
            oData.RackID                =   oInputdata.RackID;
            oData.Count                 =   oInputdata.Count;
            oData.StorageLocation       =   oInputdata.StorageLocation;
            oData.Reject                =   oInputdata.Reject;
            oData.RejectStorageLocation =   oInputdata.RejectStorageLocation;
            oData.Vendor                =   oInputdata.Vendor;
            oData.VendorName            =   oInputdata.VendorName;
            oData.ItemNo                =   oInputdata.ItemNo;
            oData.Component             =   oInputdata.Component;
            oData.ComponentName         =   oInputdata.ComponentName;
            oData.Barcode               =   oInputdata.Barcode;
            oData.StandardPacking       =   oInputdata.StandardPacking;
            oData.ComponentList         =   oInputdata.ComponentList;

            this._oModel.setData(oData);
        },

        clearData : function(){
            this._oModel.setData(this.getInitialData());
        },

        setOrderFromBarcode : function(sResult) {
            this.clearOrderData();
            var oInputData	=	this.getData();

            oInputData.ProductionOrder		=   (sResult.length >= 12 ? sResult.substring(4,16) : sResult);
            oInputData.TransportationType   =   (sResult.length >= 24 ? sResult.substring(23,24) : sResult);
            oInputData.RackNo               =   (sResult.length >= 22 ? sResult.substring(21,23) : sResult);
            this.setData(oInputData);
        },
        
        setSlocFromBarcode : function(sResult) {
            var oInputData  =   this.getData();

            oInputData.StorageLocation      =   (sResult.length >= 1 ? sResult.substring(0,4) : sResult);
            this.setData(oInputData);
        },

        setComponentFromBarcode : function(sResult) {
            var oInputData  =   this.getData();

            oInputData.Component            =   (sResult.length >= 22 ? sResult.substring(21,34) : sResult);
            oInputData.Count                =   (sResult.length >= 58 ? sResult.substring(58,61) : sResult);
            oInputData.Barcode              =   sResult;
            this.setData(oInputData);
        },

        refresh :   function(bForceUpdate){
            this._oModel.refresh(bForceUpdate);
        },

        setVendorData: function(oResult) {
            var oData = this.getData();

            oData.VendorName    =   oResult.VendorName;

            this.setData(oData);
        },

        setStandardPacking: function(oResult) {
            var oInputData = this.getData();

            oResult.forEach(function(oData){
                oInputData.StandardPacking.push({
                    Material                :   oData.Material,
                    Component               :   oData.Component,
                    Number                  :   oData.Number,
                    TransportationType      :   oData.TransportationType,
                    NetWeight               :   oData.NetWeight,
                    RackNo                  :   oData.RackNo,
                    Item                    :   oData.Item,
                    Pallet                  :   oData.Pallet,
                    House                   :   oData.House,
                    DeliveryDate            :   oData.DeliveryDate,
                    Sequence                :   oData.Sequence
                });
            });

            this.setData(oInputData);
        },

        clearVendorData: function(){
            var oData   =   this.getData();

            oData.VendorName    =   "";

            this.setData(oData);
        },

        clearOrderData: function(){
            var oData   =   this.getData();

            oData.Material              =   "";
            oData.Plant                 =   "";
            oData.WBS                   =   "";
            oData.ProductionVersion     =   "";

            this.setData(oData);
        },

        clearStandardPacking: function() {
            var oData = this.getData();

            oData.StandardPacking       =   [];

            this.setData(oData);
        },

        clearSlocData: function() {
            var oData = this.getData();

            oData.StorageLocation       =   "";

            this.setData(oData);
        },

        clearComponentPageData: function(){
            var oData = this.getData();

            oData.ItemNo                =   "";
            oData.Component             =   "";
            oData.ComponentName         =   "";
            oData.Barcode               =   "";
            oData.Count                 =   "";
            oData.Reject                =   false;
            oData.RejectStorageLocation =   "";
            oData.ComponentList         =   [];
            oData.StandardPacking       =   [];

            this.setData(oData);
        },

        clearComponentData: function(){
            var oData = this.getData();

            oData.ItemNo                =   "";
            oData.Component             =   "";
            oData.ComponentName         =   "";
            oData.Barcode               =   "";
            oData.Count                 =   "";
            oData.RejectStorageLocation =   "";
            
            this.setData(oData);
        },

       setOrderData : function(oResultData){
            var oInputData = this.getData();

            oInputData.ProductionOrder      =   oResultData.OrderNo;
            oInputData.Material			    =	oResultData.Material;
            oInputData.WBS				    =	oResultData.WBS;
            oInputData.Plant                =   oResultData.Plant;
            oInputData.StorageLocation	    =	(!oInputData.StorageLocation? oResultData.StorageLocation: oInputData.StorageLocation);
            oInputData.ProductionVersion    =   oResultData.ProductionVersion;
            oInputData.RackID               =   (!oInputData.RackID? oResultData.RackID: oInputData.RackID);
       
            this.setData(oInputData);
        },

        setComponentData : function(oResultData){
            var oInputData  =   this.getData();

            oInputData.Component        =   oResultData.Material;
            oInputData.ComponentName    =   oResultData.MaterialName;

            this.setData(oInputData);
        },

        toggleReject: function() {
            var oInputData = this.getData();

            oInputData.Reject                   =   (oInputData.Reject? false : true);
            oInputData.RejectStorageLocation    =   "";
            
            this.setData(oInputData);
        }
        
    });
});