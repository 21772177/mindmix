#!/bin/bash
# Basic coturn install and configuration script for Ubuntu/Debian
# Run as root or with sudo.
# This script installs coturn, configures it for long-term operation, and adds a static user.
# NOTE: Review and secure the configuration before production use.

set -e

REALM=${COTURN_REALM:-"example.com"}
USER=${COTURN_USER:-"turnuser"}
PASS=${COTURN_PASS:-"turnpass"}
PORT=${COTURN_PORT:-3478}

echo "Updating packages..."
apt-get update

echo "Installing coturn..."
apt-get install -y coturn

echo "Enabling coturn as a service..."
sed -i 's/NO_TURN_OFF=1/NO_TURN_OFF=0/' /etc/default/coturn || true
systemctl enable coturn
systemctl stop coturn || true

CONF="/etc/turnserver.conf"

echo "Writing configuration to $CONF"
cat > $CONF <<EOL
listening-port=$PORT
fingerprint
lt-cred-mech
use-auth-secret
static-auth-secret=$(openssl rand -hex 32)
realm=$REALM
total-quota=100
bps-capacity=0
stale-nonce=600
no-stdout-log
log-file=/var/log/turnserver/turnserver.log
simple-log
no-multicast-peers
EOL

echo "Adding user (long-term credential) to /etc/turnusers.txt"
echo "$USER:$PASS" > /etc/turnusers.txt
chown root:root /etc/turnusers.txt
chmod 600 /etc/turnusers.txt

echo "Starting coturn..."
systemctl start coturn

echo "Coturn installed and started. User: $USER"
echo "Remember to open port $PORT (UDP/TCP) on your firewall."
