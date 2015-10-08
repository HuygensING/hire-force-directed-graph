(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.ForceDirectedGraph = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports["default"] = getGraph;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _d3 = _dereq_("d3");

var _d32 = _interopRequireDefault(_d3);

function getGraph(json, filteredRelationTypes, graphNode) {
	if (filteredRelationTypes === undefined) filteredRelationTypes = [];
	var width = arguments.length <= 3 || arguments[3] === undefined ? 500 : arguments[3];
	var height = arguments.length <= 4 || arguments[4] === undefined ? 500 : arguments[4];
	var linkDistance = arguments.length <= 5 || arguments[5] === undefined ? 200 : arguments[5];
	var onEntityClick = arguments.length <= 6 || arguments[6] === undefined ? function (d) {
		console.log(d.key, d.type);
	} : arguments[6];
	var onNodeClick = arguments.length <= 7 || arguments[7] === undefined ? function (d) {
		console.log(d.key, d.type);
	} : arguments[7];

	var svg = _d32["default"].select(graphNode).append("svg:svg").attr("width", width).attr("height", height);

	var filteredLinks = json.links.filter(function (l) {
		return filteredRelationTypes.indexOf(l.type) === -1;
	});

	var links = filteredRelationTypes.length ? filteredLinks : json.links;
	var nodes = filteredRelationTypes.length ? [] : json.nodes;

	for (var i = 0; i < filteredLinks.length; i++) {
		var newSource = filteredLinks[i].source;
		var newTarget = filteredLinks[i].target;
		if (nodes.indexOf(newTarget) < 0) {
			nodes.push(newTarget);
		}
		if (nodes.indexOf(newSource) < 0) {
			nodes.push(newSource);
		}
	}

	var force = _d32["default"].layout.force().nodes(nodes).links(links).size([width, height]).linkDistance(linkDistance).charge(-800).on("tick", tick).start();

	// First clear existing content
	svg.selectAll("*").remove();

	// Per-type markers, as they don't inherit styles.
	svg.append("defs").selectAll("marker").data(json.links.map(function (l) {
		return l.type;
	})).enter().append("marker").attr("id", function (d) {
		return d;
	}).attr("viewBox", "0 -5 10 10").attr("refX", 15).attr("refY", -1.5).attr("markerWidth", 6).attr("markerHeight", 6).attr("orient", "auto").append("path").attr("d", "M0,-5L10,0L0,5");

	var path = svg.append("g").selectAll("path").data(force.links()).enter().append("path").attr("class", function (d) {
		return "link " + d.type;
	}).attr("marker-end", function (d) {
		return "url(#" + d.type + ")";
	});

	var label = svg.append("g").selectAll("text").data(force.links()).enter().append("text").attr("x", function (d) {
		return (d.source.y + d.target.y) / 2;
	}).attr("y", function (d) {
		return (d.source.x + d.target.x) / 2;
	}).attr("text-anchor", "middle").attr("font-style", "italic").text(function (d) {
		return d.type;
	});

	var circle = svg.append("g").selectAll("circle").data(force.nodes()).enter().append("circle").attr("r", 6).on("click", onNodeClick).attr("class", function (d) {
		return "node " + d.type;
	});

	var text = svg.append("g").selectAll("text").data(force.nodes()).enter().append("text").attr("x", 8).attr("y", ".31em").attr("class", function (d) {
		return "label " + d.type;
	}).on("click", onEntityClick).text(function (d) {
		return d.label;
	});

	// Use elliptical arc path  segments to doubly-encode directionality.
	function tick() {
		path.attr("d", linkArc);
		circle.attr("transform", transform);
		text.attr("transform", transform);
		label.attr("x", function (d) {
			return (d.source.x + d.target.x) / 2;
		}).attr("y", function (d) {
			return (d.source.y + d.target.y) / 2;
		});
	}

	function linkArc(d) {
		var dx = d.target.x - d.source.x,
		    dy = d.target.y - d.source.y,
		    dr = Math.sqrt(dx * dx + dy * dy) * 4;
		return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
	}

	function transform(d) {
		return "translate(" + d.x + "," + d.y + ")";
	}

	return { svg: svg, force: force };
}

;
module.exports = exports["default"];

},{"d3":"d3"}],2:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = _dereq_("react");

var _react2 = _interopRequireDefault(_react);

var _graphJs = _dereq_("./graph.js");

var _graphJs2 = _interopRequireDefault(_graphJs);

