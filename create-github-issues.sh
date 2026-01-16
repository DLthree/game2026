#!/bin/bash
#
# Script to create all 8 GitHub Issues from GITHUB_ISSUES.md
# 
# Prerequisites:
#   - GitHub CLI (gh) installed and authenticated
#   - Run from the game2026 repository root
#
# Usage:
#   chmod +x create-github-issues.sh
#   ./create-github-issues.sh

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if gh is installed
if ! command -v gh &> /dev/null; then
    echo -e "${RED}Error: GitHub CLI (gh) is not installed.${NC}"
    echo "Install it from: https://cli.github.com/"
    exit 1
fi

# Check if authenticated
if ! gh auth status &> /dev/null; then
    echo -e "${RED}Error: Not authenticated with GitHub CLI${NC}"
    echo "Run: gh auth login"
    exit 1
fi

# Check if GITHUB_ISSUES.md exists
if [ ! -f "GITHUB_ISSUES.md" ]; then
    echo -e "${RED}Error: GITHUB_ISSUES.md not found${NC}"
    echo "Run this script from the repository root directory"
    exit 1
fi

echo -e "${BLUE}Creating 8 GitHub Issues from GITHUB_ISSUES.md...${NC}\n"

# Function to extract issue content
extract_issue() {
    local issue_num=$1
    local start_pattern="^## Issue #${issue_num}:"
    local end_pattern="^---$"
    
    # Extract content between issue header and separator
    awk "/${start_pattern}/,/${end_pattern}/" GITHUB_ISSUES.md | \
        tail -n +2 | sed '$d'
}

# Issue #1: Gems and Experience
echo -e "${BLUE}Creating Issue #1: Gems and Experience Currency System...${NC}"
ISSUE1_BODY=$(extract_issue "1")
gh issue create \
    --repo DLthree/game2026 \
    --title "Implement Gems and Experience Currency System" \
    --body "$ISSUE1_BODY"
echo -e "${GREEN}✓ Issue #1 created${NC}\n"

# Issue #2: Boss Fight
echo -e "${BLUE}Creating Issue #2: Boss Fight Mechanics...${NC}"
ISSUE2_BODY=$(extract_issue "2")
gh issue create \
    --repo DLthree/game2026 \
    --title "Add Boss Fight Mechanics" \
    --body "$ISSUE2_BODY"
echo -e "${GREEN}✓ Issue #2 created${NC}\n"

# Issue #3: Enemy Types
echo -e "${BLUE}Creating Issue #3: Additional Enemy Types...${NC}"
ISSUE3_BODY=$(extract_issue "3")
gh issue create \
    --repo DLthree/game2026 \
    --title "Implement Additional Enemy Types" \
    --body "$ISSUE3_BODY"
echo -e "${GREEN}✓ Issue #3 created${NC}\n"

# Issue #4: Tooltip Size
echo -e "${BLUE}Creating Issue #4: Enlarge Skill Tree Tooltips...${NC}"
ISSUE4_BODY=$(extract_issue "4")
gh issue create \
    --repo DLthree/game2026 \
    --title "Enlarge Skill Tree Tooltips" \
    --body "$ISSUE4_BODY"
echo -e "${GREEN}✓ Issue #4 created${NC}\n"

# Issue #5: Skill Tree Content
echo -e "${BLUE}Creating Issue #5: Expand Skill Tree Content...${NC}"
ISSUE5_BODY=$(extract_issue "5")
gh issue create \
    --repo DLthree/game2026 \
    --title "Expand Skill Tree Content" \
    --body "$ISSUE5_BODY"
echo -e "${GREEN}✓ Issue #5 created${NC}\n"

# Issue #6: Touch to Grab
echo -e "${BLUE}Creating Issue #6: Touch to Grab Gems...${NC}"
ISSUE6_BODY=$(extract_issue "6")
gh issue create \
    --repo DLthree/game2026 \
    --title "Implement Touch to Grab Gems/Currency" \
    --body "$ISSUE6_BODY"
echo -e "${GREEN}✓ Issue #6 created${NC}\n"

# Issue #7: Drag Line
echo -e "${BLUE}Creating Issue #7: Drag Line for Ship...${NC}"
ISSUE7_BODY=$(extract_issue "7")
gh issue create \
    --repo DLthree/game2026 \
    --title "Add Drag Line for Ship Movement" \
    --body "$ISSUE7_BODY"
echo -e "${GREEN}✓ Issue #7 created${NC}\n"

# Issue #8: Grid Lighting
echo -e "${BLUE}Creating Issue #8: Grid Lighting Effect...${NC}"
ISSUE8_BODY=$(extract_issue "8")
gh issue create \
    --repo DLthree/game2026 \
    --title "Add Grid Lighting Effect at Touch Point" \
    --body "$ISSUE8_BODY"
echo -e "${GREEN}✓ Issue #8 created${NC}\n"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}All 8 issues created successfully!${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "\nView issues at: https://github.com/DLthree/game2026/issues"
