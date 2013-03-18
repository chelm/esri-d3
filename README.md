esri_d3
=======

An extension to the Esri JSAPI for rendering geojson features with D3

## Why?

A lot of the features that D3 brings mapping (CSS, SVG, transitions, etc) the Esri JS API already contains, however D3 exposes these features at simpler level that makes it a joy to work with. This repo explores some of the features that D3 can add to the JS API and make it fun and easy to build compelling visualization that driven by data. 


## Examples

### CSS Styling
This shows how to use a very simple CSS based style to highlight a state: 

[http://chelm.github.com/esri-d3/index.html](http://chelm.github.com/esri-d3/index.html)

### CSS Classification via HTML data attributes
This shows how we can data-* attributes on our elements as a way to assign categories to data. The classication rules are defined in the CSS instead of directly on the elements themselves: 

[http://chelm.github.com/esri-d3/rules.html](http://chelm.github.com/esri-d3/rules.html)

### Cross-Interaction
This example adds some interaction to each state. The point is to show an alternative CSS based approach to cross data selection and interaction.

[http://chelm.github.com/esri-d3/css.html](http://chelm.github.com/esri-d3/css.html)

## Usage

First include d3.js:
    <script src="http://d3js.org/d3.v3.min.js"></script>

Second add a geojson layer. You can specify arrays or key/values for styles and attrs on created SVG elements:  
    <script>
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
    </script>

