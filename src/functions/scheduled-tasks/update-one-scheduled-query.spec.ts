/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isScheduledQuery, ScheduledQuery } from '../../models';
import { integrationTest, myCustomMatchers } from '../../tests';
import { TEST_AUTH_TOKEN, TEST_HOST } from '../../tests/config';
import { makeCreateOneScheduledQuery } from './create-one-scheduled-query';
import { makeDeleteAllScheduledQueries } from './delete-all-scheduled-queries';
import { makeUpdateOneScheduledQuery } from './update-one-scheduled-query';
import { UpdatableScheduledQuery } from './update-one-scheduled-task';

describe('updateOneScheduledQuery()', () => {
	const createOneScheduledQuery = makeCreateOneScheduledQuery({ host: TEST_HOST, useEncryption: false });
	const updateOneScheduledQuery = makeUpdateOneScheduledQuery({ host: TEST_HOST, useEncryption: false });
	const deleteAllScheduledQueries = makeDeleteAllScheduledQueries({ host: TEST_HOST, useEncryption: false });

	let createdScheduledQuery: ScheduledQuery;

	beforeEach(async () => {
		jasmine.addMatchers(myCustomMatchers);

		await deleteAllScheduledQueries(TEST_AUTH_TOKEN);
		createdScheduledQuery = await createOneScheduledQuery(TEST_AUTH_TOKEN, {
			name: 'Q1',
			description: 'D1',
			schedule: '0 1 * * *',

			query: 'tag=netflow',
			searchSince: { secondsAgo: 60 * 60 },
		});
	});

	const updateTests: Array<Omit<UpdatableScheduledQuery, 'id'>> = [
		{ name: 'New Name' },

		{ description: 'New description' },

		{ groupIDs: ['1'] },
		{ groupIDs: ['1', '2'] },
		{ groupIDs: [] },

		{ labels: ['Label 1'] },
		{ labels: ['Label 1', 'Label 2'] },
		{ labels: [] },

		{ oneShot: true },
		{ oneShot: false },

		{ isDisabled: true },
		{ isDisabled: false },

		{ schedule: '1 0 * * *' },

		{ timezone: 'America/Sao_Paulo' },
		{ timezone: null },

		{ query: 'tag=custom' },

		{ searchSince: { lastRun: true } },
		{ searchSince: { lastRun: false } },
		{ searchSince: { secondsAgo: 0 } },
		{ searchSince: { secondsAgo: 60 } },
		{ searchSince: { lastRun: true, secondsAgo: 15 } },
	];
	updateTests.forEach((_data, testIndex) => {
		const updatedFields = Object.keys(_data);
		const formatedUpdatedFields = updatedFields.join(', ');
		const formatedTestIndex = (testIndex + 1).toString().padStart(2, '0');

		it(
			`Test ${formatedTestIndex}: Should update a scheduled query ${formatedUpdatedFields} and return itself updated`,
			integrationTest(async () => {
				const current = createdScheduledQuery;
				expect(isScheduledQuery(current)).toBeTrue();

				const data: UpdatableScheduledQuery = { ..._data, id: current.id };
				const updated = await updateOneScheduledQuery(TEST_AUTH_TOKEN, data);

				expect(isScheduledQuery(updated)).toBeTrue();
				expect(updated).toPartiallyEqual(data);
			}),
		);
	});
});