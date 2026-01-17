/**
 * Renders and manages the skill tree UI
 * This is a reusable UI component that can be styled and customized
 */
export class SkillTreeUI {
  constructor(manager, containerId) {
    this.manager = manager;
    this.container = document.getElementById(containerId);
    
    if (!this.container) {
      throw new Error(`Container element with id '${containerId}' not found`);
    }
    
    // Find parent container for show/hide
    this.parentContainer = this.container.closest('#skillTreeContainer');
    if (!this.parentContainer) {
      this.parentContainer = this.container.parentElement;
    }

    this.selectedSkill = null;
    this.hoveredSkill = null;
    
    // Pan and zoom state
    this.offsetX = 0;
    this.offsetY = 0;
    this.scale = 1;
    this.minScale = 0.5;
    this.maxScale = 2.0;
    
    // Dragging state
    this.isDragging = false;
    this.lastMouseX = 0;
    this.lastMouseY = 0;
    
    // Touch state for double-tap detection
    this.lastTouchTime = 0;
    this.lastTouchedSkill = null;
    this.lastPinchDist = null;
    
    // Constants
    this.doubleTapTimeout = 500; // milliseconds
    this.zoomInFactor = 1.1;
    this.zoomOutFactor = 0.9;
    this.autoCenterPadding = 100;
    this.maxAutoCenterScale = 1.5; // Increased from 1.0 to start more zoomed in
    this.currencyPanelHeight = 40;
    
    // Tooltip configuration
    this.tooltipWidth = 600; // Increased for larger fonts
    this.tooltipHeight = 320; // Increased for larger fonts
    this.tooltipFontSizeTitle = 28; // Increased from 22 for better readability
    this.tooltipFontSizeBody = 20; // Increased from 15 for better readability
    this.tooltipFontSizeDetails = 18; // Increased from 13 for better readability
    this.tooltipLineHeight = 32; // Increased from 24 for larger fonts
    this.tooltipPadding = 24; // Increased from 20 for larger fonts
    this.tooltipMargin = 10; // Margin from canvas edge
    this.tooltipSpacingLarge = 8; // Increased from 5 for larger fonts
    this.tooltipSpacingSmall = 5; // Increased from 3 for larger fonts
    this.tooltipSpacingPrereq = -2; // Tighter spacing for prerequisite list
    
    this.setupCanvas();
    this.setupEventListeners();
  }

  setupCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = 1200; // Increased from 800 for bigger canvas
    this.canvas.height = 900; // Increased from 600 for bigger canvas
    this.canvas.style.width = '100%';
    this.canvas.style.height = 'auto';
    this.canvas.style.display = 'block';
    this.canvas.style.cursor = 'grab';
    
