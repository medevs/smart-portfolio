# Farm assets

Textures and HDRIs on the 3D farm are CC0. They are not credited in the site UI. This file is the record.

## Poly Haven

License: CC0. https://polyhaven.com/license

| File | Asset | Source |
| --- | --- | --- |
| `public/farm/hdri/day.hdr` | Belfast Farmhouse, 1k HDR | https://polyhaven.com/a/belfast_farmhouse |
| `public/farm/hdri/sunset.hdr` | Dikhololo Sunset, 1k HDR | https://polyhaven.com/a/dikhololo_sunset |
| `public/farm/hdri/night.hdr` | Dikhololo Night, 1k HDR | https://polyhaven.com/a/dikhololo_night |
| `public/farm/tex/grass_*` | Aerial Grass Rock, 1k (diffuse, normal, ARM) | https://polyhaven.com/a/aerial_grass_rock |
| `public/farm/tex/dirt_*` | Brown Mud Dry, 1k | https://polyhaven.com/a/brown_mud_dry |
| `public/farm/tex/wood_*` | Brown Planks 03, 1k | https://polyhaven.com/a/brown_planks_03 |
| `public/farm/tex/roof_*` | Roof Tiles, 1k | https://polyhaven.com/a/roof_tiles |
| `public/farm/tex/brick_*` | Red Brick, 1k | https://polyhaven.com/a/red_brick |
| `public/farm/tex/rock_*` | Rock Ground, 1k | https://polyhaven.com/a/rock_ground |

JPG maps were re-encoded to WebP. The HDRIs are the original 1k Radiance files.

Day sky is `kloppenheim_06_puresky` (CC0, https://polyhaven.com/a/kloppenheim_06_puresky), 1k HDR, saved as `public/farm/hdri/day.hdr`.

## Models

Poly Haven model downloads are CC0. https://polyhaven.com/license

The glTF "1k" files still ship full photogrammetry meshes. `pine_tree_01` is about 949 MB and 17 million triangles, `fir_tree_01` about 478 MB. Those were not downloaded. `island_tree_02` was kept and simplified. Every model below was packed to a single GLB with meshopt and 512 px WebP textures (`gltf-transform optimize`).

Files live in `public/farm/models/`. The first visit loads the trees, shrubs, grass, a few rocks, a barrel, a crate, and the porch chair. The rest load after the scene is up.

Included: island_tree_02, tree_stump_01, tree_stump_02, shrub_01, shrub_02, shrub_03, shrub_04, fern_02, nettle_plant, dandelion_01, celandine_01, grass_medium_01, grass_medium_02, grass_bermuda_01, moss_01, boulder_01, rock_moss_set_01, rock_moss_set_02, rock_07, rock_09, stone_01, wooden_barrels_01, wine_barrel_01, Barrel_01, Barrel_02, wooden_crate_01, wooden_crate_02, wooden_bucket_01, wooden_bucket_02, watering_can_metal_01, wooden_ladder, wicker_basket_01, wooden_lantern_01, rusted_spade_01, garden_gnome, planter_box_01, planter_box_02, planter_box_03, wooden_picnic_table, painted_wooden_bench, Rockingchair_01, stone_fire_pit, street_lamp_01, modular_wooden_pier, propane_tank.

Not included, because the source mesh is too heavy to fetch and simplify here: pine_tree_01, fir_tree_01, island_tree_01, island_tree_03, jacaranda_tree, tree_small_02, modular_electricity_poles.

Animals, the barn, the house, the silo, and the windmill are still original procedural meshes. Windmill gears, the mill wheel, the well crank, and the gate are original too. Anatomy (MIT) and img2threejs (Apache-2.0) were read as references and not copied.

## Skills

`.cursor/skills/` is a copy of the pstack skill pack (https://github.com/backnotprop/pstack). Its license is `.cursor/skills/PSTACK-LICENSE`.

## Not from these libraries

The sketch hatch, water tint, and sun shafts are original code.
