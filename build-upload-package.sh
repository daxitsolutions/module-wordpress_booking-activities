#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SRC_DIR="${ROOT_DIR}/trunk"
OUT_DIR="${ROOT_DIR}/dist"
PLUGIN_SLUG="${1:-booking-activities}"

if [[ ! -d "${SRC_DIR}" ]]; then
  echo "Erreur: dossier source introuvable: ${SRC_DIR}" >&2
  exit 1
fi

VERSION="$(sed -n "s/^ \* Version: \(.*\)$/\1/p" "${SRC_DIR}/booking-activities.php" | head -n1 | tr -d '[:space:]')"
if [[ -z "${VERSION}" ]]; then
  VERSION="dev"
fi

mkdir -p "${OUT_DIR}"
WORK_DIR="$(mktemp -d)"
CLEAN_DIR="${WORK_DIR}/${PLUGIN_SLUG}"
ZIP_FILE="${OUT_DIR}/${PLUGIN_SLUG}-${VERSION}.zip"

cleanup() {
  rm -rf "${WORK_DIR}"
}
trap cleanup EXIT

rsync -a \
  --exclude='.git/' \
  --exclude='.svn/' \
  --exclude='.DS_Store' \
  --exclude='__MACOSX/' \
  --exclude='*/.DS_Store' \
  --exclude='*/__MACOSX/*' \
  "${SRC_DIR}/" "${CLEAN_DIR}/"

(
  cd "${WORK_DIR}"
  rm -f "${ZIP_FILE}"
  if [[ "$(uname -s)" == "Darwin" ]] && command -v ditto >/dev/null 2>&1; then
    # macOS native ZIP build, without resource forks / __MACOSX artifacts.
    ditto -c -k --keepParent --norsrc "${PLUGIN_SLUG}" "${ZIP_FILE}"
  else
    if ! command -v zip >/dev/null 2>&1; then
      echo "Erreur: la commande 'zip' est requise." >&2
      exit 1
    fi
    zip -rq "${ZIP_FILE}" "${PLUGIN_SLUG}"
  fi
)

echo "Archive générée: ${ZIP_FILE}"
