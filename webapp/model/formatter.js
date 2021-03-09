sap.ui.define([], function () {
	"use strict";

	return {
		DescStatus: function (iValue) {
			if (iValue == "01") {
				return "Listo";
			} else if (iValue == "02") {
				return "Pendiente";
			} else if (iValue == "03") {
				return "En Proceso";
			}

		},

		setColorText: function (status) {
			return "<p style='color:" + this.formatter.getColorByStatusId(status) + ";'>" + status + "<p>";
		},

		getColorByStatusId: function (statusId) {
			switch (statusId) {
			case "En planificación de necesidades":
				return "#5899DA";
			case "Planificación de necesidades finalizada":
				return "#E8743B";
			case "Registro":
				return "#19A979";
			case "Inicio carga":
				return "#ED4A7B";
			case "Fin carga":
				return "#945ECF";
			case "Despacho de expedición":
				return "#13A4B4";
			case "Inicio de transporte":
				return "#525DF4";
			case "Fin de transporte":
				return "#BF399E";
			default:
				return "6666FF";
			}
		},

		StateStatus: function (iValue) {
			if (iValue == "01") {
				return "Success";
			} else if (iValue == "02") {
				return "Error";
			} else if (iValue == "03") {
				return "Warning";
			}
		}

	};
});