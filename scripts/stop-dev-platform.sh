#!/usr/bin/env bash
# Stop Passport, Visita, Engage, and Backoffice started by dev-platform.sh.
set -euo pipefail

readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly LOG_DIR="${TMPDIR:-/tmp}/vepo-platform"
readonly GRACE_SECONDS=5

readonly SERVICE_NAMES=(passport visita engage backoffice)
readonly SERVICE_PORTS=(8080 8081 8082 4200)

FORCE=false

usage() {
  cat <<'EOF'
Usage: stop-dev-platform.sh [options]

Stops services started by dev-platform.sh:
  Passport (8080), Visita (8081), Engage (8082), Backoffice (4200)

Options:
  -h, --help   Show this help
  -f, --force  SIGKILL listeners still up after TERM grace period
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    -h | --help)
      usage
      exit 0
      ;;
    -f | --force)
      FORCE=true
      shift
      ;;
    *)
      echo "Unknown option: $1" >&2
      usage >&2
      exit 1
      ;;
  esac
done

pids_on_port() {
  local port="$1"
  if command -v lsof >/dev/null 2>&1; then
    lsof -ti ":${port}" -sTCP:LISTEN 2>/dev/null || true
    return
  fi
  if command -v fuser >/dev/null 2>&1; then
    fuser "${port}/tcp" 2>/dev/null | tr ' ' '\n' | sed '/^$/d' || true
    return
  fi
  if command -v ss >/dev/null 2>&1; then
    ss -lptn "sport = :${port}" 2>/dev/null \
      | sed -n 's/.*pid=\([0-9]\+\),.*/\1/p' \
      | sort -u || true
    return
  fi
  echo "Required command not found: install lsof, fuser, or ss to stop platform services." >&2
  exit 1
}

signal_process_group() {
  local signal="$1"
  local pid="$2"
  kill "-${signal}" "-${pid}" 2>/dev/null || kill "-${signal}" "${pid}" 2>/dev/null || true
}

stop_pid() {
  local signal="$1"
  local pid="$2"
  signal_process_group "${signal}" "${pid}"
}

collect_unique_pids() {
  local collected=()
  local pid

  for pid in "$@"; do
    [[ -n "${pid}" ]] || continue
    local seen=false
    local existing
    for existing in "${collected[@]:-}"; do
      if [[ "${existing}" == "${pid}" ]]; then
        seen=true
        break
      fi
    done
    if [[ "${seen}" == false ]]; then
      collected+=("${pid}")
    fi
  done

  if ((${#collected[@]} > 0)); then
    printf '%s\n' "${collected[@]}"
  fi
}

stop_platform_runner() {
  local pid
  local stopped=false

  while IFS= read -r pid; do
    [[ -n "${pid}" ]] || continue
    echo "Stopping dev-platform runner (pid ${pid})..."
    stop_pid TERM "${pid}"
    stopped=true
  done < <(pgrep -f 'scripts/dev-platform\.sh' 2>/dev/null || true)

  if [[ "${stopped}" == false ]]; then
    return
  fi

  sleep 1
}

stop_port_listeners() {
  local signal="$1"
  local index
  local name
  local port
  local pids
  local pid

  for index in "${!SERVICE_PORTS[@]}"; do
    name="${SERVICE_NAMES[${index}]}"
    port="${SERVICE_PORTS[${index}]}"
    mapfile -t pids < <(collect_unique_pids $(pids_on_port "${port}"))

    if ((${#pids[@]} == 0)); then
      echo "${name} (${port}): nothing running"
      continue
    fi

    echo "Stopping ${name} (${port})..."
    for pid in "${pids[@]}"; do
      stop_pid "${signal}" "${pid}"
    done
  done
}

any_port_listeners() {
  local port
  local pids

  for port in "${SERVICE_PORTS[@]}"; do
    pids="$(pids_on_port "${port}")"
    if [[ -n "${pids}" ]]; then
      return 0
    fi
  done
  return 1
}

wait_for_ports_to_clear() {
  local attempt=0
  local max_attempts=$((GRACE_SECONDS * 2))

  while any_port_listeners; do
    attempt=$((attempt + 1))
    if [[ "${attempt}" -ge "${max_attempts}" ]]; then
      return 1
    fi
    sleep 0.5
  done
  return 0
}

echo "Stopping platform services..."

stop_platform_runner
stop_port_listeners TERM

if ! wait_for_ports_to_clear; then
  if [[ "${FORCE}" == true ]]; then
    echo "Force stopping remaining listeners..."
    stop_port_listeners KILL
    wait_for_ports_to_clear || true
  else
    echo "Some services are still running. Re-run with --force to SIGKILL them." >&2
    exit 1
  fi
fi

echo "Platform services stopped."
echo "Logs: ${LOG_DIR}"
