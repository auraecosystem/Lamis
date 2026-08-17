import torch
import torch.nn as nn
import torch.nn.functional as F
from torchvision.models import vgg16, VGG16_Weights

class VGGPerceptualLoss(nn.Module):
    """Feature-level perceptual loss using frozen VGG-16 layers."""
    def __init__(self):
        super().__init__()
        vgg = vgg16(weights=VGG16_Weights.DEFAULT).features
        
        # Feature extraction layers
        self.slice1 = nn.Sequential(*[vgg[i] for i in range(4)])   # relu1_2
        self.slice2 = nn.Sequential(*[vgg[i] for i in range(4, 9)])  # relu2_2
        self.slice3 = nn.Sequential(*[vgg[i] for i in range(9, 16)]) # relu3_3

        # Freeze network parameters
        for param in self.parameters():
            param.requires_grad = False

        # ImageNet normalization statistics
        self.register_buffer('mean', torch.tensor([0.485, 0.456, 0.406]).view(1, 3, 1, 1))
        self.register_buffer('std', torch.tensor([0.229, 0.224, 0.225]).view(1, 3, 1, 1))

    def forward(self, pred, target):
        # Normalize input RGB tensors [0.0, 1.0] to ImageNet distribution
        pred = (pred - self.mean) / self.std
        target = (target - self.mean) / self.std

        # Extract features
        h1_pred, h1_target = self.slice1(pred), self.slice1(target)
        h2_pred, h2_target = self.slice2(h1_pred), self.slice2(h1_target)
        h3_pred, h3_target = self.slice3(h2_pred), self.slice3(h2_target)

        # Multi-scale feature loss
        loss = F.l1_loss(h1_pred, h1_target) + \
               F.l1_loss(h2_pred, h2_target) + \
               F.l1_loss(h3_pred, h3_target)
        return loss
