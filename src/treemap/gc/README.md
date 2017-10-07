# Treemap Google Chart


## Introduction
[Treemap Google Chart](https://developers.google.com/chart/interactive/docs/gallery/treemap) adapted to:
   * read a CSV file with the help of the [d3-dsv](https://github.com/d3/d3-dsv) library.
   * show the value as tooltip


## Data Structure
The input data must contains the following columns:
  * The Name of the node
  * The parent of the node (`null` for the root)
  * The value of the leave node. Value of parents are derived from their leaves.

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


