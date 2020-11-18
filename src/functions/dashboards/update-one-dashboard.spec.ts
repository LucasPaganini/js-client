/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { CreatableDashboard, Dashboard, isDashboard, toVersion } from '../../models';
import { integrationTest, myCustomMatchers } from '../../tests';
import { TEST_AUTH_TOKEN, TEST_HOST } from '../../tests/config';
import { makeCreateOneDashboard } from './create-one-dashboard';
import { makeDeleteOneDashboard } from './delete-one-dashboard';
import { makeGetAllDashboards } from './get-all-dashboards';
import { makeUpdateOneDashboard, UpdatableDashboard } from './update-one-dashboard';

describe('updateOneDashboard()', () => {
	const createOneDashboard = makeCreateOneDashboard({ host: TEST_HOST, useEncryption: false });
	const updateOneDashboard = makeUpdateOneDashboard({ host: TEST_HOST, useEncryption: false });
	const deleteOneDashboard = makeDeleteOneDashboard({ host: TEST_HOST, useEncryption: false });
	const getAllDashboards = makeGetAllDashboards({ host: TEST_HOST, useEncryption: false });

	let createdDashboard: Dashboard;

	beforeEach(async () => {
		jasmine.addMatchers(myCustomMatchers);

		// Delete all dashboards
		const currentDashboards = await getAllDashboards(TEST_AUTH_TOKEN);
		const currentDashboardIDs = currentDashboards.map(m => m.id);
		const deletePromises = currentDashboardIDs.map(dashboardID => deleteOneDashboard(TEST_AUTH_TOKEN, dashboardID));
		await Promise.all(deletePromises);

		// Create one dashboard
		const data: CreatableDashboard = {
			name: 'Current name',
			searches: [],
			tiles: [],
			timeframe: { durationString: 'PT1H', end: null, start: null, timeframe: 'PT1H' },
		};
		createdDashboard = await createOneDashboard(TEST_AUTH_TOKEN, data);
	});

	const updateTests: Array<Omit<UpdatableDashboard, 'id'>> = [
		{ name: 'New Name' },

		{ description: 'New description' },
		{ description: null },

		{ groupIDs: ['1'] },
		{ groupIDs: ['1', '2'] },
		{ groupIDs: [] },

		{ labels: ['Label 1'] },
		{ labels: ['Label 1', 'Label 2'] },
		{ labels: [] },

		{ version: toVersion('3') },

		{ updateOnZoom: true },
		{ updateOnZoom: false },

		{ liveUpdate: { enabled: true, interval: 30 } },
		{ liveUpdate: { enabled: false } },

		{ gridOptions: { gutter: 0, margin: 0 } },
		{ gridOptions: { gutter: null, margin: 48 } },
		{ gridOptions: { gutter: 90, margin: null } },
		{ gridOptions: { gutter: null, margin: null } },
		{ gridOptions: { gutter: 24 } },
		{ gridOptions: { margin: 4 } },
		{ gridOptions: {} },

		{ timeframe: { durationString: '1M', timeframe: '1M' } },
		{ timeframe: { durationString: 'A', timeframe: 'B', start: new Date(1000000), end: new Date() } },

		{ searches: [] },
		{ searches: [{ name: 'Search 1', type: 'query', query: 'tag=netflow' }] },
		{ searches: [{ name: 'Search 2', type: 'template', templateID: '123' }] },
		{ searches: [{ name: 'Search 3', type: 'savedQuery', savedQueryID: '123' }] },
	];
	updateTests.forEach((_data, testIndex) => {
		const updatedFields = Object.keys(_data);
		const formatedUpdatedFields = updatedFields.join(', ');
		const formatedTestIndex = (testIndex + 1).toString().padStart(2, '0');

		it(
			`Test ${formatedTestIndex}: Should update a dashboard ${formatedUpdatedFields} and return itself updated`,
			integrationTest(async () => {
				const current = createdDashboard;
				expect(isDashboard(current)).toBeTrue();

				const data: UpdatableDashboard = { ..._data, id: current.id };
				const updated = await updateOneDashboard(TEST_AUTH_TOKEN, data);

				expect(isDashboard(updated)).toBeTrue();
				expect(updated).toPartiallyEqual(data);
			}),
		);
	});
});