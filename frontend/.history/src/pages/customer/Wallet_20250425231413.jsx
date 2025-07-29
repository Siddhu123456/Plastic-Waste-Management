import React, { useState } from 'react';
import { FaCoins, FaArrowUp, FaArrowDown, FaWallet, FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';

// Sample Data
const sampleBalance = 120;
const sampleTransactions = [
  { id: 1, type: 'credit', amount: 50, description: 'Plastic waste pickup', date: '2025-04-15' },
  { id: 2, type: 'debit', amount: 20, description: 'Redeemed recycled product', date: '2025-04-16' },
  { id: 3, type: 'credit', amount: 90, description: 'Plastic waste pickup', date: '2025-04-17' },
  { id: 4, type: 'debit', amount: 10, description: 'Redeemed eco-bag', date: '2025-04-18' },
  { id: 5, type: 'credit', amount: 30, description: 'Plastic waste pickup', date: '2025-04-19' },
  { id: 6, type: 'debit', amount: 15, description: 'Redeemed recycled bottle', date: '2025-04-20' },
  { id: 7, type: 'credit', amount: 40, description: 'Plastic waste pickup', date: '2025-04-21' },
  { id: 8, type: 'debit', amount: 25, description: 'Redeemed eco-friendly notebook', date: '2025-04-22' },
];


const WalletDashboard = () => {
  const [balance] = useState(sampleBalance);
  const [transactions] = useState(sampleTransactions);
  

  // Totals
  const totalEarned = transactions.filter(tx => tx.type === 'credit').reduce((sum, tx) => sum + tx.amount, 0);
  const totalSpent = transactions.filter(tx => tx.type === 'debit').reduce((sum, tx) => sum + tx.amount, 0);



  return (
    <section className="max-w-4xl mx-auto p-2 sm:p-4">
      <div className='bg-white dark:bg-dtc rounded-md p-4 sm:p-6 text-tc dark:text-ow'>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold flex items-center">
          <FaWallet className="text-lgg mr-2" />
          My Wallet
        </h2>
        <Link to="/shop">
          <button className="pri-btn px-4 py-1">
            Shop
          </button>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-lgg/20 rounded p-4 flex items-center">
          <FaCoins className="text-lgg text-3xl mr-3" />
          <div>
            <div className="text-sm text-neutral-600 dark:text-neutral-300">Balance</div>
            <div className="text-xl font-semibold text-lgd dark:text-lgg">{balance} Coins</div>
          </div>
        </div>
        <div className="bg-blue-500/20 rounded p-4 flex items-center">
          <FaArrowUp className="text-blue-500 text-3xl mr-3" />
          <div>
            <div className="text-sm text-neutral-600 dark:text-neutral-300">Total Earned</div>
            <div className="text-xl font-semibold text-blue-500">{totalEarned} Coins</div>
          </div>
        </div>
        <div className="bg-red-500/20 rounded p-4 flex items-center">
          <FaArrowDown className="text-red-500 text-3xl mr-3" />
          <div>
            <div className="text-sm text-neutral-600 dark:text-neutral-300">Total Spent</div>
            <div className="text-xl font-semibold text-red-500">{totalSpent} Coins</div>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Transaction History</h3>
        {transactions.length === 0 ? (
          <p className="text-center text-gray-500">You have no transactions.</p>
        ) : (
          <>
            <ul className="divide-y divide-neutral-300 dark:divide-neutral-500">
              {transactions.map(tx => (
                <li key={tx.id} className="py-3 flex justify-between items-center">
                  <div>
                    <p className="font-medium">{tx.description}</p>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">{tx.date}</p>
                  </div>
                  <div className={`font-semibold flex items-center ${tx.type === 'credit' ? 'text-lgd dark:text-lgg' : 'text-red-600 dark:text-red-500'}`}>
                    {tx.type === 'credit' ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
                    {tx.amount} Coins
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
      </div>
    </section>
  );
};

export default WalletDashboard;
