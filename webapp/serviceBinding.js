function initModel() {
	var sUrl = "/sap/opu/odata/sap/ZSD_AMCR_DASH_OPERATIVO_SRV/";
	var oModel = new sap.ui.model.odata.ODataModel(sUrl, true);
	sap.ui.getCore().setModel(oModel);
}