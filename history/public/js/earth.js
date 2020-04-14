

class Earth{

	constructor(scene,mesh){
		this.scene = scene;
		
		
		this.totalSize = 0.5;
	    this.radius = 200*this.totalSize;    
	    this.water =0x4B76C0;  
		
	}

	init(){
		this.addBaseSphere();
	//	this.addNatureLines();
	   // this.applyGeoData();
	   // this.addExtraGeoData();
	}
	
	 addBaseSphere(){
	    const geometry = new THREE.SphereGeometry(this.radius-1*this.totalSize, 40, 30)
	    const material = new THREE.MeshBasicMaterial({ color: this.water     })
	    const sphere = new THREE.Mesh(geometry, material)
	    
	    sphere.rotation.y = Math.PI;
	    this.scene.add(sphere)

	    
	    this.mesh = new THREE.Mesh(geometry, material);
	    this.mesh.scale.set( 1.1, 1.1, 1.1 );
	  }
  
  
  
  addNatureLines(){
 	 var self = this;
	  var arr = [{
		  	file:"json/rivers_simplify.json",
	    	color:this.water,
	    	radius:this.radius+0.1*this.totalSize
	    },
	    {
	    	file:"json/reefs.json",
	    	color:0x63ABC1,
	    	radius:this.radius+0.1*this.totalSize
	    }];
	    
	    
	    arr.forEach(function(item){
	    	d3.json(item.file, function(error, data) {
	        	  var geo = new THREE.Geometry();
	
	        	  data.geometries.forEach(function(geometry) {
	        		 
	        		  if(geometry.type == 'LineString'){
	        			  self.drawLines(geo,geometry.coordinates);
	        		  }
	        		  
	        		  if(geometry.type == 'MultiLineString'){
	        			geometry.coordinates.forEach(function(coordinates){
	          			  self.drawLines(geo,coordinates);  				
	        			});
	        		  }
	
	        	});
	    	});
	    });
	  
  }
  

	
	  
  applyGeoData(){
	
	var self = this;
	var materials = [
		this.makeMaterial(0x9F907A),
		this.makeMaterial(0x0F5C0F),		      
		this.makeMaterial(0xFFE99E),
		this.makeMaterial(0x9F907A),
		this.makeMaterial(0x297229),
		this.makeMaterial(0x9E8C5B),
		this.makeMaterial(0x665147),
		this.makeMaterial(0xFFE6B3),
		this.makeMaterial(0x74896C), ////dry grassland
		this.makeMaterial(0xffffff),
		this.makeMaterial(0x0D490D),// thick forest
		this.makeMaterial(this.water)

	]

	
	JSZipUtils.getBinaryContent('http://localhost:8001/json/wwf_terr_ecos.zip', function(err, fileData) {
	    if(err) {
	        throw err; // or handle err
	    }

	    var zip = new JSZip();
	    
	    zip.loadAsync(fileData).then(function (contents) {
	        // ...
	    	
	    	 Object.keys(contents.files).forEach(function(filename) {
	    		 zip.file(filename).async('string').then(function(content) {

	        	    	
	                	
	        	    	var geo = new THREE.Geometry();
	        	 	
	        	 		
	        	 		
	        	 		var data = JSON.parse(content);
	        	    	data.features.forEach(function(feature){
	        				self.drawFeature(feature,geo);
	        			}); 
	        	    	
	        	    	var m = new THREE.Mesh( geo, materials );
	        	      	
	        			self.scene.add(  m);
	        			
	        			self.loaded = true;
	                });
	            });
	    	 
	    
	    });
	});
  }
  
  
  addExtraGeoData(){
  
  	var self = this;
  	var jsons = [{
    	file:"json/lakes.json",
    	color:this.water,
    	radius:this.radius+0.05
    },{
    	file:"json/glaciated.json",
    	color:0xEFF4FF,
    	radius:this.radius+0.5
    },{
    	file:"json/playas.json",
    	color:0xffffff,
    	radius:this.radius+0.1
    },{
    	file:"json/earth-rivers-simplify.json",
    	color:this.water,
    	radius:this.radius+0.05
    },{
    	file:"json/bathymetry_K_200.json",
    	color:0x1A448B,
    	radius:this.radius+0.05
    }];
	    
	    jsons.forEach(function(json){
	        $.getJSON(json.file, function(data) {
	        	self.drawGeoJson(json.color,data,json.radius);
	    		  
	        });
	    	
	    });
  }
  
