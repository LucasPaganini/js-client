/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { LogLevel, toRawLogLevel } from '~/models';
import {
	APIContext,
	buildHTTPRequestWithContextToken,
	buildURL,
	fetch,
	HTTPRequestOptions,
	parseJSONResponse
} from '../utils';

export const makeSetLogLevel = (context: APIContext) => {
	const templatePath = '/api/logging';
	const url = buildURL(templatePath, { ...context, protocol: 'http' });

	return async (level: LogLevel | 'off'): Promise<void> => {
		const baseRequestOptions: HTTPRequestOptions = {
			body: JSON.stringify({ Level: level === 'off' ? 'Off' : toRawLogLevel(level) }),
		};
		const req = buildHTTPRequestWithContextToken(context, baseRequestOptions);

		const raw = await fetch(url, { ...req, method: 'PUT' });
		await parseJSONResponse(raw, { expect: 'void' });
	};
};
