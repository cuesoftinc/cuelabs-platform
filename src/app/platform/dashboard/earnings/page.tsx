'use client';

import React from 'react';
import EarningsGraph from '@/components/custom/dashboard/earnings-graph';

export default function EarningsPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Earnings Dashboard</h1>
          <p className="text-gray-400">Track your earnings and performance over time</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Earnings Graph */}
          <div className="lg:col-span-2 xl:col-span-2">
            <EarningsGraph />
          </div>
          
          {/* Additional Stats Cards */}
          <div className="space-y-6">
            <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">This Week</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Total Earnings</span>
                  <span className="text-white font-semibold">€ 5,300</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Bounties Completed</span>
                  <span className="text-white font-semibold">7</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Average per Bounty</span>
                  <span className="text-white font-semibold">€ 756</span>
                </div>
              </div>
            </div>
            
            <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">All Time</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Total Earnings</span>
                  <span className="text-white font-semibold">€ 24,500</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Bounties Completed</span>
                  <span className="text-white font-semibold">32</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Success Rate</span>
                  <span className="text-green-400 font-semibold">94%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
