sap.ui.define([
    "sap/ui/base/Object",
    "sap/ui/model/resource/ResourceModel"
], function(Object, ResourceModel){
    "use strict";

    return Object.extend("zmmo071101.model.OrderModel", {
        _OrderModel         :   {},
        SuccessStatus       :   "Success",
        ErrorStatus         :   "Error",
        _ResourceBundle:    new ResourceModel({
            bundleName:         "zmmo071101.i18n.i18n",
            supportedLocales:   [""],
            fallbackLocales:    ""
        }).getResourceBundle(),

        constructor : function(oModel){
            this._OrderModel    =   oModel;
        },

        getOrderData: function(oInputModel){
            var that = this;
            var oParameters = this.buildGetOrderParameter(oInputModel);

            return new Promise(function(resolve, reject){
                that._OrderModel.callFunction("/GetOrder", {
                    method          :   "GET",
                    urlParameters   :   oParameters,
                    success         :   function(oData) {
                        oInputModel.setOrderData(oData.GetOrder);

                        resolve({
                            status  :   that.SuccessStatus,
                            details :   oData.GetOrder
                        })
                    },
                    error           :   function(oError) {
                        reject({
                            status  :   that.ErrorStatus,
                            details :   oError
                        })
                    } 
                })
            });
        },

        buildGetOrderParameter: function(oInputModel){
            var oInputData = oInputModel.getData();

            return {
                "OrderNo"               :   ( !oInputData.ProductionOrder ? "" : oInputData.ProductionOrder),
                "RackNo"                :   "00",
                "TransportationType"    :   "0",
                "Flag"                  :   "X"
            }
        },

        getComponentData: function(oInputModel){
            var that = this;
            var oParameters = this.buildGetMaterialNameParameter(oInputModel);

            return new Promise(function(resolve, reject){
                that._OrderModel.callFunction("/GetMaterialName", {
                    method          :   "GET",
                    urlParameters   :   oParameters,
                    success         :   function(oData) {
                        oInputModel.setComponentData(oData.GetMaterialName);

                        resolve({
                            status  :   that.SuccessStatus,
                            details :   oData.GetMaterialName
                        })
                    },
                    error           :   function(oError) {
                        reject({
                            status  :   that.ErrorStatus,
                            details :   oError
                        })
                    } 
                })
            });
        },

        buildGetMaterialNameParameter: function(oInputModel){
            var oInputData = oInputModel.getData();

            return {
                "Material"               :   ( !oInputData.Component ? "" : oInputData.Component)
            }
        },

        postGoodsReceipt:    function(oInputModel, oMessageStrip){
            var that = this;
            var oDataToBePosted =   this.prepareDataToBePosted(oInputModel);

            return new Promise(function(resolve, reject){
                that._OrderModel.create("/GoodsReceipts", oDataToBePosted, {
                    success : function(oData) {
                        oMessageStrip.showMessageStrip(that.getPostSuccessMessage(oData.MaterialDocumentNo), that.SuccessStatus);
                        resolve({
                            status  :   that.SuccessStatus,
                            details :   oData
                        })
                    },
                    error : function(oError) {
                        oMessageStrip.showMessageStrip(that.getPostErrorMessage(), that.ErrorStatus);
                        reject({
                            status  :   that.ErrorStatus,
                            details :   oError,
                            message :   that.getPostErrorMessage()
                        })
                    }
                })
            })
        },

        prepareDataToBePosted:  function(oInputModel){
            var oData = oInputModel.getData();

            return {
                TransactionId       :   "1",
                TransactionCode     :   "ZMMO071_101",
                ProductionOrder     :   oData.ProductionOrder,
                Plant               :   oData.Plant,
                RackId              :   oData.RackID,
                WBS                 :   oData.WBS,
                StorageLocation     :   oData.StorageLocation,
                RackNo              :   oData.RackNo,
                TransportationType  :   oData.TransportationType,
                Vendor              :   oData.Vendor,
                ToGRItems           :   this.appendToGRItems(oData.ComponentList)
            }
        },

        appendToGRItems: function(aComponentList){
            var aToGRItems    =   [];

            aComponentList.forEach(function(oComponent){
                aToGRItems.push({
                    TransactionId   :   "1",
                    ItemNo          :   oComponent.ItemNo,
                    Item            :   oComponent.Item,
                    StorageLocation :   oComponent.Sloc,
                    Reject          :   ( oComponent.RejectStatus ? "X" : "" ),
                    Plant           :   oComponent.Plant,
                    Vendor          :   oComponent.Vendor,
                    Count           :   oComponent.Count.toString(),
                    Barcode         :   oComponent.Barcode
                });
            });

            return aToGRItems;
        },

        getPostSuccessMessage: function(sMaterialDocumentNo) {
            return this._ResourceBundle.getText("post.Success", 
                                                [sMaterialDocumentNo]);
        },

        getPostErrorMessage: function(oInputData) {
            return this._ResourceBundle.getText("post.Error");
        },

        getVendorData: async function(oInputModel) {
            var that = this;
            var oParameters =   this.buildGetVendorDataParameter(oInputModel);

            if (oParameters) {

                return new Promise(function(resolve, reject){
                    that._OrderModel.callFunction("/GetVendorData", {
                        method          :   "GET",
                        urlParameters   :   oParameters,
                        success         :   function(oData){
                            oInputModel.setVendorData(oData.GetVendorData);

                            resolve({
                                status  :   that.SuccessStatus,
                                details :   oData.GetVendorData
                            })
                        },
                        error           :   function(oError){
                            reject({
                                status  :   that.ErrorStatus,
                                details :   oError
                            })
                        }
                    })
                });

            }
        },

        buildGetVendorDataParameter: function(oInputModel) {
            var oInputData = oInputModel.getData();

            if (oInputData.Vendor){
                return {
                    "Vendor"    :   oInputData.Vendor
                };
            }
        },

        getStandardPackingData: function(oInputModel) {
            var that = this;
            var oParameters =   this.buildGetStdPackingParameter(oInputModel);

            return new Promise(function(resolve, reject){
               that._OrderModel.callFunction("/GetStandardPacking", {
                    method          :   "GET",
                    urlParameters   :   oParameters,
                    success         :   function(oData){
                        oInputModel.setStandardPacking(oData.results);

                        resolve({
                            status  :   that.SuccessStatus,
                            details :   oData.results
                        })
                    },
                    error           :   function(oError){
                        reject({
                            status  :   that.ErrorStatus,
                            details :   oError
                        })
                    }
               })
            });
        },
        
        buildGetStdPackingParameter: function(oInputModel) {
            var oInputData = oInputModel.getData();

            return {
                "Material"              :   (!oInputData.Material? "" : oInputData.Material),
                "OrderNo"               :   (!oInputData.ProductionOrder? "" : oInputData.ProductionOrder),
                "RackId"                :   (!oInputData.RackID? "" : oInputData.RackID),
                "RackNo"                :   (!oInputData.RackNo? "" : oInputData.RackNo),
                "TransportationType"    :   (!oInputData.TransportationType? "": oInputData.TransportationType)
            };
        }
    });
});