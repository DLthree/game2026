/**
 * Skill Tree UI configuration
 * Centralizes all UI-related constants for the skill tree
 */

export const SkillTreeUIConfig = {
  // Canvas dimensions
  canvasWidth: 1200,
  canvasHeight: 900,
  
  // Zoom settings
  minScale: 0.5,
  maxScale: 2.0,
  zoomInFactor: 1.1,
  zoomOutFactor: 0.9,
  
  // Auto-center settings
  autoCenterPadding: 100,
  maxAutoCenterScale: 1.5,
  
  // Double-tap detection
  doubleTapTimeout: 500, // milliseconds
  
  // Tooltip dimensions and spacing
  tooltipWidth: 700,
  tooltipHeight: 400,
  tooltipMargin: 10, // Margin from canvas edge
  tooltipPadding: 30,
  
  // Tooltip font sizes
  tooltipFontSizeTitle: 42,
  tooltipFontSizeBody: 32,
  tooltipFontSizeDetails: 28,
  tooltipLineHeight: 48,
  
  // Tooltip spacing
  tooltipSpacingLarge: 12,
  tooltipSpacingSmall: 8,
  tooltipSpacingPrereq: -2, // Tighter spacing for prerequisite list
  
  // Currency panel
  currencyPanelHeight: 40
};
