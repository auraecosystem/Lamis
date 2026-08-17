class CompositeRawLoss(nn.Module):
    def __init__(self, w_charb=1.0, w_ssim=0.2, w_vgg=0.05):
        super().__init__()
        self.charbonnier = CharbonnierLoss()
        self.ssim = SSIMLoss()
        self.vgg = VGGPerceptualLoss()

        self.w_charb = w_charb
        self.w_ssim = w_ssim
        self.w_vgg = w_vgg

    def forward(self, pred, target):
        l_charb = self.charbonnier(pred, target)
        l_ssim = self.ssim(pred, target)
        l_vgg = self.vgg(pred, target)

        total_loss = (self.w_charb * l_charb) + \
                     (self.w_ssim * l_ssim) + \
                     (self.w_vgg * l_vgg)

        return total_loss, {
            'charb': l_charb.item(),
            'ssim': l_ssim.item(),
            'vgg': l_vgg.item()
        }
