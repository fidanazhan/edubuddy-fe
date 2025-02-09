import React from 'react';

const TokenUsageTab = () => {
  // Sample data for the table
  const tokenUsageData = [
    { no: 1, question: 'What is React?', chatId: 'chat123', tokenUsage: 50 },
    { no: 2, question: 'Explain closures in JavaScript.', chatId: 'chat124', tokenUsage: 75 },
    { no: 3, question: 'How does the virtual DOM work?', chatId: 'chat125', tokenUsage: 60 },
    // Add more data as needed
  ];

  return (
    <div className="container mx-auto p-4">
      <p>Token</p>
      {/* 'Buy Token' button positioned at the top-right */}
      <div className="flex justify-end mb-4">
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300">
          Buy Token
        </button>
      </div>

      {/* {/* Token Usage Table  */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 border-b text-left text-gray-600 font-semibold">No</th>
              <th className="px-6 py-3 border-b text-left text-gray-600 font-semibold">Question/Prompt</th>
              <th className="px-6 py-3 border-b text-left text-gray-600 font-semibold">Chat Id</th>
              <th className="px-6 py-3 border-b text-left text-gray-600 font-semibold">Token Usage</th>
            </tr>
          </thead>
          <tbody>
            {tokenUsageData.map((item, index) => (
              <tr key={item.no} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                <td className="px-6 py-4 border-b text-gray-700">{item.no}</td>
                <td className="px-6 py-4 border-b text-gray-700">{item.question}</td>
                <td className="px-6 py-4 border-b text-gray-700">{item.chatId}</td>
                <td className="px-6 py-4 border-b text-gray-700">{item.tokenUsage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> 
     
    </div>
  );
};

export default TokenUsageTab;
