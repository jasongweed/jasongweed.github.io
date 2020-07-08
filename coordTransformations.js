
function txf_GPS_to_gameworld(longit, latit, origin_gps_x, origin_gps_y, scale_factor,long_over_lat_degree_dist_ratio){////, half_canvas_width, half_canvas_height){
  //transforms gps coordinates of an object at [longit,latit] to relative to origin at initial location based on original gps coords
  let retx=0.0;
  retx=(longit-origin_gps_x)*scale_factor; //+parseFloat(half_canvas_width);
  let rety=0.0;
  rety=(latit-origin_gps_y)*scale_factor*long_over_lat_degree_dist_ratio;//+parseFloat(half_canvas_height);  // (-1)*
  //console.log("gameworld retx: "+retx+" "+ "rety: "+rety);
  return [retx,rety];
}

function txf_gameworld_to_GPS(x, y, origin_gps_x, origin_gps_y, scale_factor, long_over_lat_degree_dist_ratio){////, half_canvas_width, half_canvas_height){
  //transforms gps coordinates of an object at [longit,latit] to relative to origin at initial location based on original gps coords
  let ret_long=0.0;
  ret_long= x*1/(scale_factor)+origin_gps_x;  // reverse was retx=(longit-origin_gps_x)*scale_factor;
  let ret_lat=0.0;
  ret_lat = (y*(1/long_over_lat_degree_dist_ratio)*(1/scale_factor))+origin_gps_y; //reverse was rety=(latit-origin_gps_y)*scale_factor*long_over_lat_degree_dist_ratio;
  //console.log("gameworld retx: "+retx+" "+ "rety: "+rety);
  return [ret_long,ret_lat];
}


function txf_gameworld_to_UI(pair, half_canvas_width, half_canvas_height, player_x, player_y,_UI_zoomFactor){
  let retx=0.0;
  retx=((pair[0] - player_x)*_UI_zoomFactor+half_canvas_width); 
  let rety=0.0;
  rety=(((-1)*(pair[1]- player_y))*_UI_zoomFactor+half_canvas_height);
  //console.log("UI retx: "+retx+" "+ "rety: "+rety);
  return [retx,rety];
}      

function txf_UI_to_gameworld(pair, half_canvas_width, half_canvas_height, player_x, player_y, _UI_zoomFactor){
  let retx=0.0;
  retx=pair[0]/_UI_zoomFactor + player_x - half_canvas_width; 
  let rety=0.0;
  rety= (pair[1]/_UI_zoomFactor-half_canvas_height) *(-1)+player_y;
  //console.log("reverse txf retx: "+retx+" "+ "rety: "+rety);
  return [retx,rety];
}      

function distanceFunctionInGameworld(x1,y1,x2,y2){
    return Math.sqrt(Math.pow(x1-x2,2)+Math.pow(y1-y2,2));
}