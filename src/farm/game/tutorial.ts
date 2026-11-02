import type { Progress } from "./progress";
import { HARVEST_APPLES, pickedApples, type DeliveryContext } from "./journey";
import { destination, distance, type Point } from "./world";
export type Practice = { needsExit:boolean; moved: boolean; looked: boolean; loaded: boolean; route: "tractor" | "walk" };
export const freshPractice = (): Practice => ({needsExit:false,moved:false,looked:false,loaded:false,route:"tractor"});
export type GuideStep = { id: string; title: string; instruction: string; controls: string; target: Point | null; count: number };
export const LESSONS = [
  {id:"move",title:"Find your feet",eyebrow:"01 · Getting around",body:"Choose Walk the farm from Menu. Walk a few steps with W A S D or the movement pad. Shift or Sprint moves faster. Your walking directions stay aligned with the map even when you turn the view.",keys:"W A S D · Shift",touch:"Drag the movement pad · tap Sprint",diagram:"move"},
  {id:"look",title:"Look, zoom, find your way",eyebrow:"02 · Camera & navigation",body:"Drag the scene to look around your visitor. Wheel, pinch, + or − changes the distance. M opens the map, J opens your journal, and Escape pauses or closes a panel. A waypoint shows direction and distance; it never completes a task.",keys:"Drag · Wheel · M · J · Escape",touch:"Drag the scene · pinch · Menu → Map / Journal",diagram:"map"},
  {id:"care",title:"Follow the water",eyebrow:"03 · Begin your visit",body:"Visit the maker’s studio first and press E or the action button. Close the project window to continue. Fill your can at the well, then water the kitchen garden. The journal keeps this order and tells you what comes next.",keys:"Walk close · E",touch:"Walk close · tap the action button",diagram:"water"},
  {id:"pick",title:"Pick a real little harvest",eyebrow:"04 · Orchard",body:"After watering the garden, find three ripe apples on low branches. Small ground circles mark them. Move within arm’s reach and press E once per apple. Each fruit disappears into your basket. Find a different branch for the next apple.",keys:"W A S D · E at each low branch",touch:"Movement pad · tap Pick apple",diagram:"apple"},
  {id:"load",title:"Load at the back",eyebrow:"05 · Optional trailer delivery",body:"With three apples, walk to the back of the tractor trailer. Both tractor and trailer must be stopped. Press E or Load basket into trailer. The basket moves from your hands to the trailer. The map marks the trailer with a brown T.",keys:"E at the stopped trailer’s rear",touch:"Tap Load basket into trailer",diagram:"load"},
  {id:"drive",title:"Take the slow road",eyebrow:"06 · Tractor",body:"Walk beside the tractor and press F or Drive tractor. W/S accelerate forward/reverse; A/D steer while moving. Release to brake. Opposite input brakes before reversing. Drive the trailer beside the shared-table courtyard, outside the pergola. Reverse slowly: the trailer pivots at its hitch.",keys:"F · W / S · A / D · release to brake",touch:"Drive tractor · movement pad · release to brake",diagram:"drive"},
  {id:"deliver",title:"A table worth arriving at",eyebrow:"07 · Unload & share",body:"Stop beside the courtyard, exit with F, and walk to the back of the trailer. Press E to unload. Carry the basket close to the shared table and press E again to set it down. You can also carry all three apples directly from the orchard; the tractor is optional.",keys:"Release · F · E to unload · E at the table",touch:"Release pad · Exit tractor · Unload · action at table",diagram:"table"},
] as const;

/** Instructions reflect real inventory/movement. Reading or stepping through lessons grants nothing. */
export function practiceStep(practice:Practice,progress:Progress,context:DeliveryContext):GuideStep {
  const step=(id:string,title:string,instruction:string,controls:string,target:Point|null,count:number)=>({id,title,instruction,controls,target,count});
  if(practice.needsExit)return step("exit","Park and step outside","Release the controls, then exit the tractor. If the sides are blocked, park in an open patch first. Walking practice begins beside it.","Release · F / Exit tractor",null,1);
  if(!practice.moved)return step("move","Walk a few steps","Move around the gate. You can pause the guide at any time.","W A S D / movement pad",null,1);
  if(!practice.looked)return step("look","Make the view comfortable","Drag the scene to turn, or zoom closer and farther.","Drag · wheel / pinch · + / −",null,2);
  for(const [id,title,instruction] of [["studio","Meet the maker","Walk to the studio and interact. Close the project window to continue."],["well","Fill your can","Follow the path to the well and fill your watering can."],["garden","Water the garden","Bring the water to the kitchen garden and interact with the bed."]] as const){
    if(!progress.completed.includes(id))return step(id,title,instruction,"Walk close · E / action button",destination(id),3);
  }
  if(!progress.completed.includes("orchard")) {
    const picked=pickedApples(progress),index=HARVEST_APPLES.findIndex((_,i)=>!picked.includes(i));
    return step("pick",`Pick apples · ${progress.apples}/3`,"Follow the marker to a low branch. Pick once, then find the next marked apple.","Within arm’s reach · E / Pick apple",HARVEST_APPLES[index]??destination("orchard"),4);
  }
  if(progress.completed.includes("table"))return step("done","The table is ready","Your harvest is shared. Keep exploring the cedar edge, homes and beehives.","J / Menu → Field notebook",null,7);
  if(progress.basket==="trailer") {
    if(distance(context.trailer,destination("table")!)>4.5)return step("drive","Bring the trailer to the table","Enter the tractor nearby. Drive slowly toward the courtyard and keep the rig outside the pergola.","F / Drive tractor · W S / pad · A D to steer",{x:-3,z:24.8},6);
    if(context.speed>=.15)return step("brake","Let the rig stop","Release the movement controls and wait for the trailer to settle.","Release W / S or the movement pad",null,6);
    return step("unload","Unload your harvest","Exit the tractor, then walk to the marked rear of the trailer.","F / Exit tractor · E / Unload basket",context.loading,7);
  }
  if(practice.route==="tractor"&&!practice.loaded)return step("load","Load the full basket","Walk to the stopped trailer’s rear. Or choose to carry the basket on foot.","E / Load basket into trailer",context.loading,5);
  return step("table","Set a place at the table","Carry the basket close to the shared table and interact to finish your visit.","E / action button at the table",destination("table"),7);
}
