var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

var color = d3.scaleOrdinal(d3.schemeCategory20);

var format = d3.format(",d");

var treemap = d3.treemap()
    .size([width, height])
    .round(true)
    .padding(1);

// The stratify object
var stratify = d3.stratify()
    .parentId(function (d) {
        return d.path.substring(0, d.path.lastIndexOf("\\"));
    })
    .id(function (d) {
        return d.path;
    });

d3.csv("data.csv", function (d) {
    d.size = +d.size; // Make it a number
    return d;
}, function (error, data) {
    if (error) throw error;

    var root = stratify(data)
        .sum(function (d) {
            return +d.size;
        })
        .sort(function (a, b) {
            return b.height - a.height || b.value - a.value;
        });


    treemap(root);

    var cell = svg.selectAll("a")
        .data(root.leaves())
        .enter()
        .append("a")
        .attr("target", "_blank")
        .attr("xlink:href", function (d) {
            var p = d.data.path.split("/");
            return "https://github.com/";
        })
        .attr("transform", function (d) {
            return "translate(" + d.x0 + "," + d.y0 + ")";
        });

    cell.append("rect")
        .attr("id", function (d) {
            return d.id;
        })
        .attr("width", function (d) {
            return d.x1 - d.x0;
        })
        .attr("height", function (d) {
            return d.y1 - d.y0;
        })
        .attr("fill", function (d) {
            var a = d.ancestors();
            return color(a[a.length - 2].id);
        });

    cell.append("clipPath")
        .attr("id", function (d) {
            return "clip-" + d.id;
        })
        .append("use")
        .attr("xlink:href", function (d) {
            return "#" + d.id;
        });

    var label = cell.append("text")
        .attr("clip-path", function (d) {
            return "url(#clip-" + d.id + ")";
        });

    label.append("tspan")
        .attr("x", 4)
        .attr("y", 13)
        .text(function (d) {
            return d.data.path.substring(d.data.path.lastIndexOf("/") + 1, d.data.path.lastIndexOf("."));
        });

    label.append("tspan")
        .attr("x", 4)
        .attr("y", 25)
        .text(function (d) {
            return format(d.value);
        });

    cell.append("title")
        .text(function (d) {
            return d.id + "\n" + format(d.value);
        });
});
