esri_d3
=======

An extension to the Esri JSAPI for rendering geojson features with D3

This here is to showcase the value in using d3.js in addition to the Esri JS API. What we get from d3, aside from an awesome lib that is filled with great features, is the ability to leverage CSS with maps. We can use stylesheets and html5 data-attributes to classify maps and create compelling visualization that require minimal Javascript. 

## Examples

### CSS Styling
[http://chelm.github.com/esri-d3/index.html](http://chelm.github.com/esri-d3/index.html)

### Cross-Interaction
[http://chelm.github.com/esri-d3/css_power.html](http://chelm.github.com/esri-d3/css_power.html)

## Usage

  var layer = new modules.d3Layer('/path/to/a/geojson', {
    styles: [
      { key: 'fill', value: '#555'},
      { key: 'stroke', value: '#F00'}
    ],
    attrs: [
      { key: 'id', value: function(d){ return d.properties.name; }},
      { key: 'class', value: 'my-class'}
    ] 
  });
  map.addLayer(layer);

