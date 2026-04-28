//  YOUR FOUR TASKS
//
//  LOADING STATE (while data is being fetched)
//
//  SUCCESS STATE (data loaded, orders present)
//
//  EMPTY STATE (data loaded, but zero orders returned)
//
//  ERROR STATE (the API call failed)
//
//   HOW TO TEST EACH STATE
//
//  Open src/mockApi.js and change the SIMULATE constant:
//    'loading'  → tests your loading state (hangs forever)
//    'success'  → tests your success state (8 orders returned)
//    'empty'    → tests your empty state   (0 orders returned)
//    'error'    → tests your error state   (API throws error)

import { useState, useEffect } from 'react'
import { fetchOrders } from '../mockApi'

//Sub-components (already built for you)

function SkeletonRow() {
  return (
    <tr>
      {[40, 130, 180, 90, 80, 90].map((w, i) => (
        <td key={i} style={{ padding: '16px 20px' }}>
          <div style={{
            width: w, height: 13, borderRadius: 6,
            background: 'linear-gradient(90deg, var(--surface-2) 25%, var(--border) 50%, var(--surface-2) 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.4s infinite',
          }} />
        </td>
      ))}
    </tr>
  )
}

function OrderRow({ order }) {
  const STATUS_CONFIG = {
    Delivered:  { color: '#10b981', bg: 'rgba(16,185,129,0.12)',  dot: '#10b981' },
    Shipped:    { color: '#3b82f6', bg: 'rgba(59,130,246,0.12)',  dot: '#3b82f6' },
    Processing: { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', dot: '#f59e0b' },
    Pending:    { color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)', dot: '#8b5cf6' },
    Cancelled:  { color: '#ef4444', bg: 'rgba(239,68,68,0.12)',  dot: '#ef4444' },
  }
  const s = STATUS_CONFIG[order.status] || STATUS_CONFIG.Pending

  return (
    <tr style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background 0.15s' }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
      <td style={{ padding: '15px 20px', fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--accent)', fontWeight: 500 }}>{order.id}</td>
      <td style={{ padding: '15px 20px', color: 'var(--text-primary)', fontWeight: 500 }}>{order.customer}</td>
      <td style={{ padding: '15px 20px', color: 'var(--text-secondary)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {order.priority && (
          <span style={{ 
            background: 'var(--accent-dim)', color: 'var(--accent)', 
            padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 700,
            textTransform: 'uppercase', marginRight: 8, border: '1px solid var(--accent-glow)'
          }}>
            Priority
          </span>
        )}
        {order.product}
      </td>
      <td style={{ padding: '15px 20px', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--mono)', fontSize: 13 }}>₹{order.amount.toLocaleString()}</td>
      <td style={{ padding: '15px 20px' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: s.bg, color: s.color, padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.dot }} />
          {order.status}
        </span>
      </td>
      <td style={{ padding: '15px 20px', color: 'var(--text-muted)', fontSize: 13 }}>{order.date}</td>
    </tr>
  )
}

function EmptyState({ isFiltered, onClearFilters }) {
  return (
    <tr>
      <td colSpan={6}>
        <div style={{ padding: '80px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, textAlign: 'center' }}>
          <div style={{ 
            fontSize: 48, background: 'var(--surface-2)', width: 80, height: 80, 
            display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%',
            marginBottom: 8
          }}>
            {isFiltered ? '🔍' : '📭'}
          </div>
          <div style={{ fontSize: 20, fontWeight: 600, color: 'var(--text-primary)' }}>
            {isFiltered ? 'No matches found' : 'No orders yet'}
          </div>
          <div style={{ color: 'var(--text-secondary)', maxWidth: 320, lineHeight: 1.6, fontSize: 14 }}>
            {isFiltered 
              ? "We couldn't find any orders matching your current filters. Try adjusting your selection."
              : "Your order queue is currently empty. New customer orders will appear here automatically as they are placed."}
          </div>
          {isFiltered ? (
            <button onClick={onClearFilters} style={{
              marginTop: 8,
              padding: '10px 24px',
              background: 'var(--accent)',
              border: 'none',
              borderRadius: 'var(--radius)',
              color: '#000',
              fontSize: 14, fontWeight: 600, cursor: 'pointer',
            }}>
              Clear All Filters
            </button>
          ) : (
            <a href="#" style={{ color: 'var(--accent)', fontSize: 14, fontWeight: 500, textDecoration: 'none' }}>
              View Documentation →
            </a>
          )}
        </div>
      </td>
    </tr>
  )
}

function ErrorState({ message, onRetry }) {
  return (
    <tr>
      <td colSpan={6}>
        <div style={{ padding: '80px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, textAlign: 'center' }}>
          <div style={{ 
            fontSize: 48, background: 'var(--red-dim)', width: 80, height: 80, 
            display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%',
            marginBottom: 8, color: 'var(--red)'
          }}>
            ⚠️
          </div>
          <div style={{ fontSize: 20, fontWeight: 600, color: 'var(--text-primary)' }}>Connection Interrupted</div>
          <div style={{ color: 'var(--text-secondary)', maxWidth: 360, fontSize: 14, lineHeight: 1.6 }}>
            {message || "We encountered an unexpected error while fetching your orders. This might be due to a temporary server issue or network instability."}
          </div>
          <button onClick={onRetry} style={{
            marginTop: 12,
            padding: '10px 28px',
            background: 'transparent',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            color: 'var(--text-primary)',
            fontSize: 14, fontWeight: 600, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 8,
            transition: 'all 0.2s'
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--text-secondary)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
            <span>↻</span> Try Again
          </button>
        </div>
      </td>
    </tr>
  )
}

//Main Dashboard Component

export default function OrdersDashboard() {
  const [orders,  setOrders]  = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)
  const [filter,  setFilter]  = useState('All')

  const loadOrders = () => {
    // Reset state before each fetch
    setLoading(true)
    setError(null)
    // We don't necessarily want to clear orders during a refresh to avoid flickering,
    // but the task says "don't leave users hanging", so we'll show skeletons.
    setOrders([]) 

    fetchOrders()
      .then(data => {
        setOrders(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }

  useEffect(() => {
    loadOrders()
  }, [])

  const filteredOrders = orders.filter(o => filter === 'All' || o.status === filter)

  // DASHBOARD STATS (already implemented — do not change)
  const totalRevenue   = orders.reduce((s, o) => s + (o.status !== 'Cancelled' ? o.amount : 0), 0)
  const delivered      = orders.filter(o => o.status === 'Delivered').length
  const pending        = orders.filter(o => o.status === 'Pending' || o.status === 'Processing').length

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 32px' }}>

      {/* ── PAGE HEADER ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div style={{ width: 38, height: 38, background: 'var(--accent)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>📦</div>
            <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.5px', color: 'var(--text-primary)' }}>Orders</h1>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Manage and track all customer orders in one place.</p>
        </div>
        <button onClick={loadOrders} style={{
          padding: '10px 20px', background: 'var(--accent)', color: '#000',
          border: 'none', borderRadius: 'var(--radius)', fontSize: 14,
          fontWeight: 600, cursor: 'pointer',
        }}>
          ↻ Refresh
        </button>
      </div>

      {/* ── STAT CARDS ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
        {[
          { label: 'Total Revenue',    value: loading ? '—' : `₹${totalRevenue.toLocaleString()}`, icon: '💰', color: 'var(--accent)'  },
          { label: 'Delivered',        value: loading ? '—' : delivered,                            icon: '✅', color: 'var(--green)'  },
          { label: 'Needs Attention',  value: loading ? '—' : pending,                              icon: '⏳', color: 'var(--purple)' },
        ].map((card, i) => (
          <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px 28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>{card.label}</span>
              <span style={{ fontSize: 20 }}>{card.icon}</span>
            </div>
            <div style={{ fontSize: 30, fontWeight: 700, color: card.color, fontFamily: 'var(--mono)' }}>{card.value}</div>
          </div>
        ))}
      </div>

      {/* ── ORDERS TABLE ── */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        <div style={{ padding: '12px 28px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface-2)' }}>
          <h2 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Recent Orders
            {!loading && !error && (
              <span style={{ marginLeft: 10, fontSize: 12, color: 'var(--text-muted)', fontWeight: 400 }}>
                ({filteredOrders.length} {filteredOrders.length === 1 ? 'order' : 'orders'})
              </span>
            )}
          </h2>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>Filter:</span>
            <select 
              value={filter} 
              onChange={e => setFilter(e.target.value)}
              style={{
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 6, color: 'var(--text-primary)', fontSize: 12,
                padding: '4px 8px', outline: 'none', cursor: 'pointer'
              }}
            >
              {['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Order ID', 'Customer', 'Product', 'Amount', 'Status', 'Date'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '12px 20px', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>

              {loading ? (
                // LOADING STATE: Show skeletons
                Array(8).fill(0).map((_, i) => <SkeletonRow key={i} />)
              ) : error ? (
                // ERROR STATE: Show error component
                <ErrorState message={error} onRetry={loadOrders} />
              ) : filteredOrders.length === 0 ? (
                // EMPTY STATE: Show empty component
                <EmptyState 
                  isFiltered={filter !== 'All'} 
                  onClearFilters={() => setFilter('All')} 
                />
              ) : (
                // SUCCESS STATE: Show order rows
                filteredOrders.map(order => <OrderRow key={order.id} order={order} />)
              )}

            </tbody>
          </table>
        </div>
      </div>

      {/* Shimmer animation keyframes */}
      <style>{`
        @keyframes shimmer {
          0%   { background-position: -200% 0 }
          100% { background-position:  200% 0 }
        }
      `}</style>
    </div>
  )
}
