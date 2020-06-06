      var gps_x;
      var gps_y;
      // at equator 0.00001 degrees in gps coordinates is 1.11 m, so convert to 1 per 1.11m
      var gps_to_map_scale_factor = 1000; //default is 100000 

      //aligning map: must be precise
      //grammery map lower right: 40.738650, -73.980678. Upper left: 40.742877, -73.985388
      var mapTopLeftGpsCoordX = -73.972167;
      var mapTopLeftGpsCoordY = 40.784751;
      var mapBottomRightGpsCoordX = -73.960707;
      var mapBottomRightGpsCoordY = 40.778300;
      var long_over_lat_degree_dist_ratio = 1.40;
      var devTestSpot = true;//false;

      let app;
      let playerSprite;
      let mummySprite;
      let center_x;
      let center_y;
      let map;
      let map_initial_x;
      let map_initial_y;
      let mummies = [];

      window.onload = function(){
        app = new PIXI.Application( //jgw this creates a canvas element
          {
            width: 600,
            height: 800,
            backgroundColor: 0xAAAAAA
          }
        );
        document.querySelector("#gameDiv").appendChild(app.view); //app itself doesn't go in

        //preload assets
        app.loader.baseUrl = "images";
        app.loader.add("playerSprite","player.png").add("mummySprite","mummy.png").add("mapGrammercySprite","mapGreatLawn.png");

        app.loader.onProgress.add(showProgress);
        app.loader.onComplete.add(doneLoading);
        app.loader.onError.add(reportError);

        app.loader.load();

        //start location tracking
        getLocationInit();//this sets gps_x and gps_y vars

      }

      function showProgress(e){
        console.log(e.progress);
      }

      function reportError(e){
        console.error("ERROR: " + e.message);
      }

      function doneLoading(e){
        console.log("DONE LOADING!");
        
        center_x = app.view.width/2.0;
        center_y = app.view.height/2.0;

        //load map
        map = PIXI.Sprite.from(app.loader.resources.mapGrammercySprite.texture);
        let map_coords_top_left = transform_coords_GPS_to_game(mapTopLeftGpsCoordX, mapTopLeftGpsCoordY, gps_x,gps_y,center_x,center_y,gps_to_map_scale_factor,long_over_lat_degree_dist_ratio);
        map.x = Math.round(map_coords_top_left[0]);
        map.y = Math.round(map_coords_top_left[1]);
        map_initial_x=map.x;
        map_initial_y=map.y;
        let map_coords_bottom_right = transform_coords_GPS_to_game(mapBottomRightGpsCoordX, mapBottomRightGpsCoordY, gps_x,gps_y,center_x,center_y,gps_to_map_scale_factor,long_over_lat_degree_dist_ratio);
        map.width = Math.round(map_coords_bottom_right[0]-map.x);
        map.height = Math.round(map_coords_bottom_right[1]-map.y);
        //alert("map coords topleft " + map.x + " " + map.y + " \n bottom right: "+ map_coords_bottom_right[0] + " " + map_coords_bottom_right[1]); //jgw still working here 6/1/20
        //alert("map height width: "+ map.height + " " + map.width); //jgw still working here 6/1/20

        //TODO: in the gameloop, add function to move map
        map.anchor.set(0,0);
        app.stage.addChild(map);

        //load mummy sprite and place based on GPS coordinates
        mummySprite = PIXI.Sprite.from(app.loader.resources.mummySprite.texture);
        mummy_gps_x= gps_x+Math.random()*0.08-0.04;
        mummy_gps_y= gps_y+Math.random()*0.08-0.04;

        let mumcoords=transform_coords_GPS_to_game(mummy_gps_x,mummy_gps_y,gps_x,gps_y,center_x,center_y,gps_to_map_scale_factor,long_over_lat_degree_dist_ratio); 
        //alert(mumcoords[0]);
        
        mummySprite.x = 300;//mumcoords[0];//center_x/2;//
        mummySprite.y = 400;//mumcoords[1];//center_y/2;//;
        mummySprite.anchor.set(0);
        app.stage.addChild(mummySprite);
        mummies.push(mummySprite); //supposedly passes a reference

        //load player on center stage, based on GPS coordinates
        playerSprite = PIXI.Sprite.from(app.loader.resources.playerSprite.texture);
        playerSprite.x = center_x;
        playerSprite.y = center_y;
        playerSprite.anchor.set(0.5);
        app.stage.addChild(playerSprite);

        //game loop
        app.ticker.add(gameLoop);
      }

      function gameLoop(){
        updateMummies();
        movePlayer();
        displayGpsCoords();
        //TODO, make updateMapPosition();
      }

      function displayGpsCoords(){
        let current_coords = inv_transform_coords_GPS_to_game(map_initial_x-map.x, map_initial_y-map.y,gps_x,gps_y,center_x,center_y,gps_to_map_scale_factor,long_over_lat_degree_dist_ratio);
        //alert(current_coords[0]);
        $( "#gpsCoords1" ).text("current longitude: "+current_coords[0].toFixed(5));
        $( "#gpsCoords2" ).text("current latitude: "+current_coords[1].toFixed(5));

        //alert(current_coords);
      }

      function updateMummies(){
        for(const m of mummies){
          var asas=0;
          m.x+=(playerSprite.x-m.x)/500;
          m.y+=(playerSprite.y-m.y)/500;
        }
      }

      function getDistanceFromPlayer(){
        console.log("distance away, ", Math.sqrt(Math.pow(this.x-player.x,2)+Math.pow(this.y-player.y,2)));
        return Math.sqrt(Math.pow(this.x-player.x,2)+Math.pow(this.y-player.y,2));
      }


      function getLocationInit() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(getGeoPositionInit);
          console.log("Got geolocation information");
        } else { 
          console.log("Geolocation is not supported.");
        }
      }

      function getGeoPositionInit(position) {
          if(devTestSpot==true){
            gps_x=-73.967025; //-73.982065;  
            gps_y=40.780900;//40.737862;
          }else{
            getGeoPositionInit(); //sets gps_y and gps_x state variables based on coordinates
            gps_y = position.coords.latitude;
            gps_x = position.coords.longitude;              
          }
      }

      function movePlayer(){

        if(devTestSpot==true){
          let step = 3
          let step_x=Math.floor(Math.random() * Math.floor(step))-step/2;
          let step_y=Math.floor(Math.random() * Math.floor(step))-step/2;
        }else{

        }

        mummySprite.x+=step_x;
        mummySprite.y+=step_y;
        map.x+=step_x;
        map.y+=step_y;
      }



      function transform_coords_GPS_to_game(longit, latit, gps_x_player, gps_y_player, half_canvas_width, half_canvas_height, scale_factor,long_over_lat_degree_dist_ratio){
        //transforms gps coordinates of an object at [longit,latit] to scaled
        //coordinates on-screen relative to central player at origin\
        let retx=0.0;
        retx+=parseFloat(((longit-gps_x_player)*scale_factor))+parseFloat(half_canvas_width);
        let rety=0.0;
        rety+=parseFloat((-1)*((latit-gps_y_player)*scale_factor*long_over_lat_degree_dist_ratio))+parseFloat(half_canvas_height);
        //alert((longit-gps_x_player)*scale_factor+"\ncombo rety: " + retx );
        return [retx,rety];
      }


      function inv_transform_coords_GPS_to_game(x, y, gps_x_player, gps_y_player, half_canvas_width, half_canvas_height, scale_factor,long_over_lat_degree_dist_ratio){
        //transforms gps coordinates of an object at [longit,latit] to scaled
        //coordinates on-screen relative to central player at origin\
        let long=0.0;
        long = ((x-parseFloat(half_canvas_width))/scale_factor)+gps_x_player;
        let lat=0.0;
        lat+=((y-parseFloat(half_canvas_height))/scale_factor/long_over_lat_degree_dist_ratio)+gps_y_player;
        //parseFloat((-1)*((latit-gps_y_player)*scale_factor*long_over_lat_degree_dist_ratio))+parseFloat(half_canvas_height);
        //alert((longit-gps_x_player)*scale_factor+"\ncombo rety: " + retx );
        return [long,lat];
      }