    const ctx = this.canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get 2D context for skill tree canvas');
    }
    this.ctx = ctx;
    
    this.container.appendChild(this.canvas);
  }

  setupEventListeners() {
    // Mouse events for desktop
    this.canvas.addEventListener('click', (e) => this.handleClick(e));
    this.canvas.addEventListener('dblclick', (e) => this.handleDoubleClick(e));
    this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
    this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
    this.canvas.addEventListener('mouseleave', (e) => this.handleMouseUp(e));
    this.canvas.addEventListener('wheel', (e) => this.handleWheel(e), { passive: false });
    
    // Touch events for mobile
    this.canvas.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: false });
    this.canvas.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
    this.canvas.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: false });
  }

  getCanvasCoordinates(event) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;
    
    const canvasX = (event.clientX - rect.left) * scaleX;
    const canvasY = (event.clientY - rect.top) * scaleY;
    
    // Transform to world coordinates (accounting for pan and zoom)
    return {
      x: (canvasX - this.offsetX) / this.scale,
      y: (canvasY - this.offsetY) / this.scale
    };
  }
  
  worldToCanvas(worldX, worldY) {
    return {
      x: worldX * this.scale + this.offsetX,
      y: worldY * this.scale + this.offsetY
    };
  }

  getSkillAtPosition(x, y) {
    const skills = this.manager.getAllSkills();
    const nodeRadius = 35;
    
    for (const skill of skills) {
      const dx = x - skill.position.x;
      const dy = y - skill.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance <= nodeRadius) {
        return skill;
      }
    }
    
    return null;
  }

  handleClick(event) {
    // Ignore clicks if we were dragging to prevent accidental selections after panning
    if (this.isDragging) {
      return;
    }
    
    const coords = this.getCanvasCoordinates(event);
    const skill = this.getSkillAtPosition(coords.x, coords.y);
    
    if (skill) {
      // Select the skill to show tooltip
      this.selectedSkill = skill;
      this.render();
    } else {
      // Clicked empty space, deselect
      this.selectedSkill = null;
      this.render();
    }
  }
  
  handleDoubleClick(event) {
    const coords = this.getCanvasCoordinates(event);
    const skill = this.getSkillAtPosition(coords.x, coords.y);
    
    if (skill) {
      // Try to purchase on double-click
      if (this.manager.canPurchaseSkill(skill.id)) {
        this.manager.purchaseSkill(skill.id);
        this.render();
      }
    }
  }
  
  handleMouseDown(event) {
    this.isDragging = true;
    this.lastMouseX = event.clientX;
    this.lastMouseY = event.clientY;
    this.canvas.style.cursor = 'grabbing';
  }
  
  handleMouseUp(event) {
    this.isDragging = false;
    this.canvas.style.cursor = 'grab';
  }

  handleMouseMove(event) {
    if (this.isDragging) {
      // Pan the view
      const dx = event.clientX - this.lastMouseX;
      const dy = event.clientY - this.lastMouseY;
      
      this.offsetX += dx;
      this.offsetY += dy;
      
      this.lastMouseX = event.clientX;
      this.lastMouseY = event.clientY;
      
      this.render();
    } else {
      // Update hover state
      const coords = this.getCanvasCoordinates(event);
      const skill = this.getSkillAtPosition(coords.x, coords.y);
      
      if (skill !== this.hoveredSkill) {
        this.hoveredSkill = skill;
        this.render();
      }
    }
  }
  
  handleWheel(event) {
    event.preventDefault();
    
    // Get mouse position in canvas coordinates before zoom
    const rect = this.canvas.getBoundingClientRect();
    const mouseX = (event.clientX - rect.left) * (this.canvas.width / rect.width);
    const mouseY = (event.clientY - rect.top) * (this.canvas.height / rect.height);
    
    // Calculate zoom
    const zoomFactor = event.deltaY < 0 ? this.zoomInFactor : this.zoomOutFactor;
    const newScale = Math.max(this.minScale, Math.min(this.maxScale, this.scale * zoomFactor));
    
    if (newScale !== this.scale) {
      // Adjust offset to zoom toward mouse position
      const worldX = (mouseX - this.offsetX) / this.scale;
      const worldY = (mouseY - this.offsetY) / this.scale;
      
      this.scale = newScale;
      
      this.offsetX = mouseX - worldX * this.scale;
      this.offsetY = mouseY - worldY * this.scale;
      
      this.render();
    }
  }
  
  handleTouchStart(event) {
    event.preventDefault();
    
    if (event.touches.length === 1) {
      const touch = event.touches[0];
      this.isDragging = true;
      this.lastMouseX = touch.clientX;
      this.lastMouseY = touch.clientY;
      
      // Check for double-tap
      const coords = this.getCanvasCoordinates(touch);
      const skill = this.getSkillAtPosition(coords.x, coords.y);
      
      const now = Date.now();
      const timeSinceLastTouch = now - this.lastTouchTime;
      
      if (skill && this.lastTouchedSkill === skill && timeSinceLastTouch < this.doubleTapTimeout) {
        // Double-tap detected - try to purchase
        if (this.manager.canPurchaseSkill(skill.id)) {
          this.manager.purchaseSkill(skill.id);
          this.selectedSkill = skill;
          this.render();
        }
        this.lastTouchTime = 0;
        this.lastTouchedSkill = null;
      } else {
        // Single tap - select/show tooltip
        this.selectedSkill = skill;
        this.lastTouchTime = now;
        this.lastTouchedSkill = skill;
        this.render();
      }
    }
  }
  
  handleTouchMove(event) {
    event.preventDefault();
    
    if (event.touches.length === 1 && this.isDragging) {
      const touch = event.touches[0];
      const dx = touch.clientX - this.lastMouseX;
      const dy = touch.clientY - this.lastMouseY;
      
      this.offsetX += dx;
      this.offsetY += dy;
      
      this.lastMouseX = touch.clientX;
      this.lastMouseY = touch.clientY;
      
      this.render();
    } else if (event.touches.length === 2) {
      // Pinch-to-zoom
      const touch1 = event.touches[0];
      const touch2 = event.touches[1];
      
      const dist = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      
      if (this.lastPinchDist) {
        const zoomFactor = dist / this.lastPinchDist;
        const newScale = Math.max(this.minScale, Math.min(this.maxScale, this.scale * zoomFactor));
        
        if (newScale !== this.scale) {
          // Zoom toward center of pinch
          const rect = this.canvas.getBoundingClientRect();
          const centerX = ((touch1.clientX + touch2.clientX) / 2 - rect.left) * (this.canvas.width / rect.width);
          const centerY = ((touch1.clientY + touch2.clientY) / 2 - rect.top) * (this.canvas.height / rect.height);
          
          const worldX = (centerX - this.offsetX) / this.scale;
          const worldY = (centerY - this.offsetY) / this.scale;
          
          this.scale = newScale;
          
          this.offsetX = centerX - worldX * this.scale;
          this.offsetY = centerY - worldY * this.scale;
          
          this.render();
        }
      }
      
      this.lastPinchDist = dist;
    }
  }
  
  handleTouchEnd(event) {
    event.preventDefault();
    this.isDragging = false;
    this.lastPinchDist = null;
  }

  drawConnections() {
    const skills = this.manager.getAllSkills();
    
    this.ctx.lineWidth = 3;
    
    for (const skill of skills) {
      for (const prereqId of skill.prerequisites) {
        const prereqSkill = this.manager.getSkillData(prereqId);
        
        if (prereqSkill) {
          const prereqState = this.manager.getSkillState(prereqId);
          
          if (prereqState.unlocked) {
            this.ctx.strokeStyle = '#4CAF50';
          } else {
            this.ctx.strokeStyle = '#444';
          }
          
          this.ctx.beginPath();
          this.ctx.moveTo(prereqSkill.position.x, prereqSkill.position.y);
          this.ctx.lineTo(skill.position.x, skill.position.y);
          this.ctx.stroke();
        }
      }
    }
  }

  drawSkillNode(skill) {
    const skillState = this.manager.getSkillState(skill.id);
    const canPurchase = this.manager.canPurchaseSkill(skill.id);
    const canAfford = this.manager.canAffordSkill(skill.id);
    const prereqsMet = this.manager.arePrerequisitesMet(skill.id);
    const isMaxLevel = skillState.currentLevel >= skill.maxLevel;
    
    const x = skill.position.x;
    const y = skill.position.y;
    const radius = 35;

    let fillColor;
    let strokeColor;
    let textColor = '#FFF';

    if (isMaxLevel) {
      fillColor = '#FFD700';
      strokeColor = '#FFA500';
      textColor = '#000';
    } else if (skillState.unlocked) {
      fillColor = '#4CAF50';
      strokeColor = '#2E7D32';
    } else if (canPurchase) {
      fillColor = '#2196F3';
      strokeColor = '#1976D2';
    } else if (prereqsMet && !canAfford) {
      fillColor = '#555';
      strokeColor = '#777';
    } else {
      fillColor = '#222';
      strokeColor = '#444';
    }

    if (this.hoveredSkill === skill) {
      strokeColor = '#FFF';
      this.ctx.lineWidth = 4;
    } else {
      this.ctx.lineWidth = 3;
    }

    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    this.ctx.fillStyle = fillColor;
    this.ctx.fill();
    this.ctx.strokeStyle = strokeColor;
    this.ctx.stroke();

    this.ctx.fillStyle = textColor;
    this.ctx.font = 'bold 12px monospace';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    
    const lines = skill.name.split(' ');
    const lineHeight = 14;
    const startY = y - (lines.length - 1) * lineHeight / 2;
    
    lines.forEach((line, index) => {
      this.ctx.fillText(line, x, startY + index * lineHeight);
    });

    if (skillState.currentLevel > 0) {
      this.ctx.font = 'bold 10px monospace';
      this.ctx.fillText(`${skillState.currentLevel}/${skill.maxLevel}`, x, y + radius - 10);
    }
  }

  drawCurrencyPanel() {
    const currencies = this.manager.getAllCurrencies();
    const panelHeight = this.currencyPanelHeight;
    
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    this.ctx.fillRect(0, 0, this.canvas.width, panelHeight);

    let x = 20;
    this.ctx.font = 'bold 16px monospace';
    this.ctx.textAlign = 'left';
    this.ctx.textBaseline = 'middle';

    for (const currency of Object.values(currencies)) {
      const amount = this.manager.getCurrency(currency.id);
      
      this.ctx.fillStyle = currency.color;
      this.ctx.fillText(`${currency.name}: ${amount}`, x, panelHeight / 2);
      
      x += 180;
    }
  }

  drawInfoPanel() {
    if (!this.hoveredSkill && !this.selectedSkill) {
      return;
    }

    const skill = this.hoveredSkill || this.selectedSkill;
    const skillState = this.manager.getSkillState(skill.id);
    const canPurchase = this.manager.canPurchaseSkill(skill.id);
    
    const panelWidth = this.tooltipWidth;
    const panelHeight = this.tooltipHeight;
    const panelX = this.canvas.width - panelWidth - this.tooltipMargin;
    const panelY = this.currencyPanelHeight + this.tooltipMargin;

    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
    this.ctx.fillRect(panelX, panelY, panelWidth, panelHeight);
    
    this.ctx.strokeStyle = canPurchase ? '#4CAF50' : '#444';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(panelX, panelY, panelWidth, panelHeight);

    let textY = panelY + this.tooltipPadding;
    const textX = panelX + this.tooltipPadding;
    const lineHeight = this.tooltipLineHeight;

    // Skill name (title)
    this.ctx.fillStyle = '#FFF';
    this.ctx.font = `bold ${this.tooltipFontSizeTitle}px monospace`;
    this.ctx.textAlign = 'left';
    this.ctx.fillText(skill.name, textX, textY);
    textY += lineHeight + this.tooltipSpacingLarge;

    // Skill description (body text)
    this.ctx.font = `${this.tooltipFontSizeBody}px monospace`;
    this.ctx.fillStyle = '#AAA';
    this.ctx.fillText(skill.description, textX, textY);
    textY += lineHeight + this.tooltipSpacingLarge;

    // Level information
    this.ctx.font = `${this.tooltipFontSizeDetails}px monospace`;
    this.ctx.fillStyle = '#FFF';
    this.ctx.fillText(`Level: ${skillState.currentLevel}/${skill.maxLevel}`, textX, textY);
    textY += lineHeight + this.tooltipSpacingSmall;

    // Cost or max level indicator
    if (skillState.currentLevel < skill.maxLevel) {
      const cost = skill.costs[skillState.currentLevel];
      this.ctx.fillStyle = '#FFD700';
      
      const costParts = [];
      for (const [currencyId, amount] of Object.entries(cost)) {
        const currencyData = this.manager.getAllCurrencies()[currencyId];
        const currentAmount = this.manager.getCurrency(currencyId);
        const hasEnough = currentAmount >= amount;
        
        costParts.push(`${amount} ${currencyData.name}${hasEnough ? '' : ' ⚠'}`);
      }
      
      const costText = `Cost: ${costParts.join(', ')}`;
      this.ctx.fillText(costText, textX, textY);
      textY += lineHeight + this.tooltipSpacingLarge;
    } else {
      this.ctx.fillStyle = '#FFD700';
      this.ctx.fillText('MAX LEVEL', textX, textY);
      textY += lineHeight + this.tooltipSpacingLarge;
    }

    // Prerequisites
    if (skill.prerequisites.length > 0) {
      this.ctx.fillStyle = '#AAA';
      this.ctx.fillText('Prerequisites:', textX, textY);
      textY += lineHeight;
      
      for (const prereqId of skill.prerequisites) {
        const prereqSkill = this.manager.getSkillData(prereqId);
        const prereqState = this.manager.getSkillState(prereqId);
        const met = prereqState.unlocked;
        
        this.ctx.fillStyle = met ? '#4CAF50' : '#F44336';
        this.ctx.fillText(`  ${met ? '✓' : '✗'} ${prereqSkill.name}`, textX, textY);
        textY += lineHeight + this.tooltipSpacingPrereq;
      }
    }

    // Purchase prompt
    if (canPurchase) {
      this.ctx.fillStyle = '#4CAF50';
      this.ctx.font = `bold ${this.tooltipFontSizeDetails}px monospace`;
      const bottomTextY = panelY + panelHeight - this.tooltipPadding;
      this.ctx.fillText('Double-click to purchase!', textX, bottomTextY);
    }
  }

  render() {
    this.ctx.fillStyle = '#0a0a1a';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Apply pan and zoom transformations
    this.ctx.save();
    this.ctx.translate(this.offsetX, this.offsetY);
    this.ctx.scale(this.scale, this.scale);

    this.drawConnections();
    
    const skills = this.manager.getAllSkills();
    for (const skill of skills) {
      this.drawSkillNode(skill);
    }
    
    this.ctx.restore();

    // Draw UI elements without transformation (currency panel and info panel)
    this.drawCurrencyPanel();
    this.drawInfoPanel();
  }

  show() {
    if (this.parentContainer) {
      this.parentContainer.classList.add('visible');
    } else {
      this.container.style.display = 'block';
    }
    
    // Center the view on the skill tree
    const skills = this.manager.getAllSkills();
    if (skills.length > 0) {
      let minX = Infinity, minY = Infinity;
      let maxX = -Infinity, maxY = -Infinity;
      
      for (const skill of skills) {
        minX = Math.min(minX, skill.position.x);
        minY = Math.min(minY, skill.position.y);
        maxX = Math.max(maxX, skill.position.x);
        maxY = Math.max(maxY, skill.position.y);
      }
      
      // Add padding
      const padding = this.autoCenterPadding;
      minX -= padding;
      minY -= padding;
      maxX += padding;
      maxY += padding;
      
      // Calculate scale to fit all skills
      const treeWidth = maxX - minX;
      const treeHeight = maxY - minY;
      const scaleX = this.canvas.width / treeWidth;
      const scaleY = (this.canvas.height - this.currencyPanelHeight) / treeHeight; // Account for currency panel
      this.scale = Math.min(scaleX, scaleY, this.maxAutoCenterScale);
      
      // Center the tree
      const scaledWidth = treeWidth * this.scale;
      const scaledHeight = treeHeight * this.scale;
      this.offsetX = (this.canvas.width - scaledWidth) / 2 - minX * this.scale;
      this.offsetY = ((this.canvas.height - scaledHeight) / 2 - minY * this.scale) + (this.currencyPanelHeight / 2); // Account for currency panel
    }
    
    this.render();
  }

  hide() {
    if (this.parentContainer) {
      this.parentContainer.classList.remove('visible');
    } else {
      this.container.style.display = 'none';
    }
  }

  isVisible() {
    if (this.parentContainer) {
      return this.parentContainer.classList.contains('visible');
    }
    return this.container.style.display !== 'none';
  }
}
