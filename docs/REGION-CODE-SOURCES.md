# Region code sources and privacy boundary

The sensor platform stores canonical region identifiers in addition to its legacy location fields:

- `country_code`: ISO 3166-1 alpha-2.
- `subdivision_code`: the complete ISO 3166-2 code, including the country prefix and hyphen.
- `municipality_code`: Japan only; the six-digit national local public body code published by J-LIS.
- `admin1_code`, `locality_name`, and `location_precision`: retained for backward compatibility.

## Sources

- ISO, [ISO 3166 country and subdivision codes](https://www.iso.org/iso-3166-country-codes.html). ISO defines an alpha-2 country code and a subdivision code formed from that alpha-2 prefix, a separator, and up to three alphanumeric characters.
- Unicode CLDR 48.2, [`cldr-subdivisions-full`](https://www.npmjs.com/package/cldr-subdivisions-full) and [`cldr-core`](https://www.npmjs.com/package/cldr-core). The generated registry uses English display names and only codes reachable from CLDR's current subdivision containment data. The Unicode license applies to this derived data.
- J-LIS, [全国地方公共団体コード](https://www.j-lis.go.jp/spd/code-address/cms_1750514.html) and its 47 prefectural municipality pages. J-LIS documents the six-digit format: two prefecture digits, three municipality digits, and one modulus-11 check digit maintained by the Ministry of Internal Affairs and Communications.

The check digit is calculated from the first five digits with weights 6, 5, 4, 3, and 2. The implementation is equivalent to `(11 - (weightedSum % 11)) % 10`.

Run `node scripts/build-region-code-data.mjs` from the repository root to refresh `sensor-platform/src/region-code-data.ts`. The generator intentionally retains only codes and names from J-LIS; postal codes, street addresses, and telephone numbers are discarded.

## Public/private boundary

Authenticated owner responses contain canonical subdivision and municipality identifiers so owners can review and edit their registration. Public sensor responses may contain the country and subdivision only. They never expose `municipality_code`, `locality_name`, the owner's private profile data, or device telemetry history. Public coordinates remain explicitly opt-in and rounded to 0.1 degree before storage.

## Unicode CLDR license notice

UNICODE LICENSE V3

COPYRIGHT AND PERMISSION NOTICE

Copyright © 2004-2026 Unicode, Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy of data files and any associated documentation (the “Data Files”) or software and any associated documentation (the “Software”) to deal in the Data Files or Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, and/or sell copies of the Data Files or Software, and to permit persons to whom the Data Files or Software are furnished to do so, provided that either (a) this copyright and permission notice appear with all copies of the Data Files or Software, or (b) this copyright and permission notice appear in associated Documentation.

THE DATA FILES AND SOFTWARE ARE PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT OF THIRD PARTY RIGHTS.

IN NO EVENT SHALL THE COPYRIGHT HOLDER OR HOLDERS INCLUDED IN THIS NOTICE BE LIABLE FOR ANY CLAIM, OR ANY SPECIAL INDIRECT OR CONSEQUENTIAL DAMAGES, OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THE DATA FILES OR SOFTWARE.

Except as contained in this notice, the name of a copyright holder shall not be used in advertising or otherwise to promote the sale, use or other dealings in these Data Files or Software without prior written authorization of the copyright holder.

SPDX-License-Identifier: Unicode-3.0
