import { writeFile, readdir, lstat } from 'node:fs/promises';
import { basename, relative, join, sep, posix } from 'node:path';

if (process.argv.length !== 4) {
    console.log(`usage: ${basename(process.argv[1])} <dist folder> <.grd output>`);
    process.exit(1);
}

async function* walk(path: string): AsyncGenerator<string> {
    const entries = await readdir(path);

    for (const entry of entries) {
        const full_path = join(path, entry);
        const info = await lstat(full_path);

        if (info.isDirectory()) {
            yield* walk(full_path);
        } else if (info.isFile()) {
            yield full_path;
        }
    }
}

const to_identifier = (path: string) => {
    const prefix = 'IDR_HELIUM_ONBOARDING_';

    return prefix + path.replace(/[-\\\/.:_]+/g, '_')
                        .toUpperCase();
}

const check = (str: string) => {
    if (/[<>&'"]/g.test(str)) {
        throw "filename contains invalid characters: " + str;
    }

    return str;
}

const generate = async () => {
    const dist_dir = process.argv[2];
    const grd_out = process.argv[3];
    const includes: string[] = [];

    for await (const path of walk(dist_dir)) {
        const relative_path = relative(dist_dir, path).replaceAll(sep, posix.sep);
        includes.push(`
          <include
              name="${check(to_identifier(relative_path))}"
              file="dist/${check(relative_path)}"
              resource_path="${check(relative_path)}"
              type="BINDATA"
          />
      `);
    }

    const template = `<?xml version="1.0" encoding="UTF-8"?>
  <grit latest_public_release="0" current_release="1">
    <outputs>
      <output filename="grit/helium_onboarding_generated.h" type="rc_header">
        <emit emit_type='prepend'></emit>
      </output>
      <output filename="grit/helium_onboarding_generated_map.cc" type="resource_file_map_source" />
      <output filename="grit/helium_onboarding_generated_map.h" type="resource_map_header" />
      <output filename="helium_onboarding_generated.pak" type="data_package" />
    </outputs>
    <release seq="1">
      <includes>
        {here}
      </includes>
    </release>
  </grit>`;

    await writeFile(
        grd_out,
        template.replace('{here}', includes.join(''))
    );
}

await generate();
