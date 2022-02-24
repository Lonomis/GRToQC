sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/BusyIndicator",
    "zmmo071107/model/InputModel",
    "zmmo071107/model/OrderModel",
    "zmmo071107/model/SlocModel",
    "zmmo071107/screenManager/ScreenManager",
    "zmmo071107/messagePopover/MessagePopover",
    "zmmo071107/barcodeScanner/BarcodeScanner",
    "zmmo071107/messageStrip/MessageStrip",
    "zmmo071107/helper/MainControllerHelper",
    "zmmo071107/slocDialog/SlocDialog",
    "zmmo071107/formatter/Formatter"
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	/**
	 * @param {typeof sap.ui.core.BusyIndicator} BusyIndicator
	 */
	/**
	 * @param {typeof zmmo071107.model.InputModel} InputModel
	 */
	/**
	 * @param {typeof zmmo071107.model.OrderModel} OrderModel
	 */
	/**
	 * @param {typeof zmmo071107.model.SlocModel} SlocModel
	 */
	/**
	 * @param {typeof zmmo071107.screenManager.ScreenManager} screenManager
	 */
	/**
	 * @param {typeof zmmo071107.messagePopover.MessagePopover} MessagePopover
	 */
	/**
	 * @param {typeof zmmo071107.barcodeScanner.BarcodeScanner} BarcodeScanner
	 */
	/**
	 * @param {typeof zmmo071107.messageStrip.MessageStrip} MessageStrip
	 */
	/**
	 * @param {typeof zmmo071107.helper.MainControllerHelper} MainControllerHelper
	 */
	/**
	 * @param {typeof zmmo071107.slocDialog.SlocDialog} SlocDialog
	 */
	/**
	 * @param {typeof zmmo071107.formatter.Formatter} Formatter
	 */
    function (Controller, BusyIndicator, InputModel,
              OrderModel, SlocModel, ScreenManager, 
              MessagePopover, BarcodeScanner, MessageStrip, 
              MainControllerHelper, SlocDialog, Formatter) {
		"use strict";

		return Controller.extend("zmmo071107.controller.Main", {
            formatter: Formatter,

			onInit: async function () {

                //Instantiate Input Model
                this.InputModel =   new InputModel();
                this.InputModel.setModel(this.getView(), "input");

                //Instantiate Order Model
                this.OrderModel = new OrderModel(this.getView().getModel());

                //Instantiate Storage Location Model
                this.SlocModel = new SlocModel(this.getView().getModel(), this.getView(), "sloc");

                //Instantiate QC Storage Location Model
                this.QCSlocModel = new SlocModel(this.getView().getModel(), this.getView(), "qcsloc");

                //Instantiate ScreenManager
                this.ScreenManager = new ScreenManager(this.getView(), this.getView().byId("contentVBox"), "fragment", this);
                await this.ScreenManager.loadFragment("Init");
                
                //Instantiate Barcode Scanner
                this.BarcodeScanner = new BarcodeScanner();
                this.BarcodeScanner.setStatusModel(this.getView());

                //Instantiate Sloc Dialog
                this.SlocDialog = new SlocDialog(this.InputModel, this.SlocModel);

                //Instantiate QC Sloc Dialog
                this.QCSlocDialog = new SlocDialog(this.InputModel, this.QCSlocModel);

                //Instantiate Message Popover
                this.MessagePopover = new MessagePopover(this.getView());
                this.MessagePopover.setMessageModel(this.getView());

                //Instantiate Message Strip
                this.MessageStrip = new MessageStrip(this.getView().byId("messageStripArea")); 

            },
            
            onBack: function(){
                MainControllerHelper.clearMessages(this.MessageStrip, this.MessagePopover, this.InputModel);
                MainControllerHelper.resetInputValueState();

                switch (this.ScreenManager.getActiveFragment()){
                    case "Init107" :
                        this.InputModel.clearData();
                        this.ScreenManager.loadFragment("Init");
                        break;
                    case "Init114" :
                        this.InputModel.clearData();
                        this.ScreenManager.loadFragment("Init");
                        break;
                    case "ComponentList107" :
                        this.ScreenManager.loadFragment("Init107");
                        break;
                    default:
                        break;                        
                };
                
            },

            onClear107: function(){
                MainControllerHelper.clearMessages(this.MessageStrip, this.MessagePopover, this.InputModel);
                this.InputModel.clearOrderDataQC();
            },

            onNextItem: async function(){
                MainControllerHelper.clearMessages(this.MessageStrip, this.MessagePopover, this.InputModel);

                try {
                    BusyIndicator.show(0);
                    MainControllerHelper.validateRequiredFields(this.MessagePopover);
                    MainControllerHelper.validateOrder(this.InputModel, this.MessagePopover);
                    MainControllerHelper.validateCountField(this.MessagePopover);
                    MainControllerHelper.validateRejectSloc(this.InputModel, this.MessagePopover);
                    MainControllerHelper.validateCountWithComponent(this.InputModel, this.MessagePopover);
                    MainControllerHelper.validateMaximumQty(this.InputModel, this.MessagePopover);

                    MainControllerHelper.getVendorData(this.OrderModel, this.InputModel);
                    this.InputModel.appendComponent();
                    BusyIndicator.hide();
                } catch (oError) {
                    BusyIndicator.hide();
                }
            },
            
            onMessagePopover: function(oEvent){
                var oButtonPopover  =   this.getView().byId("messagePopOverButton");

                this.MessagePopover.openMessagePopover(oButtonPopover, oEvent);
            },

            onScanMainOrder: async function(){
                MainControllerHelper.clearMessages(this.MessageStrip, this.MessagePopover, this.InputModel);
                try{
                    BusyIndicator.show(0);
                    await this.BarcodeScanner.scanOrder(this.InputModel);
                    await this.OrderModel.getMainOrderData(this.InputModel);
                    this.ScreenManager.openInitScreenPerMode(this.InputModel);
                    BusyIndicator.hide();
                } catch(oError){
                    BusyIndicator.hide();
                }
            },

            onScanOrder107: async function(){
                MainControllerHelper.clearMessages(this.MessageStrip, this.MessagePopover, this.InputModel);
                try{
                    BusyIndicator.show(0);
                    await this.BarcodeScanner.scanOrder(this.InputModel);
                    await this.OrderModel.getOrder107(this.InputModel);
                    BusyIndicator.hide();
                } catch(oError){
                    BusyIndicator.hide();
                }
            },

            onGetMainOrderData: async function(){
                MainControllerHelper.clearMessages(this.MessageStrip, this.MessagePopover, this.InputModel);
                MainControllerHelper.getMainOrderData(this.OrderModel, this.InputModel, this.ScreenManager);
            },

            onGetOrder107: async function(){
                MainControllerHelper.clearMessages(this.MessageStrip, this.MessagePopover, this.InputModel);
                MainControllerHelper.getOrder107(this.OrderModel, this.InputModel);
            },

            onSubmitCount: function(){
                MainControllerHelper.clearMessages(this.MessageStrip, this.MessagePopover, this.InputModel);
                MainControllerHelper.validateCountField(this.MessagePopover);
            },

            onReject: function(){
                MainControllerHelper.clearMessages(this.MessageStrip, this.MessagePopover, this.InputModel);
                this.InputModel.toggleReject();
            },

            onScanSloc: async function(){
                MainControllerHelper.clearMessages(this.MessageStrip, this.MessagePopover, this.InputModel);
                
                try{
                    BusyIndicator.show(0);
                    await this.BarcodeScanner.scanSloc(this.InputModel);
                    BusyIndicator.hide();
                } catch (oError) {
                    BusyIndicator.hide();
                }
            },

            onSlocSearch: function(){
                MainControllerHelper.clearMessages(this.MessageStrip, this.MessagePopover, this.InputModel);
                MainControllerHelper.openSlocSearchDialog(this.SlocDialog, this.getView(), "REJECT");
            },

            onSlocSearchQC: function(){
                MainControllerHelper.clearMessages(this.MessageStrip, this.MessagePopover, this.InputModel);
                MainControllerHelper.openSlocSearchDialog(this.QCSlocDialog, this.getView(), "QC");
            },

            onDisplayScannedComponent: function(){
                MainControllerHelper.clearMessages(this.MessageStrip, this.MessagePopover, this.InputModel);
                this.ScreenManager.loadFragment("ComponentList107");
            },

            onSave107: async function(){
                MainControllerHelper.clearMessages(this.MessageStrip, this.MessagePopover, this.InputModel);
                
                try{
                    BusyIndicator.show(0);
                    await this.OrderModel.postGoodsReceiptFence(this.InputModel, this.MessageStrip);
                    this.InputModel.clearData();
                    this.ScreenManager.loadFragment("Init");                    
                    BusyIndicator.hide();
                } catch(oError) {
                    BusyIndicator.hide();
                }
            },

            onSave114: async function(){
                MainControllerHelper.clearMessages(this.MessageStrip, this.MessagePopover, this.InputModel);

                try{
                    BusyIndicator.show(0);
                    MainControllerHelper.validateRequiredFields(this.MessagePopover);
                    await this.OrderModel.getVendorData(this.InputModel);
                    await this.OrderModel.postGoodsReceiptNCR(this.InputModel, this.MessageStrip);
                    this.InputModel.clearData();
                    this.ScreenManager.loadFragment("Init");
                    BusyIndicator.hide();
                } catch(oError) {
                    if (oError.name !== 'ValidateException') {
                        if(JSON.parse(oError.details.responseText).error.code !== "ZMM01/027") {
                            //Vendor not exist
                            this.InputModel.clearData();
                            this.ScreenManager.loadFragment("Init"); 
                        }
                    }
                    BusyIndicator.hide();
                }
            },

            onGetVendorData: function(oEvent){
                MainControllerHelper.clearMessages(this.MessageStrip, this.MessagePopover, this.InputModel);
                MainControllerHelper.getVendorData(this.OrderModel, this.InputModel);
            },
		});
	});
