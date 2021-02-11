/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { GeneratedAutoExtractors, RawGeneratedAutoExtractors } from '~/models';
import { GeneratableAutoExtractor } from '~/models/auto-extractor/generatable-auto-extractor';
import { toGeneratedAutoExtractors } from '~/models/auto-extractor/to-generated-auto-extractor';
import { toRawGeneratableAutoExtractor } from '~/models/auto-extractor/to-raw-generatable-auto-extractor';
import { APIContext, buildHTTPRequest, buildURL, fetch, HTTPRequestOptions, parseJSONResponse } from '../utils';

export const makeGenerateAutoExtractors = (context: APIContext) => {
	const templatePath = '/api/explore/generate';
	const url = buildURL(templatePath, { ...context, protocol: 'http' });

	return async (data: GeneratableAutoExtractor): Promise<GeneratedAutoExtractors> => {
		try {
			const baseRequestOptions: HTTPRequestOptions = {
				headers: { Authorization: context.authToken ? `Bearer ${context.authToken}` : undefined },
				body: JSON.stringify(toRawGeneratableAutoExtractor(data)),
			};
			const req = buildHTTPRequest(baseRequestOptions);

			const raw = await fetch(url, { ...req, method: 'POST' });
			const rawRes = await parseJSONResponse<RawGeneratedAutoExtractors>(raw);

			return toGeneratedAutoExtractors(rawRes);
		} catch (err) {
			if (err instanceof Error) throw err;
			throw Error('Unknown error');
		}
	};
};
