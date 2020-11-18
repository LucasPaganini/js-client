/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { LogLevel, toRawLogLevel } from '../../models';
import {
	APIFunctionMakerOptions,
	buildHTTPRequest,
	buildURL,
	fetch,
	HTTPRequestOptions,
	parseJSONResponse,
} from '../utils';

export const makeCreateOneLog = (makerOptions: APIFunctionMakerOptions) => {
	return async (authToken: string | null, level: LogLevel, message: string): Promise<void> => {
		const templatePath = '/api/logging/{lowerCaseRawLogLevel}';
		const lowerCaseRawLogLevel = toRawLogLevel(level).toLowerCase();
		const url = buildURL(templatePath, { ...makerOptions, protocol: 'http', pathParams: { lowerCaseRawLogLevel } });

		const baseRequestOptions: HTTPRequestOptions = {
			headers: { Authorization: authToken ? `Bearer ${authToken}` : undefined },
			body: JSON.stringify({ Body: message }),
		};
		const req = buildHTTPRequest(baseRequestOptions);

		const raw = await fetch(url, { ...req, method: 'POST' });
		const success = await parseJSONResponse<boolean>(raw);
		if (!success) throw Error(`Couldn't create the log`);
	};
};