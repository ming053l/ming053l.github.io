# IrisMix browser studio

Static demonstration at `/IrisMix/`, linked from the personal homepage. Serve this
repository over HTTP; no build, backend or inference service is needed.

## Curated examples and provenance

The v2 library contains four inspected single-reference results: Bare Satin,
Merlot, Mint Breeze and Water Lily. They replace the earlier mixed teaser looks.
Every result comes from the actual saved Stage II output in
`oneface_cache/FULL_lora_step3000_ema_s065n1r2`, not the `_paste.png` warp. The asset
manifest records the checkpoint, sampler, source and reference. The comparison
dialog displays both the saved warp and the saved Stage II result.

The same synthetic adult source portrait is used for every example. All
references are from LayerBeauty, with no restricted external benchmark images.

## Freehand selection

The reference editor uses a 768-pixel reference photo and a 512-pixel editable
mask. Pointer strokes and the eraser edit that mask directly. A face landmark
correspondence map sends each target pixel to its reference mask pixel; the mask
therefore follows reference geometry rather than a rectangle or fixed face part.
The lookup is stored losslessly as an opaque RGB PNG containing 24-bit indices.
Optional eye/lip/face selections initialize the same freehand mask.

Each added selection becomes an independent layer. Users can change opacity,
reorder, hide or remove layers; undo/redo includes brush edits and layer changes.
A before/after divider, original toggle and committed-layer PNG download are
provided. On narrow screens a floating result thumbnail follows reference edits.

## What actually runs

Browser Canvas composites masks and the layers recovered from prepared Stage II
renders. Arbitrary mixes and brushed selections do **not** run the diffusion
model again. The interface states this explicitly. Reference photos cannot be
uploaded in this demonstration. This is separate from a full WebGPU model port.

`tools/export_irismix_demo.py` exports the v2 assets on CPU from existing model
outputs and landmark geometry. It invokes no generative model or GPU inference.
