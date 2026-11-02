"use client";
import type { ReactElement, RefObject } from "react";
import { CourtyardHouse, EarthGranary, StoneWorkshop, AtlasCedar } from "./MiddleAtlas";
import { Cow, Sheep, Donkey, Cat, Dog, Chicken, Hen } from "./Animals";
import { Tractor } from "./TractorModel";
import * as Objects from "./FarmObjects";
import { Rod } from "./ObjectParts";
import type { animalPose } from "./object-motion";
export type ModelProps = {motion?:RefObject<ReturnType<typeof animalPose>>;night:boolean;golden?:boolean;cols?:number;rows?:number;phase?:number;watered?:boolean;raining?:boolean;wind?:number};
export function Barn(props:ModelProps) {return <group><CourtyardHouse {...props}/><group position={[0,0,-.65]}><Objects.BuildingFinish/></group></group>}
export const Farmhouse=Barn;
export function Silo(props:ModelProps) {return <group><EarthGranary {...props}/><Objects.BuildingFinish width={1.95} depth={1.95} height={3.3}/></group>}
export const Windmill=Silo;
export function Shed(props:ModelProps) {return <group><StoneWorkshop {...props}/><group scale={[.76,.82,.78]} position={[0,0,-.507]}><Objects.BuildingFinish/></group></group>}
export function Tree() {return <group><AtlasCedar height={4.8}/>{[0,1,2,3].map(i=><Rod key={i} a={[0,.14,0]} b={[Math.cos(i*Math.PI/2)*.35,.015,Math.sin(i*Math.PI/2)*.35]} r={.065} color="#6e6956"/>)}</group>}
export { Cow, Sheep, Donkey, Cat, Dog, Chicken, Hen, Tractor };
export const MODELS:Record<string,(props:ModelProps)=>ReactElement>={
  barn:Barn,farmhouse:Farmhouse,silo:Silo,shed:Shed,windmill:Windmill,
  waterTower:Objects.WaterTower,coop:Objects.Coop,pond:Objects.Pond,tree:Tree,
  blossom:Objects.Blossom,wheat:Objects.Wheat,crops:Objects.Crops,scarecrow:Objects.Scarecrow,
  chicken:Chicken,hen:Hen,cow:Cow,sheep:Sheep,donkey:Donkey,cat:Cat,dog:Dog,tractor:Tractor,
  mailbox:Objects.Mailbox,stall:Objects.Stall,sign:Objects.Sign,fence:Objects.Fence,hay:Objects.Hay,
  greenhouse:Objects.Greenhouse,fencePeg:Objects.FencePeg,flowerSign:Objects.FlowerSign,animalSign:Objects.AnimalSign,plotStake:Objects.PlotStake,
};
