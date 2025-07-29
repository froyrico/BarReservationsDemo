import React, { useState } from 'react';
import { X, Users, DollarSign, Star, MapPin, Eye, Crown, Shield, Sparkles } from 'lucide-react';
import { Table } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface TableMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  tables: Table[];
  selectedTableId?: number;
  onSelectTable: (tableId: number) => void;
  guests: number;
}

export function TableMapModal({ 
  isOpen, 
  onClose, 
  tables, 
  selectedTableId, 
  onSelectTable,
  guests 
}: TableMapModalProps) {
  const { t } = useLanguage();
  const [hoveredTable, setHoveredTable] = useState<number | null>(null);
  const [detailTable, setDetailTable] = useState<Table | null>(null);

  if (!isOpen) return null;

  const getTableColor = (table: Table) => {
    if (table.status === 'occupied') return 'bg-red-500/80 border-red-400';
    if (table.status === 'reserved') return 'bg-yellow-500/80 border-yellow-400';
    if (table.capacity < guests) return 'bg-gray-500/50 border-gray-400';
    if (selectedTableId === table.id) return 'bg-green-500/80 border-green-400';
    return 'bg-blue-500/80 border-blue-400 hover:bg-blue-400/80';
  };

  const getTableTypeIcon = (type: string) => {
    switch (type) {
      case 'vip': return <Crown className="w-3 h-3" />;
      case 'premium': return <Star className="w-3 h-3" />;
      default: return <Shield className="w-3 h-3" />;
    }
  };

  const getTableShape = (table: Table) => {
    const baseClasses = "flex items-center justify-center transition-all duration-300";
    switch (table.shape) {
      case 'round':
        return `w-12 h-12 rounded-full ${baseClasses}`;
      case 'square':
        return `w-12 h-12 rounded-lg ${baseClasses}`;
      case 'rectangular':
        return `w-16 h-10 rounded-lg ${baseClasses}`;
      default:
        return `w-12 h-12 rounded-full ${baseClasses}`;
    }
  };

  const handleTableClick = (table: Table) => {
    if (table.status === 'available' && table.capacity >= guests) {
      onSelectTable(table.id);
    } else {
      setDetailTable(table);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <div className="glass-refined rounded-2xl border border-yellow-400/20">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-yellow-400/20">
            <div>
              <h2 className="text-2xl font-serif font-bold golden-gradient-text">
                Interactive Table Map
              </h2>
              <p className="text-gray-300 mt-1">
                Select your preferred table for {guests} {guests === 1 ? 'person' : 'people'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full glass-refined hover:bg-red-500/20 transition-colors duration-200"
            >
              <X className="w-6 h-6 text-gray-300" />
            </button>
          </div>

          <div className="flex">
            {/* Map Area */}
            <div className="flex-1 p-6">
              <div className="relative w-full h-[500px] bg-gradient-to-br from-gray-900 to-black rounded-xl border border-yellow-400/10 overflow-hidden">
                {/* Realistic Restaurant Layout */}
                <div className="absolute inset-0">
                  {/* Main Dining Area */}
                  <div className="absolute top-4 left-4 right-4 bottom-20 bg-gradient-to-br from-amber-900/10 to-yellow-900/5 rounded-lg border border-yellow-400/10" />
                  
                  {/* Bar Area */}
                  <div className="absolute bottom-4 left-4 right-4 h-16 bg-gradient-to-r from-yellow-900/20 to-amber-900/15 rounded border border-yellow-400/15" />
                  
                  {/* Kitchen Area */}
                  <div className="absolute top-4 right-4 w-20 h-16 bg-gray-800/30 rounded border border-gray-600/20" />
                  
                  {/* Entrance */}
                  <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-16 h-4 bg-yellow-400/20 rounded-full" />
                  
                  {/* VIP Section */}
                  <div className="absolute top-4 left-4 w-24 h-20 bg-gradient-to-br from-purple-900/10 to-yellow-900/5 rounded border border-purple-400/10" />
                  
                  {/* Terrace Area */}
                  <div className="absolute top-4 right-28 w-20 h-24 bg-gradient-to-br from-green-900/10 to-yellow-900/5 rounded border border-green-400/10" />
                  
                  {/* Labels */}
                  <div className="absolute top-6 left-6 text-xs text-yellow-400/60 font-medium">VIP</div>
                  <div className="absolute top-6 right-32 text-xs text-green-400/60 font-medium">Terrace</div>
                  <div className="absolute bottom-6 left-6 text-xs text-yellow-400/60 font-medium">Bar</div>
                  <div className="absolute top-6 right-6 text-xs text-gray-400/60 font-medium">Kitchen</div>
                </div>

                {/* Tables */}
                {tables.map((table) => (
                  <div
                    key={table.id}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 ${
                      hoveredTable === table.id ? 'scale-110 z-10' : 'z-5'
                    }`}
                    style={{
                      left: `${table.position.x}%`,
                      top: `${table.position.y}%`,
                    }}
                    onMouseEnter={() => setHoveredTable(table.id)}
                    onMouseLeave={() => setHoveredTable(null)}
                    onClick={() => handleTableClick(table)}
                  >
                    <div className={`${getTableShape(table)} border-2 flex items-center justify-center transition-all duration-300 ${getTableColor(table)}`}>
                      <span className="text-white font-bold text-sm">{table.id}</span>
                    </div>
                    
                    {/* Table Info Tooltip */}
                    {hoveredTable === table.id && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 animate-fade-in">
                        <div className="glass-refined px-3 py-2 rounded-lg border border-yellow-400/30 min-w-max">
                          <div className="flex items-center space-x-2 mb-1">
                            {getTableTypeIcon(table.type)}
                            <span className="text-yellow-400 font-semibold capitalize">
                              Table {table.id} - {table.type}
                            </span>
                          </div>
                          <div className="text-xs text-gray-300 space-y-1">
                            <div className="flex items-center space-x-1">
                              <Users className="w-3 h-3" />
                              <span>{table.capacity} seats</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <DollarSign className="w-3 h-3" />
                              <span>${table.price}</span>
                            </div>
                            <div className="capitalize text-center">
                              {table.status === 'available' && table.capacity >= guests ? (
                                <span className="text-green-400">Available</span>
                              ) : table.status === 'occupied' ? (
                                <span className="text-red-400">Occupied</span>
                              ) : table.status === 'reserved' ? (
                                <span className="text-yellow-400">Reserved</span>
                              ) : (
                                <span className="text-gray-400">Too Small</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Legend */}
                <div className="absolute bottom-4 left-4 glass-refined p-3 rounded-lg border border-yellow-400/20">
                  <div className="text-xs text-gray-300 space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span>Available</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span>Selected</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span>Reserved</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span>Occupied</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Table Details Sidebar */}
            <div className="w-80 border-l border-yellow-400/20 p-6">
              {selectedTableId ? (
                <div className="space-y-6">
                  {(() => {
                    const selectedTable = tables.find(t => t.id === selectedTableId);
                    if (!selectedTable) return null;
                    
                    return (
                      <>
                        <div className="text-center">
                          <div className="flex items-center justify-center space-x-2 mb-3">
                            {getTableTypeIcon(selectedTable.type)}
                            <h3 className="text-xl font-serif font-bold golden-gradient-text capitalize">
                              {selectedTable.type} Table {selectedTable.id}
                            </h3>
                          </div>
                          <div className="glass-refined p-2 rounded-lg inline-block">
                            <span className="text-green-400 font-semibold">Selected</span>
                          </div>
                        </div>

                        <div className="relative rounded-lg overflow-hidden">
                          <img
                            src={selectedTable.image}
                            alt={`Table ${selectedTable.id}`}
                            className="w-full h-32 object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Users className="w-5 h-5 text-yellow-400" />
                              <span className="text-gray-300">Capacity</span>
                            </div>
                            <span className="text-white font-semibold">{selectedTable.capacity} people</span>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <DollarSign className="w-5 h-5 text-yellow-400" />
                              <span className="text-gray-300">Price</span>
                            </div>
                            <span className="text-white font-semibold">${selectedTable.price}</span>
                          </div>

                          <div>
                            <div className="flex items-center space-x-2 mb-2">
                              <Sparkles className="w-5 h-5 text-yellow-400" />
                              <span className="text-gray-300">Features</span>
                            </div>
                            <div className="space-y-1">
                              {selectedTable.features.map((feature, index) => (
                                <div key={index} className="text-sm text-gray-300 flex items-center space-x-2">
                                  <div className="w-1 h-1 bg-yellow-400 rounded-full" />
                                  <span>{feature}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={onClose}
                          className="btn-refined w-full py-3 text-black font-bold rounded-xl"
                        >
                          Confirm Table Selection
                        </button>
                      </>
                    );
                  })()}
                </div>
              ) : (
                <div className="text-center text-gray-400 mt-20">
                  <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Click on an available table to see details and select it</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Table Detail Modal */}
      {detailTable && (
        <div className="absolute inset-0 z-10 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setDetailTable(null)} />
          <div className="relative glass-refined rounded-xl p-6 max-w-md w-full border border-yellow-400/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-serif font-bold golden-gradient-text">
                Table {detailTable.id} Details
              </h3>
              <button
                onClick={() => setDetailTable(null)}
                className="p-1 rounded-full hover:bg-gray-700/50"
              >
                <X className="w-5 h-5 text-gray-300" />
              </button>
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300">Status:</span>
                <span className={`capitalize font-semibold ${
                  detailTable.status === 'occupied' ? 'text-red-400' :
                  detailTable.status === 'reserved' ? 'text-yellow-400' :
                  'text-green-400'
                }`}>
                  {detailTable.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Capacity:</span>
                <span className="text-white">{detailTable.capacity} people</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Your party:</span>
                <span className="text-white">{guests} people</span>
              </div>
              {detailTable.capacity < guests && (
                <p className="text-red-400 text-xs mt-2">
                  This table is too small for your party size.
                </p>
              )}
              {detailTable.status !== 'available' && (
                <p className="text-yellow-400 text-xs mt-2">
                  This table is currently not available.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}