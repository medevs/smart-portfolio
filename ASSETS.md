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

## Models

Buildings, animals, and props are procedural meshes in `src/components/farm/scene/models.tsx`. No Quaternius, Kenney, or Poly Haven model files are shipped. Photogrammetry models and the Quaternius animal packs are CC0, but the packs that were available as a direct download were either multi‑tens of megabytes or not reachable from this environment without an interactive license click. They were left out so the first visit stays near the texture and HDRI budget instead of pulling a large animal pack.

## Not from these libraries

The sketch hatch, water tint, and sun shafts are original code.
