/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { RawSearchEntry } from './raw-search-entry';
import { SearchEntry } from './search-entry';

export const toSearchEntry = (raw: RawSearchEntry): SearchEntry => ({
	source: raw.SRC,
	timestamp: new Date(raw.TS),
	tag: raw.Tag,
	value: raw.Data,
});
