#!/bin/bash

# ============================================
# KEEPIO - Script de déploiement
# ============================================
# Usage: ./deploy.sh <command>
#
#   command: full | code | nginx | ssl | restart | health | backup | logs | status
#
# Exemples:
#   ./deploy.sh full        # Déploiement complet
#   ./deploy.sh code        # Déploiement code seulement
#   ./deploy.sh ssl         # Configuration SSL
#   ./deploy.sh restart     # Redémarrer les services
# ============================================

set -e

# --- Configuration ---
PROJECT_NAME="keepio-landing"
DOMAIN="keepio.fr"
DOMAIN_ALIASES="www.keepio.fr"
PORT=3004

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="${PROJECT_DIR:-$SCRIPT_DIR}"

NGINX_CONFIG="/etc/nginx/sites-available/$PROJECT_NAME"
BACKUP_DIR="/var/backups/$PROJECT_NAME"
LOG_FILE="/var/log/deploy-$PROJECT_NAME.log"

# Couleurs pour les logs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
NC='\033[0m'

# Fonctions utilitaires
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE" 2>/dev/null || echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$LOG_FILE" 2>/dev/null || echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

warn() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a "$LOG_FILE" 2>/dev/null || echo -e "${YELLOW}[WARNING]${NC} $1"
}

