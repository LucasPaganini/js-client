/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isAutoExtractor } from '../../models';
import { integrationTest } from '../../tests';
import { TEST_AUTH_TOKEN, TEST_HOST } from '../../tests/config';
import { CreatableAutoExtractor, makeCreateOneAutoExtractor } from './create-one-auto-extractor';
import { makeDeleteOneAutoExtractor } from './delete-one-auto-extractor';
import { makeGetAllAutoExtractors } from './get-all-auto-extractors';

describe('getAllAutoExtractors()', () => {
	const createOneAutoExtractor = makeCreateOneAutoExtractor({ host: TEST_HOST, useEncryption: false });
	const deleteOneAutoExtractor = makeDeleteOneAutoExtractor({ host: TEST_HOST, useEncryption: false });
	const getAllAutoExtractors = makeGetAllAutoExtractors({ host: TEST_HOST, useEncryption: false });

	beforeEach(async () => {
		// Delete all autoExtractors
		const currentAutoExtractors = await getAllAutoExtractors(TEST_AUTH_TOKEN);
		const currentAutoExtractorIDs = currentAutoExtractors.map(m => m.id);
		const deletePromises = currentAutoExtractorIDs.map(autoExtractorID =>
			deleteOneAutoExtractor(TEST_AUTH_TOKEN, autoExtractorID),
		);
		await Promise.all(deletePromises);
	});

	it(
		'Should return all auto extractors',
		integrationTest(async () => {
			// Create two auto extractors
			const creatableAutoExtractors: Array<CreatableAutoExtractor> = [
				{
					name: 'AE1 name',
					description: 'AE1 description',

					tag: 'netflow',
					module: 'csv',
					parameters: 'a b c',
				},
				{
					name: 'AE2 name',
					description: 'AE2 description',

					tag: 'gravwell',
					module: 'fields',
					parameters: '1 2 3',
				},
			];
			const createPromises = creatableAutoExtractors.map(creatable =>
				createOneAutoExtractor(TEST_AUTH_TOKEN, creatable),
			);
			await Promise.all(createPromises);

			const autoExtractors = await getAllAutoExtractors(TEST_AUTH_TOKEN);
			expect(autoExtractors.length).toBe(2);
			expect(autoExtractors.every(isAutoExtractor)).toBeTrue();
		}),
	);

	it(
		'Should return an empty array if there are no auto extractors',
		integrationTest(async () => {
			const autoExtractors = await getAllAutoExtractors(TEST_AUTH_TOKEN);
			expect(autoExtractors.length).toBe(0);
		}),
	);
});