/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { AutoExtractorModule, RawAutoExtractorModule } from '../../models';
import {
	APIFunctionMakerOptions,
	buildHTTPRequest,
	buildURL,
	fetch,
	HTTPRequestOptions,
	parseJSONResponse,
} from '../utils';

export const makeGetAllAutoExtractorModules = (makerOptions: APIFunctionMakerOptions) => {
	const path = '/api/autoextractors/engines';
	const url = buildURL(path, { ...makerOptions, protocol: 'http' });

	return async (authToken: string | null): Promise<Array<AutoExtractorModule>> => {
		const baseRequestOptions: HTTPRequestOptions = {
			headers: { Authorization: authToken ? `Bearer ${authToken}` : undefined },
		};
		const req = buildHTTPRequest(baseRequestOptions);

		const raw = await fetch(url, { ...req, method: 'GET' });
		const rawRes = (await parseJSONResponse<Array<RawAutoExtractorModule> | null>(raw)) ?? [];
		return rawRes;
	};
};