# Treemap Google Chart


## Introduction
[Treemap Google Chart](https://developers.google.com/chart/interactive/docs/gallery/treemap) adapted to:
   * read a CSV file with the help of the [d3-dsv](https://github.com/d3/d3-dsv) library.
   * show the value as tooltip

**!!! Value of parents node are derived from their leaves !!!**

## Data Structure
The input data must contains the following columns:
  * The Name of the node
  * The parent of the node (`null` for the root)
  * The value of the leave node. **!!! Value of parents are derived from their leaves !!!**.
  * (Optional) An optional value used to calculate a color for this node. The color is gradient between minColor and maxColor. 

In the below example, the parent is contained in the `Id`, The parent is derived in the code from the `Id`.
```csv
Id,Value
Global,0
Global\America,20
Global\Europe,30
Global\Asia,50  
```
 
As inline code, it would correspond to this array.

```javascript
dataInlineArray = [
    ['Id', 'Parent', 'Value'],
    ['Global',    null,                 0],
    ['America',   'Global',             20],
    ['Europe',    'Global',             30],
    ['Asia',      'Global',             60],
    ['Australia', 'Global',             90],
    ['Africa',    'Global',             10],
];
```

## Color

### Gradient
The color schema is a gradient of the value of the column 3 (2 if the column 3 does'nt exist).

The gradient goes from:
  * the color of the minimum `minColor` (Default to red #dd0000)
  * through the color of the median `midColor` (Default to white #000000)
  * til the color of the maximum `maxColor` (Default to green #00dd00)

### Scale
The scale can be bounded by defining the options:
  * `minColorValue`
  * `maxColorValue`
The scale legend is shown if the option `showScale` is `true`.

### Color Options Example
```javascript
var options = {
    minColor: '#26A599', // Green Dark
    midColor: '#82C9C2', // Green Clear
    maxColor: '#C9DCD3', // Grey Clear
    showScale: true
};
```