info() {
    echo -e "${BLUE}[INFO]${NC} $1" | tee -a "$LOG_FILE" 2>/dev/null || echo -e "${BLUE}[INFO]${NC} $1"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1" | tee -a "$LOG_FILE" 2>/dev/null || echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# Vérifications préliminaires
check_requirements() {
    log "Vérification des prérequis..."

    if ! command -v bun &> /dev/null; then
        error "Bun n'est pas installé. Installez-le avec: curl -fsSL https://bun.sh/install | bash"
    fi
    success "Bun $(bun --version) détecté"

    if ! command -v pm2 &> /dev/null; then
        info "Installation de PM2..."
        npm install -g pm2 || error "Impossible d'installer PM2"
    fi
    success "PM2 détecté"

    if ! command -v nginx &> /dev/null; then
        error "Nginx n'est pas installé. Installez-le avec: sudo apt install nginx"
    fi
    success "Nginx détecté"

    if ! command -v git &> /dev/null; then
        error "Git n'est pas installé"
    fi
    success "Git détecté"

    log "Tous les prérequis sont satisfaits"
}

# Vérifier les variables d'environnement
check_env() {
    log "Vérification des variables d'environnement..."

    ENV_FILE="$PROJECT_DIR/.env.local"

    if [ ! -f "$ENV_FILE" ]; then
        ENV_FILE="$PROJECT_DIR/.env"
    fi

    if [ ! -f "$ENV_FILE" ]; then
        warn "Aucun fichier d'environnement trouvé (.env.local ou .env)"
        return
    fi

    info "Utilisation de: $(basename $ENV_FILE)"

    source "$ENV_FILE"

    MISSING_VARS=()
    [ -z "$RESEND_API_KEY" ] && MISSING_VARS+=("RESEND_API_KEY")

    if [ ${#MISSING_VARS[@]} -gt 0 ]; then
        warn "Variables manquantes: ${MISSING_VARS[*]}"
        warn "Le formulaire de contact ne fonctionnera pas sans RESEND_API_KEY"
    else
        success "Configuration validée"
    fi
}

# Création des répertoires
create_directories() {
    log "Création des répertoires..."

    sudo mkdir -p "$BACKUP_DIR"
    sudo mkdir -p "/var/log/$PROJECT_NAME"

    success "Répertoires créés"
}

# Sauvegarde avant déploiement
backup_current() {
    if [ -d "$PROJECT_DIR/.next" ]; then
        log "Sauvegarde de l'ancienne version..."
        BACKUP_NAME="backup-$(date +'%Y%m%d-%H%M%S')"
        sudo mkdir -p "$BACKUP_DIR/$BACKUP_NAME"
        sudo cp -r "$PROJECT_DIR/.next" "$BACKUP_DIR/$BACKUP_NAME/"
        sudo cp "$PROJECT_DIR/package.json" "$BACKUP_DIR/$BACKUP_NAME/" 2>/dev/null || true
        success "Sauvegarde créée: $BACKUP_DIR/$BACKUP_NAME"
    fi
}

# Déploiement du code
deploy_code() {
    log "Déploiement du code..."

    cd "$PROJECT_DIR"

    # Git pull si c'est un repo
    if [ -d ".git" ]; then
        if ! git diff --quiet || ! git diff --cached --quiet; then
            error "Changements locaux non committés détectés ! Committez et pushez avant de déployer.\n$(git status --short)"
        fi

        UNTRACKED=$(git ls-files --others --exclude-standard | grep -v -E '^\.(env|ENV)' | head -5)
        if [ -n "$UNTRACKED" ]; then
            warn "Fichiers non trackés détectés (ignorés):\n$UNTRACKED"
        fi

        git fetch origin
        BRANCH=$(git rev-parse --abbrev-ref HEAD)
        REMOTE=$(git rev-parse "origin/$BRANCH" 2>/dev/null || echo "")

        if [ -n "$REMOTE" ]; then
            UNPUSHED=$(git log "origin/$BRANCH..HEAD" --oneline 2>/dev/null)
            if [ -n "$UNPUSHED" ]; then
                error "Commits locaux non pushés détectés ! Pushez avant de déployer.\n$UNPUSHED"
            fi
        fi

        log "Récupération des dernières modifications..."
        git pull --ff-only origin "$BRANCH" || error "Impossible de pull (divergence détectée). Résolvez manuellement."
        success "Code mis à jour depuis Git"
    fi

    # Installation des dépendances
    log "Installation des dépendances..."
    bun install --frozen-lockfile 2>/dev/null || bun install
    success "Dépendances installées"

    # Nettoyage du cache
    log "Nettoyage du cache..."
    rm -rf .next
    success "Cache nettoyé"

    # Build de production
    log "Build de production..."
    NODE_ENV=production bun run build || error "Échec du build"
    success "Build terminé"

    success "Code déployé"
}

# Génération de la configuration Nginx
generate_nginx_config() {
    local server_names="$DOMAIN"
    if [ -n "$DOMAIN_ALIASES" ]; then
        server_names="$DOMAIN $DOMAIN_ALIASES"
    fi

    cat << EOF
server {
    server_name ${server_names};

    location / {
        proxy_pass http://localhost:${PORT};
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    location /_next/static/ {
        proxy_pass http://localhost:${PORT};
        expires 7d;
        add_header Cache-Control "public, max-age=604800, immutable";
    }

    listen 80;
}
EOF
}

# Configuration Nginx
setup_nginx() {
    log "Configuration de Nginx..."

    generate_nginx_config | sudo tee "$NGINX_CONFIG" > /dev/null

    sudo ln -sf "$NGINX_CONFIG" "/etc/nginx/sites-enabled/$PROJECT_NAME"

    sudo nginx -t || error "Erreur dans la configuration Nginx"

    sudo systemctl reload nginx

    local domains="$DOMAIN"
    [ -n "$DOMAIN_ALIASES" ] && domains="$domains, $DOMAIN_ALIASES"
    success "Nginx configuré pour $domains -> localhost:$PORT"
}

# Configuration SSL avec Let's Encrypt
setup_ssl() {
    log "Configuration SSL avec Let's Encrypt..."

    if ! command -v certbot &> /dev/null; then
        info "Installation de certbot..."
        sudo apt update && sudo apt install -y certbot python3-certbot-nginx
    fi

    local certbot_domains="-d $DOMAIN"
    if [ -n "$DOMAIN_ALIASES" ]; then
        for alias in $DOMAIN_ALIASES; do
            certbot_domains="$certbot_domains -d $alias"
        done
    fi

    if [ ! -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ]; then
        log "Génération du certificat SSL pour $DOMAIN..."
        sudo certbot --nginx $certbot_domains --non-interactive --agree-tos --email "admin@keepio.fr" || warn "Impossible de générer le certificat SSL"
    else
        info "Certificat SSL existant pour $DOMAIN"
        sudo certbot renew --dry-run || warn "Problème avec le renouvellement SSL"
    fi

    if ! crontab -l 2>/dev/null | grep -q "certbot renew"; then
        log "Configuration du renouvellement automatique SSL..."
        (crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -
    fi

    success "SSL configuré pour $DOMAIN"
}

# Génération de ecosystem.config.js
generate_ecosystem_config() {
    cat << EOF > "$PROJECT_DIR/ecosystem.config.js"
module.exports = {
  apps: [
    {
      name: '$PROJECT_NAME',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p $PORT',
      cwd: '$PROJECT_DIR',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: $PORT
      },
      error_file: '/var/log/$PROJECT_NAME/error.log',
      out_file: '/var/log/$PROJECT_NAME/out.log',
      log_file: '/var/log/$PROJECT_NAME/combined.log',
      time: true,
      merge_logs: true
    }
  ]
};
EOF
    success "ecosystem.config.js généré ($PROJECT_NAME sur port $PORT)"
}

# Démarrage des services avec PM2
start_services() {
    log "Démarrage des services avec PM2..."

    cd "$PROJECT_DIR"

    generate_ecosystem_config

    if pm2 list | grep -q "$PROJECT_NAME"; then
        info "Arrêt de l'instance $PROJECT_NAME existante..."
        pm2 stop "$PROJECT_NAME" 2>/dev/null || true
        pm2 delete "$PROJECT_NAME" 2>/dev/null || true
    fi

    pm2 start ecosystem.config.js --env production

    sleep 3

    pm2 save

    pm2 startup systemd -u $USER --hp $HOME 2>/dev/null || warn "Impossible de configurer le démarrage automatique"

    success "Service $PROJECT_NAME démarré sur port $PORT"
}

# Vérifications de santé
health_check() {
    log "Vérifications de santé..."

    sleep 3

    if curl -f -s "http://localhost:$PORT" > /dev/null 2>&1; then
        success "Application répond sur localhost:$PORT"
    else
        warn "L'application ne répond pas sur localhost:$PORT"
        info "Vérifiez les logs: pm2 logs $PROJECT_NAME"
    fi

    if curl -f -s "http://$DOMAIN" > /dev/null 2>&1; then
        success "Application accessible via http://$DOMAIN"
    else
        warn "Application non accessible via $DOMAIN (vérifiez DNS)"
    fi

    if curl -f -s "https://$DOMAIN" > /dev/null 2>&1; then
        success "Application accessible via https://$DOMAIN"
    else
        info "HTTPS non configuré ou certificat manquant"
    fi

    echo ""
    pm2 status "$PROJECT_NAME"
}

# Nettoyage des vieilles sauvegardes
cleanup() {
    log "Nettoyage..."

    if [ -d "$BACKUP_DIR" ]; then
        cd "$BACKUP_DIR"
        ls -t | tail -n +6 | xargs -r sudo rm -rf
    fi

    pm2 flush "$PROJECT_NAME" 2>/dev/null || true

    success "Nettoyage terminé"
}

# Fonction principale
main() {
    local cmd="${1:-}"

    case "${cmd:-}" in
        full)
            log "Déploiement complet de $PROJECT_NAME..."
            check_requirements
            check_env
            create_directories
            backup_current
            deploy_code
            setup_nginx
            start_services
            health_check
            cleanup
            echo ""
            success "Déploiement complet terminé!"
            echo ""
            echo "Application accessible sur:"
            echo "  - Local:  http://localhost:$PORT"
            echo "  - HTTP:   http://$DOMAIN"
            [ -n "$DOMAIN_ALIASES" ] && echo "  - Alias:  $DOMAIN_ALIASES"
            echo ""
            echo "Pour activer HTTPS: ./deploy.sh ssl"
            echo "Commandes utiles:"
            echo "  - pm2 logs $PROJECT_NAME"
            echo "  - pm2 status"
            echo "  - ./deploy.sh status"
            ;;
        code)
            log "Déploiement du code..."
            check_env
            backup_current
            deploy_code
            pm2 restart "$PROJECT_NAME" 2>/dev/null || start_services
            health_check
            success "Code déployé!"
            ;;
        nginx)
            setup_nginx
            success "Nginx configuré!"
            ;;
        ssl)
            setup_ssl
            sudo systemctl reload nginx
            health_check
            success "SSL configuré!"
            ;;
        restart)
            pm2 restart "$PROJECT_NAME"
            sudo systemctl reload nginx
            health_check
            success "Services redémarrés!"
            ;;
        health)
            health_check
            ;;
        backup)
            backup_current
            success "Sauvegarde créée!"
            ;;
        logs)
            pm2 logs "$PROJECT_NAME" --lines 50
            ;;
        status)
            echo ""
            echo "=========================================="
            echo "   KEEPIO - Statut"
            echo "=========================================="
            echo ""
            local status="OFF"
            if pm2 list 2>/dev/null | grep -q "$PROJECT_NAME.*online"; then
                status="${GREEN}ONLINE${NC}"
            elif pm2 list 2>/dev/null | grep -q "$PROJECT_NAME"; then
                status="${RED}STOPPED${NC}"
            fi
            echo -e "  Status:  $status"
            echo -e "  Domain:  $DOMAIN"
            echo -e "  Port:    $PORT"
            echo ""
            pm2 status "$PROJECT_NAME" 2>/dev/null || true
            ;;
        *)
            echo ""
            echo "=========================================="
            echo "   KEEPIO - Deployment Script"
            echo "=========================================="
            echo ""
            echo "  Domaine: $DOMAIN"
            echo "  Port:    $PORT"
            echo "  PM2:     $PROJECT_NAME"
            echo ""
            echo "Commandes disponibles:"
            echo "  ./deploy.sh full      Déploiement complet"
            echo "  ./deploy.sh code      Déploiement code seulement"
            echo "  ./deploy.sh nginx     Configuration Nginx"
            echo "  ./deploy.sh ssl       Configuration SSL"
            echo "  ./deploy.sh restart   Redémarrer les services"
            echo "  ./deploy.sh health    Vérifications de santé"
            echo "  ./deploy.sh backup    Sauvegarder"
            echo "  ./deploy.sh logs      Voir les logs PM2"
            echo "  ./deploy.sh status    Statut du service"
            echo ""
            ;;
    esac
}

# Point d'entrée
main "$@"
