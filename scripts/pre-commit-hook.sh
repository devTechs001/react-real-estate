#!/bin/bash
# Pre-commit hook to prevent committing secrets

# Colors for output
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo "🔍 Scanning for secrets..."

ERRORS=0

# Patterns to check (common secret formats)
declare -a PATTERNS=(
  "sk-[a-zA-Z0-9]{20,}"                                    # OpenAI API keys
  "sk-proj-[a-zA-Z0-9]{20,}"                               # OpenAI project keys
  "ghp_[a-zA-Z0-9]{36}"                                    # GitHub personal access tokens
  "gho_[a-zA-Z0-9]{36}"                                    # GitHub OAuth tokens
  "github_pat_[a-zA-Z0-9]{22}_[a-zA-Z0-9]{59}"             # GitHub fine-grained tokens
  "AKIA[0-9A-Z]{16}"                                       # AWS access key ID
  "AIza[0-9A-Za-z\\-_]{35}"                                # Google API keys
  "Bearer [a-zA-Z0-9\\-_]+\\.[a-zA-Z0-9\\-_]+\\.[a-zA-Z0-9\\-_]+" # JWT tokens
  "-----BEGIN (RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----"   # Private keys
  "password\s*=\s*['\"][^'\"]{8,}['\"]"                     # Hardcoded passwords
  "api[_-]?key\s*=\s*['\"][^'\"]{16,}['\"]"                 # Generic API keys
  "secret[_-]?key\s*=\s*['\"][^'\"]{16,}['\"]"              # Generic secret keys
)

# Files to always skip
SKIP_FILES=(
  ".env"
  ".env.local"
  ".env.production"
  ".env.*"
  "*.pem"
  "*.key"
  "secrets.json"
  "credentials.json"
)

# Get staged files
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM)

for FILE in $STAGED_FILES; do
  # Skip if file matches skip patterns
  SKIP=0
  for SKIP_PATTERN in "${SKIP_FILES[@]}"; do
    if [[ "$FILE" == $SKIP_PATTERN ]] || [[ "$FILE" == */$SKIP_PATTERN ]]; then
      SKIP=1
      break
    fi
  done
  
  if [ $SKIP -eq 1 ]; then
    echo -e "${YELLOW}⚠️  Skipping: $FILE (sensitive file pattern)${NC}"
    continue
  fi
  
  # Skip if file doesn't exist (deleted)
  if [ ! -f "$FILE" ]; then
    continue
  fi
  
  # Check file content against patterns
  for PATTERN in "${PATTERNS[@]}"; do
    if grep -qE "$PATTERN" "$FILE" 2>/dev/null; then
      echo -e "${RED}❌ Potential secret found in: $FILE${NC}"
      echo -e "${RED}   Pattern: $PATTERN${NC}"
      ERRORS=1
    fi
  done
done

if [ $ERRORS -eq 1 ]; then
  echo ""
  echo -e "${RED}╔════════════════════════════════════════════════════════╗${NC}"
  echo -e "${RED}║  🛑 COMMIT BLOCKED: Potential secrets detected!       ║${NC}"
  echo -e "${RED}╚════════════════════════════════════════════════════════╝${NC}"
  echo ""
  echo "Please remove the secrets from your files before committing."
  echo "Consider using environment variables (.env files) instead."
  echo ""
  echo "Tip: Add sensitive files to .gitignore:"
  echo "  .env"
  echo "  .env.local"
  echo "  .env.production"
  echo "  *.pem"
  echo "  *.key"
  echo ""
  exit 1
fi

echo -e "${GREEN}✅ No secrets detected${NC}"
exit 0
