/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { ValidatedScript } from '~/models/script';

export interface ScriptsService {
	readonly validate: {
		readonly one: (script: string) => Promise<ValidatedScript>;
	};
}
