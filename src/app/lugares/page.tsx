'use client';

import { useState, useEffect } from 'react';
import { getUsuarios } from '@/app/users/usuarios.api';
import { Usuario } from '@/app/users/types/usuario.interface';
import { updateUsuario } from '@/app/users/usuarios.api';  // Asegúrate de importar la función

export default function AsignarLugares() {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [fraternos, setFraternos] = useState<Usuario[]>([]);
    const [columnas, setColumnas] = useState(0); // El número de columnas ahora será dinámico
    const [filas, setFilas] = useState(0);
    const [selectedCell, setSelectedCell] = useState<{ fila: number, columna: number } | null>(null);
    const [selectedFraterno, setSelectedFraterno] = useState<Usuario | null>(null);

    useEffect(() => {
        async function fetchUsuarios() {
            const data = await getUsuarios();
            const fraternos = data.filter((u: Usuario) => u.rol === 'FRATERNO');
            setUsuarios(data);
            setFraternos(fraternos);

            // Buscar al usuario con CI 0000000000
            const admin = data.find((u: Usuario) => u.ci === '0000000000');
            if (admin && admin.columna) {
                setColumnas(admin.columna); // Establecer el número de columnas
            } else {
                setColumnas(5); // Valor por defecto si no encuentra el admin o columna
            }

            setFilas(Math.ceil(fraternos.length / (admin?.columna || 5))); // Calcula filas según el número de columnas
        }
        fetchUsuarios();
    }, []); // No dependemos de columnas aquí, ya que se setea dinámicamente

    const handleAsignar = () => {
        if (selectedCell && selectedFraterno) {
            console.log(`Asignando al fraterno ${selectedFraterno.nombres} a la fila ${selectedCell.fila}, columna ${selectedCell.columna}`);

            setFraternos(prev => prev.map(f => 
                f.id === selectedFraterno.id ? { ...f, fila: selectedCell.fila, columna: selectedCell.columna } : f
            ));
            setSelectedCell(null);
            setSelectedFraterno(null);
        }
    };

    const handleQuitar = async (id: string) => {
        // Primero, actualizamos los valores de fila y columna en el frontend
        setFraternos(prev => prev.map(f => f.id === id ? { ...f, fila: null, columna: null } : f));
    
        // Luego, realizamos el PATCH para actualizar en la base de datos
        const fraterno = fraternos.find(f => f.id === id);
        if (fraterno) {
            const updatedFraterno = {
                fila: null,
                columna: null
            };
            try {
                await updateUsuario(fraterno.id, updatedFraterno);
                console.log(`Fraterno ${fraterno.nombres} actualizado correctamente en la base de datos`);
            } catch (error) {
                console.error(`Error al quitar a ${fraterno.nombres}`, error);
            }
        }
    };
    

    const handleReset = () => {
        setFraternos(prev => prev.map(f => ({ ...f, fila: null, columna: null })));
    };

    const handleGuardarTabla = async () => {
        // Filtrar fraternos que tienen fila y columna asignadas
        const fraternosActualizados = fraternos.filter(f => f.fila !== null && f.columna !== null);
        
        // Hacer un PATCH a la API para cada fraterno con su fila y columna actualizada
        for (let fraterno of fraternosActualizados) {
            const updatedFraterno = {
                fila: fraterno.fila,
                columna: fraterno.columna
            };
            try {
                await updateUsuario(fraterno.id, updatedFraterno);
                console.log(`Fraterno ${fraterno.nombres} actualizado correctamente`);
            } catch (error) {
                console.error(`Error al actualizar a ${fraterno.nombres}`, error);
            }
        }

        alert('Posiciones guardadas correctamente');
    };

    return (
        <div className="p-4 bg-white">
            <div className="mb-4 flex gap-4">
                <button onClick={handleReset} className="p-2 bg-red-500 text-white rounded">Resetear</button>
                <button onClick={handleGuardarTabla} className="p-2 bg-green-500 text-white rounded">Guardar Tabla</button>
            </div>

            <div className="grid gap-2">
                {Array.from({ length: filas }).map((_, filaIndex) => (
                    <div key={filaIndex} className="flex gap-2">
                        {Array.from({ length: columnas }).map((_, colIndex) => {
                            const fraterno = fraternos.find(f => f.fila === filaIndex && f.columna === colIndex);
                            return (
                                <div key={colIndex} className="relative">
                                    <button
                                        className="w-24 h-12 border p-2 rounded"
                                        onClick={() => setSelectedCell({ fila: filaIndex, columna: colIndex })}
                                    >
                                        {fraterno ? fraterno.nombres : 'Asignar'}
                                    </button>
                                    {fraterno && (
                                        <button onClick={() => handleQuitar(fraterno.id)} className="ml-2 text-red-500">Quitar</button>
                                    )}
                                    {selectedCell?.fila === filaIndex && selectedCell?.columna === colIndex && (
                                        <div className="absolute top-full left-0 bg-white border shadow-md p-2">
                                            <h2 className="text-sm font-bold">Seleccionar Fraterno</h2>
                                            <ul>
                                                {fraternos.filter(f => f.fila === null && f.columna === null).map(f => (
                                                    <li key={f.id}>
                                                        <button className="block w-full text-left p-1 hover:bg-gray-200" onClick={() => setSelectedFraterno(f)}>
                                                            {f.nombres}
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                            <div className="mt-2 flex gap-2">
                                                <button onClick={handleAsignar} className="p-1 bg-blue-500 text-white rounded">Guardar</button>
                                                <button onClick={() => setSelectedCell(null)} className="p-1 bg-gray-500 text-white rounded">Cancelar</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
}
