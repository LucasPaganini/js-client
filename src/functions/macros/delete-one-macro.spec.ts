/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { integrationTest } from '../../tests';
import { TEST_AUTH_TOKEN, TEST_HOST } from '../../tests/config';
import { CreatableMacro, makeCreateOneMacro } from './create-one-macro';
import { makeDeleteOneMacro } from './delete-one-macro';
import { makeGetAllMacros } from './get-all-macros';
import { makeGetOneMacro } from './get-one-macro';

describe('deleteOneMacro()', () => {
	const createOneMacro = makeCreateOneMacro({ host: TEST_HOST, useEncryption: false });
	const deleteOneMacro = makeDeleteOneMacro({ host: TEST_HOST, useEncryption: false });
	const getAllMacros = makeGetAllMacros({ host: TEST_HOST, useEncryption: false });
	const getOneMacro = makeGetOneMacro({ host: TEST_HOST, useEncryption: false });

	beforeEach(async () => {
		// Delete all macros
		const currentMacros = await getAllMacros(TEST_AUTH_TOKEN);
		const currentMacroIDs = currentMacros.map(m => m.id);
		const deletePromises = currentMacroIDs.map(macroID => deleteOneMacro(TEST_AUTH_TOKEN, macroID));
		await Promise.all(deletePromises);

		// Create two macros
		const creatableMacros: Array<CreatableMacro> = [
			{ name: 'M1', expansion: 'abc' },
			{ name: 'M2', expansion: 'def' },
		];
		const createPromises = creatableMacros.map(creatable => createOneMacro(TEST_AUTH_TOKEN, creatable));
		await Promise.all(createPromises);
	});

	it(
		'Should delete a macro',
		integrationTest(async () => {
			const currentMacros = await getAllMacros(TEST_AUTH_TOKEN);
			const currentMacroIDs = currentMacros.map(m => m.id);
			expect(currentMacroIDs.length).toBe(2);

			const deleteMacroID = currentMacroIDs[0];
			await deleteOneMacro(TEST_AUTH_TOKEN, deleteMacroID);
			await expectAsync(getOneMacro(TEST_AUTH_TOKEN, deleteMacroID)).toBeRejected();

			const remainingMacros = await getAllMacros(TEST_AUTH_TOKEN);
			const remainingMacroIDs = remainingMacros.map(m => m.id);
			expect(remainingMacroIDs).not.toContain(deleteMacroID);
			expect(remainingMacroIDs.length).toBe(1);
		}),
	);
});