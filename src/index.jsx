import React from "react";
import getGraph from "./graph.js";

let fs = require("fs");
import insertCss from "insert-css";
let css = fs.readFileSync(__dirname + "/index.css");
insertCss(css, {prepend: true});

const MOUSE_UP = 0;
const MOUSE_DOWN = 1;

class ForceDirectedGraph extends React.Component {

	constructor(props) {
		super(props);
		this.graph = null;
		this.linkDistance = 200;
		this.resizeListener = this.onResize.bind(this);
		this.cursor = [0, 0];
		this.translation = [0, 0];
		this.movement = [0, 0];
		this.mouseState = MOUSE_UP;
	}

	componentDidMount() {
		window.addEventListener("resize", this.resizeListener);
		let node = React.findDOMNode(this);
		let rect = node.getBoundingClientRect();

		this.graph = getGraph(
			this.props.data, 
			this.props.filteredRelationTypes,
			node, rect.width, rect.height, 
			this.linkDistance, 
			this.props.onEntityClick, 
			this.props.onNodeClick);
	}

	componentWillReceiveProps(nextProps) {
		let node = React.findDOMNode(this);
		let rect = node.getBoundingClientRect();
		if(this.graph) { this.graph.svg.remove(); }
		this.graph = getGraph(
			nextProps.data, 
			nextProps.filteredRelationTypes,
			node, rect.width, rect.height, 
			this.linkDistance, 
			this.props.onEntityClick, 
			this.props.onNodeClick);

	}

	componentWillUnmount() {
		window.removeEventListener("resize", this.resizeListener);
	}


	onWheel(ev) {
		if(this.graph === null) { return; }
		if(ev.deltaY < 0) {
			this.linkDistance += 25;
		} else {
			this.linkDistance -= 25;
		}
		if(this.linkDistance < 100) { this.linkDistance = 100; }
		this.graph.force
			.charge(-this.linkDistance * 2)
			.linkDistance(this.linkDistance).start();
		return ev.preventDefault();
	}

	onResize() {
		if(this.graph === null) { return; }

		let node = React.findDOMNode(this);
		let rect = node.getBoundingClientRect();
		this.graph.svg.attr('width', rect.width).attr('height', rect.height);
		this.graph.force.size([rect.width, rect.height]).resume();
	}

	onMouseDown(ev) {
		this.cursor = [ev.pageX, ev.pageY];
		this.movement = [0, 0];
		this.mouseState = MOUSE_DOWN;
	}

	onMouseMove(ev) {
		if(this.graph === null) { return; }

		if(this.mouseState === MOUSE_DOWN) {
			let movement = [this.cursor[0] - ev.pageX, this.cursor[1] - ev.pageY]
			this.cursor = [ev.pageX, ev.pageY];
			this.translation = [this.translation[0] - movement[0], this.translation[1] - movement[1]];
			this.graph.svg.selectAll("g").attr("transform", "translate(" + this.translation.join(",") + ")")
			return ev.preventDefault();
		}
	}

	onMouseUp(ev) {
		this.mouseState = MOUSE_UP;
	}

	render() {
		return (
			<div className="hire-force-directed-graph"
				onMouseDown={this.onMouseDown.bind(this)} 
				onMouseMove={this.onMouseMove.bind(this)} 
				onMouseUp={this.onMouseUp.bind(this)} 
				onWheel={this.onWheel.bind(this)} style={{width: "100%", height: "100%"}}>
			</div> 
		);
	}
}

ForceDirectedGraph.propTypes = {
	data: React.PropTypes.object,
	filteredRelationTypes: React.PropTypes.array,
	onEntityClick: React.PropTypes.func.isRequired,
	onNodeClick: React.PropTypes.func.isRequired,
};


export default ForceDirectedGraph;

