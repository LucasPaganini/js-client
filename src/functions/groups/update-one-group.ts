/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isNull } from 'lodash';
import { NumericID } from '../../value-objects';
import {
	APIFunctionMakerOptions,
	buildHTTPRequest,
	buildURL,
	fetch,
	HTTPRequestOptions,
	omitUndefinedShallow,
	parseJSONResponse,
} from '../utils';

export const makeUpdateOneGroup = (makerOptions: APIFunctionMakerOptions) => {
	return async (authToken: string | null, data: UpdatableGroup): Promise<void> => {
		const templatePath = '/api/groups/{groupID}';
		const url = buildURL(templatePath, { ...makerOptions, protocol: 'http', pathParams: { groupID: data.id } });

		try {
			const baseRequestOptions: HTTPRequestOptions = {
				headers: { Authorization: authToken ? `Bearer ${authToken}` : undefined },
				body: JSON.stringify(toRawUpdatableGroup(data)),
			};
			const req = buildHTTPRequest(baseRequestOptions);

			const raw = await fetch(url, { ...req, method: 'PUT' });
			return parseJSONResponse(raw, { expect: 'void' });
		} catch (err) {
			if (err instanceof Error) throw err;
			throw Error('Unknown error');
		}
	};
};

export interface UpdatableGroup {
	id: NumericID;
	name?: string;
	description?: string | null;
}

interface RawUpdatableGroup {
	Name?: string;
	Desc?: string;
}

const toRawUpdatableGroup = (data: UpdatableGroup): RawUpdatableGroup =>
	omitUndefinedShallow({
		Name: data.name,
		// TODO: If we send an empty string, it'll be ignored, that's why we need that space
		Desc: isNull(data.description) ? ' ' : data.description,
	});