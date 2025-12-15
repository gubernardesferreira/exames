
import React, { useState, useMemo, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import { LabResult } from '../types';

interface HistoricalAnalysisProps {
  data: LabResult[];
}

const CustomLabel: React.FC<any> = (props) => {
    const { x, y, stroke, value } = props;
    return (
      <text x={x} y={y} dy={-10} fill={stroke} fontSize={12} textAnchor="middle">
        {value.toLocaleString('pt-BR')}
      </text>
    );
};


const HistoricalAnalysis: React.FC<HistoricalAnalysisProps> = ({ data }) => {
  const [selectedExam, setSelectedExam] = useState<string>('');

  const examOptions = useMemo(() => {
    const names = new Set(data.map(r => r.examName));
    return Array.from(names).sort((a: string, b: string) => a.localeCompare(b));
  }, [data]);

  useEffect(() => {
    if (examOptions.length > 0 && !selectedExam) {
      setSelectedExam(examOptions[0]);
    }
  }, [examOptions, selectedExam]);

  const { chartData, yAxisDomain } = useMemo(() => {
    const filteredData = data
      .filter(r => r.examName === selectedExam)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .map(r => ({
        date: r.date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' }),
        value: r.value,
      }));

    if (filteredData.length === 0) {
        // Explicitly cast to tuple to satisfy Recharts AxisDomain type
        return { chartData: [], yAxisDomain: [0, 'auto'] as [number, 'auto'] };
    }
      
    const values = filteredData.map(d => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const padding = (max - min) * 0.2 || 1;

    return {
        chartData: filteredData,
        // Explicitly cast to tuple to satisfy Recharts AxisDomain type
        yAxisDomain: [Math.max(0, Math.floor(min - padding)), Math.ceil(max + padding)] as [number, number],
    }
  }, [data, selectedExam]);

  const handleSearchInfo = () => {
    if (!selectedExam) return;
    const query = encodeURIComponent(`exame ${selectedExam} para que serve e valores de referência`);
    window.open(`https://www.google.com/search?q=${query}`, '_blank');
  };
  
  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <label htmlFor="exam-select" className="block text-sm font-medium text-gray-700 mb-2">
          Selecione um Exame para Análise
        </label>
        <select
          id="exam-select"
          value={selectedExam}
          onChange={(e) => setSelectedExam(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-white text-gray-900 border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
        >
          {examOptions.map(exam => (
            <option key={exam} value={exam}>
              {exam}
            </option>
          ))}
        </select>
      </div>

      {selectedExam && chartData.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Histórico de Resultados: {selectedExam}</h3>
          <div style={{ width: '100%', height: 400 }}>
             <ResponsiveContainer>
                <LineChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={yAxisDomain} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="value" name={selectedExam} stroke="#8884d8" strokeWidth={2} activeDot={{ r: 8 }}>
                       <LabelList dataKey="value" content={<CustomLabel />} />
                    </Line>
                </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 flex justify-center border-t border-gray-100 pt-6">
            <button
              onClick={handleSearchInfo}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-purple hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Pesquisar informações e referências sobre este exame
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoricalAnalysis;
