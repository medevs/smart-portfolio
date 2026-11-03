type Stick = {stickX:number;stickY:number};

/** Drag from the first finger position; touching the pad never jumps to full speed. */
export function bindMovementPad(element:HTMLElement,stick:Stick,onTakeover:()=>void=()=>{}) {
  let active:number|null=null,originX=0,originY=0;
  const host=element.ownerDocument.defaultView,document=element.ownerDocument;
  const clear=()=>{
    const pointer=active;active=null;stick.stickX=stick.stickY=0;
    for(const [key,value] of [["--pad-x","0px"],["--pad-y","0px"],["--pad-origin-x","50%"],["--pad-origin-y","50%"]])element.style.setProperty(key,value);
    element.removeAttribute("data-active");
    if(pointer!==null&&element.hasPointerCapture(pointer))element.releasePointerCapture(pointer);
  };
  const down=(event:PointerEvent)=>{
    if(active!==null||event.button!==0)return;
    event.preventDefault();onTakeover();active=event.pointerId;originX=event.clientX;originY=event.clientY;
    const rect=element.getBoundingClientRect();
    element.style.setProperty("--pad-origin-x",`${originX-rect.left}px`);element.style.setProperty("--pad-origin-y",`${originY-rect.top}px`);
    element.setAttribute("data-active","");stick.stickX=stick.stickY=0;element.setPointerCapture(active);
  };
  const move=(event:PointerEvent)=>{
    if(event.pointerId!==active)return;
    event.preventDefault();const x=(event.clientX-originX)/38,y=(event.clientY-originY)/38,length=Math.max(1,Math.hypot(x,y));
    stick.stickX=x/length;stick.stickY=y/length;
    element.style.setProperty("--pad-x",`${stick.stickX*30}px`);element.style.setProperty("--pad-y",`${stick.stickY*30}px`);
  };
  const end=(event:PointerEvent)=>{if(event.pointerId===active)clear();};
  const visibility=()=>{if(document.hidden)clear();};
  element.addEventListener("pointerdown",down);element.addEventListener("pointermove",move);
  for(const type of ["pointerup","pointercancel","lostpointercapture"])element.addEventListener(type,end as EventListener);
  host?.addEventListener("blur",clear);host?.addEventListener("resize",clear);document.addEventListener("visibilitychange",visibility);
  return ()=>{
    element.removeEventListener("pointerdown",down);element.removeEventListener("pointermove",move);
    for(const type of ["pointerup","pointercancel","lostpointercapture"])element.removeEventListener(type,end as EventListener);
    host?.removeEventListener("blur",clear);host?.removeEventListener("resize",clear);document.removeEventListener("visibilitychange",visibility);clear();
  };
}
