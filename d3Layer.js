dojo.provide("modules.d3Layer");

dojo.declare("modules.d3Layer", esri.layers.GraphicsLayer, {

    constructor: function(url, options) {
      var self = this;
      this.inherited(arguments); 

      this.url = url;
      if (options.projection) this._project = options.projection;
     
      this._styles = options.styles || [];
      this._attrs = options.attrs || [];
      this._events = options.events || [];

      this._path = options.path || d3.geo.path();
      this.path = this._path.projection( self._project );
    
      // load features
      this._load();
    },

    _load: function(){
      var self = this;
      d3.json( this.url, function( geojson ){
        self.geojson = geojson;
        self.bounds = d3.geo.bounds( self.geojson );
        self.loaded = true;
        // TODO the onLoad event fires too soon, have to wait until the DOM is created
        setTimeout(function(){ 
          self.onLoad( self );
        }, 1000);
      });

    }, 

    _bind: function(map){
      this._connects = [];
      this._connects.push( dojo.connect( this._map, "onZoomEnd", this, this._reset ) );
    },

    _project: function(x){
       var p = new esri.geometry.Point( x[0], x[1] );
       var point = map.toScreen( esri.geometry.geographicToWebMercator( p ) )
       return [ point.x, point.y ];
    },

    _render: function(){
      var self = this;
      var p = this._paths();
      
      p.data( this.geojson.features )
        .enter().append( "path" )
          .attr('d', self.path );
          //.attr('d', function(d) { console.log(d3.geo.circle(d)); return d3.geo.circle(); }); //d3.geo.path().centroid(d); });

      this._styles.forEach(function( s, i ) { 
        self.style(s);
      });

      this._attrs.forEach(function( s, i ) {
        self.attr(s);
      });

      this._events.forEach(function( s, i ) {
        self.event(s);
      });

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
      this._paths().attr('d', this.path)
    },

    _element: function(){
      return d3.select("g#" + this.id + "_layer");
    },

    _paths: function(){
      return this._element().selectAll( "path" );
    }


});
