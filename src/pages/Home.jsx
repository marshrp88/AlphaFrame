import React, { useEffect } from "react";
import { useFinancialStateStore } from "@/core/store/financialStateStore";

function Home() {
  const { setAccountBalance, getAccountBalance, setGoal, getGoal } = useFinancialStateStore();

  useEffect(() => {
    // Initialize with some sample data
    setAccountBalance('checking', 5000);
    setAccountBalance('savings', 15000);
    setGoal('vacation', { target: 3000, current: 1200 });
    setGoal('emergency', { target: 10000, current: 8000 });
  }, [setAccountBalance, setGoal]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Welcome to AlphaFrame</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Account Balances</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Checking:</span>
              <span className="font-medium">${getAccountBalance('checking')}</span>
            </div>
            <div className="flex justify-between">
              <span>Savings:</span>
              <span className="font-medium">${getAccountBalance('savings')}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Financial Goals</h2>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span>Vacation Fund</span>
                <span>${getGoal('vacation')?.current || 0} / ${getGoal('vacation')?.target || 0}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${((getGoal('vacation')?.current || 0) / (getGoal('vacation')?.target || 1)) * 100}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span>Emergency Fund</span>
                <span>${getGoal('emergency')?.current || 0} / ${getGoal('emergency')?.target || 0}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${((getGoal('emergency')?.current || 0) / (getGoal('emergency')?.target || 1)) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home; 