sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/Device",
	"sap/ui/model/Filter",
	"sap/ui/model/Sorter",
	"sap/ui/model/json/JSONModel",
	"sap/m/Menu",
	"sap/m/MenuItem",
	'sap/ui/export/library',
	'sap/ui/export/Spreadsheet',
	"sap/ui/core/Fragment",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/FilterType",
	"../model/formatter"
], function (Controller, Device, Filter, Sorter, JSONModel, Menu, MenuItem, exportLibrary, Spreadsheet, Fragment, FilterOperator,
	FilterType, formatter) {
	"use strict";
	/* eslint-disable no-console */

	var timerFragmentText;
	var firstDisplay = false;
	var url = "/sap/opu/odata/sap/ZSD_AMCR_DASH_OPERATIVO_SRV/";
	var EdmType = exportLibrary.EdmType;
	var filtroPuestos = [];
	var arrColores = [
		"#5899DA", "#E8743B", "#19A979", "#ED4A7B", "#945ECF",
		"#13A4B4", "#525DF4", "#BF399E", "#6C8893", "#EE6868",
		"#2F6497", "#FF6633", "#FFB399", "#FF33FF", "#FFFF99",
		"#00B3E6", "#E6B333", "#3366E6", "#999966", "#99FF99",
		"#80B300", "#809900", "#E6B3B3", "#6680B3", "#66991A",
		"#FF99E6", "#CCFF1A", "#FF1A66", "#E6331A", "#33FFCC",
		"#66994D", "#B366CC", "#4D8000", "#B33300", "#CC80CC",
		"#66664D", "#991AFF", "#E666FF", "#4DB3FF", "#1AB399",
		"#E666B3", "#33991A", "#CC9999", "#B3B31A", "#00E680",
		"#4D8066", "#809980", "#E6FF80", "#80CF89", "#999933",
		"#FF3380", "#CCCC00", "#66E64D", "#4D80CC", "#9900B3",
		"#E64D66", "#4DB380", "#FF4D4D", "#99E6E6", "#6666FF"
	];

	function getData(path) {
		return new Promise(function (resolve, reject) {
			var oModel = new sap.ui.model.odata.ODataModel(url, {
				json: true,
				loadMetadataAsync: true
			});
			oModel.read(path, {
				success: function (res) {
					var oData = res;
					resolve(oData);
				},
				error: function () {}
			});
		});
	}

	function generateStatusPlanCargaPopOver(selection) {

		var table = new sap.m.Table({});

		getData("/transportesSet").then(function (odata) {
			var filtro;
			var colorPopUp;
			if (selection[0].data.DescripcionAlistado === "Listo") {
				filtro = "01";
				colorPopUp = "#3fa45b"; //Verde
			} else if (selection[0].data.DescripcionAlistado === "Pendiente") {
				filtro = "02";
				colorPopUp = "#dc0d0e"; //Rojo
			} else if (selection[0].data.DescripcionAlistado === "EnProceso") {
				filtro = "03";
				colorPopUp = "#ffde08"; //Amarillo
			}

			var arrTransportes = [];

			for (var i = 0; i < odata.results.length; i++) {

				if (odata.results[i].StatusPlanCarga === filtro) {
					arrTransportes.push(odata.results[i].Transporte);
				}
			}

			var aColumnData = [{
				columnId: "Transportes - " + selection[0].data.DescripcionAlistado
			}];

			// Creacion de objeto JSON para el bind de la tabla pop-up
			var jsonArr = [];

			for (var j = 0; j < arrTransportes.length; j++) {
				jsonArr.push({
					Transporte: arrTransportes[j]
				});
			}

			var popModel = new sap.ui.model.json.JSONModel();
			popModel.setData({
				columns: aColumnData,
				rows: jsonArr
			});

			table.setModel(popModel);

			table.bindAggregation("columns", "/columns", function (index, context) {
				return new sap.m.Column({
					header: new sap.m.Label({
						text: context.getObject().columnId
					}),
					hAlign: "Center",
					footer: new sap.ui.core.Icon({
						src: "sap-icon://color-fill",
						color: colorPopUp
					})
				});
			});

			table.bindItems("/rows", function (index, context) {
				var obj = context.getObject();
				var row = new sap.m.ColumnListItem();

				for (var k in obj) {
					row.addCell(new sap.m.Text({
						text: obj[k]
					}));
				}
				return row;
			});
		});
		return table;
	}

	function generateAlistadoChoferesPopOver(selection) {

		var table = new sap.m.Table({});

		getData("/transportesChoferesSet").then(function (odata) {
			var filtro;
			var colorPopUp;

			if (selection[0].data.Listo) {
				filtro = "01";
				colorPopUp = "#3fa45b"; //Verde
			} else if (selection[0].data.Pendiente) {
				filtro = "02";
				colorPopUp = "#dc0d0e"; //Rojo
			} else if (selection[0].data.EnProceso) {
				filtro = "03";
				colorPopUp = "#ffde08"; //Amarillo
			}

			var arrTransportes = [];

			for (var i = 0; i < odata.results.length; i++) {

				if (odata.results[i].Estado === filtro) {
					arrTransportes.push(odata.results[i].Transporte);
				}
			}

			var aColumnData = [{
				columnId: "Proveedor - " + selection[0].data.Proveedor
			}];

			// Creacion de objeto JSON para el bind de la tabla pop-up
			var jsonArr = [];

			for (var j = 0; j < arrTransportes.length; j++) {
				jsonArr.push({
					Transporte: arrTransportes[j]
				});
			}

			var popModel = new sap.ui.model.json.JSONModel();
			popModel.setData({
				columns: aColumnData,
				rows: jsonArr
			});

			table.setModel(popModel);

			table.bindAggregation("columns", "/columns", function (index, context) {
				return new sap.m.Column({
					header: new sap.m.Label({
						text: context.getObject().columnId
					}),
					hAlign: "Center",
					footer: new sap.ui.core.Icon({
						src: "sap-icon://color-fill",
						color: colorPopUp
					})
				});
			});

			table.bindItems("/rows", function (index, context) {
				var obj = context.getObject();
				var row = new sap.m.ColumnListItem();

				for (var k in obj) {
					row.addCell(new sap.m.Text({
						text: obj[k]
					}));
				}
				return row;
			});
		});
		return table;
	}

	function msToHMS(ms) {
		// 1- Convert to seconds:
		var seconds = ms / 1000;

		// 2- Extract minutes:
		var minutes = parseInt(seconds / 60, 10); // 60 seconds in 1 minute

		// 3- Keep only seconds not extracted to minutes:
		seconds = seconds % 60;

		var len = seconds.toString().length;
		if (len < 2) {
			seconds = "0" + seconds;
		}
		return minutes + ":" + seconds;
	}

	function timerCountDown(context) {
		// var refreshTime = 900000;
		var refreshTime = 900000;
		//	var timerFragment = sap.ui.xmlfragment("timerFrag",
		//		"zdashboardgcial.zdashboardgcial.view.fragment.Timer",
		//			context.getView().getController() // associate controller with the fragment            
		//		);
		//	var timerLabel = context.getView().addDependent(timerFragment);

		setInterval(function () {
			context.byId("timer").setText(msToHMS(refreshTime));
			refreshTime -= 1000;
			if (refreshTime === 0) {
				// refreshTime = 900000;
				refreshTime = 900000;
				//			if (firstDisplay) {
				//				context.getFilters();
				//				BusyIndicator.show();
				context.getView().updateBindings();
				console.log("Consulta al backend OK");
				//			}

			}
		}, 1000); //1 S.
	}

	return Controller.extend("dashboard_operativo.dashboard_operativo.controller.View1", {

		oFragments: {},

		formatter: formatter,

		onInit: function () {
			this._mViewSettingsDialogs = {};

			var that = this;
			timerCountDown(that);

			this.mGroupFunctions = {
				StatusPlanCarga: function (oContext) {
					var name = oContext.getProperty("StatusPlanCarga");
					var outText;

					if (name === "01") {
						outText = "Listo";
					} else if (name === "02") {
						outText = "Pendiente";
					} else if (name === "03") {
						outText = "EnProceso";
					}

					return {
						key: name,
						text: outText
					};
				},
				Status: function (oContext) {
					var name = oContext.getProperty("Sttrg");
					var outText;

					if (name === "01") {
						outText = "Listo";
					} else if (name === "02") {
						outText = "Pendiente";
					} else if (name === "03") {
						outText = "EnProceso";
					}

					return {
						key: name,
						text: outText
					};
				}
			};

			var flag;

			this.renderDonutChartAllEvents("alistado", flag);
			flag = "X";
			this.renderDonutChartAllEvents("estados", flag);
			this.renderStackedColumn("transportistas", flag);

			this.byId("gridHeader").setVisible(true);
			this.byId("tablaDatosGrafico").setVisible(false);

			var graficoAlistado = this.getView().byId("alistado");
			var graficoEstados = this.getView().byId("estados");
			var graficoTransportistas = this.getView().byId("transportistas");
			var tablaSalida = this.getView().byId("tablaDatosGrafico");

			// Actualizamos los datos cada 15 minutos
			setInterval(function () {

				graficoAlistado.getModel().refresh(true);
				graficoEstados.getModel().refresh(true);
				graficoTransportistas.getModel().refresh(true);
				tablaSalida.getModel().refresh(true);

				console.log("Consulta al backend OK");
			}, 900000); //15 Min.					
		},
		onExit: function () {
			var oDialogKey,
				oDialogValue;

			for (oDialogKey in this._mViewSettingsDialogs) {
				oDialogValue = this._mViewSettingsDialogs[oDialogKey];

				if (oDialogValue) {
					oDialogValue.destroy();
				}
			}
		},
		onTableFilter: function () {
			// 			for (var m = 0; m < alistadosData.results.length; m++) {
			// 	dicAlistado.push({
			// 		estadoKey: alistadosData.results[m].ValorEstado,
			// 		descripcion: alistadosData.results[m].DescEstado,
			// 		color: arrColores[m]
			// 	});
			// }
		},
		
		onPress: function () {
			var tabla = this.byId("tablaDatosGrafico").getVisible();

			if (tabla) {
				this.byId("tablaDatosGrafico").setVisible(false);
				this.byId("gridHeader").setVisible(true);
			} else {
				this.byId("tablaDatosGrafico").setVisible(true);
				this.byId("gridHeader").setVisible(false);
			}

			// if (!this._oTable) {
			// 	this._oTable = this.byId('chartContainerContentTable');
			// }
			// var oTable = this._oTable;
			// var oRowBinding = oTable.getBinding('items');
			// var oFilter = new Filter({

			// 	filters: [
			// 		new sap.ui.model.Filter({
			// 			path: "Puesto",
			// 			operator: sap.ui.model.FilterOperator.EQ,
			// 			value1: "CR02"
			// 		})
			// 	]

			// });

			// oRowBinding.filter(oFilter, FilterType.Application);

		},
		// Instanciamos el dialog fragment
		createViewSettingsDialog: function (sFragmentName) {
			var oPromise = null;
			if (!this.oFragments[sFragmentName]) {
				oPromise = Fragment.load({
					name: "dashboard_operativo.dashboard_operativo.fragments." + sFragmentName,
					controller: this
				}).then(function (oFragment) {
					this.oFragments[sFragmentName] = oFragment;
					this.getView().addDependent(this.oFragments[sFragmentName]);
					return oFragment;
				}.bind(this));
			} else {
				oPromise = Promise.resolve(this.oFragments[sFragmentName]);
			}
			return oPromise;

			// var oDialog = this._mViewSettingsDialogs[sDialogFragmentName];

			// if (!oDialog) {
			// 	oDialog = sap.ui.xmlfragment(sDialogFragmentName, this);
			// 	this._mViewSettingsDialogs[sDialogFragmentName] = oDialog;

			// 	if (Device.system.desktop) {
			// 		oDialog.addStyleClass("sapUiSizeCompact");
			// 	}
			// }
			// return oDialog;
		},
		// Implementamos el SORT en la tabla 
		handleSortButtonPressed: function () {
			this.createViewSettingsDialog("SortDialog").then(function (oFragment) {
				oFragment.open();
			}.bind(this));

		},
		handleSortDialogConfirm: function (oEvent) {
			var oTable = this.byId("chartContainerContentTable"),
				mParams = oEvent.getParameters(),
				oBinding = oTable.getBinding("items"),
				sPath,
				bDescending,
				aSorters = [];

			sPath = mParams.sortItem.getKey();
			bDescending = mParams.sortDescending;
			aSorters.push(new Sorter(sPath, bDescending));
			oBinding.sort(aSorters);
		},

		// Implementamos el FILTER en la tabla 
		handleFilterButtonPressed: function () {

			// this.createViewSettingsDialog("dashboard_operativo.dashboard_operativo.fragments.FilterDialog").open();

			this.createViewSettingsDialog("FilterDialog").then(function (oFragment) {
				oFragment.setModel(this.getView().getModel(), "transport");
				oFragment.open();
			}.bind(this));

		},

		handleRefeshPressed: function (oEvent) {
			var oTable = this.byId("chartContainerContentTable");
			oTable.getBinding("items").refresh();
		},

		handleFilterDialogConfirm: function (oEvent) {
			var oTable = this.byId("chartContainerContentTable"),
				mParams = oEvent.getParameters(),
				oBinding = oTable.getBinding("items"),
				aFilters = [];

			mParams.filterItems.forEach(function (oItem) {
				var aSplit = oItem.getKey().split("___"),
					sPath = aSplit[0],
					sOperator = aSplit[1],
					sValue1 = aSplit[2],
					sValue2 = aSplit[3],
					oFilter = new Filter(sPath, sOperator, sValue1, sValue2);
				aFilters.push(oFilter);
			});
			oBinding.filter(aFilters);
			this.byId("vsdFilterBar").setVisible(aFilters.length > 0);
			this.byId("vsdFilterLabel").setText(mParams.filterString);
		},

		onDownload: function () {
			var aCols, oRowBinding, oSettings, oSheet, oTable;

			if (!this._oTable) {
				this._oTable = this.byId('chartContainerContentTable');
			}

			oTable = this._oTable;
			oRowBinding = oTable.getBinding('items');

			aCols = this.createColumnConfig();

			var oModel = oRowBinding.getModel();

			oSettings = {
				workbook: {
					columns: aCols,
					hierarchyLevel: 'Level'
				},
				dataSource: {
					type: 'odata',
					dataUrl: oRowBinding.getDownloadUrl ? oRowBinding.getDownloadUrl() : null,
					serviceUrl: this._sServiceUrl,
					headers: oModel.getHeaders ? oModel.getHeaders() : null,
					count: oRowBinding.getLength ? oRowBinding.getLength() : null,
					useBatch: true // Default for ODataModel V2
				},
				fileName: 'Dashboard Operativo.xlsx',
				worker: false // We need to disable worker because we are using a MockServer as OData Service
			};

			oSheet = new Spreadsheet(oSettings);
			oSheet.build().finally(function () {
				oSheet.destroy();
			});
		},

		createColumnConfig: function () {
			var aCols = [];

			aCols.push({
				label: 'Plan de Carga',
				property: ['Transporte'],
				type: EdmType.String
			});

			aCols.push({
				label: 'Puesto',
				property: ['Puesto'],
				type: EdmType.String
			});

			aCols.push({
				label: 'Status Fiori',
				property: ['StatusPlanCarga'],
				type: EdmType.String
			});

			aCols.push({
				label: 'Descripción Status',
				property: ['Status'],
				type: EdmType.String
			});

			aCols.push({
				label: 'Transportista',
				property: ['Agservtran'],
				type: EdmType.String
			});

			aCols.push({
				label: 'Chapa Camión',
				property: ['Chapacamion'],
				type: EdmType.String
			});

			aCols.push({
				label: 'Chapa Semi',
				property: ['Chapasemi'],
				type: EdmType.String
			});

			aCols.push({
				label: 'Nombre Transportista',
				property: ['Nombre'],
				type: EdmType.String
			});

			aCols.push({
				label: 'DNI Transportista',
				property: ['Dni'],
				type: EdmType.String
			});

			aCols.push({
				label: 'Creación',
				property: ['Creacion'],
				type: EdmType.String
			});

			aCols.push({
				label: 'Fecha Ultimo Status',
				property: ['FechaUltStatus'],
				type: EdmType.String
			});

			aCols.push({
				label: 'Hora Ultimo Status',
				property: ['HoraUltStatus'],
				type: EdmType.String
			});

			return aCols;
		},

		// Implementamos el GRUOP en la tabla
		handleGroupButtonPressed: function () {
			this.createViewSettingsDialog("GroupDialog").then(function (oFragment) {
				oFragment.open();
			}.bind(this));
		},
		handleGroupDialogConfirm: function (oEvent) {
			var oTable = this.byId("chartContainerContentTable"),
				mParams = oEvent.getParameters(),
				oBinding = oTable.getBinding("items"),
				sPath,
				bDescending,
				vGroup,
				aGroups = [];

			if (mParams.groupItem) {
				sPath = mParams.groupItem.getKey();
				bDescending = mParams.groupDescending;
				vGroup = this.mGroupFunctions[sPath];
				aGroups.push(new Sorter(sPath, bDescending, vGroup));
				oBinding.sort(aGroups);

			} else if (this.groupReset) {
				oBinding.sort();
				this.groupReset = false;
			}
		},

		// Gráfico de COLUMNAS APILADAS
		renderStackedColumn: function (id) {

			var oVizFrame = this.getView().byId(id);
			var oModel = new sap.ui.model.odata.ODataModel(url, {
				json: true,
				loadMetadataAsync: true
			});

			var oDatasetChoferes = new sap.viz.ui5.data.FlattenedDataset({
				dimensions: [{
					name: "Proveedor",
					value: "{Nombre}"
				}],
				measures: [{
					name: "Listo",
					value: "{Listo}"
				}, {
					name: "Pendiente",
					value: "{Pendiente}"
				}, {
					name: "EnProceso",
					value: "{Proceso}"
				}],

				data: {
					path: "/alistadoChoferesSet"
				}
			});

			oVizFrame.setDataset(oDatasetChoferes);
			oVizFrame.setModel(oModel);
			oVizFrame.setVizType("stacked_column");

			oVizFrame.setVizProperties({
				interaction: {
					selectability: {
						mode: "single"
					}
				},
				plotArea: {
					colorPalette: ["#3fa45b", "#dc0d0e", "#ffde08"],
					dataLabel: {
						visible: true,
						showTotal: true,
						type: "value"
					},
					drawingEffect: "glossy"
				},
				legendGroup: {
					layout: {
						position: "left"
					}
				}
			});

			var feedValueAxisAlistado = new sap.viz.ui5.controls.common.feeds.FeedItem({
					"uid": "valueAxis",
					"type": "Measure",
					"values": ["Listo", "Pendiente", "EnProceso"]
				}),
				feedCategoryAxisAlistado = new sap.viz.ui5.controls.common.feeds.FeedItem({
					"uid": "categoryAxis",
					"type": "Dimension",
					"values": ["Proveedor"]
				});
			oVizFrame.addFeed(feedValueAxisAlistado);
			oVizFrame.addFeed(feedCategoryAxisAlistado);

			var oPopOver = this.getView().byId("idPopOver1");
			oPopOver.connect(oVizFrame.getVizUid());
			//----------------------------------------------------------------------------------
			//----------------------------------------------------------------------------------
			oPopOver.setCustomDataControl(function (data) {

					var seleccion = oVizFrame.vizSelection(); // Recuperamos los puntos seleccionados
					console.log(seleccion);
					var popUpTable = generateAlistadoChoferesPopOver(seleccion);
					return popUpTable;

				}.bind(this) // Estamos "pasando el this" de la vista al interior de la función...
			);

		},

		// Gráfico de DONAS
		renderDonutChartAllEvents: function (id, flag) {
				var oVizFrame = this.getView().byId(id);
				var oModel = new sap.ui.model.odata.ODataModel(url, {
					json: true,
					loadMetadataAsync: true
				});

				if (flag === undefined) {
					var oDatasetAlistado = new sap.viz.ui5.data.FlattenedDataset({
						dimensions: [{
							name: "DescripcionAlistado",
							value: "{Descripcion}"
						}],
						measures: [{
							name: "CantidadAlistado",
							value: "{Cantidad}"
						}],

						data: {
							path: "/alistadoSet"
						}
					});

					oVizFrame.setDataset(oDatasetAlistado);
					oVizFrame.setModel(oModel);
					oVizFrame.setVizType("donut");

					oVizFrame.setVizProperties({
						plotArea: {
							colorPalette: ["#3fa45b", "#dc0d0e", "#ffde08"],
							dataLabel: {
								visible: true,
								showTotal: true,
								type: "value"
							},
							drawingEffect: "glossy"
						},
						legend: {
							isScrollable: true
						},
						legendGroup: {
							layout: {
								position: "left"
							}
						}
					});

					var feedValueAxisAlistado = new sap.viz.ui5.controls.common.feeds.FeedItem({
							"uid": "size",
							"type": "Measure",
							"values": ["CantidadAlistado"]
						}),
						feedCategoryAxisAlistado = new sap.viz.ui5.controls.common.feeds.FeedItem({
							"uid": "color",
							"type": "Dimension",
							"values": ["DescripcionAlistado"]
						});

					oVizFrame.addFeed(feedValueAxisAlistado);
					oVizFrame.addFeed(feedCategoryAxisAlistado);

					// POP-OVER custom con listado de transportes según estado
					var oPopOver = this.getView().byId("idPopOver2");
					oPopOver.connect(oVizFrame.getVizUid());

					oPopOver.setCustomDataControl(function (data) {

							var seleccion = oVizFrame.vizSelection(); // Recuperamos los puntos seleccionados
							var popUpTable = generateStatusPlanCargaPopOver(seleccion);
							return popUpTable;

						}.bind(this) // Estamos "pasando el this" de la vista al interior de la función...
					);

				} else {

					var oDatasetEstado = new sap.viz.ui5.data.FlattenedDataset({
						dimensions: [{
							name: "DescEstado",
							value: "{DescEstado}"
						}],
						measures: [{
							name: "Cantidad",
							value: "{Cantidad}"
						}],

						data: {
							path: "/EstadosSet"
						}
					});

					oVizFrame.setDataset(oDatasetEstado);
					oVizFrame.setModel(oModel);
					oVizFrame.setVizType("donut");

					oVizFrame.setVizProperties({
						plotArea: {
							dataLabel: {
								visible: true,
								showTotal: true,
								type: "value"
							},
							drawingEffect: "glossy"
						},
						legend: {
							isScrollable: true
						},
						legendGroup: {
							layout: {
								position: "left"
							}
						}
					});

					var feedValueAxisEstado = new sap.viz.ui5.controls.common.feeds.FeedItem({
							"uid": "size",
							"type": "Measure",
							"values": ["Cantidad"]
						}),
						feedCategoryAxisEstado = new sap.viz.ui5.controls.common.feeds.FeedItem({
							"uid": "color",
							"type": "Dimension",
							"values": ["DescEstado"]
						});

					oVizFrame.addFeed(feedValueAxisEstado);
					oVizFrame.addFeed(feedCategoryAxisEstado);

					var oPopOver2 = this.getView().byId("idPopOver3");
					oPopOver2.connect(oVizFrame.getVizUid());

					oPopOver2.setCustomDataControl(function (data) {

						var dicAlistado = [];
						var arrTransportes = [];
						var jsonArr = [];
						var indice;
						var popUpTable = new sap.m.Table({});
						var seleccion2 = oVizFrame.vizSelection(); // Recuperamos los puntos seleccionados

						getData("/EstadosSet").then(function (alistadosData) {

							var aColumnData = [{
								columnId: seleccion2[0].data.DescEstado
							}];

							for (var m = 0; m < alistadosData.results.length; m++) {
								dicAlistado.push({
									estadoKey: alistadosData.results[m].ValorEstado,
									descripcion: alistadosData.results[m].DescEstado,
									color: arrColores[m]
								});
							}
							getData("/transportesSet").then(function (transportes) {
								for (var o = 0; o < dicAlistado.length; o++) {
									if (dicAlistado[o].descripcion === seleccion2[0].data.DescEstado) {
										indice = o;
										for (var i = 0; i < transportes.results.length; i++) {
											if (transportes.results[i].Sttrg === dicAlistado[o].estadoKey) {
												arrTransportes.push(transportes.results[i].Transporte);
											}
										}
									}
								}
								for (var j = 0; j < arrTransportes.length; j++) {
									jsonArr.push({
										Transporte: arrTransportes[j]
									});
								}
							}).then(function () {
								var popModel = new sap.ui.model.json.JSONModel();
								popModel.setData({
									columns: aColumnData,
									rows: jsonArr
								});
								popUpTable.setModel(popModel);
								popUpTable.bindAggregation("columns", "/columns", function (index, context) {
									return new sap.m.Column({
										header: new sap.m.Label({
											text: context.getObject().columnId
										}),
										hAlign: "Center",
										footer: new sap.ui.core.Icon({
											src: "sap-icon://color-fill",
											color: arrColores[indice]
										})
									});
								});
								popUpTable.bindItems("/rows", function (index, context) {
									var obj = context.getObject();
									var row = new sap.m.ColumnListItem();
									for (var k in obj) {
										row.addCell(new sap.m.Text({
											text: obj[k]
										}));
									}
									return row;
								});
							});
						});
						return popUpTable;
					}.bind(this));
				}
			}
			// ,mcHandleSelectionChange: function (oEvent) {
			// 	var changedItem = oEvent.getParameter("changedItem");
			// 	var isSelected = oEvent.getParameter("selected");

		// 	var state = "Selected";
		// 	if (!isSelected) {
		// 		state = "Deselected";
		// 	}

		// 	console.log("Event 'selectionChange': " + state + " '" + changedItem.getText() + "'", {
		// 		width: "auto"
		// 	});
		// },

		// mcHandleSelectionFinish: function (oEvent) {
		// 	var selectedItems = oEvent.getParameter("selectedItems");
		// 	var arr = [];
		// 	for (var i = 0; i < selectedItems.length; i++) {
		// 		arr.push(selectedItems[i].getText());
		// 	}
		// 	filtroPuestos = arr;
		// 	console.log(filtroPuestos);
		// }

	});
});