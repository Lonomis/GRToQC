sap.ui.define([
    "sap/ui/base/Object",
    "sap/ui/model/resource/ResourceModel"
], function(Object, ResourceModel){
    "use strict";

    return Object.extend("zmmo071107.model.OrderModel", {
        _OrderModel         :   {},
        SuccessStatus       :   "Success",
        ErrorStatus         :   "Error",
        _ResourceBundle:    new ResourceModel({
            bundleName:         "zmmo071107.i18n.i18n",
            supportedLocales:   [""],
            fallbackLocales:    ""
        }).getResourceBundle(),

        constructor : function(oModel){
            this._OrderModel    =   oModel;
        },

        getMainOrderData: function(oInputModel){
            var that = this;
            var oParameters = this.buildGetOrderQCParameter(oInputModel);

            return new Promise(function(resolve, reject){
                that._OrderModel.callFunction("/GetOrderQC", {
                    method          :   "GET",
                    urlParameters   :   oParameters,
                    success         :   function(oData) {
                        oInputModel.setOrderDataQC(oData.GetOrderQC);

                        resolve({
                            status  :   that.SuccessStatus,
                            details :   oData.GetOrderQC
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

        buildGetOrderQCParameter: function(oInputModel){
            var oInputData = oInputModel.getData();

            return {
                "OrderNo"               :   ( !oInputData.ProductionOrder ? "" : oInputData.ProductionOrder),
                "RackNo"                :   "00",
                "TransportationType"    :   "0",
                "Flag"                  :   "X"
            }
        },

        getSubOrderData: function(oInputModel){
            var that = this;
            var oParameters = this.buildGetOrderParameter(oInputModel);

            return new Promise(function(resolve, reject){
                that._OrderModel.callFunction("/GetOrder", {
                    method          :   "GET",
                    urlParameters   :   oParameters,
                    success         :   function(oData) {
                        oInputModel.setSubOrderData(oData.GetOrder);

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

        postGoodsReceiptFence:    function(oInputModel, oMessageStrip){
            var that = this;
            var oDataToBePosted =   this.prepareDataToPostGRFence(oInputModel);

            return new Promise(function(resolve, reject){
                that._OrderModel.create("/GoodsReceiptFences", oDataToBePosted, {
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

        prepareDataToPostGRFence:  function(oInputModel){
            var oData = oInputModel.getData();

            return {
                TransactionId       :   "1",
                TransactionCode     :   "ZMMO071_107",
                ProductionOrder     :   oData.MainProductionOrder,
                Plant               :   oData.Plant,
                RackId              :   oData.RackID,
                StorageLocation     :   oData.MainStorageLocation,
                ToGRItemsFence      :   this.appendToGRItemsFence(oData.ComponentList)
            }
        },

        appendToGRItemsFence: function(aComponentList){
            var aToGRItemsFence    =   [];

            aComponentList.forEach(function(oComponent){
                aToGRItemsFence.push({
                    TransactionId   :   "1",
                    Item            :   oComponent.Material,
                    StorageLocation :   oComponent.StorageLocation,
                    Reject          :   ( oComponent.RejectStatus ? "X" : "" ),
                    Count           :   oComponent.Count.toString(),
                    Barcode         :   ( oComponent.Barcode ? oComponent.Barcode : "" )
                });
            });

            return aToGRItemsFence;
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