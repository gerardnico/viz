
google.charts.load('current', {'packages':['treemap']});
google.charts.setOnLoadCallback(drawChart);

function drawChart() {

    var xhr = new XMLHttpRequest();
    var async = false; // Because it's true by default we may not see the content
    xhr.open('GET', 'pages.csv', async);
    xhr.send(null);
    var fileContent = xhr.responseText;

    /*global d3*/
    /* https://github.com/d3/d3-dsv */
    /* dataCSV is an array */
    var dataCsvArray = d3.csvParse(fileContent, function(d) {
        // Google accept only array
        // Otherwise First row is not an array ie dataCSV[0] is an object
        return [
            d.id,
            d.id.substring(0, d.id.lastIndexOf("\\")) == "" ? null : d.id.substring(0, d.id.lastIndexOf("\\")),
            +d.value, // must be a numeric
            +d.value/2 // Color
        ];
    });

    // Add the headers as the first row
    dataCsvArray.splice(0,0,["Id","Parent","Value","Color"])



    /*global google */
    var dataTable = google.visualization.arrayToDataTable(dataCsvArray);

    tree = new google.visualization.TreeMap(document.getElementById('chart_div'));

    // The full list of options
    // https://developers.google.com/chart/interactive/docs/gallery/treemap#configuration--options
var options = {
    // highlightOnMouseOver: true,
    // maxDepth: 1,
    // maxPostDepth: 2,
    // minHighlightColor: '#8c6bb1',
    // midHighlightColor: '#9ebcda',
    // maxHighlightColor: '#edf8fb',
    minColor: '#26A599',
    midColor: '#82C9C2',
    maxColor: '#C9DCD3',
    // minColor: '#f00',
    // midColor: '#ddd',
    // maxColor: '#0d0',
    //useWeightedAverageForAggregation: true,
    headerHeight: 15,
    fontColor: 'black',
    showScale: true,
    generateTooltip: showStaticTooltip
};
    tree.draw(dataTable, options);

    /**
     *
     * @param row - the cell's row from the datatable
     * @param size - the sum of the value (column 3) of this cell and all its children
     * @param value - the color of the cell, expressed as a number from 0 to 1
     * @returns {string}
     */
    function showStaticTooltip(row, size, value) {
        return '<div style="background:#fd9; padding:10px; border-style:solid">' +
            '<span style="font-family:Courier"><b>' + dataTable.getValue(row, 0) +
            '</b>, ' + dataTable.getValue(row, 1) + ', ' + dataTable.getValue(row, 2) +
            ', ' + dataTable.getValue(row, 3) + '</span><br>' +
            'Datatable row: ' + row + '<br>' +
            dataTable.getColumnLabel(2) +
            ' (total value of this cell and its children): ' + size + '<br>' +
            dataTable.getColumnLabel(3) + ': ' + value + ' </div>';
    }




}