	  drawGeometry(geometry,geo,color){
	  	
	  	var self = this;
  	      if(geometry.type === 'LineString'){
			  self.drawLines(geo,geometry.coordinates);
		  }
		  
		  if(geometry.type === 'MultiLineString'){
			geometry.coordinates.forEach(function(coordinates){
				self.drawLines(geo,coordinates);  				
			});
		  }
	  
  		  
	  	self.scene.add( new THREE.LineSegments(geo, new THREE.LineBasicMaterial({color: color})));
	  
	  }
	  
	  makeMaterial(color){
		
		var ret = new THREE.MeshBasicMaterial({
		        color: color,
		        morphTargets: false,
		        side: THREE.DoubleSide
		      });
		      
		return ret;
	}
	  
   drawGeoJson(color,data,radius){

		var self = this;
	  var geo = new THREE.Geometry();
		var material =  new THREE.MeshBasicMaterial({
	        color: color,
	        morphTargets: false,
	        side: THREE.DoubleSide
	      });

		
		if(data.type=="GeometryCollection"){
		
		  	data.geometries.forEach(function(geometry){
		  		
		  		if(geometry.type=='MultiPolygon'){
		  			geometry.coordinates.forEach(function(coordinate){
		  				self.drawCoordinate(geo,coordinate,radius);
		  			});
		  		}else{
		  			
		  			self.drawCoordinate(geo,geometry.coordinates,radius);
		  		
	
		  		}
		  		
		  	});
		}
		
	
	
	  	var m = new THREE.Mesh( geo, material );
  	
		this.scene.add(  m);
  }
  
  drawFeature(feature,geo){
  	var self =this;
	var biomeColorMap =[
		0,
		1,
		4,
		6,
		4,
		3,
		1,
		4,
		5,
		5,
		5,
		3,
		4,
		2,
		3
	]
	
  	if(feature.geometry !== null){
		if(feature.geometry.coordinates !== undefined){
			if(feature.geometry.coordinates.length>0){
				var color = 1;
				if(feature.properties !== undefined){
					
					if(feature.properties.BIOME>=biomeColorMap.length) console.log(feature.properties.BIOME);
					color = biomeColorMap[feature.properties.BIOME];
					
					
				}
				
				if(feature.properties.BIOME===13){
					if(feature.properties.GBL_STAT === 1){
						color=7;
						if(feature.properties.G200_STAT  ===2){
							color = 3;
						}
					}
					if(feature.properties.GBL_STAT === 2){
						if(feature.properties.G200_STAT  ===3){
							color = 7;
						}
					}
					if(feature.properties.GBL_STAT === 3){
						color=3;

					}
					
					if(feature.properties.ECO_NUM === 1){
						color=8;

					}
					if(feature.properties.ECO_NUM === 3){
						color=2;

					}
					

				}
				if(feature.properties.BIOME===4){
					if(feature.properties.GBL_STAT === 1){
						//console.log(feature.properties);
						if(feature.properties.G200_STAT  ===1){
							color=1;
						}

					}
					if(feature.properties.GBL_STAT === 2){
						color=8;
						
					}
					if(feature.properties.GBL_STAT === 3){
						color=10;
						
					}
					
				}
				if(feature.properties.BIOME===98){
					color = 11;
				}
				if(feature.geometry.type === 'Polygon'){
					self.drawCoordinate(geo,feature.geometry.coordinates,self.radius,color);
				}
				if(feature.geometry.type === 'MultiPolygon'){
					feature.geometry.coordinates.forEach(function(coordinate){
						self.drawCoordinate(geo,coordinate,self.radius,color);
					
					});
				}
			}
		}
	}
  }
  
