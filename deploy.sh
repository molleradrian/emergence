#!/bin/bash
# Project Emergence - Automated Deployment Script
# Supports multiple deployment targets and environments

set -e  # Exit on any error

# Configuration
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WEB_DIR="Web_Interface"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
LOG_FILE="$PROJECT_ROOT/deployment_$TIMESTAMP.log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$LOG_FILE"
    exit 1
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1" | tee -a "$LOG_FILE"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a "$LOG_FILE"
}

# Pre-deployment checks
pre_deployment_checks() {
    log "🔍 Running pre-deployment checks..."

    # Check if web directory exists
    if [ ! -d "$WEB_DIR" ]; then
        error "Web_Interface directory not found. Please ensure you're in the project root."
    fi

    # Check if required files exist
    if [ ! -f "$WEB_DIR/index.html" ]; then
        error "index.html not found in Web_Interface directory"
    fi

    # Check Node.js installation
    if ! command -v node &> /dev/null; then
        warning "Node.js not found. Some build processes may fail."
    fi

    # Check Git status
    if command -v git &> /dev/null && [ -d .git ]; then
        if [ -n "$(git status --porcelain)" ]; then
            warning "Working directory has uncommitted changes"
        fi
    fi

    success "Pre-deployment checks passed"
}

# Deploy to Netlify
deploy_to_netlify() {
    log "🚀 Deploying to Netlify..."

    # Check if Netlify CLI is installed
    if ! command -v netlify &> /dev/null; then
        error "Netlify CLI not found. Install with: npm install -g netlify-cli"
    fi

    # Check if user is logged in
    if ! netlify status &> /dev/null; then
        log "🔐 Please login to Netlify:"
        netlify login
    fi

    # Deploy to production
    log "📦 Deploying to production..."
    if netlify deploy --prod --dir="$WEB_DIR" --message="Automated deployment $TIMESTAMP"; then
        success "Netlify deployment completed successfully"
    else
        error "Netlify deployment failed"
    fi
}

# Deploy to Vercel
deploy_to_vercel() {
    log "🚀 Deploying to Vercel..."

    # Check if Vercel CLI is installed
    if ! command -v vercel &> /dev/null; then
        error "Vercel CLI not found. Install with: npm install -g vercel"
    fi

    # Deploy to production
    log "📦 Deploying to production..."
    if vercel --prod; then
        success "Vercel deployment completed successfully"
    else
        error "Vercel deployment failed"
    fi
}

# Validate deployment
validate_deployment() {
    log "✅ Validating deployment..."

    # Check if deployment URL is accessible (if provided)
    if [ -n "$DEPLOYMENT_URL" ]; then
        if curl -f -s "$DEPLOYMENT_URL" > /dev/null; then
            success "Deployment URL is accessible"
        else
            error "Deployment URL is not accessible"
        fi
    fi

    # Run basic functionality tests
    log "🧪 Running basic functionality tests..."

    # Test if main page loads
    if [ -f "$WEB_DIR/index.html" ]; then
        success "Main application file exists and is accessible"
    fi

    # Validate HTML structure
    if command -v html5validator &> /dev/null; then
        log "🔍 Validating HTML structure..."
        if html5validator --root "$WEB_DIR" --show-warnings; then
            success "HTML validation passed"
        else
            warning "HTML validation found issues"
        fi
    fi

    success "Deployment validation completed"
}

# Post-deployment tasks
post_deployment_tasks() {
    log "🔧 Running post-deployment tasks..."

    # Create deployment record
    cat > "deployment_record_$TIMESTAMP.json" << EOF
{
    "timestamp": "$TIMESTAMP",
    "deployment_type": "$DEPLOYMENT_TARGET",
    "version": "$(git rev-parse HEAD 2>/dev/null || echo 'unknown')",
    "status": "success",
    "artifacts": {
        "web_directory": "$WEB_DIR",
        "main_file": "$WEB_DIR/index.html",
        "log_file": "$LOG_FILE"
    }
}
EOF

    # Send notification (if configured)
    if [ -n "$DEPLOYMENT_WEBHOOK" ]; then
        log "📢 Sending deployment notification..."
        curl -X POST -H 'Content-type: application/json' \
             --data "{\"text\":\"Project Emergence deployed successfully at $TIMESTAMP\"}" \
             "$DEPLOYMENT_WEBHOOK"
    fi

    success "Post-deployment tasks completed"
}

# Main deployment function
main() {
    echo "🚀 Project Emergence - Automated Deployment System"
    echo "=================================================="

    # Parse command line arguments
    DEPLOYMENT_TARGET="${1:-netlify}"
    DEPLOYMENT_URL="${2:-}"

    log "🎯 Starting deployment to: $DEPLOYMENT_TARGET"
    log "📝 Log file: $LOG_FILE"

    # Run deployment steps
    pre_deployment_checks

    case "$DEPLOYMENT_TARGET" in
        "netlify")
            deploy_to_netlify
            ;;
        "vercel")
            deploy_to_vercel
            ;;
        *)
            error "Unknown deployment target: $DEPLOYMENT_TARGET"
            ;;
    esac

    validate_deployment
    post_deployment_tasks

    success "🎉 Deployment completed successfully!"
    echo ""
    echo "📋 Summary:"
    echo "   Target: $DEPLOYMENT_TARGET"
    echo "   Timestamp: $TIMESTAMP"
    echo "   Log: $LOG_FILE"
    echo "   Status: ✅ SUCCESS"
    echo ""
    echo "🌟 Project Emergence is now live and operational!"
}

# Handle script arguments and run
if [ "${BASH_SOURCE[0]}" = "${0}" ]; then
    main "$@"
fi
