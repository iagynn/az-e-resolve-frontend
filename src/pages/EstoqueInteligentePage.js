import React, { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card.jsx";
import { Button } from '../components/ui/Button.jsx';
import { Input } from '../components/ui/Input.jsx';
import apiClient from '../api/apiClient';

// Ícones para uma UI mais clara
const UploadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>;
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>;

const EstoqueInteligentePage = () => {
    const [invoiceImage, setInvoiceImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [extractedItems, setExtractedItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setInvoiceImage(file);
            setPreviewUrl(URL.createObjectURL(file));
            setExtractedItems([]);
        }
    };

    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = error => reject(error);
    });

    const handleProcessInvoice = useCallback(async () => {
        // --- PASSO DE DEPURAÇÃO ---
        // Vamos verificar o que a aplicação está realmente a ver.
        console.log("A chave de API que a aplicação está a usar é:", process.env.REACT_APP_GEMINI_API_KEY);

        const apiKey = process.env.REACT_APP_GEMINI_API_KEY;

        if (!apiKey) {
            toast.error("A chave de API do Gemini não foi encontrada. Verifique o seu ficheiro .env e reinicie o servidor.");
            return;
        }

        if (!invoiceImage) {
            toast.error("Por favor, selecione uma imagem da nota fiscal primeiro.");
            return;
        }

        setIsLoading(true);
        const toastId = toast.loading('A processar a nota fiscal... A IA está a ler os itens.');

        try {
            const base64ImageData = await toBase64(invoiceImage);
            const prompt = "Analise a imagem desta nota fiscal. Identifique cada item e a sua respectiva quantidade. Retorne os dados como um array de objetos JSON, onde cada objeto contém as chaves 'produto' e 'quantidade'. Ignore impostos, totais e outras informações que não sejam itens de produto.";
            
            const schema = {
                type: "ARRAY",
                items: {
                    type: "OBJECT",
                    properties: {
                        "produto": { "type": "STRING" },
                        "quantidade": { "type": "NUMBER" }
                    },
                    required: ["produto", "quantidade"]
                }
            };
            
            const payload = {
                contents: [
                    {
                        parts: [
                            { text: prompt },
                            { inlineData: { mimeType: invoiceImage.type, data: base64ImageData } }
                        ]
                    }
                ],
                generationConfig: {
                    responseMimeType: "application/json",
                    responseSchema: schema,
                }
            };
            
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorBody = await response.json().catch(() => ({ error: { message: `Erro na API: ${response.statusText}` } }));
                console.error("API Error:", errorBody);
                throw new Error(errorBody.error?.message || `A API retornou um erro: ${response.statusText}`);
            }
            
            const result = await response.json();
            
            toast.dismiss(toastId);
            
            if (result.candidates && result.candidates[0].content.parts[0].text) {
                const items = JSON.parse(result.candidates[0].content.parts[0].text);
                setExtractedItems(items);
                toast.success("Itens extraídos com sucesso! Por favor, confirme a lista abaixo.");
            } else {
                throw new Error("A resposta da IA não continha os itens esperados.");
            }

        } catch (error) {
            console.error("Erro ao processar a nota fiscal:", error);
            toast.dismiss(toastId);
            toast.error(`Falha ao processar: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    }, [invoiceImage]);

    const handleAddToStock = async () => {
        if (extractedItems.length === 0) {
            toast.error("Nenhum item para adicionar.");
            return;
        }
        
        const toastId = toast.loading("A adicionar itens ao estoque...");
        try {
            await apiClient.post('/estoque/add-batch', { items: extractedItems });
            toast.success("Itens adicionados ao estoque com sucesso!", { id: toastId });
            
            setExtractedItems([]);
            setInvoiceImage(null);
            setPreviewUrl('');

        } catch (error) {
            console.error("Erro ao adicionar ao estoque:", error);
            toast.error(`Falha ao adicionar itens: ${error.message}`, { id: toastId });
        }
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Entrada de Estoque Inteligente</h1>
            
            <Card>
                <CardHeader>
                    <CardTitle>Passo 1: Enviar Nota Fiscal</CardTitle>
                    <CardDescription>Envie uma imagem nítida da sua nota fiscal. A nossa IA irá ler os produtos e quantidades para si.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col md:flex-row items-start gap-6">
                    <div className="flex-1 w-full">
                        <label htmlFor="invoice-upload" className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-100">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <UploadIcon />
                                <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Clique para enviar</span> ou arraste e solte</p>
                                <p className="text-xs text-gray-500">PNG, JPG ou WEBP</p>
                            </div>
                            <Input id="invoice-upload" type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleImageChange} />
                        </label>
                    </div>
                    {previewUrl && (
                        <div className="flex-1 w-full">
                            <p className="text-sm font-medium mb-2">Pré-visualização:</p>
                            <img src={previewUrl} alt="Pré-visualização da nota fiscal" className="rounded-lg max-h-48 w-auto border" />
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="flex justify-center">
                <Button onClick={handleProcessInvoice} disabled={isLoading || !invoiceImage}>
                    {isLoading ? 'A processar...' : 'Ler Nota Fiscal com IA'}
                </Button>
            </div>

            {extractedItems.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Passo 2: Confirmar Itens</CardTitle>
                        <CardDescription>Verifique os itens e quantidades extraídos pela IA. Pode fazer ajustes antes de adicionar ao estoque (funcionalidade a ser implementada).</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs uppercase bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Produto</th>
                                        <th scope="col" className="px-6 py-3">Quantidade</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {extractedItems.map((item, index) => (
                                        <tr key={index} className="bg-white border-b">
                                            <td className="px-6 py-4 font-medium">{item.produto}</td>
                                            <td className="px-6 py-4">{item.quantidade}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex justify-end mt-6">
                            <Button onClick={handleAddToStock} className="bg-green-600 hover:bg-green-700">
                                <CheckCircleIcon />
                                Adicionar Itens ao Estoque
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default EstoqueInteligentePage;