     drawCoordinate(geo,coordinate,radius,color){
		var d = earcut.flatten(coordinate);
  		var triangles = earcut(d.vertices, d.holes, d.dimensions);
  		
  		
  		var i = 0;

  		for(;i<triangles.length;i+=3){


  			//create a triangular geometry
  			var pointA = new THREE.Vector3(d.vertices[triangles[i]*2],d.vertices[triangles[i]*2+1],0);
  			var pointB = new THREE.Vector3(d.vertices[triangles[i+1]*2],d.vertices[triangles[i+1]*2+1],0);
  			var pointC = new THREE.Vector3(d.vertices[triangles[i+2]*2],d.vertices[triangles[i+2]*2+1]);
  			
  			this.makeFace(geo,pointA,pointB,pointC,radius,color);
  			
  		}
  		

  }
  
  
  
   makeFace(geo,pointA,pointB,pointC,radius,color){
	  
		var max =12;

		
	   var arr = [{
		   distance:pointA.distanceTo( pointB ),
		   point1:pointA,
		   point2:pointB,
		   point3:pointC		   
	   },{
		   distance:pointA.distanceTo( pointC ),
		   point1:pointA,
		   point2:pointC,
		   point3:pointB		   
	   },{
		   distance:pointB.distanceTo( pointC ),
		   point1:pointB,
		   point2:pointC,
		   point3:pointA		   
	   }]
	  
	   arr.sort(function (a, b) {
		  return b.distance - a.distance;
		});
	   
	   
	   if(arr[0].distance > max){
		   
		   var a = arr[0];
		   
			var dir = new THREE.Vector3();
			
			  dir.subVectors( a.point1, a.point2 ).normalize();
					  
			  dir.multiplyScalar(a.distance/2);
			  
			  var mid = new THREE.Vector3(a.point2.x,a.point2.y,a.point2.z);
			  
			  mid.add(dir);
			  
			  this.gpsToVector(geo,a.point1,a.point3,mid,radius,color);
			  this.makeFace(geo,a.point1,a.point3,mid,radius,color);
			  this.makeFace(geo,a.point2,a.point3,mid,radius,color);	
	   }
	   
	   else{
		
		
				
					
				geo.vertices.push(  this.gpsToVector(pointA.x,pointA.y,radius));
				geo.vertices.push(  this.gpsToVector(pointB.x,pointB.y,radius) );
				geo.vertices.push(   this.gpsToVector(pointC.x,pointC.y,radius));
		
				var normal = new THREE.Vector3( 0, 1, 0 ); //optional
				
				//create a new face using vertices 0, 1, 2
				var face = new THREE.Face3( geo.vertices.length-3,geo.vertices.length-2,geo.vertices.length-1,normal,new THREE.Color( 0xffaa00 ),color);
		
			//add the face to the geometry's faces array
				geo.faces.push( face );
		}
	  
  }
  
   gpsToVector(lat,long,radius) {
		
	    var phi = (90 - long) * Math.PI / 180;
	    var theta = (180 - lat) * Math.PI / 180;

	    var sphereSize = radius;
		if(radius !== undefined) sphereSize = radius;
		
		  return new THREE.Vector3(
				  sphereSize * Math.sin(phi) * Math.cos(theta),
				  sphereSize * Math.cos(phi),
				  sphereSize * Math.sin(phi) * Math.sin(theta)
		  );		

	}
	
	drawLines(geo,coordinates){
	  for(var i = 0 ; i<coordinates.length; i++){
		  if(i>0){
		      geo.vertices.push(this.vertex(coordinates[i-1]), this.vertex(coordinates[i]));
		  }  				  
	  }
  	}
  	
  	vertex(point,radius) {
		if(point === undefined){
			console.log("point undefined");
			return null;
		}
	    var phi = (90 - point[1]) * Math.PI / 180;
	    var theta = (180 - point[0]) * Math.PI / 180;

	    var sphereSize = 200.1*this.totalSize;
		
	    if(radius !== undefined) sphereSize = radius;
	    
		  return new THREE.Vector3(
				  sphereSize * Math.sin(phi) * Math.cos(theta),
				  sphereSize * Math.cos(phi),
				  sphereSize * Math.sin(phi) * Math.sin(theta)
		  );		

	}
  
}

