var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

var color = d3.scaleOrdinal(d3.schemeCategory20);

// A function to extract a description from the path
// The second replace do a camelCase
var pathToDesc = function(str) {
    return str.replace(/_/g," ").replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
        return letter.toUpperCase();
    });
}


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

    var tree = stratify(data)
        .sum(function (d) {
            return +d.size;
        })
        .sort(function (a, b) {
            return b.value - a.value || b.height - a.height;
        });

    // tree.eachAfter(function (d) {
    //         if (d.value < 30) {
    //             // Suppress the node from the parent
    //             const index = d.parent.children.indexOf(d);
    //             if (index !== -1) {
    //                 d.parent.children.splice(index, 1);
    //             }
    //         }
    //     }
    // );

    treemap(tree);

    var cell = svg.selectAll("a")
        .data(tree.leaves())
        .enter()
        .append("a")
        .attr("target", "_blank")
        .attr("xlink:href", function (d) {
            var pagePath = d.data.path;
            pagePath = pagePath.replace("pages\\","");
            pagePath = pagePath.replace("\\.","/");
            pagePath = pagePath.replace(/\\/g,"/");
            return "https://gerardnico.com/wiki/"+pagePath;
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
            var textToReturn = "";
            var paths = d.data.path.split("\\");
            var length = paths.length;
            const lastPath = paths[length - 1];
            if (length>=3){
                if (lastPath!=".") {
                    textToReturn = paths[length - 2] + " - " + lastPath;
                } else {
                    textToReturn = paths[length - 2];
                }
            } else {
                textToReturn = lastPath;
            }
            return pathToDesc(textToReturn);
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
