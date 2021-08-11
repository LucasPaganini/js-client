/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { RawResourceContentPreview, ResourceContentPreview, toResourceContentPreview } from '~/models';
import { UUID } from '~/value-objects';
import {
	APIContext,
	buildHTTPRequestWithContextToken,
	buildURL,
	fetch,
	parseJSONResponse
} from '../utils';

export const makePreviewOneResourceContent = (context: APIContext) => {
	return async (resourceID: UUID, options: { bytes?: number } = {}): Promise<ResourceContentPreview> => {
		const resourcePath = '/api/resources/{resourceID}/contenttype';
		const url = buildURL(resourcePath, {
			...context,
			protocol: 'http',
			pathParams: { resourceID },
			queryParams: { bytes: options.bytes },
		});

		const req = buildHTTPRequestWithContextToken(context);

		const raw = await fetch(url, { ...req, method: 'GET' });
		const rawPreview = await parseJSONResponse<RawResourceContentPreview>(raw);
		return toResourceContentPreview(rawPreview);
	};
};
