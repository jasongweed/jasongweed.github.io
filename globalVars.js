//globalVars

//global variables, constants

//basic gps setup
var gps_to_map_scale_factor = 100000; //default is 100000, this is prior to any zooming
var devTestSpot = false;
var origin_gps_x = null; // latitude based on initial gps coordinates obtained
var origin_gps_y = null; // longitude based on initial gps coordinates obtained
var gps_accuracy = null;
let gps_location_loaded = false; 
let gps_last_timepoint = 0;//to be continuously updated


//var to keep track of current gps coordinates
var gps_x_current; 
var gps_y_current;
var long_over_lat_degree_dist_ratio = 1.40; //for NYC

//pixi and game vars
let app;
let pixi_center_x;  //x coordinate center of UI, to be instantiate when pixi loads
let pixi_center_y;  //y coordinate center of UI, to be instantiate when pixi loads
let UI_zoomFactor = 1;
let player_obj;
let map_obj;
let map;
let mummies = [];
let number_of_mummies_to_generate = 60;
let number_of_digsites_to_generate = 60;
let number_of_infsites_to_generate = 20;
let digsites = [];

//UI vars
let keys = {}; //for accumulating pressed keyboard keys
let user_has_interacted_with_UI = false;

//gameworld related variables
max_location_range_gameworld_coords_x = 1300; //range of generated location x coordinates for creating sites around user
max_location_range_gameworld_coords_y = 1300; //range of generated location x coordinates for creating sites around user


//sound
var sfx_1 = SoundFX();
//console.log(sfx_1);
var sfx_2 = SoundFX();


//Map
//aligning map: must be precise

//central park3: top left -73.981889, 40.800354. Bottom right: -73.948556, 40.764544
//var mapTopLeftGpsCoordX = -73.981889;
//var mapTopLeftGpsCoordY = 40.800354;
//var mapBottomRightGpsCoordX = -73.948556;  
//var mapBottomRightGpsCoordY = 40.764544;

//east river park top left: lat 40.740340, -73.982292, bottom right 40.720455, -73.971297
//var mapTopLeftGpsCoordX = -73.982162;
//var mapTopLeftGpsCoordY = 40.740590;
//var mapBottomRightGpsCoordX = -73.970807;// old -73.971297;  
//var mapBottomRightGpsCoordY = 40.719045;// old 40.720455;

//Prospect Park
/*var mapTopLeftGpsCoordX = -73.979654;
var mapTopLeftGpsCoordY = 40.67242;
var mapBottomRightGpsCoordX = -73.958867;
var mapBottomRightGpsCoordY = 40.651332;
*/

//Tarifa
var mapTopLeftGpsCoordX = -5.607551763889505 ;
var mapTopLeftGpsCoordY = 36.014708103672454;
var mapBottomRightGpsCoordX = -5.597429867902984;
var mapBottomRightGpsCoordY = 36.01045787548373;
