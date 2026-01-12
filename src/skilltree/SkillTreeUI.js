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

    this.selectedSkill = null;
    this.hoveredSkill = null;
    
    this.setupCanvas();
    this.setupEventListeners();
  }

  setupCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = 800;
    this.canvas.height = 450;
    this.canvas.style.width = '100%';
    this.canvas.style.height = 'auto';
    this.canvas.style.display = 'block';
    this.canvas.style.cursor = 'pointer';
    
    const ctx = this.canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get 2D context for skill tree canvas');
    }
    this.ctx = ctx;
    
    this.container.appendChild(this.canvas);
  }

  setupEventListeners() {
    this.canvas.addEventListener('click', (e) => this.handleClick(e));
    this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
  }

  getCanvasCoordinates(event) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;
    
    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY
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
    const coords = this.getCanvasCoordinates(event);
    const skill = this.getSkillAtPosition(coords.x, coords.y);
    
    if (skill) {
      this.selectedSkill = skill;
      
      if (this.manager.canPurchaseSkill(skill.id)) {
        this.manager.purchaseSkill(skill.id);
      }
      
      this.render();
    }
  }

  handleMouseMove(event) {
    const coords = this.getCanvasCoordinates(event);
    const skill = this.getSkillAtPosition(coords.x, coords.y);
    
    if (skill !== this.hoveredSkill) {
      this.hoveredSkill = skill;
      this.render();
    }
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
    const panelHeight = 40;
    
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
    
    const panelWidth = 350;
    const panelHeight = 180;
    const panelX = this.canvas.width - panelWidth - 10;
    const panelY = 50;

    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
    this.ctx.fillRect(panelX, panelY, panelWidth, panelHeight);
    
    this.ctx.strokeStyle = canPurchase ? '#4CAF50' : '#444';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(panelX, panelY, panelWidth, panelHeight);

    let textY = panelY + 20;
    const textX = panelX + 15;
    const lineHeight = 18;

    this.ctx.fillStyle = '#FFF';
    this.ctx.font = 'bold 16px monospace';
    this.ctx.textAlign = 'left';
    this.ctx.fillText(skill.name, textX, textY);
    textY += lineHeight + 5;

    this.ctx.font = '12px monospace';
    this.ctx.fillStyle = '#AAA';
    this.ctx.fillText(skill.description, textX, textY);
    textY += lineHeight + 5;

    this.ctx.fillStyle = '#FFF';
    this.ctx.fillText(`Level: ${skillState.currentLevel}/${skill.maxLevel}`, textX, textY);
    textY += lineHeight + 3;

    if (skillState.currentLevel < skill.maxLevel) {
      const cost = skill.costs[skillState.currentLevel];
      this.ctx.fillStyle = '#FFD700';
      let costText = 'Cost: ';
      
      const costParts = [];
      for (const [currencyId, amount] of Object.entries(cost)) {
        const currencyData = this.manager.getAllCurrencies()[currencyId];
        const currentAmount = this.manager.getCurrency(currencyId);
        const hasEnough = currentAmount >= amount;
        
        costParts.push(`${amount} ${currencyData.name}${hasEnough ? '' : ' ⚠'}`);
      }
      
      costText += costParts.join(', ');
      this.ctx.fillText(costText, textX, textY);
      textY += lineHeight + 5;
    } else {
      this.ctx.fillStyle = '#FFD700';
      this.ctx.fillText('MAX LEVEL', textX, textY);
      textY += lineHeight + 5;
    }

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
        textY += lineHeight - 2;
      }
    }

    if (canPurchase) {
      this.ctx.fillStyle = '#4CAF50';
      this.ctx.font = 'bold 12px monospace';
      this.ctx.fillText('Click to purchase!', textX, panelY + panelHeight - 15);
    }
  }

  render() {
    this.ctx.fillStyle = '#0a0a1a';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.drawConnections();
    
    const skills = this.manager.getAllSkills();
    for (const skill of skills) {
      this.drawSkillNode(skill);
    }

    this.drawCurrencyPanel();
    this.drawInfoPanel();
  }

  show() {
    this.container.style.display = 'block';
    this.render();
  }

  hide() {
    this.container.style.display = 'none';
  }

  isVisible() {
    return this.container.style.display !== 'none';
  }
}