var MOUSE_UP = 0;
var MOUSE_DOWN = 1;

var ForceDirectedGraph = (function (_React$Component) {
	_inherits(ForceDirectedGraph, _React$Component);

	function ForceDirectedGraph(props) {
		_classCallCheck(this, ForceDirectedGraph);

		_get(Object.getPrototypeOf(ForceDirectedGraph.prototype), "constructor", this).call(this, props);
		this.graph = null;
		this.linkDistance = 200;
		this.resizeListener = this.onResize.bind(this);
		this.cursor = [0, 0];
		this.translation = [0, 0];
		this.movement = [0, 0];
		this.mouseState = MOUSE_UP;
	}

	_createClass(ForceDirectedGraph, [{
		key: "componentDidMount",
		value: function componentDidMount() {
			window.addEventListener("resize", this.resizeListener);
			var node = _react2["default"].findDOMNode(this);
			var rect = node.getBoundingClientRect();

			this.graph = (0, _graphJs2["default"])(this.props.data, this.props.filteredRelationTypes, node, rect.width, rect.height, this.linkDistance, this.props.onEntityClick, this.props.onNodeClick);
		}
	}, {
		key: "componentWillReceiveProps",
		value: function componentWillReceiveProps(nextProps) {
			var node = _react2["default"].findDOMNode(this);
			var rect = node.getBoundingClientRect();
			if (this.graph) {
				this.graph.svg.remove();
			}
			this.graph = (0, _graphJs2["default"])(nextProps.data, nextProps.filteredRelationTypes, node, rect.width, rect.height, this.linkDistance, this.props.onEntityClick, this.props.onNodeClick);
		}
	}, {
		key: "componentWillUnmount",
		value: function componentWillUnmount() {
			window.removeEventListener("resize", this.resizeListener);
		}
	}, {
		key: "onWheel",
		value: function onWheel(ev) {
			if (this.graph === null) {
				return;
			}
			if (ev.deltaY < 0) {
				this.linkDistance += 100;
			} else {
				this.linkDistance -= 100;
			}
			this.graph.force.charge(-this.linkDistance * 2).linkDistance(this.linkDistance).start();
			return ev.preventDefault();
		}
	}, {
		key: "onResize",
		value: function onResize() {
			if (this.graph === null) {
				return;
			}

			var node = _react2["default"].findDOMNode(this);
			var rect = node.getBoundingClientRect();
			this.graph.svg.attr('width', rect.width).attr('height', rect.height);
			this.graph.force.size([rect.width, rect.height]).resume();
		}
	}, {
		key: "onMouseDown",
		value: function onMouseDown(ev) {
			this.cursor = [ev.pageX, ev.pageY];
			this.movement = [0, 0];
			this.mouseState = MOUSE_DOWN;
		}
	}, {
		key: "onMouseMove",
		value: function onMouseMove(ev) {
			if (this.graph === null) {
				return;
			}

			if (this.mouseState === MOUSE_DOWN) {
				var movement = [this.cursor[0] - ev.pageX, this.cursor[1] - ev.pageY];
				this.cursor = [ev.pageX, ev.pageY];
				this.translation = [this.translation[0] - movement[0], this.translation[1] - movement[1]];
				this.graph.svg.selectAll("g").attr("transform", "translate(" + this.translation.join(",") + ")");
				return ev.preventDefault();
			}
		}
	}, {
		key: "onMouseUp",
		value: function onMouseUp(ev) {
			this.mouseState = MOUSE_UP;
		}
	}, {
		key: "render",
		value: function render() {
			return _react2["default"].createElement("div", { className: "hire-force-directed-graph",
				onMouseDown: this.onMouseDown.bind(this),
				onMouseMove: this.onMouseMove.bind(this),
				onMouseUp: this.onMouseUp.bind(this),
				onWheel: this.onWheel.bind(this), style: { width: "100%", height: "100%" } });
		}
	}]);

	return ForceDirectedGraph;
})(_react2["default"].Component);

ForceDirectedGraph.propTypes = {
	data: _react2["default"].PropTypes.object,
	filteredRelationTypes: _react2["default"].PropTypes.array,
	onEntityClick: _react2["default"].PropTypes.func.isRequired,
	onNodeClick: _react2["default"].PropTypes.func.isRequired
};

exports["default"] = ForceDirectedGraph;
module.exports = exports["default"];

},{"./graph.js":1,"react":"react"}]},{},[2])(2)
});