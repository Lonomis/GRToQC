sap.ui.define([
    'sap/ui/base/Object',
    'sap/ui/model/json/JSONModel'
], function(Object, JSONModel) {
    'use strict';
    
    return Object.extend("zmmo071107.model.SlocModel", {
        _OrderModel         :   "",
        _SlocModel          :   "",
        SuccessStatus       :   "Success",
        ErrorStatus         :   "Error",


        constructor: function(oModel, oView, sModelName){
            this._SlocModel  =   new JSONModel(this.getInitialSlocData());
            oView.setModel(this._SlocModel, sModelName); 

            this._OrderModel = oModel;
        },

        buildSlocList: function(sObject, sPlant){
            var that        =   this;

            return new Promise(function(resolve, reject){
                that.getSlocList(sObject, sPlant).then(
                    function(oResult){
                        that.setSlocData(oResult, that._SlocModel);
                        resolve({
                            status  :   that.SuccessStatus,
                            details :   oResult
                        });
                    },
                    function(oError){
                        reject({
                            status  :   that.ErrorStatus,
                            details :   oError
                        });
                    });
            });
        },

        buildSlocPCFList: function(sProductionOrder) {
            var that    =   this;

            return new Promise(function(resolve, reject){
                that.getSlocPCFList(sProductionOrder).then(
                    function(oResult){
                        that.setSlocData(oResult, that._SlocModel);
                        resolve({
                            status  :   that.SuccessStatus,
                            details :   oResult 
                        });
                    },
                    function(oError){
                        reject({
                            status  :   that.ErrorStatus,
                            details :   oError
                        });
                    }
                );
            });
        },

        setSlocData: function(oResult, oSlocModel){
            var oSlocData   =   this.getInitialSlocData();

            if (oResult.status === this.SuccessStatus) {
                oResult.details.results.forEach(function(oSloc){
                    oSlocData.SlocList.push({
                        StorageLocation         :   oSloc.StorageLocation,
                        StorageLocationName     :   oSloc.StorageLocationName
                    })
                });
                oSlocModel.setData(oSlocData);
            }
        },

        getSlocList: function(sObject, sPlant){
            var that = this;
            var oParameters = this.buildGetSlocParameters(sObject, sPlant);

            return new Promise(function(resolve, reject){
                that._OrderModel.callFunction("/GetSloc", {
                    method          :   "GET",
                    urlParameters   :   oParameters,
                    success         :   function(oData) {
                        resolve({
                            status      :   that.SuccessStatus,
                            details     :   oData
                        })
                    },
                    error           :   function(oError) {
                        reject({
                            status      :   that.ErrorStatus,
                            details     :   oError
                        })
                    }
                })
            })
        },

        getSlocPCFList: function(sProductionOrder){
            var that = this;
            var oParameters = this.buildGetSlocPCFParameters(sProductionOrder);

            return new Promise(function(resolve, reject){
                that._OrderModel.callFunction("/GetPCFSloc", {
                    method          :   "GET",
                    urlParameters   :   oParameters,
                    success         :   function(oData) {
                        resolve({
                            status      :   that.SuccessStatus,
                            details     :   oData
                        })
                    },
                    error           :   function(oError) {
                        reject({
                            status      :   that.ErrorStatus,
                            details     :   oError
                        })
                    }
                })
            })
        },

        buildGetSlocParameters: function(sObject, sPlant){
            return {
                "Object" : sObject,
                "Plant"  : (!sPlant ? "1100" : sPlant)
            }
        },

        buildGetSlocPCFParameters: function(sProductionOrder){
            return {
                "OrderNo"   : (!sProductionOrder ? "" : sProductionOrder)
            }
        },

        getInitialSlocData: function(){
            return {
                SlocList         :   []
            };
        }
    });
});