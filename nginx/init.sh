#!/bin/sh
set -e

SSL_DIR="/etc/letsencrypt/live/issykrelax.kg"

if [ ! -f "$SSL_DIR/fullchain.pem" ]; then
    echo "[init] REAL SSL cert not found, generating self-signed cert for startup..."
    mkdir -p "$SSL_DIR"
    openssl req -x509 -nodes -newkey rsa:4096 \
        -keyout "$SSL_DIR/privkey.pem" \
        -out "$SSL_DIR/fullchain.pem" \
        -days 365 \
        -subj "/CN=issykrelax.kg" > /dev/null 2>&1
    cp "$SSL_DIR/fullchain.pem" "$SSL_DIR/chain.pem"
    echo "[init] Self-signed cert generated (will be replaced by certbot)"
fi
