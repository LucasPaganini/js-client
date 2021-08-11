/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { CreatableResource, RawResource, Resource, toRawCreatableResource, toResource } from '~/models';
import {
	APIContext,
	buildHTTPRequestWithContextToken,
	buildURL,
	fetch,
	HTTPRequestOptions,
	parseJSONResponse
} from '../utils';

export const makeCreateOneResource = (context: APIContext) => {
	const resourcePath = '/api/resources';
	const url = buildURL(resourcePath, { ...context, protocol: 'http' });

	return async (data: CreatableResource): Promise<Resource> => {
		try {
			const baseRequestOptions: HTTPRequestOptions = {
				body: JSON.stringify(toRawCreatableResource(data)),
			};
			const req = buildHTTPRequestWithContextToken(context, baseRequestOptions);

			const raw = await fetch(url, { ...req, method: 'POST' });
			const rawRes = await parseJSONResponse<RawResource>(raw);
			return toResource(rawRes);
		} catch (err) {
			if (err instanceof Error) throw err;
			throw Error('Unknown error');
		}
	};
};
