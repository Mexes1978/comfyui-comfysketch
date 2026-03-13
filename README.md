# ✏️ ComfySketch for ComfyUI

A drawing and sketching node for ComfyUI with layers, multiple brush types, and a focused, professional interface.

## ❤️ Support this project

If you find this project useful, you can support its development here:  
[👉https://mexesmith.gumroad.com/
]
 **Status:** Active development. Feedback and issues are welcome.

> Parts of this project were developed with the help of AI-assisted tools and then refined manually.

## Features

### Drawing Tools

| Tool           | Description                                                       |
| -------------- | ----------------------------------------------------------------- |
| **Brush (B)**  | Pressure-sensitive freehand drawing with hardness/falloff control |
| **Pencil (P)** | 1px anti-aliased pencil for fine details                          |
| **Line (L)**   | Straight lines (hold Shift for horizontal/vertical/45°)           |
| **Circle (C)** | Ellipses (hold Shift for perfect circles)                         |
| **Square (R)** | Rectangles (hold Shift for perfect squares)                       |
| **Fill (G)**   | Flood fill with adjustable tolerance                              |
| **Eraser (E)** | Remove content from layers                                        |

### Brush Types

| Brush        | Settings                   | Description                               |
| ------------ | -------------------------- | ----------------------------------------- |
| **Round**    | Hardness, Roundness, Angle | Standard brush with soft edge falloff     |
| **Soft**     | Hardness, Roundness, Angle | Smooth gradient brush for blending        |
| **Airbrush** | Flow, Softness             | Very soft brush for gradual color buildup |
| **Spray**    | Density                    | Particle spray pattern                    |

### Color System

- **Color Wheel** - HSV picker with hue ring and saturation/value square
- **HSL/RGB Sliders** - Precise numeric color control
- **Hex Input** - Direct hex color entry (#RRGGBB)
- **FG/BG Colors** - Foreground and background with quick swap
- **Eyedropper (I)** - Pick colors from canvas
- **6 Color Presets** - Save and recall colors (stored in browser)

### Layers

- **Multiple Layers** - Add, delete, merge, duplicate
- **Layer Opacity** - Per-layer transparency control
- **Layer Visibility** - Show/hide individual layers
- **Layer Reordering** - Drag and drop to rearrange
- **Rename Layers** - Double-click name to rename

### Canvas

- **Preset Sizes** - 512×512, 512×768, 768×512, 1024×1024, 1920×1080, Custom
- **Zoom** - Mouse wheel or +/- buttons (0.25x to 8x)
- **Pan** - Middle mouse button or hold Space
- **Mirror Drawing** - Horizontal and/or vertical symmetry
- **Flip Canvas** - Flip active layer H or V

### Interface

- **Dark/Light Theme** - Toggle with moon/sun icon
- **Draggable Panels** - Position anywhere on screen
- **Collapsible Panels** - Click − to minimize
- **Tool Properties** - Double-click any tool for settings
- **Panel Memory** - Positions saved between sessions

## Keyboard Shortcuts

### Tools

| Key | Tool       |
| --- | ---------- |
| B   | Brush      |
| P   | Pencil     |
| E   | Eraser     |
| L   | Line       |
| C   | Circle     |
| R   | Rectangle  |
| G   | Fill       |
| I   | Eyedropper |

### Colors

| Key | Action                            |
| --- | --------------------------------- |
| X   | Swap foreground/background colors |

### Adjustment (Hold + Drag)

| Key      | Action            |
| -------- | ----------------- |
| S + Drag | Adjust brush size |
| O + Drag | Adjust opacity    |

### View

| Key          | Action               |
| ------------ | -------------------- |
| Space        | Toggle UI visibility |
| Space + Drag | Pan canvas           |
| +            | Zoom in              |
| -            | Zoom out             |
| Middle Mouse | Pan canvas           |
| Mouse Wheel  | Zoom in/out          |

### Edit

| Key    | Action |
| ------ | ------ |
| Ctrl+Z | Undo   |
| Ctrl+Y | Redo   |

### Modifiers (while drawing shapes)

| Key   | Action                                               |
| ----- | ---------------------------------------------------- |
| Shift | Perfect circle/square, constrain lines to 45° angles |

## Installation

1. Download or clone this repository
2. Copy the `comfyui-comfysketch` folder to `ComfyUI/custom_nodes/`
3. Restart ComfyUI

## Usage

1. Add the **ComfySketch** node (found in `image` category)
2. Click **Sketch** button or the preview to open fullscreen editor
3. Draw using the available tools and brushes
4. Click **Done** (✓) to close and output the image
5. Connect the `image` output to other nodes

## Tips

- **Double-click** any tool or brush icon to open its settings panel
- Use **Airbrush** with low flow for smooth shading
- Lower brush **Hardness** for softer, more painterly edges
- Use **layers** to separate elements for easy editing
- **S+drag** left/right quickly adjusts brush size
- **O+drag** left/right quickly adjusts opacity
- Press **Space** to hide all panels for an unobstructed view
- The **dark theme** reduces eye strain for long sessions

## Node Outputs

| Output  | Description                                      |
| ------- | ------------------------------------------------ |
| `image` | The composited drawing as a tensor (BHWC format) |

## Canvas Size Options

The canvas size can be configured via the node's `canvas_size` dropdown:

- 512×512 (square)
- 512×768 (portrait)
- 768×512 (landscape)
- 1024×1024 (large square)
- 1920×1080 (HD landscape)
- Custom (set via width/height widgets)

## Background Color

Choose the initial canvas background:

- **Black** - Default, good for light sketches
- **White** - Good for dark sketches
- **Gray** - Neutral middle tone





ComfyUI is a separate project. This tool is not affiliated with or endorsed by the ComfyUI developers.

---

**Node Location:** `Add Node` → `image` → `ComfySketch`

## ## License

MIT License.

## Support

This is a free and open-source ComfyUI node.  
If it saves you time or fits into your workflow, you can optionally support the project via a tip on Gumroad.  
The tool will remain fully usable without payment.
