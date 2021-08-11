/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { RawValidatedScript, Script, toValidatedScript, ValidatedScript } from '~/models';
import {
	APIContext,
	buildHTTPRequestWithContextToken,
	buildURL,
	fetch,
	HTTPRequestOptions,
	parseJSONResponse
} from '../utils';

export const makeValidateOneScript = (context: APIContext) => {
	const templatePath = '/api/scheduledsearches/parse';
	const url = buildURL(templatePath, { ...context, protocol: 'http' });

	return async (script: Script): Promise<ValidatedScript> => {
		const baseRequestOptions: HTTPRequestOptions = {
			body: JSON.stringify({ Script: script }),
		};
		const req = buildHTTPRequestWithContextToken(context, baseRequestOptions);

		const raw = await fetch(url, { ...req, method: 'PUT' });
		const rawRes = await parseJSONResponse<RawValidatedScript>(raw);
		return toValidatedScript(rawRes);
	};
};
