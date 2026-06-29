#!/usr/bin/env bash
# Start Passport, Visita, Engage, and Backoffice for local manual testing.
set -euo pipefail

readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly BACKOFFICE_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
readonly PASSPORT_DIR="$(cd "${BACKOFFICE_DIR}/../passport" && pwd)"
readonly VISITA_DIR="$(cd "${BACKOFFICE_DIR}/../visita" && pwd)"
readonly ENGAGE_DIR="$(cd "${BACKOFFICE_DIR}/../engage" && pwd)"

readonly LOG_DIR="${TMPDIR:-/tmp}/vepo-platform"
readonly PASSPORT_URL="http://localhost:8080/q/health/ready"
readonly VISITA_URL="http://localhost:8081/q/health/ready"
readonly ENGAGE_URL="http://localhost:8082/q/health/ready"
readonly BACKOFFICE_URL="http://localhost:4200"

PIDS=()

usage() {
  cat <<'EOF'
Usage: dev-platform.sh [options]

Starts the full local platform for manual testing:
  Passport   → http://localhost:8080
  Visita     → http://localhost:8081
  Engage     → http://localhost:8082
  Backoffice → http://localhost:4200

Options:
  -h, --help        Show this help
  --skip-install    Do not run npm install when node_modules is missing

Environment:
  YOUTUBE_API_KEY              Required for Engage YouTube statistics (Google Cloud API key)
  PASSPORT_INTERNAL_SERVICE_KEY  Shared secret for Engage → Passport sync notifications
                                 (default in dev: dev-internal-service-key)

Login: cto@passport.vepo.dev / qwas1234

Press Ctrl+C to stop all services, or run ./scripts/stop-dev-platform.sh from another terminal.
EOF
}

SKIP_INSTALL=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    -h | --help)
      usage
      exit 0
      ;;
    --skip-install)
      SKIP_INSTALL=true
      shift
      ;;
    *)
      echo "Unknown option: $1" >&2
      usage >&2
      exit 1
      ;;
  esac
done

require_dir() {
  local label="$1"
  local path="$2"
  if [[ ! -d "${path}" ]]; then
    echo "Missing ${label} directory: ${path}" >&2
    exit 1
  fi
}

require_cmd() {
  local cmd="$1"
  if ! command -v "${cmd}" >/dev/null 2>&1; then
    echo "Required command not found: ${cmd}" >&2
    exit 1
  fi
}

resolve_maven() {
  local project_dir="$1"
  if [[ -x "${project_dir}/mvnw" ]]; then
    printf '%s\n' "${project_dir}/mvnw"
    return
  fi
  if command -v mvn >/dev/null 2>&1; then
    printf '%s\n' mvn
    return
  fi
  echo "No Maven found for ${project_dir}. Install Maven or add mvnw to the project." >&2
  exit 1
}

cleanup() {
  echo ""
  echo "Stopping platform services..."
  for pid in "${PIDS[@]}"; do
    kill -TERM "-${pid}" 2>/dev/null || kill -TERM "${pid}" 2>/dev/null || true
  done
  wait 2>/dev/null || true
}

wait_for_url() {
  local url="$1"
  local name="$2"
  local attempts=90
  local attempt=0

  printf 'Waiting for %s' "${name}"
  while ! curl -sf "${url}" >/dev/null 2>&1; do
    attempt=$((attempt + 1))
    if [[ "${attempt}" -ge "${attempts}" ]]; then
      echo " timeout" >&2
      echo "Check logs in ${LOG_DIR}" >&2
      exit 1
    fi
    printf '.'
    sleep 2
  done
  echo " ready"
}

start_service() {
  local name="$1"
  local dir="$2"
  shift 2

  mkdir -p "${LOG_DIR}"
  local log_file="${LOG_DIR}/${name}.log"

  setsid bash -c "cd $(printf '%q' "${dir}") && exec $(printf '%q ' "$@")" \
    >"${log_file}" 2>&1 &
  local pid=$!
  PIDS+=("${pid}")
  echo "Started ${name} (pid ${pid}, log: ${log_file})"
}

require_cmd curl
require_dir "Passport" "${PASSPORT_DIR}"
require_dir "Visita" "${VISITA_DIR}"
require_dir "Engage" "${ENGAGE_DIR}"
require_dir "Backoffice" "${BACKOFFICE_DIR}"

trap cleanup EXIT INT TERM

PASSPORT_MVN="$(resolve_maven "${PASSPORT_DIR}")"
VISITA_MVN="$(resolve_maven "${VISITA_DIR}")"
ENGAGE_MVN="$(resolve_maven "${ENGAGE_DIR}")"

if [[ ! -d "${BACKOFFICE_DIR}/node_modules" && "${SKIP_INSTALL}" == false ]]; then
  echo "Installing Backoffice dependencies..."
  (cd "${BACKOFFICE_DIR}" && npm install)
fi

if [[ -z "${YOUTUBE_API_KEY:-}" ]]; then
  echo "Warning: YOUTUBE_API_KEY is not set. Engage YouTube statistics will fail until you export a valid API key."
fi

export PASSPORT_INTERNAL_SERVICE_KEY="${PASSPORT_INTERNAL_SERVICE_KEY:-dev-internal-service-key}"

echo "Starting Passport..."
start_service passport "${PASSPORT_DIR}" "${PASSPORT_MVN}" -B quarkus:dev
wait_for_url "${PASSPORT_URL}" "Passport"

echo "Starting Visita..."
start_service visita "${VISITA_DIR}" "${VISITA_MVN}" -B quarkus:dev
wait_for_url "${VISITA_URL}" "Visita"

echo "Starting Engage..."
start_service engage "${ENGAGE_DIR}" "${ENGAGE_MVN}" -B quarkus:dev
wait_for_url "${ENGAGE_URL}" "Engage"

echo "Starting Backoffice..."
start_service backoffice "${BACKOFFICE_DIR}" npx ng serve --proxy-config src/proxy.conf.json

wait_for_url "${BACKOFFICE_URL}" "Backoffice"

cat <<EOF

Platform is ready for local testing:
  Backoffice  ${BACKOFFICE_URL}  (login: cto@passport.vepo.dev / qwas1234)
  Passport    http://localhost:8080
  Visita      http://localhost:8081
  Engage      http://localhost:8082  (/statistics in Backoffice)

Logs: ${LOG_DIR}
Press Ctrl+C to stop services.

EOF

# Block until Ctrl+C (avoid `wait` + set -e exiting when a child dies unexpectedly)
tail -f /dev/null
