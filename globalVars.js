//globalVars

//global variables, constants

//basic gps setup
var gps_to_map_scale_factor = 100000; //default is 100000, this is prior to any zooming
var devTestSpot = false;
var origin_gps_x = null; //this is a latitude based on initial gps coordinates obtained
var origin_gps_y = null; 
var gps_accuracy = null;
let gps_location_loaded = false;
//let gps_now_timepoint = null;//to be continuously updated
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
let number_of_mummies_to_generate = 30;
let number_of_digsites_to_generate = 30;
let number_of_infsites_to_generate = 10;
let digsites = [];
let keys = {}; //for accumulating pressed keyboard keys


//gameworld related variables
max_location_range_gameworld_coords_x = 600;
max_location_range_gameworld_coords_y = 800;


//sound
const soundEffect = new Audio();
const soundEffect2 = new Audio();

//aligning map: must be precise
//grammery map lower right: 40.738650, -73.980678. Upper left: 40.742877, -73.985388

//central park3: top left -73.981889, 40.800354. Bottom right: -73.948556, 40.764544
//var mapTopLeftGpsCoordX = -73.981889;
//var mapTopLeftGpsCoordY = 40.800354;
//var mapBottomRightGpsCoordX = -73.948556;  
//var mapBottomRightGpsCoordY = 40.764544;

//ear river park top left: lat 40.740340, -73.982292, bottom right 40.720455, -73.971297
var mapTopLeftGpsCoordX = -73.982162;
var mapTopLeftGpsCoordY = 40.740590;
var mapBottomRightGpsCoordX = -73.970807;// old -73.971297;  
var mapBottomRightGpsCoordY = 40.718845;// old 40.720455;



