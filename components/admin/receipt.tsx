'use client'

import { useRef } from 'react'
import { Button } from '@/components/ui/button'

type ReceiptItem = {
  nama: string
  jumlah: number
  harga: number
}

type ReceiptProps = {
  type: 'jasa' | 'item'
  transactionId: string
  tanggal: string
  customerName: string
  customerId: string
  status: 'PENDING' | 'SELESAI' | 'BATAL'
  payment: string
  items: ReceiptItem[]
  total: number
  catatan?: string | null
  onClose: () => void
}

export function Receipt({
  type,
  transactionId,
  tanggal,
  customerName,
  customerId,
  status,
  payment,
  items,
  total,
  catatan,
  onClose
}: ReceiptProps) {
  const receiptRef = useRef<HTMLDivElement>(null)

  const handlePrint = () => {
    const printContent = receiptRef.current?.innerHTML
    const printWindow = window.open('', '', 'width=400,height=600')
    if (printWindow && printContent) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Receipt - ${transactionId.slice(0, 8)}</title>
            <style>
              body { font-family: 'Courier New', monospace; padding: 20px; }
              .text-center { text-align: center; }
              .flex { display: flex; }
              .justify-between { justify-content: space-between; }
              .font-bold { font-weight: bold; }
              .text-sm { font-size: 0.875rem; }
              .text-xs { font-size: 0.75rem; }
              .text-lg { font-size: 1.125rem; }
              .text-xl { font-size: 1.25rem; }
              .text-gray-600 { color: #666; }
              .text-gray-500 { color: #888; }
              .text-green-600 { color: #16a34a; }
              .text-red-600 { color: #dc2626; }
              .text-yellow-600 { color: #ca8a04; }
              .border-dashed { border-style: dashed; }
              .border-t-2, .border-b-2 { border-width: 2px; border-color: #ccc; }
              .pt-4, .pb-4 { padding-top: 1rem; padding-bottom: 1rem; }
              .mt-4, .mb-4 { margin-top: 1rem; margin-bottom: 1rem; }
              .mt-6 { margin-top: 1.5rem; }
              .py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
              .mb-2 { margin-bottom: 0.5rem; }
              .mt-1 { margin-top: 0.25rem; }
              .font-mono { font-family: monospace; }
              .font-semibold { font-weight: 600; }
            </style>
          </head>
          <body>${printContent}</body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'SELESAI': return 'text-green-600'
      case 'BATAL': return 'text-red-600'
      default: return 'text-yellow-600'
    }
  }

  const getStatusLabel = (status: string) => {
    if (status === 'SELESAI') return 'Completed'
    if (status === 'BATAL') return 'Cancelled'
    return 'Pending'
  }

  return (
    <div className="fixed inset-0 w-screen h-[100dvh] bg-black/35 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white max-w-md w-full rounded-lg shadow-2xl">
        <div ref={receiptRef} className="p-6 text-black">
          {/* Header */}
          <div className="text-center border-b-2 border-dashed border-gray-300 pb-4 mb-4">
            <h2 className="text-xl font-bold">NAILEA STUDIO</h2>
            <p className="text-sm text-gray-600">Beauty & Nail Care</p>
            <p className="text-xs text-gray-500 mt-1">Jl. Taman Permata No.192, Binong, Tangerang</p>
          </div>
          
          {/* Transaction Info */}
          <div className="text-sm mb-4">
            <div className="flex justify-between">
              <span className="text-gray-600">No. Transaksi:</span>
              <span className="font-mono">#{transactionId.slice(0, 8).toUpperCase()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tanggal:</span>
              <span>{new Date(tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Customer:</span>
              <span>{customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">ID Customer:</span>
              <span className="font-mono">#{customerId.slice(0, 8).toUpperCase()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className={getStatusColor()}>{getStatusLabel(status)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Pembayaran:</span>
              <span>{payment || 'CASH'}</span>
            </div>
          </div>

          {/* Items Detail */}
          <div className="border-t-2 border-dashed border-gray-300 pt-4 mb-4">
            <h3 className="font-semibold mb-2">
              {type === 'jasa' ? 'Detail Layanan:' : 'Detail Produk:'}
            </h3>
            {items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm py-1">
                <span>{item.nama} x{item.jumlah}</span>
                <span>Rp {(Number(item.harga) * item.jumlah).toLocaleString('id-ID')}</span>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="border-t-2 border-dashed border-gray-300 pt-4">
            <div className="flex justify-between font-bold text-lg">
              <span>TOTAL:</span>
              <span>Rp {Number(total).toLocaleString('id-ID')}</span>
            </div>
          </div>

          {/* Notes */}
          {catatan && (
            <div className="mt-4 text-sm text-gray-600">
              <span className="font-semibold">Catatan:</span> {catatan}
            </div>
          )}

          {/* Footer */}
          <div className="text-center mt-6 pt-4 border-t-2 border-dashed border-gray-300">
            <p className="text-sm text-gray-600">Terima kasih atas kunjungan Anda!</p>
            <p className="text-xs text-gray-500">www.naileastudio.com</p>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex gap-2 p-4 border-t bg-gray-50 rounded-b-lg">
          <Button className="flex-1" onClick={handlePrint}>
            Print Receipt
          </Button>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}
