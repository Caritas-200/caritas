import React from "react";

const SkeletonTable: React.FC = () => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white-primary border border-border-color rounded-lg">
        <thead>
          <tr>
            <th className="border border-border-color py-2 px-4 text-left">
              #
            </th>
            <th className="border border-border-color py-2 px-4 text-left">
              Name
            </th>
            <th className="border border-border-color py-2 px-4 text-left">
              Calamity
            </th>
            <th className="border border-border-color py-2 px-4 text-left">
              Date Verified
            </th>
            <th className="border border-border-color py-2 px-4 text-left">
              Status
            </th>
            <th className="border border-border-color py-2 px-4 text-left">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {[...Array(5)].map((_, index) => (
            <tr
              key={index}
              className="hover:bg-button-hover-bg-color transition-colors"
            >
              <td className="border border-border-color py-2 px-4">
                <div className="w-8 h-4 bg-gray-200 animate-pulse rounded"></div>
              </td>
              <td className="border border-border-color py-2 px-4">
                <div className="w-32 h-4 bg-gray-200 animate-pulse rounded"></div>
              </td>
              <td className="border border-border-color py-2 px-4">
                <div className="w-20 h-4 bg-gray-200 animate-pulse rounded"></div>
              </td>
              <td className="border border-border-color py-2 px-4">
                <div className="w-24 h-4 bg-gray-200 animate-pulse rounded"></div>
              </td>
              <td className="border border-border-color py-2 px-4">
                <div className="w-16 h-4 bg-gray-200 animate-pulse rounded"></div>
              </td>
              <td className="border border-border-color py-2 px-4">
                <div className="w-24 h-4 bg-gray-200 animate-pulse rounded"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SkeletonTable;
