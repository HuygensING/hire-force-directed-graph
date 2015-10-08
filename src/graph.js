import d3 from "d3-browserify";

export default function getGraph(
	json, filteredRelationTypes = [], graphNode, width = 500, height = 500, linkDistance = 200,
	onEntityClick = function(d) { console.log(d.key, d.type); },
	onNodeClick = function(d) { console.log(d.key, d.type); } ) {
	let svg = d3.select(graphNode)
		.append("svg:svg")
		.attr("width", width)
		.attr("height", height);

	let filteredLinks = json.links.filter((l) => filteredRelationTypes.indexOf(l.type) === -1);

	let links = filteredRelationTypes.length ? filteredLinks : json.links;
	let nodes = filteredRelationTypes.length ? [] : json.nodes;

	for(let i = 0; i < filteredLinks.length; i++) {
		let newSource = filteredLinks[i].source;
		let newTarget = filteredLinks[i].target;
		if(nodes.indexOf(newTarget) < 0) {
			nodes.push(newTarget);
		}
		if(nodes.indexOf(newSource) < 0) {
			nodes.push(newSource);
		}
	}
	

	let force = d3.layout.force()
		.nodes(nodes)
		.links(links)
		.size([width, height])
		.linkDistance(linkDistance)
		.charge(-800)
		.on("tick", tick)
		.start();

	// First clear existing content
	svg.selectAll("*").remove();

	// Per-type markers, as they don't inherit styles.
	svg.append("defs").selectAll("marker")
		.data(json.links.map((l) => l.type))
		.enter().append("marker")
		.attr("id", function(d) { return d; })
		.attr("viewBox", "0 -5 10 10")
		.attr("refX", 15)
		.attr("refY", -1.5)
		.attr("markerWidth", 6)
		.attr("markerHeight", 6)
		.attr("orient", "auto")
		.append("path")
		.attr("d", "M0,-5L10,0L0,5");

	let path = svg.append("g").selectAll("path")
		.data(force.links())
		.enter().append("path")
		.attr("class", function(d) { return "link " + d.type; })
		.attr("marker-end", function(d) { return "url(#" + d.type + ")"; });

	let label = svg.append("g").selectAll("text")
		.data(force.links())
		.enter().append("text")
		.attr("x", function(d) { return (d.source.y + d.target.y) / 2; }) 
		.attr("y", function(d) { return (d.source.x + d.target.x) / 2; }) 
		.attr("text-anchor", "middle")
		.attr("font-style", "italic")
		.text(function(d) {return  d.type;});

	let circle = svg.append("g").selectAll("circle")
		.data(force.nodes())
		.enter().append("circle")
		.attr("r", 6)
		.on("click", onNodeClick)
		.attr("class", function(d) { return "node " + d.type; });

	let text = svg.append("g").selectAll("text")
		.data(force.nodes())
		.enter().append("text")
		.attr("x", 8)
		.attr("y", ".31em")
		.attr("class", function(d) { return "label " + d.type; })
		.on("click", onEntityClick)
		.text(function(d) { return d.label; });


	// Use elliptical arc path  segments to doubly-encode directionality.
	function tick() {
		path.attr("d", linkArc);
		circle.attr("transform", transform);
		text.attr("transform", transform);
		label
			.attr("x", function(d) { return (d.source.x + d.target.x) / 2; }) 
			.attr("y", function(d) { return (d.source.y + d.target.y) / 2; });
	}

	function linkArc(d) {
		let dx = d.target.x - d.source.x,
			dy = d.target.y - d.source.y,
			dr = Math.sqrt(dx * dx + dy * dy) * 4;
		return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
	}

	function transform(d) {
		return "translate(" + d.x + "," + d.y + ")";
	}

	return {svg: svg, force: force};
};
