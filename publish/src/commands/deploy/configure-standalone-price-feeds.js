'use strict';

const { gray } = require('chalk');
const {
	utils: { isAddress },
} = require('ethers');
const { toBytes32 } = require('../../../..');

module.exports = async ({ deployer, runStep, feeds, useOvm }) => {
	console.log(gray(`\n------ CONFIGURE STANDALONE FEEDS ------\n`));

	// Setup remaining price feeds (that aren't synths)
	const { ExchangeRates } = deployer.deployedContracts;

	for (const { asset, feed } of Object.values(feeds)) {
		const key = asset;
		console.log('ExchangeRates address:', ExchangeRates.address);
		if (isAddress(feed) && ExchangeRates) {
			await runStep({
				contract: `ExchangeRates`,
				target: ExchangeRates,
				read: 'aggregators',
				readArg: toBytes32(key),
				expected: input => input === feed,
				write: 'addAggregator',
				writeArg: [toBytes32(key), feed],
				comment: `Ensure the ExchangeRates contract has the standalone feed for ${key}`,
			});
		}
	}
};
