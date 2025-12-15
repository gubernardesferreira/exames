
import React, { useState, useCallback, lazy, Suspense, useEffect } from 'react';
import { LabResult, ViewMode } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import RecentResults from './components/RecentResults';
import UploadIcon from './components/icons/UploadIcon';
import TableIcon from './components/icons/TableIcon';
import ChartIcon from './components/icons/ChartIcon';

const HistoricalAnalysis = lazy(() => import('./components/HistoricalAnalysis'));

declare global {
  interface Window {
    XLSX: any;
  }
}

const LoadingFallback: React.FC = () => (
    <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-xl bg-white mt-8">
        <div className="flex justify-center items-center space-x-2">
            <div 
              className="w-6 h-6 border-4 border-dashed rounded-full animate-spin border-purple-500"
              style={{borderTopColor: 'transparent'}}
            ></div>
            <span className="text-gray-600 font-medium">Carregando análise histórica...</span>
        </div>
    </div>
);


const App: React.FC = () => {
    const [labResults, setLabResults] = useState<LabResult[]>([]);
    const [viewMode, setViewMode] = useState<ViewMode>('recent');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string>('');

    useEffect(() => {
        const storedData = localStorage.getItem('labResultsData');
        if (storedData) {
            try {
                const parsed = JSON.parse(storedData);
                const revivedData: LabResult[] = parsed.map((item: any) => ({
                    ...item,
                    date: new Date(item.date),
                }));
                if (Array.isArray(revivedData) && revivedData.length > 0) {
                   setLabResults(revivedData);
                }
            } catch (e) {
                console.error("Falha ao processar dados do localStorage", e);
                localStorage.removeItem('labResultsData');
            }
        }
    }, []);

    const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) {
            return;
        }

        setIsLoading(true);
        setError(null);
        setFileName(file.name);

        try {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const binaryStr = event.target?.result;
                    if (!binaryStr) {
                      throw new Error("Falha ao ler o arquivo.");
                    }
                    const workbook = window.XLSX.read(binaryStr, { type: 'binary', cellDates: true });
                    const sheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[sheetName];
                    const json: any[] = window.XLSX.utils.sheet_to_json(worksheet);

                    const parsedData: LabResult[] = json.map((row) => ({
                        date: new Date(row['Data']),
                        examType: row['Tipo de exame'],
                        examName: row['Exame'],
                        value: typeof row['Valor'] === 'string' 
                               ? parseFloat(row['Valor'].replace(',', '.')) 
                               : parseFloat(row['Valor']),
                    })).filter(item => 
                        item.date instanceof Date && 
                        !isNaN(item.date.getTime()) && 
                        item.examType && 
                        item.examName && 
                        !isNaN(item.value)
                    );
                    
                    if (parsedData.length === 0) {
                      throw new Error("Nenhum dado válido encontrado no arquivo. Verifique as colunas 'Data', 'Tipo de exame', 'Exame' e 'Valor'.");
                    }

                    parsedData.sort((a, b) => a.date.getTime() - b.date.getTime());
                    setLabResults(parsedData);
                    localStorage.setItem('labResultsData', JSON.stringify(parsedData));

                } catch (parseError) {
                    console.error("Parsing error:", parseError);
                    setError(parseError instanceof Error ? parseError.message : "Erro ao processar o arquivo Excel. Verifique o formato.");
                    setLabResults([]);
                    localStorage.removeItem('labResultsData');
                } finally {
                    setIsLoading(false);
                }
            };
            reader.onerror = () => {
              setError('Falha ao ler o arquivo.');
              setIsLoading(false);
            };
            reader.readAsBinaryString(file);
        } catch (err) {
            console.error(err);
            setError("Ocorreu um erro inesperado.");
            setIsLoading(false);
        }
    }, []);

    const ViewToggle: React.FC = () => (
        <div className="flex justify-center my-6">
            <div className="flex space-x-1 rounded-lg bg-gray-200 p-1">
                <button
                    onClick={() => setViewMode('recent')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ease-in-out flex items-center space-x-2 ${viewMode === 'recent' ? 'bg-white text-purple-700 shadow' : 'text-gray-600 hover:bg-gray-300'}`}
                >
                    <TableIcon className="w-5 h-5" />
                    <span>Resultados Recentes</span>
                </button>
                <button
                    onClick={() => setViewMode('historical')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ease-in-out flex items-center space-x-2 ${viewMode === 'historical' ? 'bg-white text-purple-700 shadow' : 'text-gray-600 hover:bg-gray-300'}`}
                >
                    <ChartIcon className="w-5 h-5" />
                    <span>Análise Histórica</span>
                </button>
            </div>
        </div>
    );
    
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
                {labResults.length === 0 ? (
                    <div className="text-center max-w-lg mx-auto p-8 border-2 border-dashed border-gray-300 rounded-xl bg-white">
                        <h2 className="text-2xl font-semibold text-gray-700 mb-2">Bem-vinda!</h2>
                        <p className="text-gray-500 mb-6">Para começar, envie seu arquivo de exames no formato Excel (.xlsx).</p>
                        <label className="cursor-pointer inline-flex items-center px-6 py-3 bg-brand-purple text-white rounded-lg font-semibold shadow-md hover:bg-purple-700 transition-colors">
                            <UploadIcon className="w-6 h-6 mr-2"/>
                            {isLoading ? 'Carregando...' : 'Escolher Arquivo'}
                            <input type="file" className="hidden" onChange={handleFileChange} accept=".xlsx, .xls" disabled={isLoading} />
                        </label>
                        {fileName && !error && !isLoading && <p className="text-sm text-gray-500 mt-4">Arquivo carregado: {fileName}</p>}
                        {error && <p className="text-red-500 mt-4 font-medium">{error}</p>}
                    </div>
                ) : (
                    <>
                        <div className="text-center mb-6">
                            <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-gray-100 text-gray-800 rounded-lg font-semibold shadow-sm hover:bg-gray-200 transition-colors text-sm border border-gray-300">
                                <UploadIcon className="w-5 h-5 mr-2"/>
                                {isLoading ? 'Atualizando...' : 'Atualizar Arquivo'}
                                <input type="file" className="hidden" onChange={handleFileChange} accept=".xlsx, .xls" disabled={isLoading} />
                            </label>
                            <div className="h-5 mt-2">
                                {fileName && !isLoading && !error && <p className="text-sm text-green-600">Arquivo '{fileName}' carregado com sucesso!</p>}
                                {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
                            </div>
                        </div>

                        <ViewToggle />
                        {viewMode === 'recent' && <RecentResults data={labResults} />}
                        <Suspense fallback={<LoadingFallback />}>
                            {viewMode === 'historical' && <HistoricalAnalysis data={labResults} />}
                        </Suspense>
                    </>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default App;
