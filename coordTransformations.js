
function txf_GPS_to_gameworld(longit, latit, origin_gps_x, origin_gps_y, scale_factor,long_over_lat_degree_dist_ratio){////, half_canvas_width, half_canvas_height){
  //transforms gps coordinates of an object at [longit,latit] to relative to origin at initial location based on original gps coords
  let retx=0.0;
  retx=(longit-origin_gps_x)*scale_factor; //+parseFloat(half_canvas_width);
  let rety=0.0;
  rety=(latit-origin_gps_y)*scale_factor*long_over_lat_degree_dist_ratio;//+parseFloat(half_canvas_height);  // (-1)*
  console.log("gameworld retx: "+retx+" "+ "rety: "+rety);
  return [retx,rety];
}

function txf_gameworld_to_UI(pair, half_canvas_width, half_canvas_height, player_x, player_y){
  let retx=0.0;
  retx=(pair[0] - player_x)+half_canvas_width; 
  let rety=0.0;
  rety=((-1)*(pair[1]- player_y))+half_canvas_height;
  //console.log("UI retx: "+retx+" "+ "rety: "+rety);
  return [retx,rety];
}      

function txf_UI_to_gameworld(pair, half_canvas_width, half_canvas_height, player_x, player_y){
  let retx=0.0;
  retx=pair[0] + player_x - half_canvas_width; 
  let rety=0.0;
  rety= (pair[1]-half_canvas_height) *(-1)+player_y;
  //console.log("reverse txf retx: "+retx+" "+ "rety: "+rety);
  return [retx,rety];
}      