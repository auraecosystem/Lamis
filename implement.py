def train_one_epoch(model, dataloader, criterion, optimizer, device):
    model.train()
    running_loss = 0.0

    for inputs, targets in dataloader:
        inputs, targets = inputs.to(device), targets.to(device)

        optimizer.zero_grad()
        outputs = model(inputs)

        # Compute combined loss and individual metrics
        total_loss, metrics = criterion(outputs, targets)
        total_loss.backward()
        optimizer.step()

        running_loss += total_loss.item() * inputs.size(0)

    return running_loss / len(dataloader.dataset)

# Initialization in training script
criterion = CompositeRawLoss(w_charb=1.0, w_ssim=0.2, w_vgg=0.05).to(device)
