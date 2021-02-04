/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { Search2 } from '../../models/search';

export interface SearchStatusService {
	readonly get: {
		readonly authorizedTo: {
			readonly me: () => Promise<Array<Search2>>;
		};
		readonly one: (searchID: string) => Promise<Search2>;
		readonly all: () => Promise<Array<Search2>>;
	};
}
