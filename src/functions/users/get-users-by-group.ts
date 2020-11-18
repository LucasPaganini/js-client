/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { RawUser, toUser, User } from '../../models';
import { NumericID } from '../../value-objects';
import {
	APIFunctionMakerOptions,
	buildHTTPRequest,
	buildURL,
	fetch,
	HTTPRequestOptions,
	parseJSONResponse,
} from '../utils';

export const makeGetUsersByGroup = (makerOptions: APIFunctionMakerOptions) => {
	return async (authToken: string | null, groupID: NumericID): Promise<Array<User>> => {
		const templatePath = '/api/groups/{groupID}/members';
		const url = buildURL(templatePath, { ...makerOptions, protocol: 'http', pathParams: { groupID } });

		const baseRequestOptions: HTTPRequestOptions = {
			headers: { Authorization: authToken ? `Bearer ${authToken}` : undefined },
		};
		const req = buildHTTPRequest(baseRequestOptions);

		const raw = await fetch(url, { ...req, method: 'GET' });
		const rawRes = (await parseJSONResponse<Array<RawUser> | null>(raw)) ?? [];
		return rawRes.map(toUser);
	};
};