"""
ComfyUI ComfySketch
Simple drawing pad with fullscreen editing, pen pressure, and zoom.
"""

import torch
import numpy as np
from PIL import Image
import base64
import io


class ComfySketchNode:
    """
    Drawing pad for sketching.
    - Preview in node (like Load Image)
    - Edit in fullscreen
    - Pen pressure support
    - Zoom & pan
    """
    
    CATEGORY = "image"
    FUNCTION = "get_sketch"
    RETURN_TYPES = ("IMAGE",)
    RETURN_NAMES = ("image",)
    
    PRESET_SIZES = [
        "512 x 512",
        "512 x 768",
        "768 x 512",
        "768 x 1024",
        "1024 x 768",
        "1024 x 1024",
        "1080 x 1920",
        "1920 x 1080",
        "From Input Image",
        "Custom",
    ]
    
    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "preset_size": (cls.PRESET_SIZES, {"default": "1920 x 1080"}),
                "custom_width": ("INT", {"default": 512, "min": 64, "max": 4096, "step": 64}),
                "custom_height": ("INT", {"default": 768, "min": 64, "max": 4096, "step": 64}),
                "background_color": (["white", "black", "gray"], {"default": "white"}),
                "canvas_data": ("STRING", {"default": "", "multiline": True}),
            },
            "optional": {
                "input_image": ("IMAGE",),
            },
        }
    
    @classmethod
    def IS_CHANGED(cls, **kwargs):
        return float("nan")
    
    def get_sketch(
        self,
        preset_size: str,
        custom_width: int,
        custom_height: int,
        background_color: str,
        canvas_data: str,
        input_image: torch.Tensor = None,
    ):
        # Parse size
        size_map = {
            "512 x 512": (512, 512),
            "512 x 768": (512, 768),
            "768 x 512": (768, 512),
            "768 x 1024": (768, 1024),
            "1024 x 768": (1024, 768),
            "1024 x 1024": (1024, 1024),
            "1080 x 1920": (1080, 1920),
            "1920 x 1080": (1920, 1080),
        }
        
        if preset_size == "Custom":
            width, height = custom_width, custom_height
        elif preset_size == "From Input Image" and input_image is not None:
            # input_image shape: (B, H, W, C)
            height, width = input_image.shape[1], input_image.shape[2]
        else:
            width, height = size_map.get(preset_size, (1920, 1080))
        
        # Decode canvas data if present
        if canvas_data and canvas_data.startswith("data:image"):
            try:
                base64_data = canvas_data.split(",")[1]
                image_bytes = base64.b64decode(base64_data)
                image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
                
                # Resize if needed
                if image.size != (width, height):
                    image = image.resize((width, height), Image.Resampling.LANCZOS)
                
                image_np = np.array(image).astype(np.float32) / 255.0
                image_tensor = torch.from_numpy(image_np).unsqueeze(0)
                
                return (image_tensor,)
            except Exception as e:
                print(f"[ComfySketch] Error decoding canvas: {e}")
        
        # If input_image is connected and no canvas data, use the input image
        if input_image is not None:
            # input_image shape: (B, H, W, C) float32 0-1
            image_np = input_image[0].cpu().numpy()
            image_np = (image_np * 255).clip(0, 255).astype(np.uint8)
            image = Image.fromarray(image_np, 'RGB')
            
            # Resize if needed
            if image.size != (width, height):
                image = image.resize((width, height), Image.Resampling.LANCZOS)
            
            image_np = np.array(image).astype(np.float32) / 255.0
            image_tensor = torch.from_numpy(image_np).unsqueeze(0)
            
            return (image_tensor,)
        
        # Return blank canvas
        bg_colors = {
            "black": (0, 0, 0),
            "white": (255, 255, 255),
            "gray": (128, 128, 128),
        }
        bg = bg_colors.get(background_color, (0, 0, 0))
        
        image_np = np.full((height, width, 3), bg, dtype=np.uint8)
        image_tensor = torch.from_numpy(image_np).float() / 255.0
        image_tensor = image_tensor.unsqueeze(0)
        
        return (image_tensor,)


NODE_CLASS_MAPPINGS = {
    "ComfySketch": ComfySketchNode,
}

NODE_DISPLAY_NAME_MAPPINGS = {
    "ComfySketch": "✏️ ComfySketch",
}
