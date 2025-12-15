
import React, { useMemo } from 'react';
import { LabResult } from '../types';

interface RecentResultsProps {
  data: LabResult[];
}

const RecentResults: React.FC<RecentResultsProps> = ({ data }) => {
  const latestResultsByGroup = useMemo(() => {
    const latestResultsMap = new Map<string, LabResult>();
    // Since data is pre-sorted by date, the last entry for each examName will be the most recent.
    data.forEach(result => {
      latestResultsMap.set(result.examName, result);
    });

    const groupedByType = new Map<string, LabResult[]>();
    latestResultsMap.forEach(result => {
      const group = groupedByType.get(result.examType) || [];
      group.push(result);
      groupedByType.set(result.examType, group);
    });
    
    // Sort exams within each group alphabetically
    groupedByType.forEach((results) => {
        results.sort((a, b) => a.examName.localeCompare(b.examName));
    });

    return new Map([...groupedByType.entries()].sort());
  }, [data]);

  return (
    <div className="space-y-8">
      {Array.from(latestResultsByGroup.entries()).map(([examType, results]) => (
        <div key={examType} className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">{examType}</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Exame
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Último Resultado
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data da Coleta
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {results.map(result => (
                  <tr key={result.examName}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {result.examName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {result.value.toLocaleString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {result.date.toLocaleDateString('pt-BR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentResults;
