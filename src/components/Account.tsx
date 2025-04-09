
import React from 'react';

interface AccountProps {
  session?: any;
}

const Account: React.FC<AccountProps> = ({ session }) => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Account</h2>
      {session ? (
        <div>
          <p>You are logged in as: {session.user?.email}</p>
          <button 
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600" 
            onClick={() => {/* Add logout functionality later */}}
          >
            Sign Out
          </button>
        </div>
      ) : (
        <p>Please sign in to view your account</p>
      )}
    </div>
  );
};

export default Account;
