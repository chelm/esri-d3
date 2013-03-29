dojo.provide("modules.d3Layer");

dojo.require("esri.layers.graphics");

dojo.declare("modules.d3Layer", esri.layers.GraphicsLayer, {

    constructor: function(url, options) {
      var self = this;
      this.inherited(arguments); 

      this.url = url;

      this.type = options.type || 'path';
      this.selector = this.type;

      if (options.projection) this._project = options.projection;
     
      this._styles = options.styles || [];
      this._attrs = options.attrs || [];
      this._events = options.events || [];

      this._path = options.path || d3.geo.path();
      this.path = this._path.projection(dojo.hitch(this,self._project));
    
    },

    _load: function(){
      var self = this;
      d3.json( this.url, function( geojson ){
        self.geojson = geojson;
        self.bounds = d3.geo.bounds( self.geojson );
        self.loaded = true;
        self._render();
        self.onLoad( self );
      });

    },

    // called once the layer's been added to the map
    _setMap: function(){ 
      this._load();
      return this.inherited( arguments );
    },

    _bind: function(map){
      this._connects = [];
      this._connects.push( dojo.connect( this._map, "onZoomEnd", this, this._reset ) );
    },

    _project: function(x){
       var p = new esri.geometry.Point( x[0], x[1] );
       var point = this._map.toScreen( esri.geometry.geographicToWebMercator( p ) )
       return [ point.x, point.y ];
    },

    _render: function(){
      var self = this;
      var p = this._paths();
      if ( this.type == 'circle' ) {

        p.data( this.geojson.features )
          .enter().append( this.type )
          .attr("cx", function(d, i) { return self._project(d.geometry.coordinates)[0]; })
          .attr("cy", function(d, i) { return self._project(d.geometry.coordinates)[1]; })
          .attr('r', 10)
          .on('click', function(d) {
            self.select(d, this)
          })
          .on('mouseover', function(d){
            self.hover(d, this);
          })
          .on('mouseout', function(d){
            self.exit(d, this);
          });
      } else {

        p.data( this.geojson.features )
          .enter().append( this.type )
          .attr('d', this.path);
      }  

      this._styles.forEach(function( s, i ) { 
        self.style(s);
      });

      this._attrs.forEach(function( s, i ) {
        self.attr(s);
      });

      this._events.forEach(function( s, i ) {
        self.event(s);
      });

      // assign a class to each feature element that is the ID of the layer
      // this makes it possible to select all primary features, and have secondary ones
      this._paths().attr('class', function(d, el) { 
        return d3.select(this).attr('class') + " " + self.id;
      });
    
      // selector needs to respect the layer id classname we just gave each element
      this.selector += "."+this.id;

      this._bind();
    },

    style: function( s ){
      this._paths().style(s.key, s.value);
    },

    attr: function( a ){
      this._paths().attr(a.key, a.value);
    },

    event: function( e ){
      this._paths().on(e.type, e.fn);
    },

    _reset: function(){
      var self = this;
      if (this.type == 'circle'){
        this._paths()
          .attr("cx", function(d, i) { return self._project(d.geometry.coordinates)[0]; })
          .attr("cy", function(d, i) { return self._project(d.geometry.coordinates)[1]; })
      } else {
        this._paths().attr('d', this.path)
      }
    },

    _element: function(){
      return d3.select("g#" + this.id + "_layer");
    },

    _paths: function( selector ){
      return this._element().selectAll( selector || this.selector );
    },
    
    hover: function() {},
    exit: function() {},
    select: function() {}
});
