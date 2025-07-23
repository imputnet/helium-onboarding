#!/bin/bash
# inspired by third_party/node/update_npm_deps
set -e

if ! [ -f package.json ]; then
    echo "this script must be run in the repo root" >&2
    exit 1
fi

make() {
    OUT_FILE="$1"

    rm -rf node_modules

    pnpm install \
        --frozen-lockfile \
        --verify-store-integrity \
        --shamefully-hoist \
        --node-linker hoisted \
        --force

    TAR=gtar
    if ! command -v gtar 2>&1 >/dev/null
    then
        TAR=tar
    fi

    pushd node_modules

    rm -f .modules.yaml .pnpm-workspace-state.json

    find . -print0 \
        | sort -z \
        | GZIP="-9n" $TAR -zcf "../$OUT_FILE.tar.gz" \
            --format=posix \
            --numeric-owner \
            --owner=0 \
            --group=0 \
            --pax-option='delete=atime,delete=ctime' \
            --mode='go+u,go-w' \
            --preserve-permissions \
            --mtime='1970-01-01' \
            --no-recursion \
            --null \
            --files-from -

    popd
}

make a
make b

if ! cmp --silent -- a.tar.gz b.tar.gz; then
    echo "something is broken, node_modules tarballs are not reproducible" >&2
    sha256sum a.tar.gz b.tar.gz
else
    echo "ok, checksum: "
    rm b.tar.gz
    mv a.tar.gz node_modules.tar.gz
    sha256sum node_modules.tar.gz
    rm -rf node_modules
fi
