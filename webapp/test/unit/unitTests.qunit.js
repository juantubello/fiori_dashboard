/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"dashboard_operativo/dashboard_operativo/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});