import rawpy
import numpy as np
import torch
from torch.utils.data import Dataset
from PIL import Image

def pack_raw_bayer(raw_obj):
    """Packs 1-channel raw Bayer image into 4 channels (R, Gr, Gb, B) at half resolution."""
    raw_image = raw_obj.raw_image_visible.astype(np.float32)
    black = np.array(raw_obj.black_level_per_channel, dtype=np.float32).reshape(1, 1, 4)
    white = float(raw_obj.white_level)

    # De-interleave Bayer pattern into 4 channels
    h, w = raw_image.shape
    out = np.stack([
        raw_image[0:h:2, 0:w:2],  # R
        raw_image[0:h:2, 1:w:2],  # Gr
        raw_image[1:h:2, 0:w:2],  # Gb
        raw_image[1:h:2, 1:w:2]   # B
    ], axis=-1)

    # Subtract black level and normalize to [0.0, 1.0]
    out = np.maximum(out - black, 0.0) / (white - black)
    return torch.from_numpy(out).permute(2, 0, 1)  # Tensor shape: [4, H/2, W/2]

class RawToRgbDataset(Dataset):
    def __init__(self, raw_paths, rgb_paths):
        self.raw_paths = raw_paths
        self.rgb_paths = rgb_paths

    def __len__(self):
        return len(self.raw_paths)

    def __getitem__(self, idx):
        # Load RAW sensor data
        with rawpy.imread(self.raw_paths[idx]) as raw:
            input_tensor = pack_raw_bayer(raw)

        # Load target sRGB ground truth
        target_img = Image.open(self.rgb_paths[idx]).convert('RGB')
        target_tensor = torch.from_numpy(np.array(target_img, dtype=np.float32) / 255.0).permute(2, 0, 1)

        return input_tensor, target_tensor
