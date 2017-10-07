
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
            +d.value // must be a numeric
        ];
    });

    // Add the headers as the first row
    dataCsvArray.splice(0,0,["Id","Parent","Value"])



    /*global google */
    var dataTableCsv = google.visualization.arrayToDataTable(dataCsvArray);

    tree = new google.visualization.TreeMap(document.getElementById('chart_div'));

    tree.draw(dataTableCsv, {
        minColor: '#f00',
        midColor: '#ddd',
        maxColor: '#0d0',
        headerHeight: 15,
        fontColor: 'black',
        showScale: true,
        generateTooltip: showStaticTooltip
    });

    function showStaticTooltip(row, size, value) {
        return '<div style="background:#fd9; padding:10px; border-style:solid">' +
            'Size ('+size+'), Value ('+value+')';
    }




}
