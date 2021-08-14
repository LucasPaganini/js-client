/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isString } from 'lodash';
import { isMailServerConfig,MailServerTestData } from '~/models';
import { integrationTest, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeCreateServerTest } from './create-server-test';

describe('makeCreateServerTest()', () => {
	const createServerTest = makeCreateServerTest(TEST_BASE_API_CONTEXT);

	it(
		'Should test the mail server config',
		integrationTest(async () => {

			const data: MailServerTestData = {
				from: 'someone@gravwell.io',
				to: 'someone@gravwell.io',
				body: 'This is a test',
				subject: 'This is a subject',
			};
			const test = await createServerTest(data);

		}),
	);
});
